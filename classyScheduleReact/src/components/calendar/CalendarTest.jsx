import React from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import { Button, Paper } from "@mui/material"
import moment from "moment"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import constraints from 'constraint-solver'
import { RRule } from 'rrule'
import axios from 'axios'
import EditClassForm from './EditClassForm'
import { listItemTextClasses } from "@mui/material"

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarTest() {
    const [events, setEvents] = React.useState([]);//getDatafromAPI
    const [isEdit, setEdit] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [courseList, setCourseList] = React.useState([]);
    const [instructorList, setInstructorList] = React.useState([]);
    const [roomList, setRoomList] = React.useState([]);
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [date, setDate] = React.useState("");
    const [selectedEvent, setSelectedEvent] = React.useState({});
    const startRepeat = sessionStorage.getItem("startRepeat");
    const endRepeat = sessionStorage.getItem("endRepeat");
    const token = sessionStorage.getItem("token");

    const minTime = new Date();
    minTime.setHours(8, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(21, 0, 0);

    const handleGetConfig = (data) => {
        const config = {
            method: 'get',
            url: `https://classy-api.ddns.net/v2/${data}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        return config;
    }

    function handleGetRoom() {
        // Config data for https request.
        const config = handleGetConfig("room");
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            const list = [];
            response.data.forEach(e => {
                const room = `${e.building_code} ${e.room_num}`;
                list.push(room);
            })
            setRoomList(list);
        }).catch((error) => {
            console.log(error);
        });
    };

    function handleGetInstructor() {
        // Config data for https request.
        const config = handleGetConfig("faculty");
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            const list = [];
            response.data.forEach(e => {
                const lastName = e.faculty_last.charAt(0).toUpperCase() + e.faculty_last.slice(1);
                const firstName = e.faculty_first.charAt(0).toUpperCase() + e.faculty_first.slice(1);
                const instruc = `${lastName}, ${firstName}`;
                list.push(instruc);
            });
            setInstructorList(list.sort());
        }).catch((error) => {
            console.log(error);
        });
    };

    function handleGetCourse() {
        const config = handleGetConfig("class"); // Config data for https request.

        // https request Promise executed with Config settings.
        axios(config).then(response => {
            const list = [];
            response.data.forEach(e => {
                const course = `${e.dept_code.toUpperCase()} ${e.class_num}`;
                list.push(course);
            })
            setCourseList(list);
        }).catch(error => {
            console.log(error);
        });
    };

    const handleCreateRecurrence = (data) => {
        const weekdays = [];
        let fromDate = null;
        let toDate = null;

        if (data.days.monday) {
            weekdays.push(RRule.MO);
        }
        if (data.days.tuesday) {
            weekdays.push(RRule.TU);
        }
        if (data.days.wednesday) {
            weekdays.push(RRule.WE);
        }
        if (data.days.thursday) {
            weekdays.push(RRule.TH);
        }
        if (data.days.friday) {
            weekdays.push(RRule.FR);
        }

        // Formatting time
        const time = data.startTime.split(':');
        const startHour = Number(time[0]) + 5;
        const startMin = Number(time[1]);

        // Formatting start date of repeat
        const start = startRepeat.split("-");
        let year = Number(start[0]);
        let month = Number(start[1] - 1);
        let dateOfMonth = Number(start[2]);
        fromDate = new Date(Date.UTC(year, month, dateOfMonth, startHour, startMin));

        // Formatting end date of repeat
        const end = endRepeat.split("-");
        year = Number(end[0]);
        month = Number(end[1] - 1);
        dateOfMonth = Number(end[2]);
        toDate = new Date(Date.UTC(year, month, dateOfMonth));

        // Generate the rule
        const rule = new RRule({
            freq: RRule.WEEKLY,
            interval: 1,
            byweekday: weekdays,
            dtstart: fromDate,
            until: toDate,
            tzid: 'America/Chicago'
        })

        // Execute and return the list of dates
        return rule.all();
    }

    // Formatting the start and end time to string
    function handleGetTimeInterval(start, end) {
        let modifiedStart = '';
        let modifiedEnd = '';

        if (start.getMinutes() < 10 && start.getHours() < 10) {
            modifiedStart = `0${start.getHours()}:0${start.getMinutes()}`;
        } else if (start.getHours() < 10) {
            modifiedStart = `0${start.getHours()}:${start.getMinutes()}`;
        } else if (start.getMinutes() < 10) {
            modifiedStart = `${start.getHours()}:0${start.getMinutes()}`;
        } else {
            modifiedStart = `${start.getHours()}:${start.getMinutes()}`;;
        }

        if (end.getMinutes() < 10 && end.getHours() < 10) {
            modifiedEnd = `0${end.getHours()}:0${end.getMinutes()}`;
        } else if (end.getHours() < 10) {
            modifiedEnd = `0${end.getHours()}:${end.getMinutes()}`;
        } else if (end.getMinutes() < 10) {
            modifiedEnd = `${end.getHours()}:0${end.getMinutes()}`;
        } else {
            modifiedEnd = `${end.getHours()}:${end.getMinutes()}`;
        }
        return { modifiedStart, modifiedEnd };
    }

    // Formatting event date to string
    function handleGetDate(event) {
        let month = "";
        const eventMonth = event.getMonth() + 1;
        if ((event.getMonth() + 1) < 10) {
            month = `0 ${eventMonth}`;
        } else {
            month = eventMonth;
        }

        let modifiedDate = "";
        const eventDate = event.getDate();
        if (event.getDate() < 10) {
            modifiedDate = `0 ${eventDate}`;
        } else {
            modifiedDate = eventDate;
        }

        const fullDate = `${event.getUTCFullYear()}-${month}-${modifiedDate}`;
        return fullDate;
    }

    const deleteEvent = id => {
        const array = [...events].filter(e => Number(e.id) !== Number(id));
        return array;
    }

    const handleEventResize = data => {
        const { start, end, event } = data;
        const { id } = event;
        const update = [...events].map(e => {
            if (e.id === id) {
                return {
                    ...e,
                    start: new Date(
                        e.start.getUTCFullYear(),
                        e.start.getMonth(),
                        e.start.getDate(),
                        start.getHours(),
                        start.getMinutes(),
                        0
                    ),
                    end: new Date(
                        e.end.getUTCFullYear(),
                        e.end.getMonth(),
                        e.end.getDate(),
                        end.getHours(),
                        end.getMinutes(),
                        0
                    ),
                };
            }
            return e;
        })
        setEvents(update);
    };

    const handleEventDrop = data => {
        const { start, end, event } = data;
        const { id, subId } = event;
        const newData = [...events].map(e => {
            if (e.id === id && e.subId === subId) {
                return {
                    ...e,
                    start,
                    end,
                };
            }
            return e;
        })
        setEvents(newData);
    };

    const handleSelectSlot = event => {
        const { start, end } = event;
        const { modifiedStart, modifiedEnd } = handleGetTimeInterval(start, end);
        setStartTime(modifiedStart);
        setEndTime(modifiedEnd);
        setDate(handleGetDate(start));
        const count = events.length;
        const newEvent = {
            start,
            end,
            title: "New class",
            instructor: "",
            room: "",
            id: count,
            subId: 0,
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
        handleGetCourse();
        handleGetInstructor();
        handleGetRoom();
        return events;
    };

    const handleEventUpdate = (data) => {
        setOpen(false);
        const newData = deleteEvent(data.id);
        const list = handleCreateRecurrence(data);
        let i = 0;

        list.forEach(e => {
            let time = data.startTime.split(':');
            const startHour = Number(time[0]);
            const startMin = Number(time[1]);

            time = data.endTime.split(':');
            const endHour = Number(time[0]);
            const endMin = Number(time[1]);

            const newEvent = {
                start: new Date(e.getUTCFullYear(), e.getMonth(), e.getDate(), startHour, startMin, 0),
                end: new Date(e.getUTCFullYear(), e.getMonth(), e.getDate(), endHour, endMin, 0),
                title: data.course,
                instructor: data.instructor,
                room: data.room,
                id: data.id,
                subId: i,
                repeat: data.repeat,
                days: data.days,
            }
            newData.push(newEvent);
            i += 1;
        })
        setEvents(newData);

    }

    const getDatafromAPI = () => {
        // list will hold new event data during axios response
        const list = [];
        
        // Config data for https request.
        const config = {
            method: 'get',
            url: 'https://classy-api.ddns.net/v3/meets/ext',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        // https request Promise executed with Config settings.
        axios(config).then((response) => {
            console.log(response);
            
            // pasrse JSON for DATA we need
            response.data.map((e) => {
                // Things we need:
                // dept_code
                // class_num
                // faculty_first
                // faculty_last
                // Building_code
                // room_num 
                // time_start
                // time_end
                // day_of_week
                list.push(e.dept_code);
                list.push(e.class_num);
                list.push(e.faculty_first);
                list.push(e.faculty_last);
                list.push(e.building_code);
                list.push(e.room_num);
                list.push(e.time_start);
                list.push(e.time_end);
                list.push(e.day_of_week);
                
                for (let i = 0; i < e.day_of_week; i++) {
                    console.log(e.day_of_week.charAt(i));
                }
                
                
                return list;
            })
            // use function to setBuildingList from response
            console.log("here is our list " + list);
            //handleEventUpdate(list);
            
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleSelectEvent = args => {
        const { modifiedStart, modifiedEnd } = handleGetTimeInterval(args.start, args.end);
        handleGetCourse();
        handleGetInstructor();
        handleGetRoom();
        setSelectedEvent(args);
        setEdit(true);
        setDate(handleGetDate(args.start));
        setStartTime(modifiedStart);
        setEndTime(modifiedEnd);
        setOpen(true);
    }

    // Handle pop-up window close function
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
        const CISCprof1 = 'Miracle';
        const CISCprof2 = 'Sawin';
        const prefNum1 = 5;
        const prefNum2 = 4;
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
        <Paper sx={{ padding: '20px', height: "100%" }} elevation={0} >
            {open && (
                <EditClassForm
                    open={open}
                    event={selectedEvent}
                    start={startTime}
                    end={endTime}
                    date={date}
                    onClose={onClose}
                    courseList={courseList}
                    instructorList={instructorList}
                    roomList={roomList}
                    handleEventUpdate={handleEventUpdate}
                />
            )}
            <DnDCalendar
                min={minTime}
                max={maxTime}
                defaultDate={moment().toDate()}
                defaultView='work_week'
                views={['work_week']}
                events={events}
                localizer={localizer}
                resizable
                selectable
                style={{ height: '100%' }}
                step={5}
                timeslots={12}
                styles={{ overflow: 'hidden' }}
                onEventDrop={event => handleEventDrop(event)}
                onEventResize={event => handleEventResize(event)}
                onSelectEvent={event => handleSelectEvent(event)}
                onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo)}
            />
            <div>
                <Button
                    id="test"
                    type="submit"
                    onClick={getDatafromAPI}
                >
                    test GEt APi!!!
                </Button>
            </div>
        </Paper>
    );
};