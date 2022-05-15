import React from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography
} from '@material-ui/core'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

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
    subHeader: {
        fontWeight: '600',
    },
    message: {
        color: '#388e3c',
        fontWeight: '600',
    },
    unsucessfulMessage: {
        color: 'red',
        fontWeight: '600',
    },
}))

// main function component which exports the AddFaculty Form UI
export default function AddFaculty() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [teachLoad, setTeachLoad] = React.useState('');
    const classes = useStyles() // call the useStyle hook
    const token = sessionStorage.getItem('token');
    // unique ID value must generated, for flexibility with database changing, random allows for greater flexibility than an incremental approach
    const unique = Math.floor(Math.random() * 999999999); 
    const [added, setAdded] = React.useState(0); // -1 for error, 0 for base, 1 for added successfully

    // This function will create a Axios request to send all information when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (firstName !== '' && lastName !== '' && teachLoad !== 0.0) {
            // Data fields for POST request.
            const data = JSON.stringify({
                faculty_id: unique,
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
        }
    };

    // This function will retrieve the value selected in the first name field whenever it changes
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }

    // This function will retrieve the value selected in the last name field whenever it changes
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    // This function will retrieve the value selected in the teach load field whenever it changes
    const handleTeachLoadChange = (event) => {
        setTeachLoad(event.target.value);
    };

    // Return the UI of the component
    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Faculty Member
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* FIRST NAME */}
                            <Grid item xs={4}>
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
                                        'Invalid input',
                                        'this field is required',
                                    ]}
                                    onChange={handleFirstNameChange}
                                />

                            </Grid>

                            {/* LAST NAME */}
                            <Grid item xs={4}>
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
                                        'Invalid input',
                                        'this field is required',
                                    ]}
                                    onChange={handleLastNameChange}
                                />
                            </Grid>

                            {/* TEACH LOAD */}
                            <Grid item xs={4}>
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
                                        'Invalid input',
                                        'this field is required',
                                    ]}
                                    onChange={handleTeachLoadChange}
                                />
                            </Grid>

                            {/* POST-SUBMIT STATUS MESSAGES */}
                            {(added === 1) && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" className={classes.message}>
                                        <DoneIcon /> Faculty has been added successfully!
                                    </Typography>
                                </Grid>
                            )}
                            {(added === -1) && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" className={classes.unsucessfulMessage}>
                                        <CloseIcon /> Faculty could not be added to the databse.
                                        Please verify that the record being added does not already exist.
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