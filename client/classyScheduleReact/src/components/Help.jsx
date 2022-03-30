import { Grid, Paper } from '@material-ui/core'
import React from 'react'

// new Component 'Help'
const Help = () => {

     return(
         <Paper elevation={0}>
             <Grid container>
                 <Grid item xs = {12}>
                    <div class= "header"> {/* Header H1 for the main text */}
                        <h1>Getting Started</h1>
                    </div>
                    <div class= "home-page-tab">{/* Class for CSS on home page tab*/}
                        <h2>Home Page</h2>
                        <p>- <em>Home Page</em> is where we currently showcase all our main features at once.</p>
                    </div>
                    <div class= "functions-tab">{/* Class for CSS on functions tab*/}
                        <h2>Functions Tab</h2>
                        <p>- The <em>Functions Tab</em> has two main components which are the <em>Add New Class </em> 
                            feature and the <em>Add Faculty.</em>
                        </p>
                        <p>- <em>Add New Class</em> allows you to add a brand new course into the pool
                            of classes by choosing a Department Code, a Course Number and a Course Name.
                        </p>
                        <p>- <em>Add Faculty</em> allows you to add a new Faculty member to the database directly
                            by inputing their Title, First and Last name. You also have the option to add Teach Load
                            and their preferred classes.
                        </p>
                    </div>
                    <div class= "calendar-overview-tab">{/* Class for on calendar overview tab */}
                        <h2>Calendar Overview</h2>
                        <p>
                            - The <em>Calendar Overview</em> tab allows you to view the entire Calendar 
                            with the information that is currently in the database.
                        </p>
                    </div>
                    <div class= "help-tab">{/* Class for CSS on help tab */}
                        <h2>Help</h2>
                        <p>- <em>Help</em> is the main tab where any features and their usage are documented.</p>
                    </div>
                 </Grid>
             </Grid>
         </Paper>
     )
}
export default Help