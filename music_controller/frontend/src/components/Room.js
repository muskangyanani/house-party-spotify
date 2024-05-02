import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import CreateRoom from './CreateRoom';
import MusicPlayer from './MusicPlayer';

const Room = () => {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

  // TODO: redirect to home page if we are joined in a room that does not exist or been deleted by the host
  const getRoomDetails = () => {
    fetch('/api/get-room' + '?code=' + roomCode)
    .then((response) => {
      if (!response.ok) {
        window.location.href = '/';
      }
      return response.json();
    })
    .then((data) => {
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
      console.log(data);
      if (data.is_host){
        authenticateSpotify();
      }
    });
    console.log({spotifyAuthenticated})
  }

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status)
        console.log("setSoptifyAuthenticated data:", data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  const handleLeaveRoom = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/api/leave-room', requestOptions)
    .then((_response) => {
      window.location.href = '/'
    })
  }

  const handelUpdateShowSettings = (value) => {
    setShowSettings(value);
  }

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoom 
            update={true} 
            votesToSkip={votesToSkip} 
            guestCanPause={guestCanPause} 
            roomCode={roomCode} 
            updateCallback={getRoomDetails} 
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="error" onClick={()=>setShowSettings(false)} component={Link} variant="contained">Close</Button>
        </Grid>
    </Grid>
    )
  }

  const rederSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handelUpdateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
    .then((response) => {
      if (!response.ok){
        return {};
      }else{
        return response.json();
      }
    })
    .then((data) => {
      setSong(data);
      console.log(data);
    });
  }

  useEffect(() => {
    getRoomDetails();
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (showSettings) {
    return renderSettings();
  }else{
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...song}/>
        {isHost ? rederSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button 
            variant="contained" 
            color="error" 
            to='/'
            component={Link}
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }

};

export default Room;
