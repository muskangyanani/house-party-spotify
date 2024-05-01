import React, {useState} from 'react'
import { Button, Grid, Typography, TextField, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText, Alert } from '@mui/material' 
import { Link } from "react-router-dom"
import Collapse from '@mui/material/Collapse'

const CreateRoom = (props) => {  
  const defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {}
  }
  const [votesToSkip, setVotesToSkip] = useState(defaultProps.votesToSkip)
  const [guestCanPause, setGuestCanPause] = useState(defaultProps.guestCanPause)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  const handelVotesChange = (e) => {
    setVotesToSkip(e.target.value)
  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false)
  }

  const handleCreateRoomButton = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause
      })
    }
    fetch('/api/create-room', requestOptions)
      .then((response) => response.json())
      .then((data) =>  window.location.href = '/room/' + data.code) 
  }

  const handleUpdateButton = () => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode
      })
    }
    fetch('/api/update-room', requestOptions)
      .then((response) => {
        if (response.ok){
          setSuccessMsg("Room Updated Succesfully!!")
        }else{
          setErrorMsg("Error while Updating room.")
        }
        props.updateCallback()
    })
  }

  const renderCreateRoomButtons = () =>{
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button 
            color="primary" 
            variant="contained"
            onClick={handleCreateRoomButton}
          >Create Room</Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="error" to="/" component={Link} variant="contained">Back</Button>
        </Grid>  
      </Grid>
    )
  }

  const renderUpdateRoomButtons = () =>{
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color='primary'
            variant='contained'
            onClick={handleUpdateButton}
          >
          Update Room
          </Button>
        </Grid>
      </Grid>
    )
  }
  
  const title = props.update ? "Update Room" : "Create Room";

  const getDefaultGuestCanPause = () => {
    if (props.update) {
      return props.guestCanPause.toString(); // Return last updated value for update scenario
    } else {
      return defaultProps.guestCanPause.toString(); // Return default value for create scenario
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {
            successMsg != "" ? (
              <Alert severity="success" onClose={() => setSuccessMsg("")}>
                {successMsg}
              </Alert>
            ) : (
              <Alert severity="error" onClose={() => setErrorMsg("")}>
                {errorMsg}
              </Alert>
            )
          }
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
              Guest control of playback state
          </FormHelperText>
          <RadioGroup row defaultValue={getDefaultGuestCanPause} onChange={handleGuestCanPauseChange}>
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
            defaultValue={defaultProps.votesToSkip}
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
      {
        props.update ? renderUpdateRoomButtons() : renderCreateRoomButtons()
      }
    </Grid>
  )
}

export default CreateRoom