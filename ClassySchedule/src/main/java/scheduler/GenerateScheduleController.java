package scheduler;

import alert.MyAlert;
import algorithm.Algorithm;
import courses.Course;
import courses.CourseFactory;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Alert.AlertType;
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



public class GenerateScheduleController implements Initializable {

    @FXML
    private CheckComboBox<String> courseBox;

    @FXML
    private CheckComboBox<String> roomBox;

    @FXML
    private CheckComboBox<String> professorBox;

    @FXML
    private CheckComboBox<String> timeslotBox;

    @FXML
    private Button backButton;

    @FXML
    private Button generateButton;

    @FXML
    private CheckBox selectAllCourses;

    @FXML
    private CheckBox selectAllProfessors;

    @FXML
    private CheckBox selectAllRooms;

    @FXML
    private CheckBox selectAllTimes;

    private Stage stage;

    private List<Course> courses;

    private List<Faculty> professors;

    private List<Room> rooms;

    private List<Timeslot> timeslots;


    public GenerateScheduleController() {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        courses = new CourseFactory().createCourses();
        rooms = new RoomFactory().createRooms();
        professors = new FacultyFactory().createFaculty();
        timeslots = new TimeSlotFactory().createTimeSlot();

        for (Course course : courses) {
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


    @FXML
    private void generateSchedule() {
        if (!(validateRooms() && validateCourses() && validateProfessors() && validateTimeslots())) {
            new MyAlert("Invalid Selection", "Please select at least one room, professor, course, and timeslot", AlertType.WARNING).show();
        } else {
            Algorithm test = new Algorithm();
            List<String[]> schedule = test.algorithm(professorBox.getCheckModel().getCheckedItems(), courseBox.getCheckModel().getCheckedItems(), roomBox.getCheckModel().getCheckedItems(), timeslotBox.getCheckModel().getCheckedItems());
            createSchedule(schedule);
        }
    }

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

            int timeID = new TimeSlotFactory().findTimeSlot(timeSlotStartAndEnd[0], timeSlotStartAndEnd[1], timeslotInfo[0], timeslots);

            meets.put("time_id", timeID);
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

    private boolean validateTimeslots() {
        return validateChoices(timeslotBox);
    }

    private boolean validateProfessors() {
        return validateChoices(professorBox);
    }

    private boolean validateCourses() {
        return validateChoices(courseBox);
    }

    private boolean validateRooms() {
        return validateChoices(roomBox);
    }

    private boolean validateChoices(CheckComboBox menu) {
        return !menu.getCheckModel().isEmpty();
    }

    public void selectAllCourses(ActionEvent actionEvent) {
        if (selectAllCourses.isSelected()) {
            courseBox.getCheckModel().checkAll();
        } else {
            courseBox.getCheckModel().clearChecks();
        }
    }

    public void selectAllProfessors(ActionEvent actionEvent) {
        if (selectAllProfessors.isSelected()) {
            professorBox.getCheckModel().checkAll();
        } else {
            professorBox.getCheckModel().clearChecks();
        }
    }

    public void selectAllRooms(ActionEvent actionEvent) {
        if (selectAllRooms.isSelected()) {
            roomBox.getCheckModel().checkAll();
        } else {
            roomBox.getCheckModel().clearChecks();
        }
    }

    public void selectAllTimes(ActionEvent actionEvent) {
        if (selectAllTimes.isSelected()) {
            timeslotBox.getCheckModel().checkAll();
        } else {
            timeslotBox.getCheckModel().clearChecks();
        }
    }

    public void goBack() {
        new ChangeScene().goToHomepage(stage);
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}
