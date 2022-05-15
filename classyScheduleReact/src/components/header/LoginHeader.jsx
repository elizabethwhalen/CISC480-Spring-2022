/* eslint-disable react/prop-types */
import React from 'react'
import { Box, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from 'react-router-dom'

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles({
  container: {
    textAlign: 'right',
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
          <Button
            onClick={handleLogoutClick}
            sx={{
              color: 'white',
              fontWeight: '600',
            }}
          >
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