package room;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import scenes.ChangeScene;
import org.json.JSONObject;

import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls the add room page, which allows a user to add a classroom to the database
 */
public class RoomController implements Initializable {

    /**
     * The room number
     */
    @FXML
    private TextField roomNum;

    /**
     * The building code
     */
    @FXML
    private TextField buildingCode;

    /**
     * The capacity
     */
    @FXML
    private TextField capacity;

    /**
     * The submit button
     */
    @FXML
    private Button submitButton;

    /**
     * The cancel button
     */
    @FXML
    private Button cancelButton;

    /**
     * The stage for this scene
     */
    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * The constructor for this class
     * Because this class implements initializable the
     * constructor is left empty
     */
    public RoomController() {}

    /**
     * Initializes the room controller
     * @param url the url of the fxml
     * @param resourceBundle the resource bundle for this scene
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

    }

    /**
     * Sets the stage for this scene
     * @param stage the stage to be used
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits data that has been entered when submit button is clicked.
     */
    @FXML
    public void submitData() {

        if (capacity.getText().isEmpty()) {
            MyAlert createAlert = new MyAlert("Invalid Capacity", "Please Input In The Capacity", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }
        if (roomNum.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Room Number", "Please Input In The Room Number", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }
        if (buildingCode.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Building Name", "Please Select A Building", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }

        // room number validation
        try {
            if(roomNum.getLength() == 3) {
                Integer.parseInt(roomNum.getText());
            } else {
                MyAlert createAlert = new MyAlert("Invalid Room Number Length", "Please Input In A Valid Room Number Length", Alert.AlertType.ERROR);
                createAlert.show();
                return;
            }
        } catch (NumberFormatException e) {
            MyAlert createAlert = new MyAlert("Invalid Room Number Type", "Please Input In A Valid Room Number", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }


        JSONObject newRoom = new JSONObject();
        newRoom.put("room_num", roomNum.getText());
        newRoom.put("building_code", buildingCode.getText());
        newRoom.put("capacity", capacity.getText());

        boolean inserted = DatabaseStatic.insertData("room", newRoom);

        if (!inserted) {
            //assume there is no building associated with the specified
            JSONObject newBuilding = new JSONObject();
            newBuilding.put("building_code", buildingCode.getText());
            DatabaseStatic.insertData("building", newBuilding);
            DatabaseStatic.insertData("room", newRoom);
        }

        MyAlert createAlert = new MyAlert("Insertion Completed", "The classroom has been added", Alert.AlertType.INFORMATION);
        createAlert.show();
        capacity.clear();
        roomNum.clear();
        buildingCode.clear();

    }

    /**
     * Goes back to the homepage
     */
    @FXML
    public void goBack() {
        cs.goToHomepage(stage);
    }

    /**
     * go to add course scene
     */
    @FXML
    public void goToAddCourse() {
        cs.addCourseButtonClicked(stage);
    }

    /**
     * go to add classroom scene
     */
    @FXML
    public void goToAddClassroom() {
        cs.addClassroomButtonClicked(stage);
    }

    /**
     * go to add faculty scene
     */
    @FXML
    public void goToAddFaculty() {
        cs.addProfessorButtonClicked(stage);
    }

    /**
     * go to edit course scene
     */
    @FXML
    public void goToEditCourse() { cs.editCourseButtonClicked(stage); }

    /**
     * go to edit faculty scene
     */
    @FXML
    public void goToEditFaculty() { cs.editFacultyButtonClicked(stage); }

    /**
     * go to edit classroom scene
     */
    @FXML
    public void goToEditClassroom() { cs.editClassroomButtonClicked(stage); }

    /**
     * go to delete course scene
     */
    @FXML
    public void goToDeleteCourse() {
        cs.deleteCourseButtonClicked(stage);
    }

    /**
     * go to delete classroom scene
     */
    @FXML
    public void goToDeleteClassroom() {
        cs.deleteClassroomButtonClicked(stage);
    }

    /**
     * go to delete faculty scene
     */
    @FXML
    public void goToDeleteFaculty() {
        cs.deleteFacultyButtonClicked(stage);
    }

    /**
     * go to view schedule scene
     */
    @FXML
    public void goToViewSchedule() {
        cs.viewScheduleClicked(stage);
    }
}
