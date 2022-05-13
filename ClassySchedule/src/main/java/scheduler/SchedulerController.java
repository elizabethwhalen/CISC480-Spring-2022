package scheduler;

import database.DatabaseStatic;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import jfxtras.scene.control.agenda.Agenda;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.ResourceBundle;

// TODO: Add comments, persist appointments
public class SchedulerController implements Initializable {

    /**
     * The border pane
     */
    @FXML
    BorderPane borderPane;

    /**
     * The button to add the course
     */
    @FXML
    Button addCourseButton;

    /**
     * The home button
     */
    @FXML
    Button homeButton;

    /**
     * Another button for possible future functionality
     */
    @FXML
    Button anotherButton;

    /**
     * The stage
     */
    Stage stage;

    /**
     * The agenda to manipulate
     */
    Agenda agenda;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        this.agenda = new Agenda();
        borderPane.setCenter(agenda);
        populateSchedule();
    }

    /**
     * Opens the popup dialog
     * @throws IOException
     */
    @FXML
    public void goToAddCourseToScheduler() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToSchedule.fxml"));
        Stage stage = new Stage();
        stage.initOwner(addCourseButton.getScene().getWindow());
        stage.setScene(new Scene(loader.load()));
        AddCourseToScheduleController controller = loader.getController();
        controller.setParent(this);

        // showAndWait will block execution until the window closes...
        stage.showAndWait();
    }


    /**
     * Sets the stage
     * @param stage the stage to be set
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }


    /**
     * TODO: redo this method with the new api call
     * This method populates the schedule with previously saved courses
     */
    public void populateSchedule() {
        JSONArray meets = DatabaseStatic.meetsQuery();

        for (Object json: meets) {
            JSONObject course = (JSONObject) json;

            String[] days = course.getString("day_of_week").split("");

            List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
            List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            for (String day : days) {
                try {
                    startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + course.getString("time_start"))));
                    endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + course.getString("time_end"))));

                } catch (ParseException e) {
                    // no op
                }
            }

            String crs = course.getString("dept_code") + " " + course.getString("class_num") + " " + course.get("class_name");
            String room = course.getString("building_code") + " " + course.getString("room_num");
            String professor = course.getString("faculty_first") + " " + course.getString("faculty_last");
            AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, crs, room, professor);

            addCourse(appointmentFactory.createAppointments());
        }
    }
    /**
     * Converts a character to a dayOfTheWeek object
     * @param day the character to convert
     * @return the day of the week corresponding with the day
     */
    public DayOfTheWeek convertToDayOFWeek(String day) {
        return switch (day.toUpperCase()) {
            case "M" -> DayOfTheWeek.MONDAY;
            case "T" -> DayOfTheWeek.TUESDAY;
            case "W" -> DayOfTheWeek.WEDNESDAY;
            case "R" -> DayOfTheWeek.THURSDAY;
            case "F" -> DayOfTheWeek.FRIDAY;
            default -> null;
        };
    }


    /**
     * Converts a date to local date time
     *
     * @param dateToConvert the date to be converted
     * @return a date in local date time format
     */
    public LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    /**
     * This method receive the data from the user and insert into the calendar
     * @param appointments the created appoints to add to the scheduler
     */
    public void addCourse(List<Agenda.Appointment> appointments) {
        agenda.appointments().addAll(appointments);
    }

    @FXML
    public void goBack() {
        cs.goToHomepage(stage);
    }

    /**
     * go to add course scene
     */
    @FXML
    public void goToAddCourse() {
        cs.addCourseButtonClicked(stage);
    }

    /**
     * go to add classroom scene
     */
    @FXML
    public void goToAddClassroom() {
        cs.addClassroomButtonClicked(stage);
    }

    /**
     * go to add faculty scene
     */
    @FXML
    public void goToAddFaculty() {
        cs.addProfessorButtonClicked(stage);
    }

    /**
     * go to delete course scene
     */
    @FXML
    public void goToDeleteCourse() {
        cs.deleteCourseButtonClicked(stage);
    }

    /**
     * go to delete classroom scene
     */
    @FXML
    public void goToDeleteClassroom() {
        cs.deleteClassroomButtonClicked(stage);
    }

    /**
     * go to delete faculty scene
     */
    @FXML
    public void goToDeleteFaculty() {
        cs.deleteFacultyButtonClicked(stage);
    }

    /**
     * go to view schedule scene
     */
    @FXML
    public void goToViewSchedule() {
        cs.viewScheduleClicked(stage);
    }

}
