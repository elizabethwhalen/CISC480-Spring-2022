package scheduler;

import courses.Lecture;
import database.Database;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.stage.Modality;
import javafx.stage.Popup;
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

    /**
     * The invalid class name alert error
     */
    Alert invalidClassName = new Alert(Alert.AlertType.ERROR);

    /**
     * The invalid department alert error
     */
    Alert invalidDepartment = new Alert(Alert.AlertType.ERROR);

    /**
     * The invalid class number alert error
     */
    Alert invalidClassNumber = new Alert(Alert.AlertType.ERROR);

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

        // This is the confirmation to go back alert
        confirmBackButton.setTitle("Back to Scheduler");
        confirmBackButton.setContentText("Go back to the scheduler page");
        // Set event to go back to previous scheduler screen if user click "Ok", else do nothing
        EventHandler<ActionEvent> confirmBack = new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                // Set button Ok to be the output button that the user clicked
                // It is either "Cancel" or "Ok"
                Optional<ButtonType> Ok = confirmBackButton.showAndWait();
                // If button is "Ok", then go back to scheduler
                if (Ok.get().getText().equals("OK")) {
                    // Go back to scheduler
                    section_number.getScene().getWindow().hide();
                }
            }
        };

        closeButton.setOnAction(confirmBack);

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
        if (validateData()) {
            // Create appointment from fields
            List<Agenda.Appointment> appointmentList = createAppointment();

            parentController.addCourse(appointmentList);

            // return to Scheduler
            section_number.getScene().getWindow().hide();
        }

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
        for (String day: selectedDates) {
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
     * @return false if any test is invalid, else true
     */
    private boolean validateData() {
        return validateDates() && validateDepartment() && validateClassNumber() && validateClassName() && validateTime();
    }

    /**
     * This function validates the class name. If nothing is selected, then it will prompt the user
     * to select a class name.
     * @return false is nothing is selected, else return true
     */
    private boolean validateClassName() {
        boolean result = true;
        // If the class name has not been selected
        if (class_name.getSelectionModel().isEmpty()) {
            // Set content of the error alert
            invalidClassName.setTitle("Invalid Class Name Error");
            invalidClassName.setContentText("Please select a valid class name");
            invalidClassName.showAndWait();
            result = false;
        }
        // Probably need to find a way to bind class number and class name??
        return result;
    }

    /**
     * This function validate the class number. If nothing is selected, then it will prompt the user
     * to select a class number.
     * @return false is nothing is selected, else return true
     */
    private boolean validateClassNumber() {
        boolean result = true;
        // If the class name has not been selected
        if (classNumber.getSelectionModel().isEmpty()) {
            // Set content of the error alert
            invalidClassNumber.setTitle("Invalid Class Number Error");
            invalidClassNumber.setContentText("Please select a valid class number");
            invalidClassNumber.showAndWait();
            result = false;
        }
        // Probably need to find a way to bind class number and class name??
        return result;
    }

    /**
     * This function validate the department of the newly added class. If nothing is selected,
     * then it will prompt the user to select a department.
     * @return false is nothing is selected, else return true
     */
    private boolean validateDepartment() {
        boolean result = true;
        // If the class name has not been selected
        if (dept_name.getSelectionModel().isEmpty()) {
            // Set content of the error alert
            invalidDepartment.setTitle("Invalid Department Error");
            invalidDepartment.setContentText("Please select a valid department");
            invalidDepartment.showAndWait();
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
        for (RadioButton day : datesSelected) {
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
        // TODO: time error showing up twice. Also need to validate that end time must be after start time and that it is an integer that is being entered
        boolean result = true;
        String startTime = start_time.getText();
        int startTimeValue = -1;

        if(startTime.length() == 0) {
            result = false;
        }

        if(startTime.length() > 5) {
            result = false;
        } else {
            if(startTime.length() == 5) {
                if(startTime.charAt(2) != ':') {
                    StringBuilder sb = new StringBuilder();
                    sb.append(startTime,0, 2);
                    startTimeValue = Integer.parseInt(sb.toString());
                    result = false;
                } else {
                    if(startTime.charAt(1) != ':') {
                        StringBuilder sb = new StringBuilder();
                        sb.append(startTime, 0, 1);
                        startTimeValue = Integer.parseInt(sb.toString());
                        result = false;
                    }
                }
            }
        }

        String endTime = end_time.getText();
        int endTimeValue = -1;

        if(endTime.length() == 0) {
            result = false;
        }

        if(endTime.length() > 5) {
            result = false;
        } else {
            if(endTime.length() == 5) {
                if(endTime.charAt(2) != ':') {
                    StringBuilder sb = new StringBuilder();
                    sb.append(endTime,0, 2);
                    endTimeValue = Integer.parseInt(sb.toString());
                    result = false;
                } else {
                    if(endTime.charAt(1) != ':') {
                        StringBuilder sb = new StringBuilder();
                        sb.append(endTime, 0, 1);
                        endTimeValue = Integer.parseInt(sb.toString());
                        result = false;
                    }
                }
            }
        }


        if(startTimeValue > endTimeValue) {
            result = false;
        }

        if(result == false) {
            invalidStartAndEndTime.setTitle("Invalid Time");
            invalidStartAndEndTime.setContentText("Please make sure to enter time in 24-hour time format \n" +
                    "Make sure to also have ':' in between the hour and minute \n" +
                    "Last but not least, make sure that end time is after start time");
            invalidStartAndEndTime.showAndWait();
        }

        return result;
    }

    public void setParent(SchedulerController controller) {
        this.parentController = controller;
    }

    @FXML
    public void close(ActionEvent actionEvent) {
    }
}
