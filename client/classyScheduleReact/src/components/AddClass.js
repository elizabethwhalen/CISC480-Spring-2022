import { Paper, Grid, TextField, Button, Typography } from '@material-ui/core'
import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
}))

const AddClass = () => {
    const [code, setCode] = React.useState('');

    const handleChange = (event) => {
        setCode(event.target.value);
    };
    const classes = useStyles()

    return (
        <Paper className={classes.container} elevation={0} >
            <Grid container spacing={2}>
                <Grid item xs={12} fullWidth>
                    <Typography variant="h6" className={classes.title} gutterBottom>
                        Add New Class
                    </Typography>
                </Grid>
                <Grid item xs={4} >
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={code}
                            label="Dept. Code"
                            onChange={handleChange}
                            size='medium'
                            autoWidth
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'CISC'}>CISC</MenuItem>
                            <MenuItem value={'STAT'}>STAT</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} fullWidth>
                    <TextField fullWidth size="medium" id="outlined-basic" label="Course #" variant="outlined" />
                </Grid>
                <Grid item xs={4} fullWidth>
                    <TextField fullWidth size="medium" id="outlined-basic" label="Coure Name" variant="outlined" />
                </Grid>
                <Grid item xs={4} fullWidth>
                    <Button variant="contained" size="large" type="submit" disableElevation>
                        Submit
                    </Button>
                    <Link to="/Calendar">
                        Calendar</Link>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default AddClass;