package scheduler;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import jfxtras.scene.control.agenda.Agenda;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Optional;
import java.util.ResourceBundle;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.text.SimpleDateFormat;

import java.net.URL;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * The controller for adding the course to the scheduler
 */
public class AddCourseToScheduleController implements Initializable {

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
     * The professor for the class
     */
    @FXML
    private ComboBox<String> professor;

    /**
     * The timeslot for the class
     */
    @FXML
    private ComboBox<String> classTimes;

    /**
     * The submit button
     */
    @FXML
    private Button submit_button;

    /**
     * The close button
     */
    @FXML
    private Button closeButton;

    /**
     * The timeslots available for selection
     */
    private List<Timeslot> listOfTimes = new ArrayList<>();

    /**
     * The constructor for the add course to schedule controller
     */
    public AddCourseToScheduleController() {
    }


    private void getTimeSlots() {
        TimeSlotFactory timeSlotList = new TimeSlotFactory();
        listOfTimes = timeSlotList.createTimeSlot();
        for(Timeslot timeslot : listOfTimes){
            classTimes.getItems().add(timeslot.toString());
        }
    }


    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        course.getItems().clear();
        getTimeSlots();
        // This is the confirmation to go back alert
        MyAlert createAlert = new MyAlert("Back To Scheduler", "Go back to the scheduler page", Alert.AlertType.CONFIRMATION);

        // Set event to go back to previous scheduler screen if user click "Ok", else do nothing
        EventHandler<ActionEvent> confirmBack = event -> {
            // Set button Ok to be the output button that the user clicked
            // It is either "Cancel" or "Ok"
            Optional<ButtonType> Ok = createAlert.showButton();
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

        JSONArray professors = DatabaseStatic.getData("faculty");
        for (Object jsonObject : professors) {
            JSONObject json = (JSONObject) jsonObject;
            StringBuilder str = new StringBuilder();
            if (json.get("faculty_first") != JSONObject.NULL) {
                str.append((String) json.get("faculty_first"));
            }
            str.append(" ");
            if (json.get("faculty_last") != JSONObject.NULL) {
                str.append(" ");
                str.append(json.get("faculty_last"));
            }
            professor.getItems().add(str.toString());
        }

        JSONArray rooms = DatabaseStatic.getData("room");
        for (Object jsonObject : rooms) {
            JSONObject json = (JSONObject) jsonObject;
            StringBuilder str = new StringBuilder((String) json.get("building_code"));
            str.append(" ");
            str.append(json.get("room_num"));
            if (json.get("capacity") != JSONObject.NULL) {
                str.append(" ");
                str.append(json.get("capacity"));
            }
            room.getItems().add(str.toString());
        }
    }

    /**
     * Validates the data inputs
     * Creates a list of class times
     * Adds the classes to the schedule
     * @throws ParseException
     */
    @FXML
    public void submitData() throws ParseException {
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
        Timeslot timeslot = listOfTimes.get(classTimes.getSelectionModel().getSelectedIndex());

        String[] days = timeslot.getDaysOfWeek().split("");
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        for (String day : days) {
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getStartTime())));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getEndTime())));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, course.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), professor.getSelectionModel().getSelectedItem());

        return appointmentFactory.createAppointments();
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
     * @param dateToConvert the date to be converted
     * @return a date in local date time format
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
        return validateDates() && validateCourse() && validateRoom() && validateProfessor();
    }

    /**
     * This function validates the class name. If nothing is selected, then it will prompt the user
     * to select a class name.
     * @return false is nothing is selected, else return true
     */
    private boolean validateCourse() {
        // If the class name has not been selected
        if (course.getSelectionModel().isEmpty()) {
            // Set content of the error alert
            MyAlert createAlert = new MyAlert("Invalid Course Error", "Please Select A Valid Course", Alert.AlertType.ERROR);
            createAlert.show();
            return false;
        }
        // Probably need to find a way to bind class number and class name??
        return true;
    }

    /**
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
     *
     * @return false is nothing is selected, else return true
     */
    private boolean validateDates() {
        if (classTimes.getSelectionModel().isEmpty()) {
            MyAlert alert = new MyAlert("Timeslot alert", "Please select a timeslot for the course", Alert.AlertType.WARNING);
            alert.show();
            return false;
        }
        return true;
    }
    /**
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
     *
     * @return false is nothing is selected, else return true
     */
    private boolean validateProfessor() {
        if (professor.getSelectionModel().isEmpty()) {
            MyAlert alert = new MyAlert("Professor alert", "Please select a professor for the course", Alert.AlertType.WARNING);
            alert.show();
            return false;
        }
        return true;
    }

    /**
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
     *
     * @return false is nothing is selected, else return true
     */
    private boolean validateRoom() {
        if (classTimes.getSelectionModel().isEmpty()) {
            MyAlert alert = new MyAlert("Room alert", "Please select a room for the course", Alert.AlertType.WARNING);
            alert.show();
            return false;
        }
        return true;
    }


    public void setParent(SchedulerController controller) {
        this.parentController = controller;
    }

    @FXML
    public void close() {
        course.getScene().getWindow().hide();
    }
}
