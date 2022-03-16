import React from 'react'
import { Button, Grid, Paper, Typography, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import background from '../images/campus.jpg'
import logo from '../images/ustlogo.png'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Link } from 'react-router-dom'

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
  container: {
    width: '100%'
  },
  gridItem1: {
    padding: '0px',
    margin: '0px',
    width: 'calc(100% - 500px)'
  },
  gridItem2: {
    backgroundColor: 'white',
    padding: '0px',
    margin: '0px',
    width: '500px'
  },
  loginContainer: {
    display: 'flex', 
    width: '100%', 
    padding: '0px 150px 0px 50px', 
    margin: '0 auto -55px auto'
  }, 
  logoGrid: {
    paddingTop: '30px', 
    marginBottom: '70px'
  },
  logo: {
    width: '260px', 
    height: '50px'
  },
  text: {
    marginBottom: '30px'
  }, 
  textBox: {
    marginBottom: '20px'
  },
  forgotPass: {
    textDecoration: 'none', 
    color: "#646364" 
  }, 
  link: {
    textDecoration: 'none', 
  },
  loginButtonGrid: {
    marginTop: '20px'
  }
}))

const Login = (props) => {
  const classes = useStyles()
  
  return (
    <Paper className={classes.root}>
      <Grid container className={classes.container} >
        <Grid item direction="column"
          alignItems="flex-start"
          justify="flex-start" className={classes.gridItem1} >
        </Grid>
        <Grid item direction="column"
          alignItems="flex-end"
          justify="flex-end"
          className={classes.gridItem2}
        >
          <Grid container className={classes.loginContainer}>
            <Grid item xs={12} fullWidth className={classes.logoGrid} >
              <img src={logo} className={classes.logo} alt='logo' ></img>
            </Grid>
            <Grid item xs={12} fullWidth className={classes.text}>
              Sign in with your organizational account
            </Grid>
            <Grid item xs={12} fullWidth>
              <ValidatorForm onError={(errors) => console.log(errors)}>
                <Grid container spacing={1}>
                  <Grid item xs={12} fullWidth>
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Email"
                      fullWidth
                      name="email"
                      type="text"
                    // validators={['matchRegexp:^[0-9]{1,9}$', 'required']}
                    // errorMessages={[
                    //   'Invalid - It should be a 9-digit number',
                    //   'this field is required',
                    // ]}
                    />
                  </Grid>
                  <Grid item xs={12} fullWidth >
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Password"
                      fullWidth
                      name="password"
                      type="password"
                      // validators={['matchRegexp:^[0-9]{1,3}$', 'required']}
                      // errorMessages={[
                      //   'Invalid - It should be a 3-digit number',
                      //   'this field is required',
                      // ]}
                      className={classes.textBox}
                    />
                  </Grid>
                  <Grid item xs={12} fullwidth>
                    <Typography variant='h8'>
                      <Link to='/ForgotPassword' className={classes.forgotPass}>
                        Forgot password?
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} fullWidth className={classes.loginButtonGrid}>
                    <Link to='/' className={classes.link}>
                      <Button variant="contained" disableElevation onClick={props.handleLogin} >
                        Log In
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Login;