import React from 'react'
import { Grid, Paper, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import background from '../images/campus.jpg'
import logo from '../images/ustlogo.png'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: '100vh'
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
        <Paper className={classes.root} style={{ backgroundImage: `url(${background})`, 
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh'}}>
            <Grid container spacing={1}  >
                <Grid item xs={8}>
                </Grid>
                <Grid item xs={4} style={{ backgroundColor: 'white'}}>
                    <Grid container spacing={6}>
                        <Grid item style={{ marginLeft: '50px', marginRight: '150px', marginTop: '50px'}}>
                            <img src={logo} style={{width: '80%'}} alt='logo' ></img>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Login;