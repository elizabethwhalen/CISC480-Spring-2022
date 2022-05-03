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

import java.net.URL;
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
     * The invalid class name alert error
     */
    private Alert invalidClassName = new Alert(Alert.AlertType.ERROR);


    /**
     * The invalid dates alert error
     */
    private Alert invalidDays = new Alert(Alert.AlertType.ERROR);

    /**
     * The invalid time alert error
     */
    private Alert invalidStartAndEndTime = new Alert(Alert.AlertType.ERROR);

    /**
     * The confirmation alert to go back to the scheduler
     */
    private Alert confirmBackButton = new Alert(Alert.AlertType.CONFIRMATION);

    /**
     * The constructor for the add course to schedule controller
     */
    public AddCourseToScheduleController() {
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        datesSelected = Arrays.asList(monday, tuesday, wednesday, thursday, friday);
        course.getItems().clear();
        getTimeSlots();

        //Add options to dropdown time chunk dropdown menu
        //String[] timeChunks = new String[]{"8:00 - 9:40", "8:15 - 9:20"};


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
        for (Object jsonObject : classes) {
            JSONObject json = (JSONObject) jsonObject;
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
        for (Object jsonObject : rooms) {
            JSONObject json = (JSONObject) jsonObject;
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
     * Gets the current time slots from the database
     */
    private void getTimeSlots() {
        JSONArray currentTimeChunk = DatabaseStatic.getData("timeslot");
        //JSONObject dayOfWeek = ()
        for (Object jsonObject : currentTimeChunk) {
            JSONObject job = (JSONObject) jsonObject;
            if (job.get("time_start") != JSONObject.NULL && job.get("time_end") != JSONObject.NULL) {
                timeSlot.getItems().add(job.get("time_start") + " - " + job.get("time_end"));
            }
        }
    }

    /**
     * Sets the stage
     *
     * @param stage the stage to be set
     */
    public void setStage(Stage stage) {
        this.currentStage = stage;
    }

    /**
     * Validates the data inputs
     * Creates a list of class times
     * Adds the classes to the schedule
     *
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
     *
     * @return a list of appointments
     * @throws ParseException
     */
    private List<Agenda.Appointment> createAppointment() throws ParseException {
        List<String> selectedDates = new ArrayList<>();
        for (CheckBox radioButton : datesSelected) {
            if (radioButton.isSelected()) {
                selectedDates.add(radioButton.getText());
            }
        }
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (String day : selectedDates) {
            String[] times = timeSlot.getSelectionModel().getSelectedItem().split("-");
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + times[0])));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + times[1])));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, course.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), "TODO: PROFESSOR");

        return appointmentFactory.createAppointments();
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
     * This method validates that each data field necessary has the required and correct data type
     *
     * @return false if any test is invalid, else true
     */
    private boolean validateData() {
        return validateDates() && validateCourse() && validateTime();
    }

    /**
     * This function validates the class name. If nothing is selected, then it will prompt the user
     * to select a class name.
     *
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
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
     *
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

    private boolean validateTime() {
//        boolean result = true;
//        String startTime = start_time.getText();
//        String endTime = end_time.getText();
//
//        // If no input
//        if (startTime.length() == 0 || endTime.length() == 0) {
//            result = false;
//            invalidStartAndEndTime.setTitle("No Input");
//            invalidStartAndEndTime.setContentText("Please input a timeslot");
//            invalidStartAndEndTime.showAndWait();
//        }
//
//        // If input is longer than 5 character (Not valid timeslot)
//        if (startTime.length() > 5) {
//            result = false;
//            invalidStartAndEndTime.setTitle("Input Longer than 5 Character");
//            invalidStartAndEndTime.setContentText("Please input a valid time slot");
//            invalidStartAndEndTime.showAndWait();
//        }
//
//        // If Start Time Length is 5
//        if (startTime.length() == 5) {
//            int i = 0;
//            // Iterate through each character
//            while (i < 5) {
//                // if length is 5, 2nd character must be a colon
//                if (i == 2) {
//                    if (startTime.charAt(i) != ':') {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("No Colon In Start Time");
//                        invalidStartAndEndTime.setContentText("Please input a colon in the 24-hour format timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                } else {
//                    // Every other character must be an integer
//                    if (!(Character.isDigit(startTime.charAt(i)))) {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("Character Not Integer In Start Time");
//                        invalidStartAndEndTime.setContentText("Please input a a proper integer timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                }
//                i++;
//            }
//        }
//
//        // If Start Time Length is 4
//        if (startTime.length() == 4) {
//            int i = 0;
//            // Iterate through each character
//            while (i < 4) {
//                if (i == 1) {
//                    // if length is 4, 1 character must be a colon
//                    if (startTime.charAt(i) != ':') {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("No Colon In Start Time");
//                        invalidStartAndEndTime.setContentText("Please input a colon in the 24-hour format timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                } else {
//                    // Every other character must be an integer
//                    if (!(Character.isDigit(startTime.charAt(i)))) {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("Character Not Integer In Start Time");
//                        invalidStartAndEndTime.setContentText("Please input a a proper integer timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                }
//                i++;
//            }
//        }
//
//        // If End Time Length is 5
//        if (endTime.length() == 5) {
//            int i = 0;
//            // Iterate through each character
//            while (i < 5) {
//                if (i == 2) {
//                    // if length is 5, 2nd character must be a colon
//                    if (endTime.charAt(i) != ':') {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("No Colon In End Time");
//                        invalidStartAndEndTime.setContentText("Please input a colon in the 24-hour format timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                } else {
//                    // Every other character must be an integer
//                    if (!(Character.isDigit(endTime.charAt(i)))) {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("Character Not Integer In End Time");
//                        invalidStartAndEndTime.setContentText("Please input a a proper integer timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                }
//                i++;
//            }
//        }
//
//        // If End Time Length is 4
//        if (endTime.length() == 4) {
//            int i = 0;
//            // Iterate through each character
//            while (i < 4) {
//                if (i == 1) {
//                    // if length is 4, 1st character must be a colon
//                    if (endTime.charAt(i) != ':') {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("No Colon In End Time");
//                        invalidStartAndEndTime.setContentText("Please input a colon in the 24-hour format timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                } else {
//                    // Every other character must be an integer
//                    if (!(Character.isDigit(endTime.charAt(i)))) {
//                        result = false;
//                        invalidStartAndEndTime.setTitle("Character Not Integer In End Time");
//                        invalidStartAndEndTime.setContentText("Please input a a proper integer timeslot");
//                        invalidStartAndEndTime.showAndWait();
//                    }
//                }
//                i++;
//            }
//        }
//
//        // Remove colon from the string to test for end time beginning start time.
//        String startTimeValue = startTime.replace(":", "");
//        String endTimeValue = endTime.replace(":", "");
//
//        // Timeslot in 24-hour format, so just need to ensure that End Time is bigger than Start Time
//        if (Integer.parseInt(startTimeValue) > Integer.parseInt(endTimeValue)) {
//            result = false;
//            invalidStartAndEndTime.setTitle("End Time Need To Be After Start Time");
//            invalidStartAndEndTime.setContentText("Please ensure that end time starts after end time");
//            invalidStartAndEndTime.showAndWait();
//        }

        return true;
    }

    public void setParent(SchedulerController controller) {
        this.parentController = controller;
    }

    @FXML
    public void close(ActionEvent actionEvent) {
        course.getScene().getWindow().hide();
    }
}
