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

// main function component which exports the DeleteRoom Form UI
export default function DeleteRoom() {
    const [deleted, setDeleted] = React.useState(0); // -1 for error, 0 for base, 1 for added successfully
    const [roomNum, setRoomNum] = React.useState('');
    const [building, setBuilding] = React.useState('');
    const [buildingList, setBuildingList] = React.useState([]);
    const [roomNumList, setRoomNumList] = React.useState([]);
    const token = sessionStorage.getItem('token');
    const classes = useStyles(); // call the useStyle hook

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
    // This function will get the list of existing room numbers from the database for a specific building code
    const getRoomNumList = (buildingCode) => {
        // list will hold room numbers during axios response
        const list = [];
        // Config data for https request.
        const config = {
            method: 'get',
            url: `https://classy-api.ddns.net/v2/room?building_code=${buildingCode}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            response.data.map((e) => {
                list.push(e.room_num);
                return list;
            })
            // use function to setBuildingList from response
            setRoomNumList(list);
        }).catch(() => {

        });
    };

    // This function will retrieve the value entered in the Room number field whenever it changes
    const handleChangeRoomNum = (event) => {
        setRoomNum(event.target.value);
    }

    // This function will retrieve the value entered in the building field whenever it changes
    const handleChangeBuilding = (event) => {
        setBuilding(event.target.value);
        getRoomNumList(event.target.value);
    }

    // call the hook useEffect to populate dept list from the GET request
    useEffect(() => {
        getBuildingList();
    }, [])

    // This function will create a Axios request to DELETE a room when the form is submitted
    const submitForm = (event) => {
        event.preventDefault();
        if (roomNum !== '' && building !== '') {
            // Config data for DELETE https request
            const config = {
                method: 'delete',
                url: `https://classy-api.ddns.net/v2/room/${building}/${roomNum}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            // https request Promise executed with Config settings.
            axios(config).then(() => {
                // good response. room was removed from the database
                setDeleted(1);
                getRoomNumList(building);
            }).catch(() => {
                // bad response: verify that room exists
                setDeleted(-1);
            });
        }
    };

    // Return the UI of the component
    return (
        <Paper sx={{ padding: '20px', height: "100%" }} elevation={0} >
            <Grid container spacing={2}>

                {/* TITLE */}
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} fontWeight='600'>
                        Delete an Existing Room
                    </Typography>
                </Grid>

                {/* FORM BODY */}
                <Grid item xs={12}>
                    <ValidatorForm onSubmit={submitForm}>
                        <Grid container spacing={2}>

                            {/* DROPDOWN FOR BUILDING SELECTION */}
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth size="medium">
                                    <InputLabel id="demo-select-small">Building</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={building}
                                        label="Building"
                                        onChange={handleChangeBuilding}
                                        size='large'
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

                            {/* DROPDOWN FOR ROOM NUMBER SELECTION */}
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth size="medium">
                                    <InputLabel id="demo-select-small">Room Number</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={roomNum}
                                        label="Room Number"
                                        onChange={handleChangeRoomNum}
                                        size='large'
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {/* DYNAMIC MAP OF EXISTING BUILDINGS TO MENU ITEMS */}
                                        {roomNumList.map(e =>
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
                                        <DoneIcon /> Room has been deleted from the database successfully!
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
                                        <CloseIcon /> Room could not be deleted from the databse.
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