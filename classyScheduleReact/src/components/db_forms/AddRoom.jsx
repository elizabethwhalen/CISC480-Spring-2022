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
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { makeStyles } from '@mui/styles'
import axios from 'axios';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';



// This is a React hook used for organizing the styling of each element in this component
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    container: {
        padding: "40px",
    },
    title: {
        fontWeight: 600,
        color: '#7E16A4',
    },
    message: {
        color: '#388e3c',
        fontWeight: 600,
    },
    unsucessfulMessage: {
        color: 'red',
        fontWeight: 600,
    }
}))

// Main component
const AddRoom = () => {
    const [roomNum, setRoomNum] = React.useState('');
    const [building, setBuilding] = React.useState(''); // Room number (e.g., 420, 350, etc.)
    const [buildingList, setBuildingList] = React.useState([]);
    const classes = useStyles();
    const token = sessionStorage.getItem('token');
    const [added, setAdded] = React.useState(0); //-1 for error, 0 for base, 1 for added successfully
    // const [notAdded, setNotAdded] = React.useState(null);


    // This function will retrieve the value entered in the Room number field whenever it changes
    const handleChangeRoomNum = (event) => {
        setRoomNum(event.target.value);
    }

    // This function will retrieve the value entered in the building field whenever it changes
    const handleChangeBuilding = (event) => {
        setBuilding(event.target.value);
    }

    useEffect(() => {
        getBuildingList();
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        if (roomNum !== '' && building !== '') {
            let data = JSON.stringify({
                building_code: building,
                room_num: roomNum,
                capacity: 20
            });
            let config = {
                method: 'post',
                url: 'https://classy-api.ddns.net/v2/room',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: data
            };
            axios(config).then((response) => {
                //console.log(JSON.stringify(response.data));
                setAdded(1);

            }).catch((error) => {
                //bad response: check that record is not a duplicate
                console.log("Error: Please verify that the record you are adding does not already exist.  " + error);
                setAdded(-1);

            });
            setRoomNum('');
            setBuilding('');
        }
        setAdded(0);
    }

    //This function gets...
    const getBuildingList = () => {
        const token = sessionStorage.getItem('token');
        // Config data for https request.
        let list = [];
        let config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/building',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            //console.log(JSON.stringify(response.data));
            response.data.map((e) => {
                let bd = e.building_code;
                list.push(bd);
                return list;
            })
            setBuildingList(list);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Room
                    </Typography>
                </Grid>

                <Grid item xs={12} >
                    <ValidatorForm onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                {/* Dropdown for Building Selection */}
                                <FormControl fullWidth size="large">
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
                                        {buildingList.map(e =>
                                            <MenuItem
                                                key={e}
                                                value={e}
                                            >
                                                {e}
                                            </MenuItem>
                                        )}

                                    </Select>
                                </FormControl>
                            </Grid>
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
                                        'Invalid - It should be a 3-digit number',
                                        'this field is required',
                                    ]}
                                    onChange={handleChangeRoomNum}
                                />
                            </Grid>

                            {(added === 1) && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" className={classes.message}>
                                        <DoneIcon /> Room has been added successfully!
                                    </Typography>
                                </Grid>
                            )}
                            {(added === -1) && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" className={classes.unsucessfulMessage}>
                                        <CloseIcon /> Room could not be added to the databse.
                                        Please verify that the record being added does not already exist.
                                    </Typography>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Button variant="contained"
                                    size="large"
                                    type="submit"
                                    disableElevation
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
// Export the component
export default AddRoom