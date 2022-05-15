package scheduler;

import alert.MyAlert;
import courses.Course;
import courses.CourseFactory;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ComboBox;

import jfxtras.scene.control.agenda.Agenda;
import org.json.JSONArray;
import org.json.JSONObject;
import room.Room;
import room.RoomFactory;
import users.Faculty;
import users.FacultyFactory;

import java.util.Optional;
import java.util.ResourceBundle;
import java.util.List;
import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.net.URL;
import java.text.ParseException;
import java.time.LocalDateTime;


import static scheduler.DateTimeUtils.convertToDayOFWeek;
import static scheduler.DateTimeUtils.convertToLocalDateTimeViaInstant;

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

    private List<Course> courses = new ArrayList<>();

    private List<Faculty> faculty = new ArrayList<>();

    private List<Room> rooms = new ArrayList<>();

    /**
     * The constructor for the add course to schedule controller
     */
    public AddCourseToScheduleController() {
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        course.getItems().clear();
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

        courses = new CourseFactory().createCourses();
        faculty = new FacultyFactory().createFaculty();
        rooms = new RoomFactory().createRooms();
        listOfTimes = new TimeSlotFactory().createTimeSlot();

        for (Course crs : courses) {
            course.getItems().add(crs.toString());
        }

        for (Faculty faculty: faculty) {
            professor.getItems().add(faculty.toString());
        }

        for (Room classRoom: rooms) {
            room.getItems().add(classRoom.toString());
        }

        for (Timeslot timeslot : listOfTimes) {
            classTimes.getItems().add(timeslot.toString());
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

            sendDataToDatabase();

            JSONArray test = DatabaseStatic.getData("meets");
            // return to Scheduler
            course.getScene().getWindow().hide();
        }

    }

    private void sendDataToDatabase() {
        Timeslot timeslot = listOfTimes.get(classTimes.getSelectionModel().getSelectedIndex());
        Course crs = courses.get(course.getSelectionModel().getSelectedIndex());
        Faculty prof = faculty.get(professor.getSelectionModel().getSelectedIndex());
        Room rm = rooms.get(room.getSelectionModel().getSelectedIndex());

        JSONObject meets = new JSONObject();
        //dept_code , class_num, section_num, semester, draft, building_code, room_num, time_id
        meets.put("dept_code", crs.getDeptCode());
        meets.put("class_num", crs.getClassNum());
        meets.put("section_num", crs.getSectionNum());
        meets.put("semester", crs.getSemester());
        meets.put("draft", crs.getDraft());
        meets.put("building_code", rm.getBuildingCode());
        meets.put("room_num", rm.getRoomNum());
        meets.put("time_id", timeslot.getTimeID());
        DatabaseStatic.insertData("meets", meets);
        JSONObject teaches = new JSONObject();
        // dept_code, class_num, section_num, semester, draft, faculty_id
        teaches.put("dept_code", crs.getDeptCode());
        teaches.put("class_num", crs.getClassNum());
        teaches.put("section_num", crs.getSectionNum());
        teaches.put("semester", crs.getSemester());
        teaches.put("draft", crs.getDraft());
        teaches.put("faculty_id", prof.getFacultyID());
        DatabaseStatic.insertData("teaches", teaches);
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
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (String day : days) {
            startDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getStartTime())));
            endDaysAndTimes.add(convertToLocalDateTimeViaInstant(df.parse(convertToDayOFWeek(day).label + " " + timeslot.getEndTime())));
        }

        AppointmentFactory appointmentFactory = new AppointmentFactory(startDaysAndTimes, endDaysAndTimes, course.getSelectionModel().getSelectedItem(), room.getSelectionModel().getSelectedItem(), professor.getSelectionModel().getSelectedItem());

        return appointmentFactory.createAppointments();
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
        return true;
    }

    /**
     * This function validate that at least 1 of the day of the week is selected. If not
     * then it will prompt the user to click on at least 1 or more day/days of the week.
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
