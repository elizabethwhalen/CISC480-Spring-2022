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
export default function Help() {
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
                                Database Functions Tab
                            </Typography>
                            <Typography variant='h6'>
                                <em>Add New Course</em> allows you to add a new course to the database
                                by choosing a Department Code, Course Number and a Course Name.
                            </Typography>
                            <Typography variant='h6'>
                                <em>Add Faculty</em> allows you to add a new Faculty member to the database
                                by inputing their First and Last name, Faculty ID, and Teach Load.
                            </Typography>
                            <Typography variant='h6'>
                                <em>Add Room</em> allows you to add a new Room to the database directly
                                by inputing the Building Code, Room Number, and Capacity.
                            </Typography>
                            <Typography variant='h6'>
                                <em>Delete Course</em> allows you to delete an existing Course from the database
                                by selecting Department code and Course Number.
                            </Typography>
                            <Typography variant='h6'>
                                <em>Delete Faculty</em> allows you to delete an existing Faculty Member from the database
                                by selecting their Faculty ID. Under current version, deletion by Faculty Name is not supported.
                            </Typography>
                            <Typography variant='h6'>
                                <em>Delete Room</em> allows you to delete an existing Room from the database
                                by selecting the Building Code and Room number.
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
                                Versioning status and FAQ are also found on this page.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
