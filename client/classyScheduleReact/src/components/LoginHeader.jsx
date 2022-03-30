import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar } from '@mui/material'

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
}))

// Main components with parameters passed as props
const LoginHeader = (props) => {

  const classes = useStyles() // call the hook
 
  // return the component
  return (
    <Box display="flex" className={classes.container}>

      {/* 
        If user is logged in the display the header with 
          avatar containing user's initials and log out button 
        Otherwise, display login button
      */}

      {props.login ? (
        <>
          <Avatar sx={{ bgcolor: 'white', color: '#7E16A4' }}>
              KN
          </Avatar>
          
          <Button  className={classes.button} onClick={props.handleLogOut}>
            Logout
          </Button>
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