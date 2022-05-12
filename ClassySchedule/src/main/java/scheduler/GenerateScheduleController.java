package scheduler;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.MenuButton;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.CustomMenuItem;
import javafx.scene.control.MenuItem;
import javafx.scene.control.Alert.AlertType;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;
import algorithm.AlgoTestClass;

public class GenerateScheduleController implements Initializable {

    @FXML
    private MenuButton courseBox;

    @FXML
    private MenuButton roomBox;

    @FXML
    private MenuButton professorBox;

    @FXML
    private MenuButton timeslotBox;

    @FXML
    private Button backButton;

    @FXML
    private Button generateButton;

    private Stage stage;

    private List<Object> courses;

    private List<Object> professors;

    private List<Object> rooms;

    private List<Object> timeslots;


    public GenerateScheduleController() {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        JSONArray courses = DatabaseStatic.getData("class");
        JSONArray rooms = DatabaseStatic.getData("room");
        JSONArray professors = DatabaseStatic.getData("faculty");

        for (Object course : courses) {
            JSONObject crs = (JSONObject) course;
            CheckBox menuItem = new CheckBox();
            menuItem.setText((String)crs.get("class_name"));
            CustomMenuItem customMenuItem = new CustomMenuItem(menuItem);
            customMenuItem.setHideOnClick(false);
            customMenuItem.setOnAction(a -> {
                this.courses.add(customMenuItem);
            });
            courseBox.getItems().add(customMenuItem);
        }
        for (Object room : rooms) {
            JSONObject rm = (JSONObject) room;
            CheckBox checkBox = new CheckBox();
            checkBox.setText(rm.get("building_code") + " " + rm.get("room_num"));
            CustomMenuItem customMenuItem = new CustomMenuItem(checkBox);
            customMenuItem.setHideOnClick(false);
            customMenuItem.setOnAction(a -> {
                this.rooms.add(customMenuItem);
            });
            roomBox.getItems().add(customMenuItem);
        }
        for (Object professor : professors) {
            JSONObject prof = (JSONObject) professor;
            CheckBox checkBox = new CheckBox();
            checkBox.setText(prof.get("faculty_first") + " " + prof.get("faculty_last"));
            CustomMenuItem customMenuItem = new CustomMenuItem(checkBox);
            customMenuItem.setHideOnClick(false);
            customMenuItem.setOnAction(a -> {
                this.professors.add(customMenuItem);
            });
            professorBox.getItems().add(customMenuItem);
        }

        TimeSlotFactory timeSlotList = new TimeSlotFactory();
        List<Timeslot> listOfTimes = timeSlotList.createTimeSlot();
        for (Timeslot timeslot : listOfTimes) {
            CheckBox checkBox = new CheckBox();
            checkBox.setText(timeslot.toString());
            CustomMenuItem customMenuItem = new CustomMenuItem(checkBox);
            customMenuItem.setHideOnClick(false);
            customMenuItem.setOnAction(a -> {
                this.timeslots.add(customMenuItem);
            });
            timeslotBox.getItems().add(customMenuItem);
        }
    }


    @FXML
    private void generateSchedule() {
        if (!(validateRooms() && validateCourses() && validateProfessors() && validateTimeslots())) {
            new MyAlert("Invalid Selection", "Please select at least one room, professor, course, and timeslot", AlertType.WARNING);
        } else {
            AlgoTestClass test = new AlgoTestClass();
           // List<Object> te = test.algorithm(professors, courses, rooms, timeslots);
 //           List<> something = algorithm(professorBox.getItems(), courseBox.getItems(),roomBox.getItems(), timeslotBox.getItems());
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

    private boolean validateChoices(MenuButton menu) {
        boolean oneSelected = false;
        int i = 0;
        while (i < menu.getItems().size() && !oneSelected) {
            CustomMenuItem cmi = (CustomMenuItem) menu.getItems().get(i);
            CheckBox box = (CheckBox) cmi.getContent();
            if (box.isSelected()) {
                oneSelected = true;
            }
        }
        return oneSelected;
    }

    @FXML
    private void goBack() {
        new ChangeScene().goToHomepage(stage);
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}
