/* eslint-disable react/prop-types */
import React from 'react'
import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles({
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
      fontWeight: '600',
    },
  },
  link: {
    textDecoration: 'none',
  },
})

export default function LoginHeader(props) {
  const { loggedIn, setLoggedIn, handleLogOut } = props;
  const classes = useStyles()
  const currentToken = sessionStorage.getItem('token');

  const handleLogoutClick = () => {
    setLoggedIn(false);
    handleLogOut();
    window.location.href = "/";
  }

  return (
    <Box display="flex" className={classes.container}>

      {/* 
        If user is logged in the display the header with 
          avatar containing user's initials and log out button 
        Otherwise, display login button
      */}

      {loggedIn || currentToken ? (
        <Link to='/' className={classes.link}>
          <Button className={classes.button} onClick={handleLogoutClick}>
            Logout
          </Button>
        </Link>
      ) : (
        <Button className={classes.button}>
          Login
        </Button>
      )}
    </Box>
  )
}