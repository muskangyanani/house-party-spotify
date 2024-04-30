import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RoomJoin from "./RoomJoin";
import CreateRoom from "./CreateRoom";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      })
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} align="center">
          <Typography variant="h3" component="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()} />
        <Route path="/join" element={<RoomJoin />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
}
