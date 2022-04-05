import React from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography
} from '@material-ui/core'

import {
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from '@mui/material'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

// This is a React hook used for organizing the styling of each element in this component
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
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
    message: {
        color: 'red',
        fontWeight: 600,
    },
}))

// Main component
const AddClass = () => {

    const [code, setCode] = React.useState(''); // Department code (e.g., CISC, STAT, etc.)
    const [courseNum, setCourseNum] = React.useState(''); // Course number (e.g., 420, 350, etc.)
    const [courseName, setCourseName] = React.useState(''); // Course name (e.g., Info Sec, Computer Graphics, etc.)
    const [error, setError] = React.useState(false);

    // This function will create a Axios request when the form is submitted
    // It will send all information in the form to the database through the call
    const submitForm = (event) => {
        event.preventDefault();
        if (code === '' || courseNum === '' || courseName === '') {
            setError(true);
        } else {
            let data = JSON.stringify({dept_code: code, class_num: courseNum, class_name: courseName });
            let config = {
                method: 'post',
                url: 'http://databaseconnectionexample.azurewebsites.net/class',
                headers: { 'Content-Type': 'application/json'},
                data: data
            };
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));
            }).catch((error) => {
                console.log(error);
            });
            
            setError(false);
            setCode('');
            setCourseNum('');
            setCourseName('');
        }
    };
    
    // This function will retrieve the value selected in the dept. code field whenever it changes
    const handleChangeCode = (event) => {
        setCode(event.target.value);
    };

    // This function will retrieve the value entered in the course number field whenever it changes
    const handleChangeCourseNum = (event) => {
        setCourseNum(event.target.value);
    }

    // This function will retrieve the value entered in the course name field whenever it changes
    const handleChangeCourseName = (event) => {
        setCourseName(event.target.value);
    }

    const classes = useStyles() // call the useStyle hook

    // Return the main component
    return (
        <Paper className={classes.container} elevation={0} >

            {/* TITLE */}
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    <Typography
                        variant="h6"
                        className={classes.title}
                        gutterBottom
                    >
                        Add New Class
                    </Typography>
                </Grid>

                <Grid item xs={12} fullWidth>
                    <ValidatorForm onError={(errors) => console.log(errors)}>
                        <Grid container spacing={1}>

                            {/* DEPARTMENT CODE */}
                            <Grid item xs={3} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department Code</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={code}
                                        label="Department Code"
                                        onChange={handleChangeCode}
                                        size='medium'
                                        autoWidth
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value={'CISC'}>CISC</MenuItem>
                                        <MenuItem value={'STAT'}>STAT</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* COURSE NUMBER */}
                            <Grid item xs={3}>
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Course Number"
                                    fullWidth
                                    name="coursenum"
                                    type="text"
                                    value={courseNum}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(0, 4)
                                    }}
                                    validators={[
                                        'matchRegexp:^[0-9]{1,4}$',
                                        'required'
                                    ]}
                                    errorMessages={[
                                        'Invalid - It should be a 3-digit number',
                                        'this field is required',
                                    ]}
                                    onChange={handleChangeCourseNum}
                                />
                            </Grid>

                            {/* COURSE NAME */}
                            <Grid item xs={6} fullWidth >
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Course Name"
                                    fullWidth
                                    name="coursename"
                                    type="text"
                                    value={courseName}
                                    validators={['matchRegexp:^[a-zA-Z ]{1,100}$', 'required']}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(0, 100)
                                    }}
                                    errorMessages={[
                                        'Invalid - It should be a-z, A-Z, and space',
                                        'this field is required'
                                    ]}
                                    className={classes.textBox}
                                    onChange={handleChangeCourseName}
                                />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </Grid>

                {/* 
                    If any field is missing, then display the error message
                    Otherwise, display nothing
                 */}
                {error && (
                    <Grid item xs={12}>
                        <Typography variant="body1" className={classes.message}>
                            * Please enter valid inputs.
                        </Typography>
                    </Grid>
                )}

                {/* BUTTON */}
                <Grid item xs={4} fullWidth>
                    <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        disableElevation
                        onClick={submitForm}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

// Export the component
export default AddClass;