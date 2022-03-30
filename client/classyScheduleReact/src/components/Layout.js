import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppRouter from '../router/AppRouter'
import { CssBaseline } from '@material-ui/core'
import AppSideNavBar from './AppSideNavBar'
import AppHeader from './AppHeader'
import Login from './Login'

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

export default function Layout() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [login, setLogin] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleLogin = () =>  {
    setLogin(true) 
  }

  return (
    <>
      {login ?
        <div className={classes.root}>
          <CssBaseline />
          <AppHeader open={open} login={login} handleDrawerOpen={handleDrawerOpen} />
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