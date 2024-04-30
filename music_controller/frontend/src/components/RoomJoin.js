import React, { useState } from 'react'
import { Button, Grid, Typography, TextField } from '@mui/material'
import { Link } from 'react-router-dom'

const RoomJoin = () => {
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState(false)

  const handleRoomCodeChange = (e) =>{
    setRoomCode(e.target.value)
  }

  const handleEnterRoom = () =>{
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        code: roomCode
      })
    }
    fetch('/api/join-room', requestOptions)
    .then((Response)=>{
      if (Response.ok){
        window.location.href = '/room/' + roomCode
      } else {
        setError("Room not found")
      }
    }).catch((error)=>{
      console.log(error)
    })
  }

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField 
          error={error}
          label='Code'
          placeholder='Enter the Room Code'
          value={roomCode}
          helperText={error}
          variant='outlined'
          onChange={handleRoomCodeChange}
        >

        </TextField> 
      </Grid>
      <Grid item xs={12} align="center">
        <Button 
          color="primary" 
          variant="contained"
          onClick={handleEnterRoom}
        >Enter Room</Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="error" to="/" component={Link} variant="contained">Back</Button>
      </Grid>
    </Grid>
  )
}

export default RoomJoin