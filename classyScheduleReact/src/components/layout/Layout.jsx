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

  const classes = useStyles() // call the hook
  const [open, setOpen] = React.useState(false) // variable that determines expanding motion of the drawer
  const loggedIn = props.loggedIn;
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
    <>
      {loggedIn || currentToken ?
        <div className={classes.root}>
          <CssBaseline />
          <AppHeader
            open={open}
            loggedIn={props.loggedIn}
            handleLogOut={props.handleLogOut}
            handleDrawerOpen={handleDrawerOpen}
            setLoggedIn={props.setLoggedIn}
          />

          <AppSideNavBar
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
            open={open}
          />

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <AppRouter></AppRouter>
          </main>
        </div> :
        <LogRouter setLoggedIn={props.setLoggedIn} setToken={props.setToken}></LogRouter>
      }
    </>

  )
}
