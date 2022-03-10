import { Grid, Paper } from '@material-ui/core'
import React from 'react'


// This is just a template, adjust according to how you like




const Calendar = () => {
    
    return (
        <Paper>
            <Grid Grid item xs={12} fullWidth>
                <div class='header'>
                    <h1>Classy Scheduler</h1>
                
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
                        <td>8:15-9:20</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                    <tr>
                        <td>9:35-10:40</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                    <tr>
                        <td>10:55-12:00</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                    <tr>
                        <td>12:15-1:20</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                    <tr>
                        <td>1:35-2:40</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                    <tr>
                        <td>2:55-4:20</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                    <tr>
                        <td>4:35-5:40</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                        <td> class</td>
                    </tr>
                                
                </table>
                
                
            </Grid>
            
            
        </Paper>
        
            
        
    )
}

export default Calendar