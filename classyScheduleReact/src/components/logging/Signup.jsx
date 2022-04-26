import React from 'react'
import { Button, Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import background from '../../images/campus.jpg'
import logo from '../../images/ustlogo.png'
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
    paddingTop: '50px',
    paddingBottom: '70px',
  },
  logo: {
    width: '260px',
    height: '50px'
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
const Signup = (props) => {

  const classes = useStyles(); // use the useStyles
  const [email, setEmail] = React.useState(''); // email
  const [password, setPassword] = React.useState(''); // password

  const handleLogin = (event) => {
    event.preventDefault();

    // If either email or password is empty, then don't log user in
    if (email !== '' && password !== ''){
      let token = '';
      let data = JSON.stringify({
        username: email,
        password: password
      });
      let config = {
        method: 'post',
        url: 'http://classy-api.ddns.net/v2/login',
        headers: { 'Content-Type': 'application/json' },
        data: data
      };
      axios(config).then((response) => {
        if (response.data !== ''){
          token = response.data;
          props.handleLogin(true);
          localStorage.setItem('access_token', token);
          console.log(token)
        } else {
          props.handleLogin(false);
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

            {/* LOGO */}
            <Grid item xs={12} className={classes.logoGrid} >
              <img src={logo} className={classes.logo} alt='logo' ></img>
            </Grid>


            {/* Form */}
            <Grid item xs={12}>
              <ValidatorForm onSubmit={handleLogin}>
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

                 
                  {/* <Grid item xs={6}>
                    <Typography variant='h8'>
                      <Link to='/Login' className={classes.forgotPass}>
                        Forgot password?
                      </Link>
                    </Typography>
                  </Grid> */}

                  {/* Submit button */}
                  <Grid item xs={12} sx={{ marginTop: '30px' }}>
                      <Button variant="contained" disableElevation type='submit' sx={{backgroundColor: '#6a1b9a', '&:hover' : {backgroundColor: '#4a148c'} }} >
                        Sign up
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

export default Signup;