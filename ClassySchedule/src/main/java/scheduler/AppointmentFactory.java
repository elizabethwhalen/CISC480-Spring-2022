package scheduler;

import jfxtras.scene.control.agenda.Agenda;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * This class takes the information from the add course to schedule class
 * and transforms it into a workable appointment.
 */
public class AppointmentFactory {
    final List<LocalDateTime> startTimes;
    final List<LocalDateTime> endTimes;
    private final String departmentCode;
    private final String room;
    private final String professor;
    private final String classNumber;
    private final String className;

    /**
     * Constructor for an appointment factory
     * @param startTimes the days and start times appointments will be placed
     * @param endTimes the days and end times appointments will be placed
     * @param room the room the class will be placed in
     * @param professor the professor teaching the class
     */
    public AppointmentFactory(List<LocalDateTime> startTimes, List<LocalDateTime> endTimes, String course, String room, String professor) {
        this.startTimes = startTimes;
        this.endTimes = endTimes;
        String[] courseInfo = course.split(" ");
        this.departmentCode = courseInfo[0];
        this.room = room;
        this.professor = professor;
        this.classNumber = courseInfo[1];
        this.className = courseInfo[2];
    }

    /**
     * This creates the appointments from the given information
     * @return a list of appointments to be added to the calendar
     */
    public List<Agenda.Appointment> createAppointments() {
        List<Agenda.Appointment> appointments = new ArrayList<>();
        for (int i = 0; i < startTimes.size(); i++) {
            Agenda.AppointmentImplLocal appointment = new Agenda.AppointmentImplLocal()
                    .withStartLocalDateTime(startTimes.get(i))
                    .withEndLocalDateTime(endTimes.get(i))
                    .withSummary(departmentCode + " " + classNumber + " " + className + " " + professor)
                    .withLocation(room);
            appointments.add(appointment);
        }
        return appointments;
    }

    /**
     *
     * @param room
     */
    public Agenda.AppointmentGroup getAppointmentGroup(String room) {
        return null;
    }
}
