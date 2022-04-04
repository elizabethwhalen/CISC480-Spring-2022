import React from "react"
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from "@mui/material"
import { Link } from 'react-router-dom'

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
                {/* Place holder home page header*/}
                Welcome to Classy Scheduler 
                <h3>The place for all of your scheduling needs</h3>
            </h1>

            <h2>
                {/*This button will take you to the add new class tab*/}
                <Grid>
                    <Link to='/AddClass' className={classes.link}>
                        <button size="large" type="submit">Add New Class</button>
                    </Link>
                </Grid> 
            </h2>
               
            <h2>
                {/*This button will take you to the add New Faculty tab*/}
                <Grid>
                    <Link to='/AddFaculty' className={classes.link}>
                        <button size="large" type="submit">Add New Faculty Member</button>
                    </Link>
                </Grid> 
            </h2>
            <h2>
                {/*This button will take you to the Calendar */}
                <Grid>
                    <Link to='/Calendar' className={classes.link}>
                        <button size="large" type="submit">View Schedule</button>
                    </Link>
                </Grid>
            </h2>
            <h2>
                {/*This button will take you to the Questions tab*/}
                <Grid>
                    <Link to='/Help' className={classes.link}>
                        <button size="large" type="submit">Questions?</button>
                    </Link>
                </Grid>
                
            </h2>
            {/* Add a footer that talks about classy scheduler*/}
        </Paper>

    )
}

export default Home