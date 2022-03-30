import React from 'react'
import { 
    Paper, 
    Grid, 
    TextField, 
    Button, 
    Typography 
} from '@material-ui/core'

import { 
    InputLabel, 
    MenuItem, 
    FormControl, 
    Select 
} from '@mui/material'

import { makeStyles } from '@material-ui/core/styles'
import Axios from 'axios'

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
}))

// Main component
const AddClass = () => {

    const [code, setCode] = React.useState(''); // Department code (e.g., CISC, STAT, etc.)
    const [courseNum, setCourseNum] = React.useState(''); // Course number (e.g., 420, 350, etc.)
    const [courseName, setCourseName] = React.useState(''); // Course name (e.g., Info Sec, Computer Graphics, etc.)

    // This function will create a Axios request when the form is submitted
    // It will send all information in the form to the database through the call
    const submitForm = () => {
        Axios.post('http://localhost:3000/AddClass', {
            dept_code: code,
            class_num: courseNum,
            class_name: courseName,
        }).then(() => {
            alert('inserted');
        });
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

                 {/* DEPT. CODE DROP-DOWN MENU */}
                <Grid item xs={4} >
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Department Code</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={code}
                            label="code"
                            onChange={handleChangeCode}
                            size='medium'
                            autoWidth
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'CISC'}>CISC</MenuItem>
                            <MenuItem value={'STAT'}>STAT</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                 {/* COURSE NUMBER */}
                <Grid item xs={4} fullWidth>
                    <TextField 
                        fullWidth 
                        size="medium" 
                        id="outlined-basic" 
                        label="Course #" 
                        variant="outlined" 
                        value={courseNum} 
                        onChange={handleChangeCourseNum} 
                    />
                </Grid>

                 {/* COURSE NAME */}
                <Grid item xs={4} fullWidth>
                    <TextField 
                        fullWidth 
                        size="medium" 
                        id="outlined-basic" 
                        label="Course Name" 
                        variant="outlined" 
                        value={courseName} 
                        onChange={handleChangeCourseName} 
                    />
                </Grid>

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