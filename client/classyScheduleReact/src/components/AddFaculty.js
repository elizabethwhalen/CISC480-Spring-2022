import { Paper, Grid, TextField, Button, Typography } from '@material-ui/core'
import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
}))

const AddFaculty = () => {
    const [facultyTitle, setFacultyTitle] = React.useState('');
    const [teachLoad, setTeachLoad] = React.useState('');
    const [prefClasses, setPrefClasses] = React.useState('');

    const handleTitleChange = (event) => {
        setFacultyTitle(event.target.value);
    };
    const handleTeachLoadChange = (event) => {
        setTeachLoad(event.target.value);
    };
    const handlePrefClassesChange = (event) => {
        setPrefClasses(event.target.value);
    }


    const classes = useStyles()

    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Faculty Member
                    </Typography>
                </Grid>
                {/* Title (Dr. / Prof.) */}
                <Grid item xs={2} >
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Title</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={facultyTitle}
                            label="Faculty Title"
                            onChange={handleTitleChange}
                            size='medium'
                            autoWidth
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'Prof'}>Prof.</MenuItem>
                            <MenuItem value={'Dr'}>Dr.</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* First name */}
                <Grid item xs={4} fullWidth>
                    <TextField fullWidth size="medium" id="outlined-basic" label="First Name" variant="outlined" />
                </Grid>
                {/* Last name */}
                <Grid item xs={4} fullWidth>
                    <TextField fullWidth size="medium" id="outlined-basic" label="Last Name" variant="outlined" />
                </Grid>
                {/* Teach Load */}
                <Grid item xs={4}>
                    <TextField fullWidth size="medium" id="outlined-basic" label="Teach Load" variant="outlined" onChange={handleTeachLoadChange}/>
                </Grid>
                <Grid item xs={8}>
                    <p>(Standard Full-time Faculty are assigned 6.0 teach-load hours per year.)</p>
                </Grid>
                {/* Preferred Classes checkboxes */}
                <Grid item xs={12} fullWidth>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                    Please Select Preferred Classes for Faculty to Instruct
                    </Typography>
                </Grid>
                <Grid item xs={12} fullWidth>
                    <Box sx={{ display: 'flex' }}>
                        <FormControl component="fieldset" variant="standard">
                            <FormGroup>
                            <FormControlLabel
                                control={
                                <Checkbox onChange={handlePrefClassesChange} name="intro to cs" />
                                }
                                label="Intro to CS"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox onChange={handlePrefClassesChange} name="info sec" />
                                }
                                label="Information Security"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox onChange={handlePrefClassesChange} name="ai" />
                                }
                                label="Artifical Intelligence"
                            />
                            </FormGroup>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={12} fullWidth>
                    <Button variant="contained" size="large" type="submit" disableElevation>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default AddFaculty;