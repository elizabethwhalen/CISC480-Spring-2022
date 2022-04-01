package scheduler;

import jfxtras.scene.control.agenda.Agenda;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * This class takes the information from the add course to schedule class
 * and transforms it into a workable appointment.
 */
public class AppointmentFactory {
    private List<String> days;
    private Date startTime;
    private Date endTime;
    private String classNumber;
    private String room;
    private String professor;
    private String classSection;
    private String className;

    public AppointmentFactory(List<String> days, Date startTime, Date endTime, String classNumber, String room, String professor, String classSection, String className) {
        this.days = days;
        this.startTime = startTime;
        this.endTime = endTime;
        this.classNumber = classNumber;
        this.room = room;
        this.professor = professor;
        this.classSection = classSection;
        this.className = className;
    }

    public List<Agenda.Appointment> createAppointments() {
        List<Agenda.Appointment> appointments = new ArrayList<>();
        for (String day: days) {
            Agenda.AppointmentImplLocal appointment = new Agenda.AppointmentImplLocal()
                    .withStartLocalDateTime(LocalDate.now().atTime(4,00))
                    .withEndLocalDateTime(LocalDate.now().atTime(6,00))
                    .withDescription(classNumber + " " + className + " " + classSection + " " + professor + " " + room)
                    .withAppointmentGroup(new Agenda.AppointmentGroupImpl().withStyleClass("group2"));
            appointments.add(appointment);
        }
        return appointments;
    }
}
