package scheduler;

import database.DatabaseStatic;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.MenuButton;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Button;
import javafx.scene.control.CustomMenuItem;

import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URL;
import java.util.ResourceBundle;

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

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        JSONArray courses = DatabaseStatic.getData("class");
        JSONArray rooms = DatabaseStatic.getData("room");
        JSONArray professors = DatabaseStatic.getData("faculty");
        JSONArray timeslots = DatabaseStatic.getData("timeslot");

        for (Object course : courses) {
            JSONObject crs = (JSONObject) course;
            CheckBox menuItem = new CheckBox();
            menuItem.setText((String)crs.get("class_name"));
            CustomMenuItem customMenuItem = new CustomMenuItem(menuItem);
            customMenuItem.setHideOnClick(false);
            courseBox.getItems().add(customMenuItem);
        }
        for (Object room : rooms) {
            JSONObject rm = (JSONObject) room;
            CheckBox checkBox = new CheckBox();
            checkBox.setText(rm.get("building_code") + " " + rm.get("room_num"));
            CustomMenuItem customMenuItem = new CustomMenuItem(checkBox);
            customMenuItem.setHideOnClick(false);
            roomBox.getItems().add(customMenuItem);
        }
        for (Object professor : professors) {
            JSONObject prof = (JSONObject) professor;
            CheckBox checkBox = new CheckBox();
            checkBox.setText(prof.get("faculty_first") + " " + prof.get("faculty_last"));
            CustomMenuItem customMenuItem = new CustomMenuItem(checkBox);
            customMenuItem.setHideOnClick(false);
            professorBox.getItems().add(customMenuItem);
        }

        //TODO: Get timeslots from !zack
        for (Object timeslot : timeslots) {
            JSONObject ts = (JSONObject) timeslot;
            CheckBox menuItem = new CheckBox();
            menuItem.setText((String)ts.get("time_start"));
            CustomMenuItem customMenuItem = new CustomMenuItem(menuItem);
            customMenuItem.setHideOnClick(false);
            timeslotBox.getItems().add(customMenuItem);
        }
    }


    @FXML
    private void generateSchedule() {

    }

    @FXML
    private void goBack() {

    }


    public GenerateScheduleController() {}

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}
