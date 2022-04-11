import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import AppRouter from '../../router/AppRouter'
import AppSideNavBar from '../../nav/AppSideNavBar'
import AppHeader from '../header/AppHeader'
import Login from '../logging/Login'

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
    padding: theme.spacing(1),
  },
}))

// This function will return the overall layout of the app
export default function Layout() {

  const classes = useStyles() // call the hook
  const [open, setOpen] = React.useState(false) // variable that determines expanding motion of the drawer
  const [login, setLogin] = React.useState(false) // variable that determines whether the user is logged in

  // This function will set the drawer to open
  const handleDrawerOpen = () => {
    setOpen(true)
  }

   // This function will set the drawer to close
  const handleDrawerClose = () => {
    setOpen(false)
  }

  // This function will set the login variable to be true
  // A.K.A. log user in
  const handleLogin = () =>  {
    setLogin(true) 
  }

  // This function will set the login variable to be false
  // A.K.A. log user out
  const handleLogOut = () => {
    setLogin(false)
  }

  return (
    <>
    {/* 
        When the login variable is false, the display the Login page
        Otherwise, open the main page (Home)
    */}
      {login ?
        <div className={classes.root}>
          <CssBaseline />
          <AppHeader 
            open={open} 
            login={login} 
            handleDrawerOpen={handleDrawerOpen} 
            handleLogOut={handleLogOut}
          />

          <AppSideNavBar handleDrawerClose={handleDrawerClose} open={open} />

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <AppRouter></AppRouter>
          </main>
        </div>
        :
        <Login handleLogin={handleLogin} />
      }
    </>

  )
}
