import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Paper } from "@mui/material";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EditClassForm from './EditClassForm'
import constraints from 'constraint-solver'
import { RRule } from 'rrule'
import axios from 'axios'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarTest() {
    const [events, setEvents] = React.useState([]);
    const [isEdit, setEdit] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [courseList, setCourseList] = React.useState([]);
    const [instructorList, setInstructorList] = React.useState([]);
    const [roomList, setRoomList] = React.useState([]);
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [date, setDate] = React.useState('');
    const [selectedEvent, setSelectedEvent] = React.useState({});
    const startRepeat = sessionStorage.getItem("startRepeat");
    const endRepeat = sessionStorage.getItem("endRepeat");
    const token = sessionStorage.getItem("token");

    const minTime = new Date();
    minTime.setHours(8, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(21, 0, 0);

    function getCourse() {
        // Config data for https request.
        let config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/class',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then(response => {
            //console.log(JSON.stringify(response.data));
            let list = [];
            response.data.forEach(e => {
                let clas = e.dept_code.toUpperCase() + ' ' + e.class_num;
                list.push(clas);
            })
            setCourseList(list);
        }).catch(error => {
            console.log(error);
        });
    };

    function getInstructor() {
        // Config data for https request.
        let config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/faculty',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            //console.log(JSON.stringify(response.data));
            let list = [];
            response.data.forEach(e => {
                let lastName = e.faculty_last.charAt(0).toUpperCase() + e.faculty_last.slice(1);
                let firstName = e.faculty_first.charAt(0).toUpperCase() + e.faculty_first.slice(1);
                let instruc = lastName + ', ' + firstName;
                list.push(instruc);
            });
            setInstructorList(list.sort());
        }).catch((error) => {
            console.log(error);
        });
    };

    function getRoom() {
        // Config data for https request.
        let config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/room',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            //console.log(JSON.stringify(response.data));
            let list = [];
            response.data.map((e) => {
                let room = e.building_code + ' ' + e.room_num;
                list.push(room);
                return list;
            })
            setRoomList(list);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleEventResize = data => {
        const { start, end, event } = data;
        let id = event.id;
        const update = [...events].map(e => {
            if (e.id === id) {
                return {
                    ...e,
                    start: new Date(e.start.getUTCFullYear(), e.start.getMonth(), e.start.getDate(), start.getHours(), start.getMinutes(), 0),
                    end: new Date(e.end.getUTCFullYear(), e.end.getMonth(), e.end.getDate(), end.getHours(), end.getMinutes(), 0),
                };
            }
            return e;
        })
        setEvents(update);
    };

    const handleEventDrop = data => {
        const { start, end, event } = data;
        let id = event.id;
        const newData = [...events];
        newData.map(e => {
            if (e.id === id) {
                let updated = {
                    start: start,
                    end: end,
                    title: e.title,
                    instructor: e.instructor,
                    room: e.room,
                    color: e.color,
                    id: id,
                    days: e.days,
                };
                newData[e.id] = updated;
            }
            return null;
        })
        setEvents(newData);
    };


    const handleSelectSlot = event => {
        let { start, end } = event;
        const { startTime, endTime } = getTimeInterval(start, end);
        setStartTime(startTime);
        setEndTime(endTime);
        setDate(getDate(start));
        let count = events.length;
        let newEvent = {
            start: start,
            end: end,
            title: "New class",
            instructor: "",
            room: "",
            id: count,
            days: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
            }
        };
        const newData = [...events];
        newData.push(newEvent);
        setEvents(newData);
        setSelectedEvent(newEvent);
        setOpen(true);
        getCourse();
        getInstructor();
        getRoom();
        return events;
    };

    const createRecurrence = (data) => {
        let byweekday = [];
        let dtstart = null;
        let until = null;

        if (data.days.monday) {
            byweekday.push(RRule.MO);
        }
        if (data.days.tuesday) {
            byweekday.push(RRule.TU);
        }
        if (data.days.wednesday) {
            byweekday.push(RRule.WE);
        }
        if (data.days.thursday) {
            byweekday.push(RRule.TH);
        }
        if (data.days.friday) {
            byweekday.push(RRule.FR);
        }

        let time = data.startTime.split(':');
        let startHour = Number(time[0]) + 5;
        let startMin = Number(time[1]);

        let start = startRepeat.split("-");
        let year = Number(start[0]);
        let month = Number(start[1] - 1);
        let date = Number(start[2]);
        dtstart = new Date(Date.UTC(year, month, date, startHour, startMin));

        let end = endRepeat.split("-");
        year = Number(end[0]);
        month = Number(end[1] - 1);
        date = Number(end[2]);
        until = new Date(Date.UTC(year, month, date));

        const rule = new RRule({
            freq: RRule.WEEKLY,  // repeate weekly, possible freq [DAILY, WEEKLY, MONTHLY, ]
            interval: 1,
            byweekday: byweekday,
            dtstart: dtstart,
            until: until,
            tzid: 'America/Chicago'
        })
        return rule.all();
    }

    const handleEventUpdate = (data) => {
        setOpen(false);
        const newData = deleteEvent(data.id);
        const list = createRecurrence(data);

        list.forEach(e => {
            let time = data.startTime.split(':');
            let startHour = Number(time[0]);
            let startMin = Number(time[1]);

            time = data.endTime.split(':');
            let endHour = Number(time[0]);
            let endMin = Number(time[1]);

            let newEvent = {
                start: new Date(e.getUTCFullYear(), e.getMonth(), e.getDate(), startHour, startMin, 0),
                end: new Date(e.getUTCFullYear(), e.getMonth(), e.getDate(), endHour, endMin, 0),
                title: data.course,
                instructor: data.instructor,
                room: data.room,
                color: data.color,
                id: data.id,
                repeat: data.repeat,
                days: data.days,
            }
            newData.push(newEvent);
        })
        setEvents(newData);
    }

    const deleteEvent = id => {
        const array = [...events].filter(e => Number(e.id) !== Number(id));
        return array;
    }

    const getDate = (event) => {
        //Tue May 10 2022 11:30:00 GMT-0500 (Central Daylight Time)
        let month = "";
        if ((event.getMonth() + 1) < 10) {
            month = "0" + (event.getMonth() + 1);
        } else {
            month = event.getMonth() + 1;
        }

        let date = "";
        if (event.getDate() < 10) {
            date = "0" + event.getDate();
        } else {
            date = event.getDate();
        }
        return event.getUTCFullYear() + "-" + month + "-" + date;
    }

    const getTimeInterval = (start, end) => {
        let startTime = '';
        let endTime = '';

        if (start.getMinutes() < 10 && start.getHours() < 10) {
            startTime = "0" + start.getHours() + ":0" + start.getMinutes();
        } else if (start.getHours() < 10) {
            startTime = "0" + start.getHours() + ":" + start.getMinutes();
        } else if (start.getMinutes() < 10) {
            startTime = start.getHours() + ":0" + start.getMinutes();
        } else {
            startTime = start.getHours() + ":" + start.getMinutes();
        }

        if (end.getMinutes() < 10 && end.getHours() < 10) {
            endTime = "0" + end.getHours() + ":0" + end.getMinutes();
        } else if (end.getHours() < 10) {
            endTime = "0" + end.getHours() + ":" + end.getMinutes();
        } else if (end.getMinutes() < 10) {
            endTime = end.getHours() + ":0" + end.getMinutes();
        } else {
            endTime = end.getHours() + ":" + end.getMinutes();
        }

        return { startTime, endTime }
    }

    const handleSelectEvent = args => {
        setSelectedEvent(args);
        getCourse();
        getInstructor();
        getRoom();
        setEdit(true);
        const { startTime, endTime } = getTimeInterval(args.start, args.end);
        setDate(getDate(args.start));
        setStartTime(startTime);
        setEndTime(endTime);
        setOpen(true);
    }

    const onClose = React.useCallback(() => {
        if (!isEdit) {
            // refresh the list, if add popup was canceled, to remove the temporary event
            setEvents([...events]);
        }
        setOpen(false);
    }, [isEdit, events]);

    // do curl request to get the number of classes that need to be scheduled
    // at the 100, 200, 300, and 400 level

    const layout = constraints(`
         editable CISC.class
         editable Miracle
         editable CISC2.class
         editable Sawin
         
    
         CISC131.class == (CISC.class) required
         CISC131.professor == Miracle
         CISC480.class == (CISC2.class)
         CISC480.professor == Sawin
    `)

    const myFunction = () => {

        let CISCprof1 = 'Miracle';
        let CISCprof2 = 'Sawin';
        let prefNum1 = 5;
        let prefNum2 = 4;
        // the first parameter has to be a string
        // the second parameter has to be a number
        layout.suggestValue('CISC.class', 131) // sets the vaue of CISC class to 131
        layout.suggestValue(CISCprof2, prefNum2) // sets the value of the first instructor
        layout.suggestValue('CISC2.class', 480) // sets the value of CISCclass2 to 480
        layout.suggestValue(CISCprof1, prefNum1)

        layout.updateVariables()

        console.log(layout.getValues({ roundToInt: true }))
    }

    return (
        <Paper sx={{ padding: '20px' }} elevation={0} >
            {open &&
                <EditClassForm
                    open={open}
                    event={selectedEvent}
                    startTime={startTime}
                    endTime={endTime}
                    date={date}
                    onClose={onClose}
                    courseList={courseList}
                    instructorList={instructorList}
                    roomList={roomList}
                    handleEventUpdate={handleEventUpdate}
                />}
            <DnDCalendar
                min={minTime}
                max={maxTime}
                defaultDate={moment().toDate()}
                defaultView={'work_week'}
                views={['work_week']}
                events={events}
                localizer={localizer}
                resizable
                selectable
                style={{ height: "100vh" }}
                step={5}
                timeslots={12}
                styles={{ overflow: "hidden" }}
                onEventDrop={event => handleEventDrop(event)}
                onEventResize={event => handleEventResize(event)}
                onSelectEvent={event => handleSelectEvent(event)}
                onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo)}
            />
            <div>
                <button id="algo" onClick={myFunction}>Algorithm Fun!!!</button>
            </div>

        </Paper>
    );
};