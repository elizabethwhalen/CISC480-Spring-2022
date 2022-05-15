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
    container: {
        padding: '40px',
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

// main function component which exports the DeleteFaculty Form UI
export default function DeleteFaculty() {
    const [facultyID, setFacultyID] = React.useState([]);
    const [facultyIDList, setFacultyIDList] = React.useState([]);
    const [deleted, setDeleted] = React.useState(0); // -1 for error, 0 for base, 1 for deleted successfully
    const token = sessionStorage.getItem('token');
    const classes = useStyles(); // call the useStyle hook

    // This function will create a Axios request to DELETE a faculty member when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (facultyID !== '') {
            // Config data for DELETE https request
            const config = {
                method: 'delete',
                url: `https://classy-api.ddns.net/v2/faculty/${facultyID}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            // https request Promise executed with Config settings.
            axios(config).then(() => {
                // good response. faculty member was removed from the database
                setDeleted(1);
            }).catch(() => {
                // bad response: verify that faculty id exists
                setDeleted(-1);
            });
        }
    };

    // This function will get the list of existing Dept codes
    const getFacultyList = () => {
        // idList will hold faculty id during axios response
        const idList = [];
        // Config data for https request.
        const config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/faculty',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            response.data.map((e) => {
                idList.push(e.faculty_id);
                return idList;
            })
            // use function to set fac id list and lastname list from response
            setFacultyIDList(idList);
        }).catch(() => {

        });
    }

    // This function will retrieve the value selected in the faculty id field whenever it changes
    const handleFacultyIDChange = (event) => {
        setFacultyID(event.target.value);
    };

    // call the hook useEffect to populate dept list from the GET request
    useEffect(() => {
        getFacultyList();
    }, [])

    // Return the UI of the component
    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} fontWeight='600'>
                        Delete an Existing Faculty Member
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* FACULTY ID */}
                            <Grid item xs={12} md={4} >
                                <FormControl fullWidth size="medium">
                                    <InputLabel id="demo-select-small">Faculty ID</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={facultyID}
                                        label="Faculty ID"
                                        onChange={handleFacultyIDChange}
                                        size='large'
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {/* DYNAMIC MAP OF EXISTING FACULTY IDS TO MENU ITEMS */}
                                        {facultyIDList.map(e =>
                                            <MenuItem key={e} value={e}>
                                                {e}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={8} />

                            {/* POST-SUBMIT STATUS MESSAGES */}
                            {(deleted === 1) && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body1"
                                        className={classes.message}
                                        fontWeight='600'
                                    >
                                        <DoneIcon /> Faculty Member has been deleted from the database successfully!
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
                                        <CloseIcon /> Faculty Member could not be deleted from the databse.
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