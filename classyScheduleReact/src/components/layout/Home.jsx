import React from "react"
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper, Button, Typography } from "@mui/material"
import { Link } from 'react-router-dom'
import logo from '../../images/Classy_logo.gif'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
        height: '90vh'
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
    link: {
        textDecoration: 'none',
    },
    logo: {
        width: '100px',
        height: '100px',
        display: 'inline-block',
        float: 'left'
    }
}))

const Home = () => {
    const classes = useStyles()

    return (
        <Paper className={classes.container} elevation={0}>
            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <img src={logo} alt='' className={classes.logo}/>
                    <Typography variant="h4">
                        Welcome to Classy Scheduler
                    </Typography>
                    <Typography variant="h6">
                        The place for all of your scheduling needs
                    </Typography>
                    
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {/*This button will take you to the add new class tab*/}
                        <Grid item xs={12} fullWidth>
                            <Link to='/AddClass' className={classes.link}>
                                <Button size="large">Add New Class</Button>
                            </Link>
                        </Grid>

                        {/*This button will take you to the add New Faculty tab*/}
                        <Grid item xs={12}>
                            <Link to='/AddFaculty' className={classes.link}>
                                <Button size="large">Add New Faculty Member</Button>
                            </Link>
                        </Grid>

                        {/*This button will take you to the add New Room tab*/}
                        <Grid item xs={12}>
                            <Link to='/AddRoom' className={classes.link}>
                                <Button size="large">Add New Room</Button>
                            </Link>
                        </Grid>

                        {/*This button will take you to the Calendar */}
                        <Grid item xs={12}>
                            <Link to='/Calendar' className={classes.link}>
                                <Button size="large">View Schedule</Button>
                            </Link>
                        </Grid>

                        {/*This button will take you to the Questions tab*/}
                        <Grid item xs={12}>
                            <Link to='/Help' className={classes.link}>
                                <Button size="large">Questions?</Button>
                            </Link>
                        </Grid>
                    </Grid>

                </Grid>


            </Grid>

            {/* Add a footer that talks about classy scheduler*/}
        </Paper>

    )
}

export default Home