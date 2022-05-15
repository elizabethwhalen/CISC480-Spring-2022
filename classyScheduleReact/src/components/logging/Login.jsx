/* eslint-disable react/prop-types */
import React from 'react'
import { Button, Grid, Paper, Typography, } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Link } from 'react-router-dom'
import axios from 'axios'
import background from '../../images/hd_calendar2.jpg'
import logo from '../../images/Updated_Logo.gif'

// Styling components using useStyles
const useStyles = makeStyles({
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
    top: '0px',
    minHeight: '450px'
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
  loginTitleContainer: {
    padding: '200px 100px 50px 50px',
  },
  loginTitle: {
    padding: '50px 10px 10px 10px',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '26pt'
  },
  loginContainer: {
    display: 'flex',
    width: '100%',
    padding: '0px 150px 0px 50px',
    margin: '0 auto -55px auto'
  },
  logoGrid: {
    paddingBottom: '10px',
  },
  logo: {
    width: '220px',
    height: '220px',
    paddingLeft: '40px',
  },
  text: {
    paddingBottom: '30px'
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
    marginTop: '100px',
  },
  message: {
    color: 'red',
    fontWeight: 600,
  },
  button: {
    backgroundColor: '#0063cc',
  },
});

// Login page component with parameter passed under props
export default function Login(props) {
  const classes = useStyles(); // use the useStyles
  const [email, setEmail] = React.useState(''); // email
  const [password, setPassword] = React.useState(''); // password
  const { setToken, setLoggedIn } = props;

  const handleLogin = (event) => {
    event.preventDefault();

    // If either email or password is empty, then don't log user in
    if (email !== '' && password !== '') {
      // Data for POST to accept request.
      const data = JSON.stringify({
        email,
        password
      });
      // Config for axios specific https request.
      const config = {
        method: 'post',
        url: "https://classy-api.ddns.net/v2/login",
        headers: { 'Content-Type': 'application/json' },
        data,
      };
      // Axios promise is being executed with config data and token is being saved into browser local storage.
      axios(config).then((response) => {
        if (response.data !== '') {
          const token = response.data;
          setToken(token);
          setLoggedIn(true);
          sessionStorage.setItem("startRepeat", "2022-01-31");
          sessionStorage.setItem("endRepeat", "2022-05-22");
        } else {
          setLoggedIn(false);
        }
      }).catch((error) => {
        console.log(error);
      });

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
        <Grid item
          alignItems="flex-start"
          justify="flex-start"
          className={classes.gridItem1} >
          {/* <Grid container className={classes.loginTitleContainer}>
              <Grid item xs={12} className={classes.loginTitle}>
                CLASSY SCHEDULE
              </Grid>
            </Grid> */}
        </Grid>

        <Grid item
          alignItems="flex-end"
          justify="flex-end"
          className={classes.gridItem2}
        >
          <Grid container className={classes.loginContainer}>

            {/* TITLE */}
            <Grid item xs={12} className={classes.loginTitle} >
              CLASSY SCHEDULE
            </Grid>

            {/* LOGO */}
            <Grid item xs={12} className={classes.logoGrid} >
              <img src={logo} className={classes.logo} alt='logo' />
            </Grid>

            {/* INSTRUCTION TEXT */}
            <Grid item xs={12} className={classes.text}>
              Log in with your Classy Schedule Account
            </Grid>

            {/* Form */}
            <Grid item xs={12}>
              <ValidatorForm onSubmit={(event) => handleLogin(event)}>
                <Grid container spacing={1}>

                  {/* Email */}
                  <Grid item xs={12}>
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Email"
                      fullWidth
                      name="email"
                      value={email}
                      onChange={(event) => handleChangeEmail(event)}
                      validators={['required', 'isEmail']}
                      errorMessages={['this field is required', 'email is not valid']}
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} >
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Password"
                      fullWidth
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => handleChangePassword(event)}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      className={classes.textBox}
                    />
                  </Grid>

                  {/* Forgot Password link to reset password */}
                  <Grid item xs={6}>
                    <Typography variant='h8'>
                      <Link to='/ForgotPassword' className={classes.forgotPass}>
                        Forgot password?
                      </Link>
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant='h8'>
                      <Link to='/Signup' className={classes.forgotPass}>
                        Sign up
                      </Link>
                    </Typography>
                  </Grid>

                  {/* Submit button */}
                  <Grid item xs={12} sx={{ marginTop: '20px' }}>
                    <Button
                      variant="contained"
                      disableElevation
                      type='submit'
                      sx={{
                        backgroundColor: '#6a1b9a',
                        '&:hover': { backgroundColor: '#B9BDBB' }
                      }}
                    >
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

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// };