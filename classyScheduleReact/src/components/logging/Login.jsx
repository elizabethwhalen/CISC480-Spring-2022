import React from 'react'
import { Button, Grid, Paper, Typography, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import background from '../../images/campus.jpg'
import logo from '../../images/ustlogo.png'
import { Link } from 'react-router-dom'

// Styling components using useStyles
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
  },
  message: {
    color: 'red',
    fontWeight: 600,
  },
}))

// Login page component with parameter passed under props
const Login = (props) => {

  const classes = useStyles(); // use the useStyles
  const [email, setEmail] = React.useState(''); // email
  const [password, setPassword] = React.useState(''); // password

  const handleLogin = (event) => {
    event.preventDefault();

    // If either email or password is empty, then don't log user in
    if (email !== '' && password !== ''){
      props.handleLogin();
    }
  }

  // This function will assign input value to email variable
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  }

  // This function will assign input value to password variable
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  }

  return (
    <Paper className={classes.root}>
      <Grid container className={classes.container} >

        {/* Empty grid item used for place holder */}
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

            {/* LOGO */}
            <Grid item xs={12} fullWidth className={classes.logoGrid} >
              <img src={logo} className={classes.logo} alt='logo' ></img>
            </Grid>

            {/* Instruction line */}
            <Grid item xs={12} fullWidth className={classes.text}>
              Sign in with your organizational account
            </Grid>

            {/* Form */}
            <Grid item xs={12} fullWidth>
              <ValidatorForm onSubmit={handleLogin}>
                <Grid container spacing={1}>

                  {/* Email */}
                  <Grid item xs={12} fullWidth>
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Email"
                      fullWidth
                      name="email"
                      value={email}
                      onChange={handleChangeEmail}
                      validators={['required', 'isEmail']}
                      errorMessages={['this field is required', 'email is not valid']}
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} fullWidth >
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Password"
                      fullWidth
                      name="password"
                      type="password"
                      value={password}
                      onChange={handleChangePassword}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      className={classes.textBox}
                    />
                  </Grid>

                  {/* Forgot Password link to reset password */}
                  <Grid item xs={12} fullwidth>
                    <Typography variant='h8'>
                      <Link to='/ForgotPassword' className={classes.forgotPass}>
                        Forgot password?
                      </Link>
                    </Typography>
                  </Grid>

                  {/* Submit button */}
                  <Grid item xs={12} fullWidth className={classes.loginButtonGrid}>
                      <Button variant="contained" disableElevation type='submit' >
                        Log In
                      </Button>                   
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