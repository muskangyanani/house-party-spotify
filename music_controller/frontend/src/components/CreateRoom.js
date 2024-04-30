import React, {useState} from 'react'
import { Button, Grid, Typography, TextField, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText } from '@mui/material' 
import { Link } from "react-router-dom"

const CreateRoom = () => {
  
  const [defaultVotes, setDefaultVotes] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(true)

  const handelVotesChange = (e) => {
    setDefaultVotes(e.target.value)
  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false)
  }

  const handleCreateRoomButton = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: defaultVotes,
        guest_can_pause: guestCanPause
      })
    }
    fetch('/api/create-room', requestOptions)
      .then((response) => response.json())
      .then((data) =>  window.location.href = '/room/' + data.code) 
  }
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create A Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
              Guest control of playback state
          </FormHelperText>
          <RadioGroup row defaultValue="true" onChange={handleGuestCanPauseChange}>
            <FormControlLabel 
              value="true" 
              control={<Radio color="primary"/>} 
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel 
              value="false" 
              control={<Radio color="error"/>} 
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField 
            required={true} 
            type="number" 
            variant="outlined"
            defaultValue={defaultVotes}
            onChange={handelVotesChange}
            inputProps={{
              min: 1,
              style: { textAlign: "center" }
            }} 
          />
          <FormHelperText style={{textAlign: "center"}}>
            Votes required to skip song
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button 
          color="primary" 
          variant="contained"
          onClick={handleCreateRoomButton}
        >Create a Room</Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="error" to="/" component={Link} variant="contained">Back</Button>
      </Grid>
    </Grid>
  )
}

export default CreateRoom