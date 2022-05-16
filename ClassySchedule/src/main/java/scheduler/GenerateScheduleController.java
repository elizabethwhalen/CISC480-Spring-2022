/*
     Portions of this page are reproduced from work created and shared by Google
     and used according to terms described in the Creative Commons 4.0 Attribution License.
     Relies on Google OR-tools https://developers.google.com/optimization

     This class also uses ControlsFX to create the CheckComboBox used under the BSD License
     https://github.com/controlsfx/controlsfx
 */
package scheduler;

import alert.MyAlert;
import algorithm.Algorithm;
import courses.CourseFactory;
import courses.Lecture;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Dialog;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.controlsfx.control.CheckComboBox;
import org.json.JSONObject;
import room.Room;
import room.RoomFactory;
import scenes.ChangeScene;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;
import users.Faculty;
import users.FacultyFactory;

/**
 * A class to generate the schedule
 */
public class GenerateScheduleController implements Initializable {

    /**
     * The courses to select
     */
    @FXML
    private CheckComboBox<String> courseBox;

    /**
     * The rooms available
     */
    @FXML
    private CheckComboBox<String> roomBox;

    /**
     * The professors available
     */
    @FXML
    private CheckComboBox<String> professorBox;

    /**
     * The timeslots available
     */
    @FXML
    private CheckComboBox<String> timeslotBox;

    /**
     * The back button
     */
    @FXML
    private Button backButton;

    /**
     * The generate schedule button
     */
    @FXML
    private Button generateButton;

    /**
     * A box to select all course
     */
    @FXML
    private CheckBox selectAllCourses;

    /**
     * A box to select all professors
     */
    @FXML
    private CheckBox selectAllProfessors;

    /**
     * A box to select all rooms
     */
    @FXML
    private CheckBox selectAllRooms;

    /**
     * A box to select all times
     */
    @FXML
    private CheckBox selectAllTimes;

    /**
     * The stage for this scene
     */
    private Stage stage;

    /**
     * A list of all the courses
     */
    private List<Lecture> courses;

    /**
     * A list of all professors
     */
    private List<Faculty> professors;

    /**
     * A list of all rooms
     */
    private List<Room> rooms;

    /**
     * A list of all timeslots
     */
    private List<Timeslot> timeslots;


    /**
     * The constructor for this controller. Since this class implements
     * initializable the constructor is not used.
     */
    public GenerateScheduleController() {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        courses = new CourseFactory().createCourses();
        rooms = new RoomFactory().createRooms();
        professors = new FacultyFactory().createFaculty();
        timeslots = new TimeslotFactory().createTimeSlot();

        for (Lecture course : courses) {
            courseBox.getItems().add(course.toString());
        }
        for (Room room : rooms) {
            roomBox.getItems().add(room.toString());
        }
        for (Faculty professor : professors) {
            professorBox.getItems().add(professor.toString());
        }
        for (Timeslot timeslot : timeslots) {
            timeslotBox.getItems().add(timeslot.toString());
        }
    }


    /**
     * Validates at least one room, course, professor, and timeslot is selected
     * Generate a schedule based on what the algorithm generates
     * Uses the Google OR-tools solver
     */
    @FXML
    private void generateSchedule() {
        if (!(validateRooms() && validateCourses() && validateProfessors() && validateTimeslots())) {
            new MyAlert("Invalid Selection", "Please select at least one room, professor, course, and timeslot", AlertType.WARNING).show();
        } else {
            Dialog<Boolean> dialog = new Dialog<>();
            Text text = new Text("Generating schedule, please wait...");
            dialog.getDialogPane().setContent(text);
            dialog.show();
            Algorithm test = new Algorithm();
            List<String[]> schedule = test.algorithm(professorBox.getCheckModel().getCheckedItems(), courseBox.getCheckModel().getCheckedItems(), roomBox.getCheckModel().getCheckedItems(), timeslotBox.getCheckModel().getCheckedItems());
            createSchedule(schedule);
            dialog.setResult(Boolean.TRUE);
            dialog.close();
        }
    }

    /**
     * Uses what the algorithm generated to create the schedule
     * @param schedule the algorithm generated schedule
     */
    private void createSchedule(List<String[]> schedule) {
        // Loop through each class returned from the algorithm
        for (String[] scheduledClass : schedule) {
            String course = scheduledClass[0];
            String professor = scheduledClass[1];
            String room = scheduledClass[2];
            String timeslot = scheduledClass[3];

            String[] courseInfo = course.split(" ");
            String[] courseNumAndSection = courseInfo[1].split("-");
            String[] professorInfo = professor.split(" ");
            String[] roomInfo = room.split(" ");
            String[] timeslotInfo = timeslot.split(" ");
            String[] timeSlotStartAndEnd = timeslotInfo[1].split("-");

            // Updates the meets table
            //dept_code , class_num, section_num, semester, draft, building_code, room_num, time_id

            JSONObject meets = new JSONObject();
            meets.put("dept_code", courseInfo[0]);
            meets.put("class_num", courseNumAndSection[0]);
            meets.put("section_num", Integer.parseInt(courseNumAndSection[1]));
            meets.put("semester", "Spring2022");
            meets.put("draft", 1);
            meets.put("building_code", roomInfo[0]);
            meets.put("room_num", roomInfo[1]);

            int timeId = new TimeslotFactory().findTimeSlot(timeSlotStartAndEnd[0], timeSlotStartAndEnd[1], timeslotInfo[0], timeslots);

            meets.put("time_id", timeId);
            boolean insertedIntoMeets = DatabaseStatic.insertData("meets", meets);

            // Update the teaches table
            // dept_code, class_num, section_num, semester, draft, faculty_id
            JSONObject teaches = new JSONObject();
            teaches.put("dept_code", courseInfo[0]);
            teaches.put("class_num", courseNumAndSection[0]);
            teaches.put("section_num", Integer.parseInt(courseNumAndSection[1]));
            teaches.put("semester", "Spring2022");
            teaches.put("draft", 1);
            teaches.put("faculty_id", Integer.parseInt(professorInfo[2]));
            boolean insertedIntoTeaches = DatabaseStatic.insertData("teaches", teaches);

            System.out.println("Inserted into meets = " + insertedIntoMeets + " \n inserted into teaches = " + insertedIntoTeaches);
        }
    }

    /**
     * checks the timeslots
     * @return returns true if at least one timeslot is selected, false otherwise
     */
    private boolean validateTimeslots() {
        return validateChoices(timeslotBox);
    }

    /**
     * Checks the professors
     * @return returns true if at least one professor is selected, false otherwise
     */
    private boolean validateProfessors() {
        return validateChoices(professorBox);
    }

    /**
     * Checks the courses
     * @return returns true if at least one course is selected, false otherwise
     */
    private boolean validateCourses() {
        return validateChoices(courseBox);
    }

    /**
     * Checks the rooms
     * @return returns true if at least one room is selected, false otherwise
     */
    private boolean validateRooms() {
        return validateChoices(roomBox);
    }

    /**
     * Checks the menu for selection
     * @param menu the menu to check
     * @return true if at least one item on the menu is selected, false otherwise
     */
    private boolean validateChoices(CheckComboBox<String> menu) {
        return !menu.getCheckModel().isEmpty();
    }

    /**
     * Selects all the course
     * @param actionEvent the selection event
     */
    public void selectAllCourses(ActionEvent actionEvent) {
        if (selectAllCourses.isSelected()) {
            courseBox.getCheckModel().checkAll();
        } else {
            courseBox.getCheckModel().clearChecks();
        }
    }

    /**
     * Selects all the professors
     * @param actionEvent the selection event
     */
    public void selectAllProfessors(ActionEvent actionEvent) {
        if (selectAllProfessors.isSelected()) {
            professorBox.getCheckModel().checkAll();
        } else {
            professorBox.getCheckModel().clearChecks();
        }
    }

    /**
     * Selects all rooms
     * @param actionEvent the selection event
     */
    public void selectAllRooms(ActionEvent actionEvent) {
        if (selectAllRooms.isSelected()) {
            roomBox.getCheckModel().checkAll();
        } else {
            roomBox.getCheckModel().clearChecks();
        }
    }

    /**
     * Selects all timeslots
     * @param actionEvent the selection event
     */
    public void selectAllTimes(ActionEvent actionEvent) {
        if (selectAllTimes.isSelected()) {
            timeslotBox.getCheckModel().checkAll();
        } else {
            timeslotBox.getCheckModel().clearChecks();
        }
    }

    /**
     * Goes back to the homepage
     */
    public void goBack() {
        new ChangeScene().goToHomepage(stage);
    }

    /**
     * Sets the stage for this scene
     * @param stage the stage to use for this scene
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Goes to view the scheduler
     * @param actionEvent the action event trigger
     */
    public void viewSchedule(ActionEvent actionEvent) {
        new ChangeScene().viewScheduleClicked(stage);
    }
}
