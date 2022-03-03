import React from 'react'
import { Grid, Paper, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import background from '../images/campus.jpg'
import logo from '../images/ustlogo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100wh',
    margin: '0px',
    flexWrap: 'nowrap',
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    left: '0px',
    right: '0px',
    top: '0px'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const Login = () => {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <Grid container style={{width: '100%'}}>
        <Grid item direction="column"
    alignItems="flex-start"
    justify="flex-start" style={{ padding: '0px', margin: '0px', width: 'calc(100% - 500px)'}} >
        </Grid>
        <Grid item direction="column"
    alignItems="flex-end"
    justify="flex-end" style={{ backgroundColor: 'white', padding: '0px', margin: '0px', width: '500px'}}>
          <Grid container style={{display: 'flex', width: '100%', padding: '0px 150px 0px 50px', margin: '0 auto -55px auto' }}>
            <Grid item xs={12} fullWidth style={{paddingTop: '30px', marginBottom: '30px'}} >
              <img src={logo} style={{ width: '260px', height: '50px' }} alt='logo' ></img>
            </Grid>
            <Grid item xs={12} fullWidth style={{marginBottom: '30px'}}>
            Sign in with your organizational account
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Login;