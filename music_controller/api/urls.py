from django.urls import path
from . import views

urlpatterns = [
  path('rooms', views.roomView.as_view()),
  path('create-room', views.createRoomView.as_view()),
  path('get-room', views.getRoom.as_view())
]