import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Paper, Snackbar } from "@mui/material";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EditClassForm from './EditClassForm'
import constraints from 'constraint-solver'
import { RRule, RRuleSet, rrulestr } from 'rrule'
import axios from 'axios'
import { pink, blue, yellow, purple, green } from '@mui/material/colors';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarTest() {
    const [events, setEvents] = React.useState([]);
    
    const [isEdit, setEdit] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    //const [anchor, setAnchor] = React.useState(null);
    const [courseList, setCourseList] = React.useState([]);
    const [instructorList, setInstructorList] = React.useState([]);
    const [roomList, setRoomList] = React.useState([]);
    //const [sessions, setSessions] = React.useState([]);
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [date, setDate] = React.useState('');
    //const [color, setColor] = React.useState('#b3e5fc');
    const [selectedEvent, setSelectedEvent] = React.useState({});

    const token = sessionStorage.getItem("token");
    const minTime = new Date();
    minTime.setHours(8, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(21, 0, 0);


    const getCourse = () => {
        // Config data for https request.
        let config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v2/class',
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
                let clas = e.dept_code + ' ' + e.class_num;
                list.push(clas);
                return courseList;
            })
            setCourseList(list);
        }).catch((error) => {
            console.log(error);
        });
    };

    const getInstructor = () => {
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
            response.data.map((e) => {
                let instruc = e.faculty_first + ' ' + e.faculty_last;
                list.push(instruc);
                return list;
            })
            setInstructorList(list);
        }).catch((error) => {
            console.log(error);
        });
    };

    const getRoom = () => {
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

    const onEventDrop = (data) => {
        const { start, end, event } = data;
        let id = event.id;
        const newData = [...events];
        newData.map((e) => {
            if (e.id === id) {
                let updated = {
                    start: start,
                    end: end,
                    title: e.title,
                    instructor: e.instructor,
                    room: e.room,
                    color: e.color,
                    id: id
                };
                newData[e.id] = updated;
            }
            return null;
        })
        setEvents(newData);
    };

    const onSlotChange = (event) => {
        //setColor('#b3e5fc');
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
            instructor: "N/A",
            room: "N/A",
            color: "#b3e5fc",
            id: count,
        };
        const newData = [...events]
        newData.push(newEvent);
        setEvents(newData);
        return events;
    };

    const createRecurrence = (data) => {
        let freq = null;
        let interval = 1;
        let byweekday = [];
        let dtstart = null;
        let until = null;

        if (data.repeat === "weekly") {
            freq = RRule.WEEKLY;
            interval = 1;
        } else if (data.repeat === "biweekly") {
            freq = RRule.WEEKLY;
            interval = 2;
        } else if (data.repeat === "month") {
            freq = RRule.MONTHLY;
            interval = 1;
        }

        freq = RRule.WEEKLY;
        interval = 1;
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

        let startRepeat = data.startRepeat.split("-");
        let year = Number(startRepeat[0]);
        let month = Number(startRepeat[1] - 1);
        let date = Number(startRepeat[2]);
        dtstart = new Date(Date.UTC(year, month, date, startHour, startMin));

        let endRepeat = data.endRepeat.split("-");
        year = Number(endRepeat[0]);
        month = Number(endRepeat[1] - 1);
        date = Number(endRepeat[2]);
        until = new Date(Date.UTC(year, month, date));
        
        const rule = new RRule({
            freq: freq,  // repeate weekly, possible freq [DAILY, WEEKLY, MONTHLY, ]
            interval: interval,
            byweekday: byweekday,
            //dtstart: dtstart,
            //until: until,
            tzid: 'America/Chicago'
        })

        return rule.all();
        
    }
    
    const onUpdateEvents = (data) => {

        const newData = deleteEvent(data.id);
        const list = createRecurrence(data);

        list.map((e) => {
            let time = data.startTime.split(':');
            let startHour = Number(time[0]);
            let startMin = Number(time[1]);

            time = data.endTime.split(':');
            let endHour = Number(time[0]);
            let endMin = Number(time[1]);

            let newEvent = {
                start: new Date( startHour, startMin, 0),
                end: new Date( endHour, endMin, 0),
                title: data.course,
                instructor: data.instructor,
                room: data.room,
                color: data.color,
                id: data.id,
            }

            newData.push(newEvent);
        })
        setEvents(newData);
    }

    const deleteEvent = (id) => {
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

        return {
            startTime, endTime
        }
    }

    const onEventClick = React.useCallback((args) => {
        console.log(events)
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
    });

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
    const myFunction = React.useCallback(() => {

        let CISCprof1 = 'Miracle';
        let CISCprof2 = 'Sawin';
        let prefNum1 = 5;
        let prefNum2 = 4;
        //console.log(instructorList);
        //console.log(instructorList.at(1));
        //console.log(courseList);
        // the first parameter has to be a string
        // the second parameter has to be a number
        layout.suggestValue('CISC.class', 131) // sets the vaue of CISC class to 131
        layout.suggestValue(CISCprof2, prefNum2) // sets the value of the first instructor
        layout.suggestValue('CISC2.class', 480) // sets tje value of CISCclass2 to 480
        layout.suggestValue(CISCprof1, prefNum1)

        layout.updateVariables()

        console.log(layout.getValues({ roundToInt: true }))
    });

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
                    onUpdate={onUpdateEvents}
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
                step={30}
                timeslots={2}
                styles={{ overflow: "hidden" }}
                onEventDrop={event => onEventDrop(event)}
                onEventResize={event => onEventDrop(event)}
                onSelectEvent={event => onEventClick(event)}
                onSelectSlot={(slotInfo) => onSlotChange(slotInfo)}
            />
            <div>
                
                <button id="algo" onClick={myFunction}>Algorithm Fun!!!</button>
            </div>

        </Paper>
    );
};