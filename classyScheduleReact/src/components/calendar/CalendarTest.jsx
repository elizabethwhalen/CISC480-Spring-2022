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
    const [tempEvent, setTempEvent] = React.useState(null);
    const [isEdit, setEdit] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [anchor, setAnchor] = React.useState(null);
    const [courseList, setCourseList] = React.useState([]);
    const [instructorList, setInstructorList] = React.useState([]);
    const [roomList, setRoomList] = React.useState([]);
    const [sessions, setSessions] = React.useState([]);
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [date, setDate] = React.useState('');
    //const [color, setColor] = React.useState('#b3e5fc');
    const [selectedEvent, setSelectedEvent] = React.useState('');

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
        //console.log(event)
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
                return null;
            }
            return null;
        })
        setEvents(newData);
    };

    const onSlotChange = (event) => {
        //setColor('#b3e5fc');
        let { start, end } = event;
        const { startTime, endTime } = getTimeInterval(event.start, event.end);
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
            color: "b3e5fc",
            id: count,
        };
        const newData = [...events]
        newData.push(newEvent);
        setEvents(newData);
        return events;
    };

    const rule = new RRule({
        freq: RRule.WEEKLY,  // repeate weekly, possible freq [DAILY, WEEKLY, MONTHLY, ]
        interval: 1,
        byweekday: [RRule.MO, RRule.FR],
        dtstart: new Date(Date.UTC(2012, 1, 1, 9, 30)),
        until: new Date(Date.UTC(2012, 1, 31)),
        tzid: 'America/Chicago'
    })

    const onUpdateEvents = (event) => {
        // Color
        if (event.color === "pink") {
            //setColor("#f48fb1");
        } else if (event.color === "blue") {
            //setColor("#90caf9");
        }

       // setColor(event.color);
        //console.log(event.color);
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
        //console.log(args.id)
        setSelectedEvent(args.id);
        getCourse();
        getInstructor();
        getRoom();
        setEdit(true);
        setTempEvent({ ...args.event });
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



    const onEventDeleted = React.useCallback((args) => {
        deleteEvent(args.event)
    });

    // // popup options
    // const headerText = React.useMemo(() => isEdit ? 'Edit event' : 'New Event', [isEdit]);
    // const popupButtons = React.useMemo(() => {
    //     if (isEdit) {
    //         return [
    //             'cancel',
    //             {
    //                 handler: () => {
    //                     saveEvent();
    //                 },
    //                 keyCode: 'enter',
    //                 text: 'Save',
    //                 cssClass: 'mbsc-popup-button-primary'
    //             }
    //         ];
    //     }
    //     else {
    //         return [
    //             'cancel',
    //             {
    //                 handler: () => {
    //                     saveEvent();
    //                 },
    //                 keyCode: 'enter',
    //                 text: 'Add',
    //                 cssClass: 'mbsc-popup-button-primary'
    //             }
    //         ];
    //     }
    // }, [isEdit]);

    // const saveEvent = React.useCallback(() => {
    //     // save and edit events 
    //     const newEvent = {
    //         id: tempEvent.id,
    //         title: popupEventTitle,
    //         description: popupEventDescription,
    //         start: popupEventDate[0],
    //         end: popupEventDate[1]
    //     };
    //     if (isEdit) {
    //         // edit event on calendar
    //         const index = events.findIndex(x => x.id === tempEvent.id);
    //         const newEventList = [...events];

    //         newEventList.splice(index, 1, newEvent);
    //         setEvents(newEventList);
    //         // here you can update your files from storage as well
    //     }
    //     else {
    //         //add ne event to list
    //         setEvents([...events, newEvent]);
    //         // add events to your storage as well
    //     }
    //     setDate(popupEventDate[0]);
    //     //close popup
    //     setOpen(false);
    // }, [isEdit, events, popupEventDate, popupEventDescription, popupEventStatus, popupEventTitle, tempEvent]);

    const deleteEvent = React.useCallback((event) => {
        setEvents(events.filter(item => item.id !== event.id));
        setTimeout(() => {
            Snackbar({
                button: {
                    action: () => {
                        setEvents(prevEvents => [...prevEvents, event]);
                    },
                    text: 'Undo'
                },
                message: 'event deleted'
            });
        });

    }, [events]);

    // const loadPopupForm = React.useCallback((event) => {
    //     setTitle(event.title);
    //     setDescription(event.description);
    //     setDate(event.Date);

    // }, []);

    // // handle popup form changes
    // const titleChange = React.useCallback((ev) => {
    //     setTitle(ev.target.value);
    // }, []);

    // const descriptionChange = React.useCallback((ev) => {
    //     setDescription(ev.target.value);
    // }, []);

    // const dateChange = React.useCallback((args) => {
    //     setDate(args.value);
    // }, []);

    const onDeleteClick = React.useCallback(() => {
        deleteEvent(tempEvent);
        setOpen(false);
    }, [deleteEvent, tempEvent]);
    //scheduler options

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
        // the first parameter has to be a string
        // the second parameter has to be a number
        layout.suggestValue('CISC.class', 131)
        layout.suggestValue(CISCprof2, prefNum2)
        layout.suggestValue('CISC2.class', 480)
        layout.suggestValue(CISCprof1, prefNum1)

        layout.updateVariables()

        console.log(layout.getValues({ roundToInt: true }))
    });

    const classPool = React.useCallback(() => {
        //const cd = document.getElementsByName('level100');
        //console.log(cd.checked);
        console.log("test");
    });

    // const eventPropGetter = React.useCallback(
    //     (event, start, end, isSelected) => ({
    //       ...(isSelected && {
    //         style: {
    //           backgroundColor: '#000',
    //         },
    //       }),
    //       ...(moment(start).hour() < 12 && {
    //         className: 'powderBlue',
    //       }),
    //       ...(event.title.includes('New class') && {
    //         className: 'darkGreen',
    //       }),
    //     }),
    //     []
    //   )


    return (
        <Paper sx={{ padding: '20px' }} elevation={0} >
            {open &&
                <EditClassForm
                    open={open}
                    selected={selectedEvent}
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
                //eventPropGetter={eventPropGetter}
            />
            <div>
                <label htmlFor="level100">Level 100 classes</label><input type="checkbox" name="level100" value="yes"></input><br></br>
                <label htmlFor="level200">Level 200 classes</label><input type="checkbox" name="level200" value="yes"></input><br></br>
                <label htmlFor="level300">Level 300 classes</label><input type="checkbox" name="level300" value="yes"></input><br></br>
                <label htmlFor="level400">Level 400 classes</label><input type="checkbox" name="level400" value="yes"></input><br></br>
                <button id="btn" onClick={classPool}>Get Selected Classes</button>
                <button id="algo" onClick={myFunction}>Algorithm Fun!!!</button>
            </div>

        </Paper>
    );
};