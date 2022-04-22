import React from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
        height: '100%'
    },
    header: {
        color: '#7E16A4',
        fontWeight: '600',
    },
}))

// new Component 'Help'
const Help = () => {
    const classes = useStyles();
    return (
        <Paper elevation={0} className={classes.container} >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant='h4'>
                        Getting Started
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant='h5' gutterBottom className={classes.header}>
                                Home Page
                            </Typography>
                            <Typography variant='h6'>
                                <em>Home Page</em> is where we currently showcase all our main features at once.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h5' gutterBottom className={classes.header}>
                                Functions Tab
                            </Typography>
                            <Typography variant='h6'>
                                The <em>Functions Tab</em> has two main components which are the <em>Add New Class </em>
                                feature and the <em>Add Faculty.</em>
                            </Typography>
                            <Typography variant='h6'>
                                <em>Add New Class</em> allows you to add a brand new course into the pool
                                of classes by choosing a Department Code, a Course Number and a Course Name.
                            </Typography>
                            <Typography variant='h6'>
                                <em>Add Faculty</em> allows you to add a new Faculty member to the database directly
                                by inputing their Title, First and Last name. You also have the option to add Teach Load
                                and their preferred classes.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h5' gutterBottom className={classes.header}>
                                Calendar Overview
                            </Typography>
                            <Typography variant='h6'>
                                The <em>Calendar Overview</em> tab allows you to view the entire Calendar
                                with the information that is currently in the database.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant='h5' gutterBottom className={classes.header}>
                                Help
                            </Typography>
                            <Typography variant='h6'>
                                <em>Help</em> is the main tab where any features and their usage are documented.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
export default Help