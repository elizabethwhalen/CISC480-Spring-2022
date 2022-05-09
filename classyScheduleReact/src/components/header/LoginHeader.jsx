import React from 'react'
import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar } from '@mui/material'
import { Link } from 'react-router-dom'

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'right',
  },
  avatar: {
    color: '#b71c1c',
    backgroundColor: 'white',
  },
  button: {
    color: 'white',
    '&:hover': {
      fontWeight: '600'
    },
  },
  link: {
    textDecoration: 'none',
  },
}))

// Main components with parameters passed as props
const LoginHeader = (props) => {

  const classes = useStyles() // call the hook
  const loggedIn = props.loggedIn;
  const currentToken = sessionStorage.getItem('token');

  const handleLogoutClick = () => {
    props.setLoggedIn(false);
    props.handleLogOut();
  }

  // return the component
  return (
    <Box display="flex" className={classes.container}>

      {/* 
        If user is logged in the display the header with 
          avatar containing user's initials and log out button 
        Otherwise, display login button
      */}

      {loggedIn || currentToken  ? (
        <>
          <Avatar sx={{ bgcolor: 'white', color: '#7E16A4' }}>
            KN
          </Avatar>
          
          <Link to='/' className={classes.link}>
            <Button className={classes.button} onClick={handleLogoutClick}>
              Logout
            </Button>
          </Link>

        </>
      ) : (
        <Button className={classes.button}>
          Login
        </Button>
      )}
    </Box>
  )
}
export default LoginHeader