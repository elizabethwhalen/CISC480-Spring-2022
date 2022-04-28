import React, {useRef} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Paper } from "@mui/material";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";


const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarTest() {
    const nodeRef = useRef(null);
    const [events, setEvents] = React.useState([]);
    const [tempEvent, setTempEvent] = React.useState(null);
    const [popupEventTitle, setTitle] = React.useState('');
    const [popupEventDescription, setDescription] = React.useState('');
    const [popupEventDate, setDate] = React.useState([]);
    const [popupEventStatus, setStatus] = React.useState('busy');
    const [isEdit, setEdit] = React.useState(false);
    const [isOpen, setOpen] = React.useState(false);
    const minTime = new Date();
    minTime.setHours(8, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(21, 0, 0);

    const onEventDrop = (data) => {
        const { start, end, event } = data;
        let id = event.id;
        const newData =  [...events];
        newData.map((e) => {
            if (e.id === id) { 
                let title = e.title;
                let updated = {start: start, end: end, title: title, id : id};
                newData[e.id] = updated;
                return null;
            }
            return null;
        })
        setEvents(newData);
    };

    const onSlotChange = (event) => {
        let { start, end } = event;
        let count = events.length;
        let newEvent = { start: start, end: end, title: "New event", id: count};
        const newData = [...events]
        newData.push(newEvent);
        setEvents(newData);
        return events;
    };

    const onEventClick = (event) => {
        // return <EditSession />;
        console.log(event, "data click");
    };

    const saveEvent = React.useCallback(()=>{
        // save and edit events 
        const newEvent = {
            id: tempEvent.id,
            title: popupEventTitle,
            description: popupEventDescription,
            start: popupEventDate[0],
            end: popupEventDate[1]
        };
        if (isEdit){
            // edit event on calendar
            const index = events.findIndex(x => x.id === tempEvent.id);
            const newEventList = [...events];

            newEventList.splice(index, 1, newEvent);
            setEvents(newEventList);
            // here you can update your files from storage as well
        }
        else{
            //add ne event to list
            setEvents([...events, newEvent]);
            // add events to your storage as well
        }
        setDate(popupEventDate[0]);
        //close popup
        setOpen(false);
    });

    

    return (
        <Paper sx={{ padding: '20px' }} elevation={0} >
            <DnDCalendar
                min={minTime}
                max={maxTime}
                defaultDate={moment().toDate()}
                defaultView="week"
                views={['week']}
                events={events}
                localizer={localizer}
                onEventDrop={event => onEventDrop(event)}
                onEventResize={event => onEventDrop(event)}
                resizable
                selectable
                style={{ height: "100vh" }}
                step={30}
                timeslots={2}
                onSelectEvent={event => onEventClick(event)}
                onSelectSlot={(slotInfo) => onSlotChange(slotInfo)}
                styles={{ overflow: "hidden" }}
                ref={nodeRef}
            />
        </Paper>
    );
};