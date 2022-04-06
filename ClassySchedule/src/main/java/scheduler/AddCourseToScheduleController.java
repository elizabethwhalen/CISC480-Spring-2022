package scheduler;

import courses.Lecture;
import database.Database;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import jfxtras.scene.control.agenda.Agenda;

import java.io.IOException;
import java.net.URL;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

/**
 * The controller for adding the course to the scheduler
 */
public class AddCourseToScheduleController implements Initializable {

    /**
     * The current stage
     */
    private Stage currentStage;

    /**
     * The parent controller
     */
    private SchedulerController parentController;

    /**
     * The section number of the class
     */
    @FXML
    private ComboBox<String> section_number;

    /**
     * The class name
     */
    @FXML
    private ComboBox<String> class_name;

    /**
     * The department name
     */
    @FXML
    private ComboBox<String> dept_name;

    /**
     * The submit button
     */
    @FXML
    private Button submit_button;

    /**
     * A button to specify Monday
     */
    @FXML
    private RadioButton monday;

    /**
     * A button to specify Tuesday
     */
    @FXML
    private RadioButton tuesday;

    /**
     * A button to specify Wednesday
     */
    @FXML
    private RadioButton wednesday;

    /**
     * A button to specify Thursday
     */
    @FXML
    private RadioButton thursday;

    /**
     * A button to specify Friday
     */
    @FXML
    private RadioButton friday;

    /**
     * The start time of the appointment
     */
    @FXML
    private TextField start_time;

    /**
     * The end time of the appointment
     */
    @FXML
    private TextField end_time;

    /**
     * The class number
     */
    @FXML
    private ComboBox<String> classNumber;

    /**
     * The close button
     */
    @FXML
    private Button closeButton;

    /**
     * The room for the class
     */
    @FXML
    private ComboBox<String> room;

    /**
     * The list of the select days
     */
    List<RadioButton> datesSelected;

    /**
     * The constructor for the add course to schedule controller
     */
    public AddCourseToScheduleController() {
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        datesSelected = Arrays.asList(monday, tuesday, wednesday, thursday, friday);
        dept_name.getItems().clear();
        try {
            Database database = new Database();

            ResultSet rs = database.getData("dept_code", "dept");
            while (rs.next()) {
                dept_name.getItems().add(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Testing; Hard-coded courses into the drop-down boxes
        // TODO: Get class name, class sections, available rooms from database
        class_name.getItems().add("Intro to Programming");
        class_name.getItems().add("Object-Oriented Programming");
        class_name.getItems().add("Data Structure");
        class_name.getItems().add("Information Security");
        classNumber.getItems().add("131");
        classNumber.getItems().add("230");
        classNumber.getItems().add("231");
        classNumber.getItems().add("350");
    }

    /**
     * Sets the stage
     * @param stage the stage to be set
     */
    public void setStage(Stage stage) {
        this.currentStage = stage;
    }

    /**
     * Validates the data inputs
     * Creates a list of class times
     * Adds the classes to the schedule
     * @param event
     * @throws IOException
     * @throws ParseException
     */
    @FXML
    public void submitData(ActionEvent event) throws IOException, ParseException {
        // Validate needed data is present
        validateData();

        // Create appointment from fields
        List<Agenda.Appointment> appointmentList = createAppointment();

        parentController.addCourse(appointmentList);

        // return to Scheduler
        section_number.getScene().getWindow().hide();

    }

    /**
     * Creates the appointments
     * @return a list of appointments
     * @throws ParseException
     */
    private List<Agenda.Appointment> createAppointment() throws ParseException {
        List<String> selectedDates = new ArrayList<>();
        for (RadioButton radioButton: datesSelected) {
            if (radioButton.isSelected()) {
                selectedDates.add(radioButton.getText());
            }
        }
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(String day: selectedDates) {
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + start_time.getText() + ":00")));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + end_time.getText() + ":00")));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, classNumber.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), "test",section_number.getSelectionModel().getSelectedItem(), class_name.getSelectionModel().getSelectedItem());

        return appointmentFactory.createAppointments();
    }

    /**
     * Converts a date to local date time
     * @param dateToConvert the date to be converted
     * @return a date in local date time formatx
     */
    public LocalDateTime convertToLocalDateTimeViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    /**
     * This method validates that each data field necessary has the required and correct data type
     */
    private void validateData() {

    }

    /**
     * This method takes a given lecture object turn it into a string using StringBuilder to use
     * for setting the displayCourse object strings.
     *
     * @param lecture a given lecture object to reference its necessary information
     * @return a string output of the necessary lecture information
     */
    private String lectureToDisplayCourse(Lecture lecture) {
        StringBuilder sb = new StringBuilder();
        sb.append(lecture.getClassName() + "\n");
        sb.append(lecture.getSectionNumber() + "\n");
        sb.append(lecture.getDepartment());
        String output;
        output = sb.toString();
        System.out.println(output);
        return output;
    }

    public void setParent(SchedulerController controller) {
        this.parentController = controller;
    }

    @FXML
    public void close(ActionEvent actionEvent) {
    }
}
