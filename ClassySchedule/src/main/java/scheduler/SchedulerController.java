package scheduler;

import database.DatabaseStatic;
import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import jfxtras.scene.control.agenda.Agenda;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.JarURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

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
     * @param actionEvent
     * @throws IOException
     */
    @FXML
    public void goToAddCourseToScheduler(ActionEvent actionEvent) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToSchedule.fxml"));
        Stage stage = new Stage();
        stage.initOwner(addCourseButton.getScene().getWindow());
        stage.setScene(new Scene((Parent) loader.load()));
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

    public void populateSchedule() {
        JSONArray meets = DatabaseStatic.getData("meets");
        for (Object course: meets) {
            JSONObject json = (JSONObject) course;
            json.get("dept_code");
            json.get("class_num");
            JSONObject time = new JSONObject();
            time.put("time_id", String.valueOf(json.get("time_id")));
            JSONArray times = DatabaseStatic.getData("timeslot", time);
            List<LocalDateTime> startTimes = getStartTimes(times);
            List<LocalDateTime> endTimes = getEndTimes(times);

            AppointmentFactory test = new AppointmentFactory(startTimes, endTimes, "Dept_code classNumber className", (String)json.get("building_code") + (String) json.get("room_num"), "test");
            addCourse(test.createAppointments());
        }
    }

    private List<LocalDateTime> getStartTimes(JSONArray times) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();

        for (Object time: times) {
            JSONObject endTime = (JSONObject) time;
            DayOfTheWeek day = null;
            switch ((int) endTime.get("day_of_week")) {
                case 1:
                    day = DayOfTheWeek.MONDAY;
                    break;
                case 2:
                    day = DayOfTheWeek.TUESDAY;
                    break;
                case 3:
                    day = DayOfTheWeek.WEDNESDAY;
                    break;
                case 4:
                    day = DayOfTheWeek.THURSDAY;
                    break;
                case 5:
                    day = DayOfTheWeek.FRIDAY;
                    break;
                default:
                    break;
            }
            try {
                startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(day.label + " " + endTime.get("time_start"))));
            } catch (ParseException e) {
                e.printStackTrace();
            }

        }
        return startDaysAndTimes;
    }

    private List<LocalDateTime> getEndTimes(JSONArray times) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();

        for (Object time: times) {
            JSONObject endTime = (JSONObject) time;
            DayOfTheWeek day = null;
            switch ((int) endTime.get("day_of_week")) {
                case 1:
                    day = DayOfTheWeek.MONDAY;
                    break;
                case 2:
                    day = DayOfTheWeek.TUESDAY;
                    break;
                case 3:
                    day = DayOfTheWeek.WEDNESDAY;
                    break;
                case 4:
                    day = DayOfTheWeek.THURSDAY;
                    break;
                case 5:
                    day = DayOfTheWeek.FRIDAY;
                    break;
                default:
                    break;
            }
            try {
                endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(day.label + " " + endTime.get("time_end"))));
            } catch (ParseException e) {
                e.printStackTrace();
            }

        }
        return endDaysAndTimes;
    }


    /**
     * Converts a date to local date time
     *
     * @param dateToConvert the date to be converted
     * @return a date in local date time formatx
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
