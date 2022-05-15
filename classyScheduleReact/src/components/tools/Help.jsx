import React from 'react'
import { Typography, Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    root: {
        display: 'flex',
    },
    container: {
        padding: '40px',
        position: 'relative',
        flexGrow: 1,
        height: '100%'
    },
    header: {
        color: '#7E16A4',
    },
})

// new Component 'Help'
export default function Help() {
    const classes = useStyles();


    return (
        <Paper elevation={0} className={classes.container} >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant='h4' fontWeight='600'>
                        Getting Started
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography
                                variant='h5'
                                className={classes.header}
                                fontWeight='600'
                            >
                                Home Page
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Home Page</strong></em> is where we currently showcase all our main features at once.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                variant='h5'
                                className={classes.header}
                                fontWeight='600'
                            >
                                Database Functions Tab
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Add Course</strong></em> allows you to add a new course to the database
                                by choosing a Department Code, Course Number and a Course Name.
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Add Faculty</strong></em> allows you to add a new Faculty member to the database
                                by inputing their First and Last name, Faculty ID, and Teach Load.
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Add Room</strong></em> allows you to add a new Room to the database directly
                                by inputing the Building Code, Room Number, and Capacity.
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Delete Course</strong></em> allows you to delete an existing Course from the database
                                by selecting Department code and Course Number.
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Delete Faculty</strong></em> allows you to delete an existing Faculty Member from the database
                                by selecting their Faculty ID. Under current version, deletion by Faculty Name is not supported.
                                User may verify Faculty Name fields before deletion.
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Delete Room</strong></em> allows you to delete an existing Room from the database
                                by selecting the Building Code and Room number.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                variant='h5'
                                className={classes.header}
                                fontWeight='600'
                            >
                                Calendar Overview
                            </Typography>
                            <Typography variant='h6'>
                                The <em><strong>Calendar Overview</strong></em> tab allows you to view the entire Calendar
                                with the information that is currently in the database.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                variant='h5'
                                className={classes.header}
                                fontWeight='600'
                            >
                                Help
                            </Typography>
                            <Typography variant='h6'>
                                <em><strong>Help</strong></em> is the main tab where any features and their usage are documented.
                                Versioning status and FAQ are also found on this page.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
