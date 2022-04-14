import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [{ start: new Date(), end: new Date(), title: "special event" }];

const DnDCalendar = withDragAndDrop(Calendar);

const minTime = new Date();
minTime.setHours(8, 0, 0);
const maxTime = new Date();
maxTime.setHours(21, 0, 0);

class CalendarTest extends React.Component {
    state = {
        events,
        minTime: minTime,
        maxTime: maxTime,
    };

    onEventResize = (data) => {
        const { start, end } = data;

        this.setState((state) => {
            state.events[0].start = start;
            state.events[0].end = end;
            return { events: state.events };
        });
    };

    onEventDrop = (data) => {
        console.log(data);
    };

    onSlotChange(slotInfo) {
        var startDate = moment(slotInfo.start.toLocaleString()).format("YYYY-MM-DD hh:mm:ss");
        var endDate = moment(slotInfo.end.toLocaleString()).format("YYYY-MM-DD hh:mm:ss");
        console.log(startDate); //shows the start time chosen
        console.log(endDate); //shows the end time chosen
        // this.state.events.push({ start: new Date(), end: new Date(), title: "new event" });
        return {events: this.state.events};
    }

    onEventClick(event) {
        console.log(event) //Shows the event details provided while booking
    }

    render() {
        return (
            <div className="App">
                <DnDCalendar
                    min={this.state.minTime}
                    max={this.state.maxTime}
                    defaultDate={moment().toDate()}
                    defaultView="week"
                    events={this.state.events}
                    localizer={localizer}
                    onEventDrop={this.onEventDrop}
                    onEventResize={this.onEventResize}
                    resizable
                    selectable
                    style={{ height: "100vh" }}
                    step={30}
                    timeslots={2}
                    onSelectEvent={event => this.onEventClick(event)}
                    onSelectSlot={(slotInfo) => this.onSlotChange(slotInfo)}
                />
            </div>
        );
    }
}

export default CalendarTest;