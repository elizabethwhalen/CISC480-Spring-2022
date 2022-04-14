import {
    Grid,
    Paper,
    Button,
    FormControlLabel,
    Checkbox,
    Popover
} from '@material-ui/core'

import {
    InputLabel,
    MenuItem,
    FormControl,
    FormGroup,
    Select,
    Typography
} from '@mui/material'

import React, { useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AddClassForm from './AddClassForm'

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

}))

/*React page Calendar */
const Calendar = () => {

    const ref = useRef(null);

    const [popOverVisible, setPopOverVisible] = useState(false);
    const togglePopOver = () => {
        popOverVisible === false
            ? setPopOverVisible(true)
            : setPopOverVisible(false);
    };

    const [Time, SetTime] = React.useState('');
    const [Class, SetClass] = React.useState('');
    const [Room, SetRoom] = React.useState('');
    const [Instructor, SetInstructor] = React.useState('');

    /*Submiting the Form will Update the table (Calendar) */
    const submitForm = (event) => {
        let row = -1;

        let workday1 = document.getElementById("Monday");
        let workday2 = document.getElementById("Tuesday");
        let workday3 = document.getElementById("Wednesday");
        let workday4 = document.getElementById("Thursday");
        let workday5 = document.getElementById("Friday");

        if (Time === '8AM') {
            row = 1;
        } else if (Time === '9AM') {
            row = 2;
        } else if (Time === '10AM') {
            row = 3;
        } else if (Time === '11AM') {
            row = 4;
        } else if (Time === '12PM') {
            row = 5;
        } else if (Time === '1PM') {
            row = 6;
        } else if (Time === '2PM') {
            row = 7;
        } else if (Time === '3PM') {
            row = 8;
        } else if (Time === '4PM') {
            row = 9;
        } else if (Time === '5PM') {
            row = 10;
        } else if (Time === '6PM') {
            row = 11;
        } else if (Time === '7PM') {
            row = 12;
        } else if (Time === '8PM') {
            row = 13;
        }

        var table = document.getElementById('classes');
        if (row !== -1) {
            if (workday1.checked) {
                table.rows[row].cells[1].innerHTML = Class + " Room: " + Room + " Instructor: " + Instructor;
            }
            if (workday2.checked) {
                table.rows[row].cells[2].innerHTML = Class + " Room: " + Room + " Instructor: " + Instructor;
            }
            if (workday3.checked) {
                table.rows[row].cells[3].innerHTML = Class + " Room: " + Room + " Instructor: " + Instructor;
            }
            if (workday4.checked) {
                table.rows[row].cells[4].innerHTML = Class + " Room: " + Room + " Instructor: " + Instructor;
            }
            if (workday5.checked) {
                table.rows[row].cells[5].innerHTML = Class + " Room: " + Room + " Instructor: " + Instructor;
            }
        }
    }

    // This function will retrieve the value entered in the time field whenever it changes
    const handleChangeTime = (event) => {
        SetTime(event.target.value)
    }

    // This function will retrieve the value entered in the class field whenever it changes
    const handleChangeClass = (event) => {
        SetClass(event.target.value);
    }

    // This function will retrieve the value entered in the time field whenever it changes
    const handleChangeRoom = (event) => {
        SetRoom(event.target.value)
    }
    // This function will retrieve the value entered in the time field whenever it changes
    const handleChangeInstructor = (event) => {
        SetInstructor(event.target.value)
    }

    const classes = useStyles();

    return (
        <Paper elevation={0} className={classes.container}>
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    {/* This is the header of our classy scheduler page */}
                    <Typography variant='h4'>
                        Class Schedule
                    </Typography>
                </Grid>
                {/* add a list with checkboxes */}
                <Grid item xs={12} fullWidth>
                    <Button
                        ref={ref}
                        variant="contained"
                        disableElevation
                        onClick={togglePopOver}
                    >
                        Add Class
                    </Button>
                </Grid>

                {/* <AddClassForm
                    Class = {Class}
                    Instructor = {Instructor}
                    Room = {Room}
                    Time = {Time}
                    handleChangeClass = {handleChangeClass}
                    handleChangeInstructor = {handleChangeInstructor}
                    handleChangeRoom = {handleChangeRoom}
                    handleChangeTime = {handleChangeTime}
                /> */}

                <Grid item xs={12} fullWidth >{/* This Grid contains the table for our calendar*/}
                    <table id='classes'>
                        <thead>
                            <tr> {/* This row contains the headers for Time and each day of the week*/}
                                <th>Time</th>
                                <th>Monday</th>
                                <th> Tuesday</th>
                                <th> Wednessday</th>
                                <th> Thursday</th>
                                <th> Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr> {/* This row contians the class data for 8:00 time slot*/}
                                <td>8:00AM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 9:00 time slot*/}
                                <td>9:00AM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 10:00 time slot*/}
                                <td>10:00AM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 11:00 time slot*/}
                                <td>11:00AM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 12:00 time slot*/}
                                <td>12:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 1:00 time slot*/}
                                <td>1:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 2:00 time slot*/}
                                <td>2:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 3:00 time slot*/}
                                <td>3:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 4:00 time slot*/}
                                <td>4:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 5:00 time slot*/}
                                <td>5:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/* This row contains class data for the 6:00 time slot*/}
                                <td>6:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>
                            <tr>{/*This row contains class data for the 7:00 time slot*/}
                                <td>7:00PM</td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                            </tr>

                        </tbody>
                    </table>
                </Grid>
            </Grid>

            {/*Anchored Popover with on it form*/}
            <Popover
                open={popOverVisible}
                anchorEl={ref}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                styles={'padding: 10px'}
            >
                {/*This is the demo form to add classes to the table*/}
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        {/*This Section controls the time to input*/}
                        <FormControl fullWidth>
                            {/* anchor */}
                            <InputLabel id="demo-simple-select-label">Time</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Time}
                                label="Time"
                                onChange={handleChangeTime}
                                size='medium'
                                autoWidth
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'8AM'}>8AM</MenuItem>
                                <MenuItem value={'9AM'}>9AM</MenuItem>
                                <MenuItem value={'10AM'}>10AM</MenuItem>
                                <MenuItem value={'11AM'}>11AM</MenuItem>
                                <MenuItem value={'12PM'}>12PM</MenuItem>
                                <MenuItem value={'1PM'}>1PM</MenuItem>
                                <MenuItem value={'2PM'}>2PM</MenuItem>
                                <MenuItem value={'3PM'}>3PM</MenuItem>
                                <MenuItem value={'4PM'}>4PM</MenuItem>
                                <MenuItem value={'5PM'}>5PM</MenuItem>
                                <MenuItem value={'6PM'}>6PM</MenuItem>
                                <MenuItem value={'7PM'}>7PM</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        {/*This controls the day being inputted into the calendar*/}
                        <FormControl fullWidth>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox name="WorkA" id="Monday" value={"yes"} />} label="Monday" />
                                <FormControlLabel control={<Checkbox name="WorkB" id="Tuesday" value={"yes"} />} label="Tuesday" />
                                <FormControlLabel control={<Checkbox name="WorkC" id="Wednesday" value={"yes"} />} label="Wednesday" />
                                <FormControlLabel control={<Checkbox name="WorkD" id="Thursday" value={"yes"} />} label="Thursday" />
                                <FormControlLabel control={<Checkbox name="WorkE" id="Friday" value={"yes"} />} label="Friday" />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Room</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Room}
                                label="Room"
                                onChange={handleChangeRoom}
                                size='medium'
                                autoWidth>

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={428}>428</MenuItem>
                                <MenuItem value={429}>429</MenuItem>
                                <MenuItem value={430}>430</MenuItem>
                                <MenuItem value={431}>431</MenuItem>
                                <MenuItem value={432}>432</MenuItem>

                            </Select>

                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Instructor</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Instructor}
                                label="Instructor"
                                onChange={handleChangeInstructor}
                                size='medium'
                                autoWidth>

                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'Chaz'}>Chaz</MenuItem>
                                <MenuItem value={"Carl"}>Carl</MenuItem>
                                <MenuItem value={"Sue"}>Sue</MenuItem>
                                <MenuItem value={"Kevin"}>Kevin</MenuItem>
                                <MenuItem value={"Howard"}>Howard</MenuItem>

                            </Select>

                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        {/*This controls the class to input into the calendar*/}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Class}
                                label="Class"
                                onChange={handleChangeClass}
                                size='medium'
                                autoWidth
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="CISC 480">CISC 480</MenuItem>
                                <MenuItem value="CISC 210">CISC 210</MenuItem>
                                <MenuItem value="STAT 420">STAT 420</MenuItem>
                                <MenuItem value="No Class">No Class</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            size="medium"
                            type="submit"
                            disableElevation
                            onClick={submitForm}
                        >
                            Submit
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            ref={ref}
                            variant="contained"
                            disableElevation
                            size="medium"
                            onClick={togglePopOver}
                        >
                            Close Form
                        </Button>
                    </Grid>
                </Grid>

            </Popover>
        </Paper>


    )
}
export default Calendar