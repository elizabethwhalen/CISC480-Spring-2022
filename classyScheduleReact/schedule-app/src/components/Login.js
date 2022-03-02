import React from 'react'
import { Grid, Paper, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import background from '../images/campus.jpg'
import logo from '../images/ustlogo.png'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    margin: '0px',
    flexWrap: 'nowrap',
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',

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
      <Grid container>
        <Grid item xs={8} style={{ padding: '0px', margin: '0px' }} >
        </Grid>
        <Grid item xs={4} style={{ backgroundColor: 'white', padding: '0px', margin: '0px' }}>
          <Grid container>
            <Grid item style={{ marginLeft: '50px', marginRight: '150px', marginTop: '50px' }}>
              <img src={logo} style={{ width: '80%' }} alt='logo' ></img>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Login;