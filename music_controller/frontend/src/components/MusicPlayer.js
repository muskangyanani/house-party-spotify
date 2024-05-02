import React from 'react'
import { Grid, Typography, Card, IconButton, LinearProgress } from '@mui/material'
import { PlayArrow, SkipNext, SkipPrevious, Pause } from '@mui/icons-material'

const MusicPlayer = (props) => {

  const songProgress = (props.time/ props.duration) * 100

  // This play and pause feature is only for Premium accounts...not for poor peoples
  const playSong = () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/play', requestOptions)
      .then((response)=>{
        console.log("play button pressed")
      })
  }

  const pauseSong = () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/pause', requestOptions)
      .then((response)=>{
        console.log("pause button pressed")
      })
  }

  const skipSong = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/skip', requestOptions)
      .then((response)=>{
        console.log("skip button pressed")
      })
  }

  const previousSong = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/previous', requestOptions)
      .then((response)=>{
        console.log("previous button pressed")
      })
  }

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item xs={4} align='center'>
          <img src={props.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item xs={8} align='center'>
          <Typography variant="h5" component="h5">{props.title}</Typography>
          <Typography color="secondary" variant="subtitle1">{props.artist}</Typography>
          <div>
            <IconButton onClick={()=>{previousSong()}}>
              <SkipPrevious />
            </IconButton>
            <IconButton
              onClick={() => {props.is_playing ? pauseSong() : playSong()}}
            >
                {props.is_playing ? <Pause /> : <PlayArrow />}
              </IconButton>
            <IconButton onClick={()=>{skipSong()}}>
              <SkipNext /> 
              <small>
                {props.votes} / {' '} {props.votes_required}
              </small>
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  )
}

export default MusicPlayer