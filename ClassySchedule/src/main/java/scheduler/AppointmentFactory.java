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
    List<LocalDateTime> startTimes;
    List<LocalDateTime> endTimes;
    private String classNumber;
    private String room;
    private String professor;
    private String classSection;
    private String className;

    /**
     * Constructor for an appointment factory
     * @param startTimes the days and start times appointments will be placed
     * @param endTimes the days and end times appointments will be placed
     * @param classNumber the class number ex. 131 for CISC 131
     * @param room the room the class will be placed in
     * @param professor the professor teaching the class
     * @param classSection the section number of the class
     * @param className the name of the class
     */
    public AppointmentFactory(List<LocalDateTime> startTimes, List<LocalDateTime> endTimes, String classNumber, String room, String professor, String classSection, String className) {
        this.startTimes = startTimes;
        this.endTimes = endTimes;
        this.classNumber = classNumber;
        this.room = room;
        this.professor = professor;
        this.classSection = classSection;
        this.className = className;
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
                    .withSummary(classNumber + " " + className + " " + classSection + " " + professor + " " + room);
            appointments.add(appointment);
        }
        return appointments;
    }
}
