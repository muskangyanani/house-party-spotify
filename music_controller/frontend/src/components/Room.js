import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomCode } = useParams();
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);

  const getRoomDetails = () => {
    fetch('/api/get-room' + '?code=' + roomCode)
    .then((response) => response.json())
    .then((data) => {
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
    })
  }

  useEffect(() => {
    getRoomDetails();
  }, []);

  return (
    <div>
      <h1>Room: {roomCode}</h1>
      <p>Votes: {votesToSkip}</p>
      <p>Guest Can Pause: {guestCanPause.toString()}</p>
      <p>Host: {isHost.toString()}</p>
    </div>
  );
};

export default Room;
