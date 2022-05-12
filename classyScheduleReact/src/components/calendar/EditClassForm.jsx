import * as React from 'react';
import {
    Grid,
    Select,
    InputLabel,
    MenuItem,
    Modal,
    Typography,
    Box,
    Button,
    TextField,
    FormControlLabel,
    FormGroup,
    FormControl,
    Checkbox,
    FormLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    title: {
        color: '#7E16A4',
        fontWeight: 600,
    },
    button: {
        color: "black",
        bgcolor: "grey",
    },
    grid: {
        paddingRight: 0,
    },
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    p: 4,
};

export default function EditClassForm(props) {
    const open = props.open;
    const classes = useStyles();
    const [course, setCourse] = React.useState(props.event.title === "New class" ? "" : props.event.title);
    const [instructor, setInstructor] = React.useState(props.event.instructor);
    const [room, setRoom] = React.useState(props.event.room);
    const [startTime, setStartTime] = React.useState(props.startTime);
    const [endTime, setEndTime] = React.useState(props.endTime);
    const [days, setDays] = React.useState(props.event.days);
    const [errors, setErrors] = React.useState([]);

    const handleChangeCourse = (event) => {
        setCourse(event.target.value);
    }

    const handleChangeInstructor = (event) => {
        setInstructor(event.target.value);
    }

    const handleChangeRoom = (event) => {
        setRoom(event.target.value);
    }

    const handleChangeStartTime = (event) => {
        setStartTime(event.target.value);
    }

    const handleChangeEndTime = (event) => {
        setEndTime(event.target.value);
    }

    const handleChangeDays = (event) => {
        setDays({
            ...days,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSubmit = () => {
        let error = [];
        if (course === '') {
            error.push('Course is not selected');
        }
        if (instructor === '') {
            error.push('Instructor is not selected');
        }
        if (room === '') {
            error.push('Room is not selected');
        }
        if (endTime < startTime) {
            error.push("Meeting time is not valid. Ending time must be greater than starting time.")
        }

        if (!days.monday && !days.tuesday && !days.wednesday && !days.thursday && !days.friday) {
            error.push('Meeting days are not selected');
        }

        setErrors(error);

        let data = null;
        let id = props.event.id;

        if (error.length === 0) {
            data = {
                course: course,
                instructor: instructor,
                room: room,
                startTime: startTime,
                endTime: endTime,
                days: days,
                id: id,
            }
        }
        props.handleEventUpdate(data);
    }

    const { monday, tuesday, wednesday, thursday, friday } = days;

    return (
        <div>
            <Modal
                open={open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                className={classes.title}
                                gutterBottom
                            >
                                Edit Class
                            </Typography>
                        </Grid>

                        <Grid item md={8} xs={12}>
                            <Grid container spacing={2} >
                                <Grid item xs={12} className={classes.grid}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-select-small">Course</InputLabel>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={course}
                                            label="Class"
                                            onChange={handleChangeCourse}
                                            size='small'
                                            autoWidth
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {props.courseList.map((e) => {
                                                return <MenuItem key={e} value={e}>{e}</MenuItem>;
                                            })}

                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} className={classes.grid}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-select-small">Instructor</InputLabel>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={instructor}
                                            label="Instructor"
                                            onChange={handleChangeInstructor}
                                            size='small'
                                            autoWidth
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {props.instructorList.map((e) => {
                                                return <MenuItem key={e} value={e}>{e}</MenuItem>;
                                            })}

                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} className={classes.grid}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-select-small">Room</InputLabel>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={room}
                                            label="Room"
                                            onChange={handleChangeRoom}
                                            size='small'
                                            autoWidth
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {props.roomList.map((e) => {
                                                return <MenuItem key={e} value={e}>{e}</MenuItem>;
                                            })}

                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="time"
                                        label="Start Time"
                                        type="time"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: 300, // 5 min
                                        }}
                                        value={startTime}
                                        size="small"
                                        onChange={handleChangeStartTime}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="time"
                                        label="End Time"
                                        type="time"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: 300, // 5 min
                                        }}
                                        value={endTime}
                                        size="small"
                                        onChange={handleChangeEndTime}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item md={4} xs={12} style={{ "paddingLeft": "40px" }}>
                            <FormControl fullWidth component="fieldset" variant="standard">
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={monday} onChange={handleChangeDays} name="monday" />
                                        }
                                        label="Monday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={tuesday} onChange={handleChangeDays} name="tuesday" />
                                        }
                                        label="Tuesday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={wednesday} onChange={handleChangeDays} name="wednesday" />
                                        }
                                        label="Wednesday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={thursday} onChange={handleChangeDays} name="thursday" />
                                        }
                                        label="Thursday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={friday} onChange={handleChangeDays} name="friday" />
                                        }
                                        label="Friday"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                disableElevation
                                type='submit'
                                size='medium'
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: '#6a1b9a',
                                    '&:hover': { backgroundColor: '#4a148c' },
                                    marginRight: "10px",
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                disableElevation
                                sx={{
                                    color: '#6a1b9a',
                                    '&:hover': { borderColor: '#4a148c', color: '#4a148c' },
                                    borderColor: '#6a1b9a',
                                }}
                                onClick={props.onClose}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}