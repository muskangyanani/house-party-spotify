from django.urls import path
from . import views

urlpatterns = [
  path('rooms', views.roomView.as_view()),
  path('create-room', views.createRoomView.as_view()),
  path('get-room', views.getRoom.as_view()),
  path('join-room', views.joinRoom.as_view()),
  path('user-in-room', views.userInRoom.as_view()),
  path('leave-room', views.leaveRoom.as_view()),
]