import React from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography
} from '@material-ui/core'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import DoneIcon from '@mui/icons-material/Done'

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
        color: '#388e3c',
        fontWeight: 600,
    },
}))

// Main component
const AddClass = () => {

    const [code, setCode] = React.useState(''); // Department code (e.g., CISC, STAT, etc.)
    const [courseNum, setCourseNum] = React.useState(''); // Course number (e.g., 420, 350, etc.)
    const [courseName, setCourseName] = React.useState(''); // Course name (e.g., Info Sec, Computer Graphics, etc.)
    const [added, setAdded] = React.useState(null);

    const token = localStorage.getItem('access_token');
    // This function will create a Axios request when the form is submitted
    // It will send all information in the form to the database through the call
    const submitForm = (event) => { 
        event.preventDefault();
        if (code !== '' && courseNum !== '' && courseName !== '') {
            // Data fields for POST request.
            let data = JSON.stringify({
                dept_code: code,
                class_num: courseNum,
                class_name: courseName
            });
            // Config data for https request.
            let config = {
                method: 'post',
                url: 'http://classy-api.ddns.net/v2/class',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: data
            };
            // https request Promise executed with Config settings.
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));
                setAdded(true);
            }).catch((error) => {
                console.log(error);
                setAdded(false);
            });

            setCode('')
            setCourseNum('')
            setCourseName('')
        } else {
            setAdded(false);
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
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        className={classes.title}
                        gutterBottom
                    >
                        Add New Class
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* DEPARTMENT CODE */}
                            <Grid item xs={3} >
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Department Code"
                                    fullWidth
                                    name="code"
                                    type="text"
                                    value={code}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(0, 4)
                                    }}
                                    validators={[
                                        'matchRegexp:^[a-zA-Z]{1,4}$',
                                        'required'
                                    ]}
                                    errorMessages={[
                                        'Invalid - It should have 4 characters',
                                        'this field is required',
                                    ]}
                                    onChange={handleChangeCode}
                                />
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
                            <Grid item xs={6} >
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

                            {added && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" className={classes.message}>
                                        <DoneIcon /> Class has been added successfully!
                                    </Typography>
                                </Grid>
                            )}

                            {/* BUTTON */}
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disableElevation
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </Grid>

            </Grid>
        </Paper>
    )
}

// Export the component
export default AddClass;