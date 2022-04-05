import {  
    Grid, 
    Paper,
    Button 
} from '@material-ui/core'

import { 
    InputLabel, 
    MenuItem, 
    FormControl, 
    Select 
} from '@mui/material'

import React from 'react'


/*React page Calendar */
const Calendar = () => {

    
    const [Time, SetTime] = React.useState('');
    const [Day, SetDay] = React.useState('');
    const [Class, SetClass] = React.useState('');

    /*Submiting the Form will Update the table (Calendar) */
    const submitForm = (event) => {
        let row = -1;
        if(Time === '8AM') {
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

        if(row !== -1) {
            var table = document.getElementById('classes');
            table.rows[row].cells[Day].innerHTML = Class;
        }
    }

    // This function will retrieve the value entered in the time field whenever it changes
    const handleChangeTime = (event) => {
        SetTime(event.target.value)
    }

    // This function will retrieve the value entered in the day field whenever it changes
    const handleChangeDay = (event) => {
        SetDay(event.target.value);
    }

    // This function will retrieve the value entered in the class field whenever it changes
    const handleChangeClass = (event) => {
        SetClass(event.target.value);
    }
    
    return (
        <Paper elevation={0}>
            <Grid container>
                
                <Grid item xs={12} fullWidth>
                    <div class='header'>
                        <h1>Classy Scheduler</h1> 
                        {/* This is the header of our classy scheduler page */}

                    </div>
                </Grid>
                {/* add a list with checkboxes */}

                <Grid item xs={12} >{/* This Grid contains the table for our calendar*/}
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

            {/*This is the demo form to add classes to the table*/}
            <Grid container xs={4} fullWidth>
                
                {/*This Section controls the time to input*/}
                <FormControl>
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

                {/*This controls the time being inputted into the calendar*/}
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Day</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={Day}
                        label="Day"
                        onChange={handleChangeDay}
                        size='medium'
                        autoWidth
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Monday</MenuItem>
                        <MenuItem value={2}>Tuesday</MenuItem>
                        <MenuItem value={3}>Wednesday</MenuItem>
                        <MenuItem value={4}>Thursday</MenuItem>
                        <MenuItem value={5}>Friday</MenuItem>
                    </Select>
                </FormControl>

                {/*This controls the class to input into the calendar*/}
                <FormControl>
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
        </Paper>
        
        
    )
}
export default Calendar