import { Grid, Paper } from '@material-ui/core'
import React from 'react'



const Calendar = () => {
   

    return (
        <Paper elevation={0}>
            <Grid container>
                <Grid item xs={12} fullWidth>
                    <div class='header'>
                        <h1>Classy Scheduler</h1> 
                        {/* This is the header of our classy scheduler page */}

                    </div>
                </Grid>

                <Grid item xs={12} fullWidth>
                    <table >
                        <tr>
                            <th>Time</th>
                            <th>Monday</th>
                            <th> Tuesday</th>
                            <th> Wednessday</th>
                            <th> Thursday</th>
                            <th> Friday</th>
                        </tr>
                        <tr>
                            <td>8:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>9:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>10:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>11:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>12:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>1:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>2:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>
                            <td>3:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>

                    </table>
                </Grid>
            </Grid>
        </Paper>
    )
}
export default Calendar