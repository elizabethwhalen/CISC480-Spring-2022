import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Paper, Snackbar } from "@mui/material";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EditClassForm from './EditClassForm'
import constraints from 'constraint-solver'
import axios from 'axios'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarTest() {
    const [events, setEvents] = React.useState([]);
    const [tempEvent, setTempEvent] = React.useState(null);
    const [popupEventTitle, setTitle] = React.useState('');
    const [popupEventDescription, setDescription] = React.useState('');
    const [popupEventDate, setDate] = React.useState([]);
    const [popupEventStatus, setStatus] = React.useState('busy');
    const [isEdit, setEdit] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [anchor, setAnchor] = React.useState(null);
    const [courseList, setCourseList] = React.useState([]);
    const [instructorList, setInstructorList] = React.useState([]);
    const [roomList, setRoomList] = React.useState([]);
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
                let title = e.title;
                let updated = { start: start, end: end, title: title, id: id };
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
        let newEvent = { start: start, end: end, title: "New class", id: count };
        const newData = [...events]
        newData.push(newEvent);
        setEvents(newData);
        return events;
    };

    const onEventClick = React.useCallback((args) => {
        getCourse();
        getInstructor();
        getRoom();
        setEdit(true);
        setTempEvent({ ...args.event });
        // fill popup form with event data
        // load popupform
        // loadPopupForm(args.event);
        setOpen(true);
    });

    const onClose = React.useCallback(() => {
        if (!isEdit) {
            // refresh the list, if add popup was canceled, to remove the temporary event
            setEvents([...events]);
        }
        setOpen(false);
    }, [isEdit, events]);

    const onEventCreated = React.useCallback((args) => {
        // createNewEvent(args.event, args.target)
        setEdit(false);
        setTempEvent(args.event)
        // fill popup form with event data
        // open the popup
        setOpen(true);
    });

    const onEventDeleted = React.useCallback((args) => {
        deleteEvent(args.event)
    });

    const onEventUpdated = React.useCallback((args) => {
        // here you can update the event in your storage as well, after drag & drop or resize
        // ...
    }, []);

    // popup options
    const headerText = React.useMemo(() => isEdit ? 'Edit event' : 'New Event', [isEdit]);
    const popupButtons = React.useMemo(() => {
        if (isEdit) {
            return [
                'cancel',
                {
                    handler: () => {
                        saveEvent();
                    },
                    keyCode: 'enter',
                    text: 'Save',
                    cssClass: 'mbsc-popup-button-primary'
                }
            ];
        }
        else {
            return [
                'cancel',
                {
                    handler: () => {
                        saveEvent();
                    },
                    keyCode: 'enter',
                    text: 'Add',
                    cssClass: 'mbsc-popup-button-primary'
                }
            ];
        }
    }, [isEdit]);

    const saveEvent = React.useCallback(() => {
        // save and edit events 
        const newEvent = {
            id: tempEvent.id,
            title: popupEventTitle,
            description: popupEventDescription,
            start: popupEventDate[0],
            end: popupEventDate[1]
        };
        if (isEdit) {
            // edit event on calendar
            const index = events.findIndex(x => x.id === tempEvent.id);
            const newEventList = [...events];

            newEventList.splice(index, 1, newEvent);
            setEvents(newEventList);
            // here you can update your files from storage as well
        }
        else {
            //add ne event to list
            setEvents([...events, newEvent]);
            // add events to your storage as well
        }
        setDate(popupEventDate[0]);
        //close popup
        setOpen(false);
    }, [isEdit, events, popupEventDate, popupEventDescription, popupEventStatus, popupEventTitle, tempEvent]);

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

    const loadPopupForm = React.useCallback((event) => {
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.Date);

    }, []);

    // handle popup form changes
    const titleChange = React.useCallback((ev) => {
        setTitle(ev.target.value);
    }, []);

    const descriptionChange = React.useCallback((ev) => {
        setDescription(ev.target.value);
    }, []);

    const dateChange = React.useCallback((args) => {
        setDate(args.value);
    }, []);

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


    return (
        <Paper sx={{ padding: '20px' }} elevation={0} >
            {open &&
                <EditClassForm
                    open={open}
                    onClose={onClose}
                    courseList={courseList}
                    instructorList={instructorList}
                    roomList={roomList}
                />}
            <DnDCalendar
                min={minTime}
                max={maxTime}
                defaultDate={moment().toDate()}
                defaultView={'work_week'}
                views={['work_week']}
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