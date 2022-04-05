import React from 'react'
import {
    Paper,
    Grid,
    TextField,
    Button,
    Typography
} from '@material-ui/core'

import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
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
    subHeader: {
        fontWeight: '600'
    }
}))

const AddFaculty = () => {
    const [teachLoad, setTeachLoad] = React.useState('');
    const [state, setState] = React.useState({
        intro: false,
        security: false,
        ai: false,
    });

    const handleTeachLoadChange = (event) => {
        setTeachLoad(event.target.value);
    };


    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const { intro, security, ai } = state;

    const classes = useStyles()

    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Faculty Member
                    </Typography>
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
                    <TextField fullWidth size="medium" id="outlined-basic" label="Teach Load" variant="outlined" value={teachLoad} onChange={handleTeachLoadChange} />
                </Grid>

                <Grid item xs={12} fullWidth>
                    <Grid container spacing={1}>
                        {/* Preferred Classes checkboxes */}
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
                                            <Checkbox checked={intro} onChange={handleChange} name="intro" />
                                        }
                                        label="Intro to CS"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={security} onChange={handleChange} name="security" />
                                        }
                                        label="Information Security"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={ai} onChange={handleChange} name="ai" />
                                        }
                                        label="Artifical Intelligence"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
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
