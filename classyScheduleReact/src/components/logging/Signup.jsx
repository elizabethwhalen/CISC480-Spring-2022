import React from 'react'
import { Button, Grid, Paper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import background from '../../images/hd_calendar2.jpg'
import { Link } from 'react-router-dom'
import logo from '../../images/Updated_Logo.gif'
import axios from 'axios'

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
  loginContainer: {
    display: 'flex',
    width: '100%',
    padding: '0px 150px 0px 50px',
    margin: '0 auto -55px auto'
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
  logoGrid: {
    paddingBottom: '10px',
  },
  logo: {
    width: '220px',
    height: '220px',
    padding: '0px 0px 0px 40px',
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
  error: {
    color: 'red',
  }
});

// Login page component with parameter passed under props
const Signup = (props) => {

  const classes = useStyles(); // use the useStyles
  const [email, setEmail] = React.useState(''); // email
  const [password, setPassword] = React.useState(''); // password
  const [confirmPass, setConfirmPass] = React.useState('');
  const [passMatch, setPassMatch] = React.useState(true);

  const handleSignup = (event) => {
    event.preventDefault();

    // If either email or password is empty, then don't log user in
    if (email !== '' && password !== '' && confirmPass !== '') {
      if (password === confirmPass) {
        let data = JSON.stringify({
          email: email,
          password: password
        });
        let config = {
          method: 'post',
          url: 'https://classy-api.ddns.net/v2/signup',
          headers: { 'Content-Type': 'application/json' },
          data: data
        };
        axios(config).then().catch((error) => {
          console.log(error);
        });
      } else {
        setPassMatch(false);
      }
    }
  }

  // This function will assign input value to email variable
  const handleChangeEmail = (event) => {
    setPassMatch(true);
    setEmail(event.target.value);
  }

  // This function will assign input value to password variable
  const handleChangePassword = (event) => {
    setPassMatch(true);
    setPassword(event.target.value);
  }

  // This function will assign input value to confirm password value
  const handleChangeConfirmPassword = (event) => {
    setPassMatch(true);
    setConfirmPass(event.target.value);
  }

  return (
    <Paper className={classes.root}>
      <Grid container className={classes.container} >

        {/* Empty grid item used for place holder */}
        <Grid item
          // alignItems="flex-start"
          // justify="flex-start" 
          className={classes.gridItem1} >
        </Grid>

        <Grid item
          // alignItems="flex-end"
          // justify="flex-end"
          className={classes.gridItem2}
        >
          <Grid container className={classes.loginContainer}>

            {/* TITLE */}
            <Grid item xs={12} className={classes.loginTitle} >
              CLASSY SCHEDULE
            </Grid>

            {/* LOGO */}
            <Grid item xs={12} className={classes.logoGrid} >
              <img src={logo} className={classes.logo} alt='logo' ></img>
            </Grid>

            {/* INSTRUCTION TEXT */}
            <Grid item xs={12} className={classes.text}>
              Create a New Classy Schedule Account
            </Grid>

            {/* Form */}
            <Grid item xs={12}>
              <ValidatorForm onSubmit={handleSignup}>
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
                      onChange={handleChangeEmail}
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
                      onChange={handleChangePassword}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      className={classes.textBox}
                    />
                  </Grid>

                  {/* Re-enter Password */}
                  <Grid item xs={12} >
                    <TextValidator
                      size="small"
                      variant="outlined"
                      label="Re-enter Password"
                      fullWidth
                      name="password"
                      type="password"
                      value={confirmPass}
                      onChange={handleChangeConfirmPassword}
                      validators={['required']}
                      errorMessages={['this field is required']}
                      className={classes.textBox}
                    />
                  </Grid>
                  {!passMatch && <Grid item xs={12}>
                    <Typography className={classes.error}>
                      Passwords do not match. Please retype.
                    </Typography>
                  </Grid>}

                  {/* Submit button */}
                  <Grid item xs={6} sx={{ marginTop: '20px' }}>
                    <Button
                      variant="contained"
                      disableElevation
                      type='submit'
                      sx={{ backgroundColor: '#6a1b9a', '&:hover': { backgroundColor: '#4a148c' } }} >
                      Sign up
                    </Button>
                  </Grid>

                  {/* BACK BUTTON */}
                  <Grid item xs={6} sx={{ marginTop: '20px' }}>
                    <Link to='/' style={{ "textDecoration": "none" }} >
                      <Button
                        variant="contained"
                        disableElevation
                        type='submit'
                        sx={{ backgroundColor: '#B9BDBB', '&:hover': { backgroundColor: '#4a148c' } }}
                      >
                        Back
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

export default Signup;