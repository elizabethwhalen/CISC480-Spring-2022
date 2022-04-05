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

    public AppointmentFactory(List<LocalDateTime> startTimes, List<LocalDateTime> endTimes, String classNumber, String room, String professor, String classSection, String className) {
        this.startTimes = startTimes;
        this.endTimes = endTimes;
        this.classNumber = classNumber;
        this.room = room;
        this.professor = professor;
        this.classSection = classSection;
        this.className = className;
    }

    public List<Agenda.Appointment> createAppointments() {
        List<Agenda.Appointment> appointments = new ArrayList<>();
        for (int i = 0; i < startTimes.size(); i++) {
            Agenda.AppointmentImplLocal appointment = new Agenda.AppointmentImplLocal()
                    .withStartLocalDateTime(startTimes.get(i))
                    .withEndLocalDateTime(endTimes.get(i))
                    .withDescription(classNumber + " " + className + " " + classSection + " " + professor + " " + room)
                    .withAppointmentGroup(new Agenda.AppointmentGroupImpl().withStyleClass("group2"));
            appointments.add(appointment);
        }
        return appointments;
    }
}
