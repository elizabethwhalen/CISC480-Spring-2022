/*
    This class relies on a modified version of JFXtras
    Agenda module. Used under the BSD license
    https://jfxtras.org/
 */
package scheduler;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
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
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import static scheduler.DateTimeUtils.convertToDayOFWeek;
import static scheduler.DateTimeUtils.convertToLocalDateTimeViaInstant;

/**
 * Creates the scheduler controller and displays the schedule
 */
public class SchedulerController implements Initializable {

    /**
     * The delete button
     */
    @FXML
    private Button deleteButton;
    /**
     * The border pane
     */
    @FXML
    private BorderPane borderPane;

    /**
     * The button to add the course
     */
    @FXML
    private Button addCourseButton;

    /**
     * The home button
     */
    @FXML
    private Button homeButton;

    /**
     * The stage
     */
    private Stage stage;

    /**
     * The agenda to manipulate
     */
    private Agenda agenda;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * Initializes this scene
     * @param location the url of the fxml
     * @param resources the resource bundle for this scene
     */
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
                    // should never happen unless something goes horribly wrong
                }
            }

            String crs = course.getString("dept_code") + " " + course.getString("class_num") + "-" + course.getInt("section_num") +" " + course.get("class_name");
            String room = course.getString("building_code") + " " + course.getString("room_num") + " " + course.getString("day_of_week");
            String professor = course.getString("faculty_first") + " " + course.getString("faculty_last") + " " + course.getInt("faculty_id");
            AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, crs, room, professor);

            addCourse(appointmentFactory.createAppointments());
        }
    }

    /**
     * This method deletes the selected appointment from the calendar
     * and from the stored appointments in the database
     */
    @FXML
    private void deleteCourse() {
        if (agenda.selectedAppointments().isEmpty()) {
            new MyAlert("Delete Appointment Warning", "Please select the appointment you wish to delete", Alert.AlertType.WARNING).show();
        } else {
            for (Agenda.Appointment appointment : agenda.selectedAppointments()) {
                LocalTime startTime = appointment.getStartLocalDateTime().toLocalTime();
                LocalTime endTime = appointment.getEndLocalDateTime().toLocalTime();
                String[] summary = appointment.getSummary().split(" ");
                String[] location = appointment.getLocation().split(" ");

                String[] classNum = summary[1].split("-");
                // Delete from meets
                StringBuilder meets = new StringBuilder();
                meets.append("meets/").append(summary[0]);
                meets.append("/").append(classNum[0]);
                meets.append("/").append(classNum[1]);
                meets.append("/Spring2022/1");
                meets.append("/").append(location[0]);
                meets.append("/").append(location[1]);

                int timeId = new TimeslotFactory().findTimeSlot(startTime.toString() + ":00", endTime.toString() + ":00", location[2], new TimeslotFactory().createTimeSlot());
                meets.append("/").append(timeId);
                boolean didDeleteMeets = DatabaseStatic.deleteData(meets.toString(), null);
                //Delete from teaches
                String teaches = "teaches/" + summary[0] +
                        "/" + classNum[0] +
                        "/" + classNum[1] +
                        "/Spring2022/1" +
                        "/" + summary[5];
                boolean didDeleteteaches = DatabaseStatic.deleteData(teaches, null);

                System.out.println("deleted meets = " + didDeleteMeets + " deleted teaches = " + didDeleteteaches);
            }
            cs.viewScheduleClicked(stage);
        }
    }

    /**
     * This method receive the data from the user and insert into the calendar
     * @param appointments the created appoints to add to the scheduler
     */
    public void addCourse(List<Agenda.Appointment> appointments) {
        agenda.appointments().addAll(appointments);
    }

    /**
     * Goes to the homepage
     */
    @FXML
    private void goBack() {
        cs.goToHomepage(stage);
    }

    /**
     * go to add course scene
     */
    @FXML
    private void goToAddCourse() {
        cs.addCourseButtonClicked(stage);
    }

    /**
     * go to add classroom scene
     */
    @FXML
    private void goToAddClassroom() {
        cs.addClassroomButtonClicked(stage);
    }

    /**
     * go to add faculty scene
     */
    @FXML
    private void goToAddFaculty() {
        cs.addProfessorButtonClicked(stage);
    }

    /**
     * go to edit course scene
     */
    @FXML
    private void goToEditCourse() { cs.editCourseButtonClicked(stage); }

    /**
     * go to edit faculty scene
     */
    @FXML
    private void goToEditFaculty() { cs.editFacultyButtonClicked(stage); }

    /**
     * go to edit classroom scene
     */
    @FXML
    private void goToEditClassroom() { cs.editClassroomButtonClicked(stage); }

    /**
     * go to delete course scene
     */
    @FXML
    private void goToDeleteCourse() {
        cs.deleteCourseButtonClicked(stage);
    }

    /**
     * go to delete classroom scene
     */
    @FXML
    private void goToDeleteClassroom() {
        cs.deleteClassroomButtonClicked(stage);
    }

    /**
     * go to delete faculty scene
     */
    @FXML
    private void goToDeleteFaculty() {
        cs.deleteFacultyButtonClicked(stage);
    }

    /**
     * go to view schedule scene
     */
    @FXML
    private void goToViewSchedule() {
        cs.viewScheduleClicked(stage);
    }

    /**
     * Goes to the generate schedule page
     * @param actionEvent the event trigger
     */
    @FXML
    public void generateSchedule(ActionEvent actionEvent) {
        cs.goToGenerateSchedule(stage);
    }
}
