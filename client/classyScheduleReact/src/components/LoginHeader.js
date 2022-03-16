import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar } from '@mui/material'
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

const LoginHeader = (props) => {
  const classes = useStyles()
 
  return (
    <Box display="flex" className={classes.container}>
      {props.login ? (
        <>
          <Avatar sx={{ bgcolor: 'white', color: '#7E16A4' }}>
              KN
          </Avatar>
          <Button  className={classes.button}>
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