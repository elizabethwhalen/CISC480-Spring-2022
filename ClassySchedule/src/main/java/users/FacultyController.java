package users;

import alert.MyAlert;
import database.DatabaseStatic;
import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ResourceBundle;

public class FacultyController implements Initializable {
    @FXML
    TextField facultyLast;

    @FXML
    TextField facultyFirst;

    @FXML
    TextField facultyID;

    @FXML
    ChoiceBox<String> type;

    @FXML
    Button submitButton;

    @FXML
    Button cancelButton;

    @FXML
    Text firstNameWarning;

    @FXML
    Text lastNameWarning;

    @FXML
    Text IDWarning;

    @FXML
    Text typeWarning;
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
            if (job.get("title_ID") != JSONObject.NULL) {
                //change to ENUM
                type.getItems().add((String) job.get("title_id"));
            }
        }
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    public void submitData(ActionEvent event) {
        if (facultyFirst.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Faculty First Name", "Please Input In The Faculty First Name", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }
        if (facultyLast.getText().isBlank()) {
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
        newFaculty.put("faculty_first", facultyFirst.getText());
        newFaculty.put("faculty_last", facultyLast.getText());
        //newFaculty.put("title_id", type.getValue());

        try {
            database.insertData("faculty", newFaculty);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }



        facultyFirst.clear();
        facultyLast.clear();
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

}
