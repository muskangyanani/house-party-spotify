import React from 'react'
import { Grid, Typography, Card, IconButton, LinearProgress } from '@mui/material'
import { PlayArrow, SkipNext, SkipPrevious, Pause } from '@mui/icons-material'


const MusicPlayer = (props) => {

  const songProgress = (props.time/ props.duration) * 100

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
            <IconButton>
              <SkipPrevious />
            </IconButton>
            <IconButton>
              {props.is_playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton>
              <SkipNext />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  )
}

export default MusicPlayer