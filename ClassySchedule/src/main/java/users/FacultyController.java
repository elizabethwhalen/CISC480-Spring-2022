package users;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ResourceBundle;

public class FacultyController implements Initializable {
    @FXML
    TextField firstName;

    @FXML
    TextField lastName;

    @FXML
    TextField facultyID;

    @FXML
    ChoiceBox<String> type;

    /**
     * TODO: use email for professor account
     */
    @FXML
    TextField email;

    @FXML
    Button submitButton;

    @FXML
    Button cancelButton;

    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    public FacultyController() {}

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

        JSONArray types = DatabaseStatic.getData("title");
        for (Object jsonObject: types) {

            JSONObject job = (JSONObject)jsonObject;
            if (job.get("title_id") != JSONObject.NULL) {
                //change to ENUM
                type.getItems().add(String.valueOf(job.get("title_id")));
            }
        }
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    public void submitData(ActionEvent event) {
        if (firstName.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Faculty First Name", "Please Input In The Faculty First Name", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }
        if (lastName.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Faculty Last Name", "Please Input In The Faculty Last Name", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }
        if (facultyID.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Faculty ID", "Please Input In The Faculty ID", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }
        if (type.getSelectionModel().isEmpty()) {
            MyAlert createAlert = new MyAlert("Invalid Faculty Type", "Please Input In The Faculty Type", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }

        // ID number validation
        try {
            Integer.parseInt(facultyID.getText());
        } catch (NumberFormatException e) {
            MyAlert createAlert = new MyAlert("Invalid Faculty ID Number", "Please Input In A Valid Faculty ID", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }

        JSONObject newFaculty = new JSONObject();
        newFaculty.put("faculty_id", facultyID.getText());
        newFaculty.put("faculty_first", firstName.getText());
        newFaculty.put("faculty_last", lastName.getText());
        //newFaculty.put("title_id", type.getValue());

        try {
            DatabaseStatic.insertData("faculty", newFaculty);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }



        firstName.clear();
        lastName.clear();
        facultyID.clear();
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

    @FXML
    public void cancelButtonClicked() {
        goBack();
    }
}
