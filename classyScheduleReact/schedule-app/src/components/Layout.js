import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppRouter from '../router/AppRouter'
import { CssBaseline } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
//   toolbar: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//   },
 }))

export default function Layout() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppRouter></AppRouter>
    </div>
   
  )
}
