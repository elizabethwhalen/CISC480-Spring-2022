/* eslint-disable react/prop-types */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import AppRouter from '../../router/AppRouter'
import AppSideNavBar from '../../nav/AppSideNavBar'
import AppHeader from '../header/AppHeader'
import LogRouter from '../../router/LogRouter'

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
    padding: theme.spacing(0),
  },
}))

// This function will return the overall layout of the app
export default function Layout(props) {

  const {
    handleLogOut,
    loggedIn,
    setLoggedIn,
    setToken
  } = props;

  const classes = useStyles() // call the hook
  const [open, setOpen] = React.useState(false) // variable that determines expanding motion of the drawer
  const currentToken = sessionStorage.getItem('token');

  // This function will set the drawer to open
  const handleDrawerOpen = () => {
    setOpen(true)
  }

  // This function will set the drawer to close
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div>
      {loggedIn || currentToken ?
        <div className={classes.root}>
          <CssBaseline />
          <AppHeader
            open={open}
            loggedIn={loggedIn}
            handleLogOut={handleLogOut}
            handleDrawerOpen={handleDrawerOpen}
            setLoggedIn={setLoggedIn}
          />

          <AppSideNavBar
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
            open={open}
          />

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <AppRouter />
          </main>
        </div> :
        <LogRouter setLoggedIn={setLoggedIn} setToken={setToken} />
      }
    </div>

  )
}

