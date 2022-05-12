package scheduler;

import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.stage.Stage;
import jfxtras.scene.control.agenda.Agenda;
import org.json.JSONArray;
import org.json.JSONObject;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.text.SimpleDateFormat;

import java.net.URL;
import java.text.ParseException;
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
     * The department name
     */
    @FXML
    private ComboBox<String> course;

    /**
     * The room for the class
     */
    @FXML
    private ComboBox<String> room;

    /**
     * The timeslot for the class
     */
    @FXML
    private ComboBox<String> timeSlot;

    /**
     * The submit button
     */
    @FXML
    private Button submit_button;

    /**
     * A button to specify Monday
     */
    @FXML
    private CheckBox monday;

    /**
     * A button to specify Tuesday
     */
    @FXML
    private CheckBox tuesday;

    /**
     * A button to specify Wednesday
     */
    @FXML
    private CheckBox wednesday;

    /**
     * A button to specify Thursday
     */
    @FXML
    private CheckBox thursday;

    /**
     * A button to specify Friday
     */
    @FXML
    private CheckBox friday;

    /**
     * The close button
     */
    @FXML
    private Button closeButton;

    /**
     * The list of the select days
     */
    private List<CheckBox> datesSelected;

    /**
     * This is the dropdown menu for the class times
     */
    @FXML
    private ComboBox<String> classTimes;

    private List<String> listOfTimes = new ArrayList<>();

    /**
     * The constructor for the add course to schedule controller
     */
    public AddCourseToScheduleController() {
    }

    /**
     * The invalid class name alert error
     */
    Alert invalidClassName = new Alert(Alert.AlertType.ERROR);


    /**
     * The invalid dates alert error
     */
    Alert invalidDays = new Alert(Alert.AlertType.ERROR);

    /**
     * The invalid time alert error
     */
    Alert invalidStartAndEndTime = new Alert(Alert.AlertType.ERROR);

    /**
     * The confirmation alert to go back to the scheduler
     */
    Alert confirmBackButton = new Alert(Alert.AlertType.CONFIRMATION);


    private List<Timeslot> timeslots;

    private void getTimeSlots(){
        TimeSlotFactory timeSlotList = new TimeSlotFactory();
        timeslots = timeSlotList.createTimeSlot();
        for(Timeslot timeslot : timeslots){
            classTimes.getItems().add(timeslot.toString());
        }
    }


    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        datesSelected = Arrays.asList(monday, tuesday, wednesday, thursday, friday);
        course.getItems().clear();
        getTimeSlots();

        //Add options to dropdown time chunk dropdown menu



        // This is the confirmation to go back alert
        confirmBackButton.setTitle("Back to Scheduler");
        confirmBackButton.setContentText("Go back to the scheduler page");
        // Set event to go back to previous scheduler screen if user click "Ok", else do nothing
        EventHandler<ActionEvent> confirmBack = event -> {
            // Set button Ok to be the output button that the user clicked
            // It is either "Cancel" or "Ok"
            Optional<ButtonType> Ok = confirmBackButton.showAndWait();
            // If button is "Ok", then go back to scheduler
            if (Ok.get().getText().equals("OK")) {
                // Go back to scheduler
                course.getScene().getWindow().hide();
            }
        };

        closeButton.setOnAction(confirmBack);

        JSONArray classes = DatabaseStatic.getData("class");
        for (Object jsonObject: classes) {
            JSONObject json = (JSONObject)jsonObject;
            StringBuilder str = new StringBuilder((String) json.get("dept_code"));
            if (json.get("class_num") != JSONObject.NULL) {
                str.append(" ");
                str.append(json.get("class_num"));
            }
            if (json.get("class_name") != JSONObject.NULL) {
                str.append(" ");
                str.append(json.get("class_name"));
            }
            course.getItems().add(str.toString());
        }

        JSONArray rooms = DatabaseStatic.getData("room");
        for (Object jsonObject: rooms) {
            JSONObject json = (JSONObject)jsonObject;
            StringBuilder str = new StringBuilder((String) json.get("building_code"));
            str.append(" ");
            str.append(json.get("room_num"));
            if (json.get("capacity") != JSONObject.NULL) {
                str.append(" ");
                str.append(json.get("room_num"));
            }
            room.getItems().add(str.toString());
        }
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
     * @throws ParseException
     */
    @FXML
    public void submitData(ActionEvent event) throws ParseException {
        // Validate needed data is present
        if (validateData()) {
            // Create appointment from fields
            List<Agenda.Appointment> appointmentList = createAppointment();

            parentController.addCourse(appointmentList);

            // return to Scheduler
            course.getScene().getWindow().hide();
        }

    }

    /**
     * Creates the appointments
     * @return a list of appointments
     * @throws ParseException
     */
    private List<Agenda.Appointment> createAppointment() throws ParseException {
        Timeslot timeslot = timeslots.get(classTimes.getSelectionModel().getSelectedIndex());

        String[] days = timeslot.getDaysOfWeek().split("");
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        for (String day : days) {
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getStartTime())));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getEndTime())));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, course.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), "test",course.getSelectionModel().getSelectedItem(), course.getSelectionModel().getSelectedItem());

        return appointmentFactory.createAppointments();
    }

    /**
     * TODO update commetn
     * @param day
     * @return
     */
    public DayOfTheWeek convertToDayOFWeek(String day) {
        switch (day.toUpperCase()) {
            case "M":
                return DayOfTheWeek.MONDAY;
            case "T":
                return DayOfTheWeek.TUESDAY;
            case "W":
                return DayOfTheWeek.WEDNESDAY;
            case "R":
                return DayOfTheWeek.THURSDAY;
            case "F":
                return DayOfTheWeek.FRIDAY;
            default:
                return null;
        }

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
     * @return false if any test is invalid, else true
     */
    private boolean validateData() {
        return validateCourse();
    }

    /**
     * This function validates the class name. If nothing is selected, then it will prompt the user
     * to select a class name.
     * @return false is nothing is selected, else return true
     */
    private boolean validateCourse() {
        boolean result = true;
        // If the class name has not been selected
        if (course.getSelectionModel().isEmpty()) {
            // Set content of the error alert
            invalidClassName.setTitle("Invalid course Error");
            invalidClassName.setContentText("Please select a valid course");
            invalidClassName.showAndWait();
            result = false;
        }
        // Probably need to find a way to bind class number and class name??
        return result;
    }

    /**
     * This function validates the class name. If nothing is selected, then it will prompt the user
     * to select a class name.
     * @return false is nothing is selected, else return true
     */
    private boolean validateTimeSlot() {
        boolean result = true;
        // If the class name has not been selected
        if (course.getSelectionModel().isEmpty()) {
            // Set content of the error alert
            invalidClassName.setTitle("Invalid course Error");
            invalidClassName.setContentText("Please select a valid course");
            invalidClassName.showAndWait();
            result = false;
        }
        // Probably need to find a way to bind class number and class name??
        return result;
    }

    /**
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
     * @return false is nothing is selected, else return true
     */
    private boolean validateDates() {
        boolean result = false;
        // Iterate through all 5 days to check if at least 1 day is checked.
        // If so, set the boolean to true and break.
        for (CheckBox day : datesSelected) {
            if (day.isSelected()) {
                result = true;
                break;
            }
        }

        // boolean outcome is false, meaning none of the days has been selected, so
        // use JavaFX to prompt the user to select at least 1 day of the week.
        if (result == false) {
            // Set content of the error alert
            invalidDays.setTitle("Invalid Day/Days Error");
            invalidDays.setContentText("Please select at least one or more day/days of the week");
            invalidDays.showAndWait();
        }

        return result;
    }

    public void setParent(SchedulerController controller) {
        this.parentController = controller;
    }

    @FXML
    public void close(ActionEvent actionEvent) {
        course.getScene().getWindow().hide();
    }
}
