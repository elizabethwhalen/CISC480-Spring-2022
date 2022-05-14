import React from "react"
import { makeStyles } from '@mui/styles'
import { Grid, Paper, Button, Typography } from "@mui/material"
import { Link } from 'react-router-dom'


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
    container: {
        padding: "30px",
        position: 'relative',
        flexGrow: 1,
        height: '100%',
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
    link: {
        textDecoration: 'none',
    },
    button: {
        color: "black",
    }
}))

function Home() {
    const classes = useStyles();

    return (
        <Paper className={classes.container} elevation={0}>
            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Welcome to Classy Scheduler
                    </Typography>

                    <Typography variant="h6">
                        The place for all of your scheduling needs
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {/* This button will take you to the add new class tab */}
                        <Grid item md={3} sm={6} xs={12}>
                            <Link to='/AddClass' className={classes.link}>
                                <Button
                                    size="large"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#7E16A4",
                                        '&:hover': { color: '#7E16A4', borderColor: "#7E16A4" },
                                        color: "white"
                                    }}
                                >
                                    Add New Class
                                </Button>
                            </Link>
                        </Grid>

                        {/* This button will take you to the add New Faculty tab */}
                        <Grid item md={3} sm={6} xs={12}>
                            <Link to='/AddFaculty' className={classes.link}>
                                <Button
                                    size="large"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#7E16A4",
                                        '&:hover': { color: '#7E16A4', borderColor: "#7E16A4" },
                                        color: "white"
                                    }}
                                >
                                    Add New Faculty Member
                                </Button>
                            </Link>
                        </Grid>

                        {/* This button will take you to the add New Room tab */}
                        <Grid item md={3} sm={6} xs={12}>
                            <Link to='/AddRoom' className={classes.link}>
                                <Button
                                    size="large"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#7E16A4",
                                        '&:hover': { color: '#7E16A4', borderColor: "#7E16A4" },
                                        color: "white"
                                    }}
                                >
                                    Add New Room
                                </Button>
                            </Link>
                        </Grid>

                        {/* This button will take you to the Calendar */}
                        <Grid item md={3} sm={6} xs={12}>
                            <Link to='/Calendar' className={classes.link}>
                                <Button
                                    size="large"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#7E16A4",
                                        '&:hover': { color: '#7E16A4', borderColor: "#7E16A4" },
                                        color: "white"
                                    }}
                                >
                                    View Schedule
                                </Button>
                            </Link>
                        </Grid>

                        {/* This button will take you to the Questions tab */}
                        <Grid item xs={12}>
                            <Link to='/Help' className={classes.link}>
                                <Button
                                    size="large"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#7E16A4",
                                        '&:hover': { color: '#7E16A4', borderColor: "#7E16A4" },
                                        color: "white"
                                    }}
                                >
                                    Help and FAQ Page</Button>
                            </Link>
                        </Grid>
                    </Grid>

                </Grid>


            </Grid>

            {/* Add a footer that talks about classy scheduler */}
        </Paper>

    )
}

export default Home