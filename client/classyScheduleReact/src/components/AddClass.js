import { Paper, Grid, TextField, Button, Typography } from '@material-ui/core'
import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles'
import Axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root:{
        display: 'flex',   
    },
    container: {
        padding: theme.spacing(4),
        position: 'relative',
        flexGrow: 1,
        height: '100%'
    },
    title: {
        color: '#7E16A4',
        fontWeight: '600',
    },
}))

const AddClass = () => {
    const [code, setCode] = React.useState('');
    const [courseNum, setCourseNum] = React.useState('');
    const [courseName, setCourseName] = React.useState('');

    const submitForm = () => {
        Axios.post('http://localhost:3000/AddClass', {
            dept_code: code,
            class_num: courseNum,
            class_name: courseName,
        }).then(() => {
            alert('inserted');
        });
    };

    const handleChangeCode = (event) => {
        //console.log('typed => ${event.target.value}');
        setCode(event.target.value);
    };
    const handleChangeCourseNum = (event) => {
        setCourseNum(event.target.value);
    }
    const handleChangeCourseName = (event) => {
        setCourseName(event.target.value);
    }
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
                        <InputLabel id="demo-simple-select-label">Department Code</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={code}
                            label="code"
                            onChange={handleChangeCode}
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
                    <TextField fullWidth size="medium" id="outlined-basic" label="Course #" variant="outlined" value={courseNum} onChange={handleChangeCourseNum}  />
                </Grid>
                <Grid item xs={4} fullWidth>
                    <TextField fullWidth size="medium" id="outlined-basic" label="Course Name" variant="outlined" value={courseName} onChange={handleChangeCourseName}  />
                </Grid>
                <Grid item xs={4} fullWidth>
                    <Button variant="contained" size="large" type="submit"  disableElevation onClick={submitForm}>
                        Submit
                    </Button>
                    {/* <Link to='/Calendar'>
                        Calendar
                    </Link> */}

                </Grid>
            </Grid>
        </Paper>
    )
}

export default AddClass;