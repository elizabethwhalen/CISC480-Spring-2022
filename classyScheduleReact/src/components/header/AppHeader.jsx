import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core'
import LoginHeader from './LoginHeader'
import { Link } from 'react-router-dom'
import logo from '../../images/Updated_Logo.gif'
import { Box } from '@mui/material'

// Width of the drawer (so that the header can move to exact position as the drawer expands)
const drawerWidth = 300

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: '#7E16A4',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 100,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'white', 
  },
  link: {
    textDecoration: 'none'
  },
  logo: {
      width: '35px',
      height: '35px',
      display: 'inline',
      marginRight: '10px',
  }
}))

// Define and export the function
export default function AppHeader(props) {

  const classes = useStyles() // call the hook

  // Return the main component
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.open,
      })}
    >
      <Toolbar>

        {/* ICON */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: props.open,
          })}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
        
        {/* TITLE */}
        <Container>
          <Link to='/' className={classes.link}>
            <Typography
              variant="h4"
              className={classes.text}
              noWrap
              align='center'
            >
              <img src={logo} alt='logo' className={classes.logo}/> 
              Classy Schedule 
            </Typography>
          </Link>          
        </Container>

        {/* USER'S LOGIN INFO */}
        <LoginHeader
          login={props.login}
          handleLogOut={props.handleLogOut}
        ></LoginHeader>

      </Toolbar>
    </AppBar>
  )
}