import React from "react"
import { makeStyles } from '@material-ui/core/styles'
import { Paper } from "@mui/material"

const useStyles = makeStyles((theme) => ({
    root:{
        display: 'flex',   
    },
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
        height: '100%'
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
}))

const Home = () => {
    const classes = useStyles()

    return (
        <Paper className={classes.container} elevation={0}>
            <h1>
                HOME PAGE
            </h1>
        </Paper>

    )
}

export default Home