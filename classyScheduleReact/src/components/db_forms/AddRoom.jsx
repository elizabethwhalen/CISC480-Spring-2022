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
import axios from 'axios';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@mui/styles'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles({
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

// main function component which exports the AddFaculty Form UI
export default function AddRoom() {
    const [roomNum, setRoomNum] = React.useState('');
    const [building, setBuilding] = React.useState(''); // Room number (e.g., 420, 350, etc.)
    const [buildingList, setBuildingList] = React.useState([]);
    const [capacity, setCapacity] = React.useState('');
    const classes = useStyles();
    const token = sessionStorage.getItem('token');
    const [added, setAdded] = React.useState(0); // -1 for error, 0 for base, 1 for added successfully

    // This function will create a Axios request to send all information when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (roomNum !== '' && building !== '' && capacity !== '') {
            const data = JSON.stringify({
                building_code: building,
                room_num: roomNum,
                // Using property shorthand
                capacity,
            });
            const config = {
                method: 'post',
                url: 'https://classy-api.ddns.net/v2/room',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // using property shorthand
                data,
            };
            axios(config).then(() => {
                // good response
                setAdded(1);
            }).catch(() => {
                // bad response: check that record is not a duplicate
                setAdded(-1);
            });
            setRoomNum('');
            setBuilding('');
            setCapacity('')
        }
    }

    // This function will retrieve the value entered in the Room number field whenever it changes
    const handleChangeRoomNum = (event) => {
        setRoomNum(event.target.value);
    }

    // This function will retrieve the value entered in the building field whenever it changes
    const handleChangeBuilding = (event) => {
        setBuilding(event.target.value);
    }

    // This function will retrieve the value entered in the capacity field whenever it changes
    const handleChangeCapacity = (event) => {
        setCapacity(event.target.value);
    }

    // This function populates the building list used in the dropdown
    const getBuildingList = () => {
        // list will hold building codes during axios response
        const list = [];
        // Config data for https request.
        const config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/building',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            response.data.map((e) => {
                list.push(e.building_code);
                return list;
            })
            // use function to setBuildingList from response
            setBuildingList(list);
        }).catch(() => {

        });
    }

    // call the hook useEffect to populate building list from the GET request
    useEffect(() => {
        getBuildingList();
    }, [])

    // Return the UI of the component
    return (
        <Paper sx={{ padding: '20px', height: "100%" }} elevation={0}  >
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} fontWeight='600'>
                        Add a New Room
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12} >
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>

                                {/* DROPDOWN FOR BUILDING SELECTION */}
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Building</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={building}
                                        label="Building"
                                        onChange={handleChangeBuilding}
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {/* DYNAMIC MAP OF EXISTING BUILDINGS TO MENU ITEMS */}
                                        {buildingList.map(e =>
                                            <MenuItem key={e} value={e}>
                                                {e}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* ROOM NUMBER */}
                            <Grid item xs={4}>
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
                                        'Invalid: Please enter a 3-digit number',
                                        'this field is required',
                                    ]}
                                    onChange={handleChangeRoomNum}
                                />
                            </Grid>

                            {/* CAPACITY */}
                            <Grid item xs={4}>
                                <TextValidator
                                    size="medium"
                                    variant="outlined"
                                    label="Capacity"
                                    fullWidth
                                    name="Capacity"
                                    type="text"
                                    value={capacity}
                                    validators={['matchRegexp:^[0-9]{1,3}$', 'required']}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.slice(0, 4)
                                    }}
                                    errorMessages={[
                                        'Invalid: Please enter a number between 1 and 999',
                                        'this field is required',
                                    ]}
                                    onChange={handleChangeCapacity}
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
                                        <DoneIcon /> Room has been added successfully!
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
                                        <CloseIcon /> Room could not be added to the databse.
                                        Please verify that the record being added does not already exist.
                                    </Typography>
                                </Grid>
                            )}

                            {/* SUBMIT BUTTON */}
                            <Grid item xs={12}>
                                <Button variant="contained"
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