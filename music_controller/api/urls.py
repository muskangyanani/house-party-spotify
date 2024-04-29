from django.urls import path
from . import views

urlpatterns = [
  path('', views.roomView.as_view())
]