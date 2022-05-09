import * as React from 'react';
import { 
    Grid, 
    Select, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Modal, 
    Typography, 
    Box 
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles'

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

export default function EditClassForm (props) {
    const open = props.open;
    const classes = useStyles()
   
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
                    <Grid container spacing={1}>
                        <Grid item xs={12} fullWidth>
                            <Typography
                                variant="h6"
                                className={classes.title}
                                gutterBottom
                            >
                                Edit Class
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-select-small">Class</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={props.Class}
                                    label="Class"
                                    onChange={props.handleChangeClass}
                                    size='small'
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="CISC 480">CISC 480</MenuItem>
                                    <MenuItem value="CISC 210">CISC 210</MenuItem>
                                    <MenuItem value="STAT 420">STAT 420</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-select-small">Instructor</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={props.Instructor}
                                    label="Instructor"
                                    onChange={props.handleChangeInstructor}
                                    size='small'
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'Chaz'}>Chaz</MenuItem>
                                    <MenuItem value={"Carl"}>Carl</MenuItem>
                                    <MenuItem value={"Sue"}>Sue</MenuItem>
                                    <MenuItem value={"Kevin"}>Kevin</MenuItem>
                                    <MenuItem value={"Howard"}>Howard</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-select-small">Room</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={props.Room}
                                    label="Room"
                                    onChange={props.handleChangeRoom}
                                    size='small'
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={428}>428</MenuItem>
                                    <MenuItem value={429}>429</MenuItem>
                                    <MenuItem value={430}>430</MenuItem>
                                    <MenuItem value={431}>431</MenuItem>
                                    <MenuItem value={432}>432</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                {/* anchor */}
                                <InputLabel id="demo-select-small">Time</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={props.Time}
                                    label="Time"
                                    onChange={props.handleChangeTime}
                                    size='small'
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'8AM'}>8AM</MenuItem>
                                    <MenuItem value={'9AM'}>9AM</MenuItem>
                                    <MenuItem value={'10AM'}>10AM</MenuItem>
                                    <MenuItem value={'11AM'}>11AM</MenuItem>
                                    <MenuItem value={'12PM'}>12PM</MenuItem>
                                    <MenuItem value={'1PM'}>1PM</MenuItem>
                                    <MenuItem value={'2PM'}>2PM</MenuItem>
                                    <MenuItem value={'3PM'}>3PM</MenuItem>
                                    <MenuItem value={'4PM'}>4PM</MenuItem>
                                    <MenuItem value={'5PM'}>5PM</MenuItem>
                                    <MenuItem value={'6PM'}>6PM</MenuItem>
                                    <MenuItem value={'7PM'}>7PM</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} fullWidth>

                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}