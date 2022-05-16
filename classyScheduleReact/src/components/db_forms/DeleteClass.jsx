import React, { useEffect } from 'react'
import {
    Paper,
    Grid,
    Button,
    Typography,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
} from '@mui/material'
import axios from 'axios'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@mui/styles'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close';

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles({
    root: {
        display: 'flex',
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

// main function component which exports the DeleteClass Form UI
export default function DeleteClass() {
    const [code, setCode] = React.useState(''); // Department code (e.g., CISC, STAT, etc.)
    const [courseNum, setCourseNum] = React.useState(''); // Course number (e.g., 420, 350, etc.)
    const [deleted, setDeleted] = React.useState(0); // -1 for error, 0 for base, 1 for added successfully
    const [deptList, setDeptList] = React.useState([]);
    const [courseNumList, setCourseNumList] = React.useState([]);
    const token = sessionStorage.getItem('token');
    const classes = useStyles(); // call the useStyle hook

    // This function will create a Axios request to DELETE a course when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (code !== '' && courseNum !== '' && courseNum !== '') {
            // Config data for DELETE https request
            const config = {
                method: 'delete',
                url: `https://classy-api.ddns.net/v2/class/${code}/${courseNum}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            // https request Promise executed with Config settings.
            axios(config).then(() => {
                // good response. course was removed from the database
                setDeleted(1);
            }).catch(() => {
                // bad response: verify that course exists
                setDeleted(-1);
            });
        }
    };

    // This function will get the list of existing Dept codes
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

    // This function will get the list of existing course numbers from the database
    const getCourseNumList = (dept) => {
        // list will hold dept codes during axios response
        const list = [];
        // Config data for https request.
        const config = {
            method: 'get',
            url: `https://classy-api.ddns.net/v2/class?dept_code=${dept}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            response.data.map((e) => {
                list.push(e.class_num);
                return list;
            })
            // use function to setBuildingList from response
            setCourseNumList(list);
        }).catch(() => {

        });
    };

    // This function will retrieve the value selected in the dept. code field whenever it changes
    const handleChangeCode = (event) => {
        setCode(event.target.value);
        getCourseNumList(event.target.value);
    };

    // This function will retrieve the value entered in the course number field whenever it changes
    const handleChangeCourseNum = (event) => {
        setCourseNum(event.target.value);
    }

    // call the hook useEffect to populate dept list from the GET request
    useEffect(() => {
        getDeptList(code);
        getCourseNumList();
    }, [])

    // Return the UI of the component
    return (
        <Paper sx={{ padding: '20px', height: "100%" }} elevation={0}>
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} fontWeight='600'>
                        Delete an Existing Course
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* DEPARTMENT CODE */}
                            <Grid item xs={12} md={4} >
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

                            {/* CLASS NUMBER */}
                            <Grid item xs={12} md={4} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Course Number</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={courseNum}
                                        label="Course Number"
                                        onChange={handleChangeCourseNum}
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {/* DYNAMIC MAP OF EXISTING COURSE NUMS TO MENU ITEMS */}
                                        {courseNumList.map(e =>
                                            <MenuItem key={e} value={e}>
                                                {e}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} />

                            {/* POST-SUBMIT STATUS MESSAGES */}
                            {(deleted === 1) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body1"
                                        className={classes.message}
                                        fontWeight='600'
                                    >
                                        <DoneIcon /> Course has been deleted from the database successfully!
                                    </Typography>
                                </Grid>
                            )}
                            {(deleted === -1) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body1"
                                        className={classes.message}
                                        fontWeight='600'
                                    >
                                        <CloseIcon /> Course could not be deleted from the databse.
                                        Please verify that the record being deleted exists.
                                    </Typography>
                                </Grid>
                            )}

                            {/* SUBMIT/DELETE BUTTON */}
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
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </Grid>
            </Grid>
        </Paper>
    )
}