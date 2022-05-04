package room;

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

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls the add room page, which allows a user to add a classroom to the database
 */
public class RoomController implements Initializable {
    @FXML
    ChoiceBox<String> deptName;

    @FXML
    ChoiceBox<String> type;

    @FXML
    TextField roomNum;

    @FXML
    ChoiceBox<String> buildingCode;

    @FXML
    ChoiceBox<String> campusID;

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

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        deptName.getItems().add("CISC");
        deptName.getItems().add("STAT");

        buildingCode.getItems().add("OSS");
        buildingCode.getItems().add("OWS");
        campusID.getItems().add("St. Paul");

    }

    //May use in the future to reach into database for room options
    /*@Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
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
    }*/

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits data that has been entered when submit button is clicked.
     * @param event submit button being clicked
     */
    @FXML
    public void submitData(ActionEvent event) {

        if (campusID.getSelectionModel().isEmpty()) {
            campusWarning.setVisible(true);
            return;
        }
        if (roomNum.getText().isBlank()) {
            roomWarning.setVisible(true);
            return;
        }
        if (buildingCode.getSelectionModel().isEmpty()) {
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

        //made it to the end of validation, send to database and then clear fields
        //TODO: Send course to database instead of text file
        File file = new File("testroom.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Campus: " + campusID.getValue() + " building: " + buildingCode.getValue() + " Room number: " + roomNum.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        campusID.setValue(null);
        roomNum.clear();
        buildingCode.setValue(null);
        roomWarning.setVisible(false);
        buildingWarning.setVisible(false);
        campusWarning.setVisible(false);
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
