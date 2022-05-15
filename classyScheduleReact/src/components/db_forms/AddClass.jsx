import React, { useEffect } from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography,
    Select,
    FormControl,
    MenuItem,
    InputLabel
} from '@mui/material'
import axios from 'axios'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@mui/styles'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles({
    root: {
        display: 'flex',
    },
    container: {
        padding: "40px",
        position: 'relative',
        flexGrow: 1,
        height: '100%',
    },
    title: {
        color: '#7E16A4',
    },
    message: {
        color: '#388e3c',
    },
    unsucessfulMessage: {
        color: 'red',
    },
})

// main function component which exports the AddClass Form UI
export default function AddClass() {
    const [code, setCode] = React.useState(''); // Department code (e.g., CISC, STAT, etc.)
    const [courseNum, setCourseNum] = React.useState(''); // Course number (e.g., 420, 350, etc.)
    const [courseName, setCourseName] = React.useState(''); // Course name (e.g., Info Sec, Computer Graphics, etc.)
    const [added, setAdded] = React.useState(0); // -1 for error, 0 for base, 1 for added successfully
    const [deptList, setDeptList] = React.useState([]);
    const token = sessionStorage.getItem('token');
    const classes = useStyles(); // call the useStyle hook

    // This function will create a Axios request to send all information when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (code !== '' && courseNum !== '' && courseName !== '') {
            // Data fields for POST request.
            const data = JSON.stringify({
                dept_code: code,
                class_num: courseNum,
                class_name: courseName
            });
            // Config data for https request.
            const config = {
                method: 'post',
                url: 'https://classy-api.ddns.net/v2/class',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                data,
            };
            // https request Promise executed with Config settings.
            axios(config).then(() => {
                // good response
                setAdded(1);
            }).catch(() => {
                // bad response: verify that course number is not a duplicate
                setAdded(-1);
            });
            setCode('')
            setCourseNum('')
            setCourseName('')
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

    const getDeptList = () => {
        // list will hold dept codes during axios response
        const list = [];
        // Config data for https request.
        const config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/dept',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            response.data.map((e) => {
                list.push(e.dept_code);
                return list;
            })
            // use function to setBuildingList from response
            setDeptList(list);
        }).catch(() => {

        });
    }

    // call the hook useEffect to populate dept list from the GET request
    useEffect(() => {
        getDeptList();
    }, [])

    // Return the UI of the component
    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} fontWeight='600'>
                        Add a New Course
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* DEPARTMENT CODE */}
                            <Grid item xs={3} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={code}
                                        label="Department"
                                        onChange={handleChangeCode}
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {/* DYNAMIC MAP OF EXISTING DEPTS TO MENU ITEMS */}
                                        {deptList.map(e =>
                                            <MenuItem key={e} value={e}>
                                                {e}
                                            </MenuItem>
                                        )}
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

                            {/* POST-SUBMIT STATUS MESSAGES */}
                            {(added === 1) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body1"
                                        className={classes.message}
                                        fontWeight='600'
                                    >
                                        <DoneIcon /> Class has been added successfully!
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
                                        <CloseIcon /> Class could not be added to the databse.
                                        Please verify that the record being added does not already exist.
                                    </Typography>
                                </Grid>
                            )}

                            {/* SUBMIT BUTTON */}
                            <Grid item xs={4}>
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