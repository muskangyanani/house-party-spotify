from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework import status
from rest_framework.views import APIView
from requests import Request, post
from rest_framework.response import Response
from .util import *
from django.shortcuts import redirect
from api.models import Room
from .models import Vote

# Api endpoint to get the authorization url
class AuthURL(APIView):
  def get(self, request, format=None):
    scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

    url = Request('GET', 'https://accounts.spotify.com/authorize', params={
      'scope': scopes,
      'response_type': 'code',
      'redirect_uri': REDIRECT_URI,
      'client_id': CLIENT_ID
    }).prepare().url

    print("url from AuthURL: ", url)
    return Response({'url': url}, status=status.HTTP_200_OK)
  
def spotify_callback(request, format=None):
  print("spotify_callback")
  code = request.GET.get('code')
  print("code from spotify_callback: ", code)
  error = request.GET.get('error')
  
  response = post('https://accounts.spotify.com/api/token', data={
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  }).json()

  print("response from spotify_callback: ", response)

  access_token = response.get('access_token')
  token_type = response.get('token_type')
  refresh_token = response.get('refresh_token')
  expires_in = response.get('expires_in')
  error = response.get('error')

  print("access_token from spotify_callback: ", access_token)
  if not request.session.exists(request.session.session_key):
    request.session.create()
    print("session_key from spotify_callback: ", request.session.session_key)

  update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
  return redirect('frontend:')


class IsAuthenticated(APIView):
  def get(self, request, format=None):
    is_authenticated = is_spotify_authenticated(self.request.session.session_key)
    print("IsAuthenticated: ", is_authenticated)
    return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
  
class CurrentSong(APIView):
  def get(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)
    print("room from CurrentSong: ", room)
    if room.exists():
        room = room[0]
    else:
        return Response({}, status=status.HTTP_404_NOT_FOUND)
    host = room.host
    endpoint = "player/currently-playing"
    response = execute_spotify_api_request(host, endpoint)
    # print("response from CurrentSong: ", response)

    if 'error' in response or 'item' not in response:
        return Response({}, status=status.HTTP_204_NO_CONTENT)

    item = response.get('item')
    duration = item.get('duration_ms')
    progress = response.get('progress_ms')
    album_cover = item.get('album').get('images')[0].get('url')
    is_playing = response.get('is_playing')
    song_id = item.get('id')

    artist_string = ""

    for i, artist in enumerate(item.get('artists')):
      if i > 0:
          artist_string += ", "
      name = artist.get('name')
      artist_string += name
    
    votes = Vote.objects.filter(room=room, song_id=song_id)
    song = {
        'title': item.get('name'),
        'artist': artist_string,
        'duration': duration,
        'time': progress,
        'image_url': album_cover,
        'is_playing': is_playing,
        'votes': len(votes),
        'votes_required': room.votes_to_skip,
        'id': song_id
    }
    self.update_room_song(room, song_id)

    return Response(song, status=status.HTTP_200_OK)

  def update_room_song(self, room, song_id):
    current_song = room.current_song
    if current_song != song_id:
      room.current_song = song_id
      room.save(update_fields=['current_song'])
      vote = Vote.objects.filter(room=room).delete()
      return True
    return False


class PauseSong(APIView):
   def put(self, response, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]
    if self.request.session.session_key == room.host or room.guest_can_pause:
      pause_song(room.host)
      return Response({}, status=status.HTTP_204_NO_CONTENT)
    return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
   def put(self, response, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]
    if self.request.session.session_key == room.host or room.guest_can_pause:
      play_song(room.host)
      return Response({}, status=status.HTTP_204_NO_CONTENT)
    return Response({}, status=status.HTTP_403_FORBIDDEN)
   
class SkipSong(APIView):
  def post(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]
    votes = Vote.objects.filter(room=room, song_id=room.current_song)
    votes_needed = room.votes_to_skip
    if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
      votes.delete()
      skip_song(room.host)
    else:
      vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
      vote.save()
    return Response({}, status=status.HTTP_204_NO_CONTENT)
  
class PreviousSong(APIView):
  def post(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)[0]
    if self.request.session.session_key == room.host:
      previous_song(room.host)
    else:
      return Response({}, status=status.HTTP_403_FORBIDDEN)
    return Response({}, status=status.HTTP_204_NO_CONTENT)
  
