import React from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography
} from '@mui/material'
import axios from 'axios';
import { makeStyles } from '@mui/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles({
    title: {
        color: '#7E16A4',
    },
    message: {
        color: '#388e3c',
    },
    unsucessfulMessage: {
        color: '#FA0D00',
    },
})

// main function component which exports the AddFaculty Form UI
export default function AddFaculty() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [teachLoad, setTeachLoad] = React.useState('');
    const [facultyID, setFacultyID] = React.useState('');
    const classes = useStyles() // call the useStyle hook
    const token = sessionStorage.getItem('token');
    // unique ID value must generated, for flexibility with database changing, random allows for greater flexibility than an incremental approach
    // const unique = Math.floor(Math.random() * 999999999); 
    const [added, setAdded] = React.useState(0); // -1 for error, 0 for base, 1 for added successfully

    // This function will create a Axios request to send all information when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (firstName !== '' && lastName !== '' && teachLoad !== 0.0 && facultyID !== '') {
            // Data fields for POST request.
            const data = JSON.stringify({
                faculty_id: facultyID,
                faculty_first: firstName,
                faculty_last: lastName,
                title_id: 2, // title ID level 2 is default for created faculty
                prev_load: 0,
                curr_load: teachLoad,
            });
            // Config data for https request.
            const config = {
                method: 'post',
                url: 'https://classy-api.ddns.net/v2/faculty',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // using property shorthand
                data,
            };
            // https request Promise executed with Config settings.
            axios(config).then(() => {
                // good response
                setAdded(1);
            }).catch(() => {
                // bad response: check that record is not a duplicate
                setAdded(-1);
            });
            setFirstName('');
            setLastName('');
            setTeachLoad('');
            setFacultyID('');
        }
    };

    // This function will retrieve the value selected in the first name field whenever it changes
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    // This function will retrieve the value selected in the last name field whenever it changes
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    // This function will retrieve the value selected in the teach load field whenever it changes
    const handleTeachLoadChange = (event) => {
        setTeachLoad(event.target.value);
    };

    // This function will retrieve the value selected in the faculty id field whenever it changes
    const handleFacultyIDChange = (event) => {
        setFacultyID(event.target.value);
    };

    // Return the UI of the component
    return (
        <Paper sx={{ padding: '20px', height: "100%" }} elevation={0}  >
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} fontWeight='600'>
                        Add a New Faculty Member
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* FIRST NAME */}
                            <Grid item xs={12} md={6}>
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="First Name"
                                    fullWidth
                                    name="firstName"
                                    type="text"
                                    value={firstName}

                                    validators={[
                                        'matchRegexp:^[a-zA-Z]{1,50}$',
                                        'required'
                                    ]}
                                    errorMessages={[
                                        'Invalid input: please check that length of 50 non-numeric characters is not exceeded',
                                        'this field is required',
                                    ]}
                                    onChange={handleFirstNameChange}
                                />

                            </Grid>

                            {/* LAST NAME */}
                            <Grid item xs={12} md={6}>
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Last Name"
                                    fullWidth
                                    name="lastName"
                                    type="text"
                                    value={lastName}

                                    validators={[
                                        'matchRegexp:^[a-zA-Z]{1,50}$',
                                        'required'
                                    ]}
                                    errorMessages={[
                                        'Invalid input: please check that length of 50 non-numeric characters is not exceeded',
                                        'this field is required',
                                    ]}
                                    onChange={handleLastNameChange}
                                />
                            </Grid>

                            {/* TEACH LOAD */}
                            <Grid item xs={12} md={6}>
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Teach Load"
                                    fullWidth
                                    name="teachLoad"
                                    value={teachLoad}

                                    validators={[
                                        'matchRegexp:^[0-9.]{1,5}$',
                                        'required'
                                    ]}
                                    errorMessages={[
                                        'Invalid input: please input a number greater than 0',
                                        'this field is required',
                                    ]}
                                    onChange={handleTeachLoadChange}
                                />
                            </Grid>

                            {/* FACULTY ID */}
                            <Grid item xs={12} md={6}>
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Faculty ID"
                                    fullWidth
                                    name="facultyID"
                                    value={facultyID}
                                    validators={[
                                        'matchRegexp:^[0-9.]{9}$',
                                        'required'
                                    ]}
                                    errorMessages={[
                                        'Invalid input: please input a 9-digit numerical ID',
                                        'this field is required',
                                    ]}
                                    onChange={handleFacultyIDChange}
                                />
                            </Grid>

                            {/* POST-SUBMIT STATUS MESSAGES */}
                            {(added === 1) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body1"
                                        className={classes.message}
                                        fontWeight='600'
                                    >
                                        <DoneIcon /> Faculty has been added successfully!
                                    </Typography>
                                </Grid>
                            )}
                            {(added === -1) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body1"
                                        className={classes.unsucessfulMessage}
                                        fontWeight='600'
                                    >
                                        <CloseIcon /> Faculty could not be added to the database.
                                        Please verify that the faculty ID being added does not already exist.
                                    </Typography>
                                </Grid>
                            )}

                            {/* SUBMIT BUTTON */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disableElevation
                                    sx={{
                                        backgroundColor: '#6a1b9a',
                                        '&:hover': { backgroundColor: '#B9BDBB' }
                                    }}
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