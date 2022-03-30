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

            <h2>
                
                <button size="large" type="submit">Add New Class</button>
            </h2>
               
            <h2>
                
                <button size="large" type="submit">Add New Faculty Member</button>
            </h2>
            <h2>
                
                <button size="large" type="submit">View Schedule</button>
            </h2>
            <h2>
                
                <button size="large" type="submit">Questions?</button>
            </h2>
        </Paper>

    )
}

export default Home