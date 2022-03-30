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
                

                <Grid item xs={12} >{/* This Grid contains the table for our calendar*/}
                    <table id='classes'>
                        <tr> {/* This row contains the headers for Time and each day of the week*/}
                            <th>Time</th>
                            <th>Monday</th>
                            <th> Tuesday</th>
                            <th> Wednessday</th>
                            <th> Thursday</th>
                            <th> Friday</th>
                        </tr>
                        <tr> {/* This row contians the class data for 8:00 time slot*/}
                            <td>8:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 9:00 time slot*/}
                            <td>9:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 10:00 time slot*/}
                            <td>10:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 11:00 time slot*/}
                            <td>11:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 12:00 time slot*/}
                            <td>12:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 1:00 time slot*/}
                            <td>1:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 2:00 time slot*/}
                            <td>2:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 3:00 time slot*/}
                            <td>3:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 4:00 time slot*/}
                            <td>4:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 5:00 time slot*/}
                            <td>5:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 6:00 time slot*/}
                            <td>6:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 7:00 time slot*/}
                            <td>7:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 8:00 time slot*/}
                            <td>8:00</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                            <td> class</td>
                        </tr>
                        <tr>{/* This row contains class data for the 9:00 time slot*/}
                            <td>9:00</td>
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