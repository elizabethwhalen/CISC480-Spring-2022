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
                return;
            }
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
    };

    return (
        <Paper sx={{ padding: '20px' }} elevation={0} >
            <DnDCalendar
                min={minTime}
                max={maxTime}
                defaultDate={moment().toDate()}
                defaultView="week"
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