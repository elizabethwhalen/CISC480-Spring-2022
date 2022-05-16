package users;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import java.net.URL;
import java.util.ResourceBundle;
import org.json.JSONObject;
import scenes.ChangeScene;

/**
 * The controller for adding faculty to the database
 */
public class FacultyController implements Initializable {
    /**
     * The first name of the faculty
     */
    @FXML
    TextField firstName;

    /**
     * The last name of the faculty
     */
    @FXML
    TextField lastName;

    /**
     * The faculty ID
     */
    @FXML
    TextField facultyId;

    /**
     * The submit button
     */
    @FXML
    Button submitButton;

    /**
     * The cancel button
     */
    @FXML
    Button cancelButton;

    /**
     * The stage for this scene
     */
    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * The constructor for this controller. Since this class implements
     * initializable, the constructor is empty.
     */
    public FacultyController() {}

    /**
     * This method initializes the scene and the required elements
     * @param url the url of the fxml file
     * @param resourceBundle the resource bundle to be used in this scene
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

    }

    /**
     * Sets the stage of this scene
     * @param stage the stage to use for this scene
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits the request faculty to the database
     */
    @FXML
    public void submitData() {
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
        if (facultyId.getText().isBlank()) {
            MyAlert createAlert = new MyAlert("Invalid Faculty ID", "Please Input In The Faculty ID", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }

        // ID number validation
        try {
            Integer.parseInt(facultyId.getText());
        } catch (NumberFormatException e) {
            MyAlert createAlert = new MyAlert("Invalid Faculty ID Number", "Please Input In A Valid Faculty ID", Alert.AlertType.ERROR);
            createAlert.show();
            return;
        }

        JSONObject newFaculty = new JSONObject();
        newFaculty.put("faculty_id", Integer.parseInt(facultyId.getText()));
        newFaculty.put("faculty_first", firstName.getText());
        newFaculty.put("faculty_last", lastName.getText());
        newFaculty.put("title_id", 2);
        DatabaseStatic.insertData("faculty", newFaculty);


        MyAlert createAlert = new MyAlert("Insertion Complete", "The faculty member has been added", Alert.AlertType.INFORMATION);
        createAlert.show();

        firstName.clear();
        lastName.clear();
        facultyId.clear();

    }

    /**
     * Goes to the homepage
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

    /**
     * Goes to the homepage
     */
    @FXML
    public void cancelButtonClicked() {
        goBack();
    }
}
