import React from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography
} from '@material-ui/core'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@material-ui/core/styles'


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
const AddRoom = () => {
    const [roomNum, setRoomNum] = React.useState(''); // Room number (e.g., 420, 350, etc.)
    const [error, setError] = React.useState(false);

    const classes = useStyles()

    // This function will retrieve the value entered in the Room number field whenever it changes
    const handleChangeRoomNum = (event) => {
        setRoomNum(event.target.value);
    }

    const handleSubmit = (event) => {
        if (roomNum !== '') {
            // function
        }
    }

    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Room Number
                    </Typography>
                </Grid>

                <Grid item xs={12} fullWidth>
                    <ValidatorForm onSubmit={handleSubmit}>
                        <TextValidator
                            size="medium"
                            variant="outlined"
                            label="Room Number"
                            fullWidth
                            name="RoomNum"
                            type="text"
                            value={roomNum}
                            validators={['matchRegexp:^[0-9]{1,3}$', 'required']}
                            onInput={(e) => {
                                e.target.value = e.target.value.slice(0, 4)
                            }}
                            errorMessages={[
                                'Invalid - It should be a 3-digit number',
                                'this field is required',
                            ]}
                            onChange={handleChangeRoomNum}
                        />
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
                <Grid item xs={12} fullWidth>
                    <Button variant="contained" size="large" type="submit" disableElevation>
                        Submit
                    </Button>
                </Grid>
            </Grid>

        </Paper>
    )
}
// Export the component
export default AddRoom