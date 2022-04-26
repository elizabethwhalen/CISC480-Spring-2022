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

    private void getTimeSlots(){
        //TODO: Find out why i need to call removeDuplicates twice.

        JSONArray currentTimeChunk = DatabaseStatic.getData("timeslot");
        List<LocalTime> startTime = new ArrayList<LocalTime>();
        List<LocalTime> endTime = new ArrayList<LocalTime>();

        //grabs a list of times from the database and adds them to a list, removes the duplicates, and sorts them.
        for (Object jsonObject: currentTimeChunk) {
            JSONObject job = (JSONObject)jsonObject;
            int day = (int) job.get("day_of_week");
            listOfTimes.add((String) job.get("time_start") + " - " + job.get("time_end"));
        }
        System.out.println(listOfTimes.size());
        removeDuplicateTimes(listOfTimes);
        System.out.println(listOfTimes.size());
        //Add Times to startTime and endTime list
        for(int i=0; i < listOfTimes.size(); i++) {
            String stringTime = listOfTimes.get(i).toString();

            String stringStartTime = stringTime.substring(0, stringTime.indexOf(" "));
            String stringEndTime = stringTime.substring(stringTime.lastIndexOf(" ") + 1);
            LocalTime currentStartTime = LocalTime.parse(stringStartTime, DateTimeFormatter.ISO_LOCAL_TIME);
            LocalTime currentEndTime = LocalTime.parse(stringEndTime, DateTimeFormatter.ISO_LOCAL_TIME);
            startTime.add(currentStartTime);
            endTime.add(currentEndTime);
        }

        sortTimes(startTime, endTime);
        //Inserts time slots to the dropdown menu
        for(int numTimes=0; numTimes < listOfTimes.size(); numTimes++){
            classTimes.getItems().add(listOfTimes.get(numTimes));
        }
    }

    /**
     * This method sorts the times and updates the listoftimes
     * @param startingTimes
     * @param endTimes
     */
    @SuppressWarnings("DuplicatedCode")
    private void sortTimes(List<LocalTime> startingTimes, List<LocalTime> endTimes){
        List<String> sortedTimes = new ArrayList<String>();
        for (int index = 0; index < startingTimes.size()-1; index++){
            for(int j=0; j<startingTimes.size()-1-index; j++){
                LocalTime currentStartTime = startingTimes.get(j);
                LocalTime currentEndTime = endTimes.get(j);
                if(currentStartTime.isAfter(startingTimes.get(j+1))){
                    startingTimes.set(j,startingTimes.get(j+1));
                    startingTimes.set(j+1, currentStartTime);

                    endTimes.set(j,endTimes.get(j+1));
                    endTimes.set(j+1, currentEndTime);

                }
                //Handle the end times
                if(currentStartTime == startingTimes.get(j+1)) {
                    if (currentEndTime.isAfter(endTimes.get(j + 1))){
                        startingTimes.set(j, startingTimes.get(j + 1));
                        startingTimes.set(j + 1, currentStartTime);
                        endTimes.set(j, endTimes.get(j + 1));
                        endTimes.set(j + 1, currentEndTime);
                    }
                }
            }
        }
        //Update the current List of Times
        for(int k =0; k < startingTimes.size(); k++){
            sortedTimes.add(startingTimes.get(k).toString() + " - " + endTimes.get(k).toString());
        }
        listOfTimes = sortedTimes;
    }


    /**
     * This method removes the duplicate time slots given to us by the database.
     * @param listOfTimes
     */
    private List<String> removeDuplicateTimes(List<String> listOfTimes){
        boolean removedAllDuplicates = false;
        while(!removedAllDuplicates) {
            removedAllDuplicates = true;
            for (int index = 0; index < listOfTimes.size(); index++) {
                String currentTimeChunk = listOfTimes.get(index);
                if (index != listOfTimes.lastIndexOf(currentTimeChunk)) {
                    listOfTimes.remove(listOfTimes.lastIndexOf(currentTimeChunk));
                    removedAllDuplicates = false;
                }
            }
        }

        return listOfTimes;
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
        List<String> selectedDates = new ArrayList<>();
        for (CheckBox radioButton: datesSelected) {
            if (radioButton.isSelected()) {
                selectedDates.add(radioButton.getText());
            }
        }
        List<LocalDateTime> startDaysAndTimes = new ArrayList<>();
        List<LocalDateTime> endDaysAndTimes = new ArrayList<>();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (String day: selectedDates) {
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + timeSlot.getSelectionModel().getSelectedItem())));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(DayOfTheWeek.valueOf(day.toUpperCase(Locale.ROOT)).label + " " + timeSlot.getSelectionModel().getSelectedItem())));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, course.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), "test",course.getSelectionModel().getSelectedItem(), course.getSelectionModel().getSelectedItem());

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
        return validateDates() && validateTime();
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
