import React from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography
} from '@material-ui/core'

import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material'

import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'

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
    subHeader: {
        fontWeight: '600'
    }
}))

const AddFaculty = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [teachLoad, setTeachLoad] = React.useState('');
    const [state, setState] = React.useState({
        intro: false,
        security: false,
        ai: false,
    });
    // promise for our AddFaculty button
    const submitForm = (event) => {
        event.preventDefault();
        if (firstName !== '' && lastName !== '' && teachLoad !== 0.0) {
            let data = JSON.stringify({
                faculty_id: 99, 
                faculty_first: firstName, 
                faculty_last: lastName,
                title_id: 99, 
                prev_load: 0, 
                curr_load: teachLoad
            });
            let config = {
                method: 'post',
                url: 'http://classy-api.ddns.net/faculty',
                headers: { 'Content-Type': 'application/json' },
                data: data
            };
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data));
            }).catch((error) => {
                console.log(error);
            });
            setFirstName('');
            setLastName('');
            setTeachLoad('');
            //setState(false);
        }

    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    const handleTeachLoadChange = (event) => {
        setTeachLoad(event.target.value);
    };


    const handleChangeClassType = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

   // const { intro, security, ai } = state;

    const classes = useStyles()

    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Faculty Member
                    </Typography>
                </Grid>

                <Grid item xs={12} fullWidth>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>
                            {/* First name */}
                            <Grid item xs={4} fullWidth>
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

                            {/* Last name */}
                            <Grid item xs={4} fullWidth>
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

                            {/* Teach Load */}
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

                            {/* <Grid item xs={12} fullWidth>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} fullWidth>
                                        <Typography className={classes.subHeader}>
                                            Please Select Preferred Classes for Faculty to Instruct
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} fullWidth>
                                        <FormControl component="fieldset" variant="standard">
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={intro} onChange={handleChangeClassType} name="intro" />
                                                    }
                                                    label="Intro to CS"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={security} onChange={handleChangeClassType} name="security" />
                                                    }
                                                    label="Information Security"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={ai} onChange={handleChangeClassType} name="ai" />
                                                    }
                                                    label="Artifical Intelligence"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid> */}

                            <Grid item xs={12} fullWidth>
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

export default AddFaculty;
