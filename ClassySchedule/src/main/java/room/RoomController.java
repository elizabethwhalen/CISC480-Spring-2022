package room;

import database.Database;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import homescreen.HomescreenController;
import scenes.ChangeScene;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls the add room page, which allows a user to add a classroom to the database
 */
public class RoomController implements Initializable {

    private Stage addRoom;
    private Scene scene;
    private Parent root;
    @FXML
    ChoiceBox<String> deptName;

    @FXML
    ChoiceBox<String> type;

    @FXML
    TextField roomNum;

    @FXML
    ChoiceBox<String> buildingName;

    @FXML
    TextField capacity;

    @FXML
    Button submitButton;

    @FXML
    Button cancelButton;

    @FXML
    Text roomWarning;

    @FXML
    Text buildingWarning;

    @FXML
    Text campusWarning;

    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();


    public RoomController() {}

    Text capacityWarning;

    //May use in the future to reach into database for room options
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        buildingName.getItems().clear();
        try {
            Database database = new Database();
            JSONArray rs = database.getData("building");
            for (Object jsonObject: rs) {
                //buildingName.getItems().add(rs.getString(1));
                JSONObject job = (JSONObject)jsonObject;
                buildingName.getItems().add((String) job.get("building_code"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits data that has been entered when submit button is clicked.
     * @param event submit button being clicked
     */
    @FXML
    public void submitData(ActionEvent event) {

        if (capacity.getText().isEmpty()) {
            capacityWarning.setVisible(true);
            return;
        }
        if (roomNum.getText().isBlank()) {
            roomWarning.setVisible(true);
            return;
        }
        if (buildingName.getSelectionModel().isEmpty()) {
            buildingWarning.setVisible(true);
            return;
        }

        // room number validation
        try {
            if(roomNum.getLength() == 3) {
                Integer.parseInt(roomNum.getText());
            } else {
                roomWarning.setVisible(true);
            }
        } catch (NumberFormatException e) {
            roomWarning.setVisible(true);
            return;
        }

        Database database = new Database();

        JSONObject newRoom = new JSONObject();
        newRoom.put("room_num", roomNum.getText());
        newRoom.put("building_code", buildingName.getValue());
        newRoom.put("capacity", capacity.getText());

        try {
            database.insertData("room", newRoom);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }



        capacity.clear();
        roomNum.clear();
        buildingName.setValue(null);
        roomWarning.setVisible(false);
        buildingWarning.setVisible(false);
        capacityWarning.setVisible(false);
    }

    /**
     * go back to homepage
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
