import * as React from 'react'
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
} from '@mui/material'
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
    const { open, event, start, end, onClose, courseList } = props;
    const classes = useStyles();
    const [course, setCourse] = React.useState(event.title === "New class" ? "" : event.title);
    const [instructor, setInstructor] = React.useState(event.instructor);
    const [room, setRoom] = React.useState(event.room);
    const [startTime, setStartTime] = React.useState(start);
    const [endTime, setEndTime] = React.useState(end);
    const [days, setDays] = React.useState(event.days);
    const [errors, setErrors] = React.useState([]);

    const handleChangeCourse = (e) => {
        setCourse(e.target.value);
    }

    const handleChangeInstructor = (e) => {
        setInstructor(e.target.value);
    }

    const handleChangeRoom = (e) => {
        setRoom(e.target.value);
    }

    const handleChangeStartTime = (e) => {
        setStartTime(e.target.value);
    }

    const handleChangeEndTime = (e) => {
        setEndTime(e.target.value);
    }

    const handleChangeDays = (e) => {
        setDays({
            ...days,
            [e.target.name]: e.target.checked,
        });
    };

    const handleSubmit = () => {
        const error = [];
        if (course === '') {
            error.push('Course is not selected.');
        }
        if (instructor === '') {
            error.push('Instructor is not selected.');
        }
        if (room === '') {
            error.push('Room is not selected.');
        }
        if (endTime <= startTime) {
            error.push("Meeting time is not valid. Ending time must be greater than starting time.");
        }

        if (!days.monday && !days.tuesday && !days.wednesday && !days.thursday && !days.friday) {
            error.push('Meeting days are not selected.');
        }

        let data = null;
        const { id } = event.id;

        if (error.length === 0) {
            data = {
                course,
                instructor,
                room,
                startTime,
                endTime,
                days,
                id,
            }
            props.handleEventUpdate(data);
        } else {
            setErrors(error);
        }
    }

    const { monday, tuesday, wednesday, thursday, friday } = days;

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
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
                                            {courseList.map(e => {
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
                                            {props.instructorList.map(e => {
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
                                            {props.roomList.map(e => {
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
                                            <Checkbox
                                                checked={monday}
                                                onChange={handleChangeDays}
                                                name="monday"
                                            />
                                        }
                                        label="Monday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={tuesday}
                                                onChange={handleChangeDays}
                                                name="tuesday"
                                            />
                                        }
                                        label="Tuesday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={wednesday}
                                                onChange={handleChangeDays}
                                                name="wednesday"
                                            />
                                        }
                                        label="Wednesday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={thursday}
                                                onChange={handleChangeDays}
                                                name="thursday"
                                            />
                                        }
                                        label="Thursday"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={friday}
                                                onChange={handleChangeDays}
                                                name="friday"
                                            />
                                        }
                                        label="Friday"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>

                        {errors.length !== 0 && (
                            <Grid item xs={12}>
                                {errors.map(e => {
                                    return (
                                        <Typography
                                            key={e}
                                            style={{ color: "red" }}
                                        >
                                            {e}
                                        </Typography>
                                    );
                                })}
                            </Grid>
                        )}

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
                                onClick={() => props.onClose()}
                                sx={{
                                    color: '#6a1b9a',
                                    '&:hover': { borderColor: '#4a148c', color: '#4a148c' },
                                    borderColor: '#6a1b9a',
                                }}
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