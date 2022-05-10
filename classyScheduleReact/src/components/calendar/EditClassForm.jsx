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
    Radio
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles'
import { pink, blue, yellow, purple, green } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
        height: '100%',
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
    button: {
        color: "black",
        bgcolor: "grey"
    }
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    p: 4,
};

export default function EditClassForm(props) {
    const open = props.open;
    const classes = useStyles();
    const [course, setCourse] = React.useState('');
    const [instructor, setInstructor] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [repeat, setRepeat] = React.useState('');
    const [startTime, setStartTime] = React.useState(props.startTime);
    const [endTime, setEndTime] = React.useState(props.endTime);
    const [startRepeat, setStartRepeat] = React.useState(props.date);
    const [endRepeat, setEndRepeat] = React.useState(props.date);
    const [days, setDays] = React.useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
    });
    const [errors, setErrors] = React.useState([]);
    const [color, setColor] = React.useState('a');

    const handleChange = (event) => {
        setColor(event.target.value);
    };

    const controlProps = (item) => ({
        checked: color === item,
        onChange: handleChange,
        value: item,
        name: 'color-radio-button-demo',
        inputProps: { 'aria-label': item },
    });

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

    const handleChangeStartRepeat = (event) => {
        setStartRepeat(event.target.value);
    }

    const handleChangeEndRepeat = (event) => {
        setEndRepeat(event.target.value);
    }

    const handleChangeDays = (event) => {
        setDays({
            ...days,
            [event.target.name]: event.target.checked,
        });
    };

    const handleRepeatChange = (event) => {
        setRepeat(event.target.value);
    };

    const handleSubmit = () => {
        let error = [];
        if (course === ''){
            error.push('Course is not selected');
        }
        if (instructor === ''){
            error.push('Instructor is not selected');
        }
        if (room === ''){
            error.push('Room is not selected');
        }
        if (endTime < startTime) {
            error.push("Meeting time is not valid. Ending time must be greater than starting time.")
        }

        if (!days.monday && !days.tuesday && !days.wednesday && !days.thursday && !days.friday) {
            error.push('Meeting days are not selected');
        }

        if (repeat !== "" ){
            if (endRepeat < startRepeat){
                error.push("Recurrence interval is not valid")
            }
        }
        setErrors(error);

        let data = null;
        if (error.length === 0){
            data = {
                course: course,
                instructor: instructor,
                room: room,
                startTime: startTime,
                endTime: endTime,
                days: days,
                repeat: repeat,
                startRepeat: startRepeat,
                endRepeat: endRepeat,
                color: color,
                selected: props.selected,
            }
        }
        props.onUpdate(data);
    }
    const { monday, tuesday, wednesday, thursday, friday } = days;

    return (
        <div>
            {/* <Button variant='contained' onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container spacing={2} display="flex">
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                                className={classes.title}
                                gutterBottom
                            >
                                Edit Class
                            </Typography>
                        </Grid>
                        <Grid item md={6} xs={8}>
                            <Grid container spacing={2} >
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
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
                                        defaultValue="07:30"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: 300, // 5 min
                                        }}
                                        // sx={{ width: 150 }}
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
                                        defaultValue="08:00"
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

                        <Grid item md={2.5} xs={4}>
                            <FormControl component="fieldset" variant="standard">
                                <FormGroup>
                                    <FormLabel>
                                        Meeting Days
                                    </FormLabel>
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

                        <Grid item md={3.5} xs={12}>
                            <Grid container spacing={2}>

                                <Grid item xs={12}>
                                    <FormControl fullWidth size="small">

                                        <InputLabel id="demo-simple-select-label">Recurrence</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={repeat}
                                            label="Recurrence"
                                            onChange={handleRepeatChange}
                                            size="small"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'weekly'}>Weekly</MenuItem>
                                            <MenuItem value={'biweekly'}>Biweekly</MenuItem>
                                            <MenuItem value={'monthly'}>Monthly</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="date"
                                        label="From"
                                        type="date"
                                        defaultValue="2017-05-24"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={startRepeat}
                                        size="small"
                                        onChange={handleChangeStartRepeat}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="date"
                                        label="From"
                                        type="date"
                                        defaultValue="2017-05-24"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={endRepeat}
                                        size="small"
                                        onChange={handleChangeEndRepeat}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Radio
                                        {...controlProps('pink')}
                                        sx={{
                                            color: pink[400],
                                            '&.Mui-checked': {
                                                color: pink[400],
                                            },
                                        }}
                                    />
                                    <Radio
                                        {...controlProps('blue')}
                                        sx={{
                                            color: blue[400],
                                            '&.Mui-checked': {
                                                color: blue[400],
                                            },
                                        }}
                                    />
                                    <Radio
                                        {...controlProps('yellow')}
                                        sx={{
                                            color: yellow[400],
                                            '&.Mui-checked': {
                                                color: yellow[400],
                                            },
                                        }}
                                    />
                                    <Radio
                                        {...controlProps('green')}
                                        sx={{
                                            color: green[400],
                                            '&.Mui-checked': {
                                                color: green[400],
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>

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