import { Grid, Paper } from '@material-ui/core'
//import { NetworkCheckOutlined } from '@material-ui/icons';
import React from 'react'

/*
//Determine the indexes of dragging
let draggingEle; // the dragging element
let draggingRowIndex; // The index of the dragging row

//query the table
const table = document.getElementById('table');


const mouseDownHandler = function(e){
    //Attach listeners to 'document'
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    const originalRow = e.target.parentNode;
    draggingRowIndex = [].slice.call(table.querySelectorAll('tr')).indexOf(originalRow);
    
};

//set flag
let isDraggingStarted = false;

const mouseMoveHandler = function(e){
    if(!isDraggingStarted){
        isDraggingStarted = true;

        cloneTable();
        //query the dragging element
        draggingEle = [].slice.call(list.children)[draggingRowIndex];
    }
};

const mouseUpHandler = function(){
    //Remove the handlers of 'mousemove' and 'mouseup'
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseMoveHandler);

    //Get the end index
    const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);
    // move dragged row to end index
    let rows = [].slice.call(table.querySelectorAll('tr'));
    draggingRowIndex > endRowIndex
        ?// user drops to the top 
            rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
        ://user drops the the bottom
            rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex].nextSibling);
};

//query all rows
table.querySelectorAll('tr').forEach(function(row, index){
    //Ignore the header 
    //we don't want the user the change the order of the header
    if(index === 0){
        return;
    }

    //Get the first cell of row
    const firstCell = row.firstElementChild;
    firstCell.classList.add('draggable');

    // Attach event Listener
    firstCell.addEventListener('mousedown', mouseDownHandler);
    
});

//clone the table
let list;
const cloneTable = function(){
    //Get bounding rectangle of table
    const rect = table.getBoundingClientRect();

    //Get the width of the table
    const width = parseInt(window.getComputedStyle(table).width);

    // create a new element
    list.document.createElement('div');

    //Set the same position as the table
    list.style.position = 'absolute';
    list.style.left = `${rect.left}px`;
    list.style.top =  `${rect.top}px`;

    //Insert it before the table
    table.parentNode.insertBefore(list,table);

    //Hide the table
    table.style.visibility = 'hidden';

    //loop over the rows
    table.querySelectorAll('tr').forEach(function(row){
        const item = document.createElement('div');

        const newTable = document.createElement('table');
        const newRow = document.createElement('tr');

        //Query cells in row
        const cells = [].slice.call(row.children);
        cells.forEach(function(cell){
            const newCell = cell.cloneNode(true);
            //Set the width as the original cell
            newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`;
            newRow.appendChild(newCell);
        });

        newTable.appendChild(newRow);
        item.appendChild(newTable);

        list.appendChild(item);
    });
};
*/

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
                    <table id='table'>
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
                            
                        </tr>
                        <tr>{/* This row contains class data for the 9:00 time slot*/}
                            <td>9:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 10:00 time slot*/}
                            <td>10:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 11:00 time slot*/}
                            <td>11:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 12:00 time slot*/}
                            <td>12:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 1:00 time slot*/}
                            <td>1:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 2:00 time slot*/}
                            <td>2:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 3:00 time slot*/}
                            <td>3:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 4:00 time slot*/}
                            <td>4:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 5:00 time slot*/}
                            <td>5:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 6:00 time slot*/}
                            <td>6:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 7:00 time slot*/}
                            <td>7:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 8:00 time slot*/}
                            <td>8:00</td>
                            
                        </tr>
                        <tr>{/* This row contains class data for the 9:00 time slot*/}
                            <td>9:00</td>
                            
                        </tr>
                        
                        

                    </table>
                </Grid>
                <Grid>
                    {/* Test code to create a function within this component*/}
                    <button id='myButton'>AddClasstest</button>
                </Grid>
                
            </Grid>
            
        </Paper>
        
        
    )
}
export default Calendar