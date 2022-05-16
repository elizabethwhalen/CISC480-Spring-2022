package courses;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls add course page, which allows the user to add a course to the database.
 */
public class AddCourseToDatabaseController implements Initializable {
    @FXML
    private TextField classNum;

    @FXML
    private TextField className;

    @FXML
    private TextField sectionNum;

    @FXML
    private TextField deptName;

    @FXML
    private Button submitButton;

    @FXML
    private Button backButton;

    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * The constructor for the AddCourseToDatabaseController
     * Not used because class implements initializable
     */
    public AddCourseToDatabaseController() {}

    /**
     * Retrieves department codes from database for dropdown menu
     * @param url the url of the fxml
     * @param resourceBundle the resource bundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

    }

    /**
     * Sets the stage for the class
     * @param stage the stage to set
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits data that has been entered to the database.
     */
    @FXML
    public void submitData() {
        boolean warning = false;
        //checking if user inputs are entered:
        if (deptName.getText().isBlank()) {
            warning = true;
            new MyAlert("No Department Selected", "Please Select A Department",
                    Alert.AlertType.ERROR).show();
        }
        if (classNum.getText().isBlank()) {
            warning = true;
            new MyAlert("No Class Number", "Please Select A Class Number",
                    Alert.AlertType.ERROR).show();
        }
        if (className.getText().isBlank()) {
            warning = true;
            new MyAlert("No Class Name", "Please Select A Class Name",
                    Alert.AlertType.ERROR).show();
        }

        //checking if length of course code is 3 and course code is type int:
        if (classNum.getLength() == 3) {
            try {
                Integer.parseInt(classNum.getText());
            } catch (NumberFormatException e) {
                warning = true;
                new MyAlert("Invalid ClassNumber", "Please select a department",
                        Alert.AlertType.ERROR).show();
            }
        } else {
            warning = true;
            new MyAlert("Invalid Class Number",
                    "Please Input A Valid Class Number", Alert.AlertType.ERROR).show();
        }

        if (sectionNum.getLength() == 1) {
            try {
                Integer.parseInt(sectionNum.getText());
            } catch (NumberFormatException e) {
                warning = true;
                new MyAlert("Invalid section number", "Section must be a number",
                        Alert.AlertType.ERROR).show();
            }
        } else {
            warning = true;
            new MyAlert("Invalid section Number", "Section number must be 2 or less digits",
                    Alert.AlertType.ERROR).show();
        }
        if (!warning) {

            // Creates the new class
            JSONObject newClass = new JSONObject();
            newClass.put("dept_code", deptName.getText());
            newClass.put("class_num", classNum.getText());
            newClass.put("class_name", className.getText());
            // Sends the new class to the database
            boolean createdNewCourse = DatabaseStatic.insertData("class", newClass);

            if (!createdNewCourse) {
                // assume dept does not exist, create a new one
                JSONObject newDept = new JSONObject();
                newDept.put("dept_code", deptName.getText());
                DatabaseStatic.insertData("dept", newDept);
                DatabaseStatic.insertData("class", newClass);
            }
            // Creates the section
            JSONObject newSection = new JSONObject();
            newSection.put("dept_code", deptName.getText());
            newSection.put("class_num", classNum.getText());
            newSection.put("section_num", Integer.parseInt(sectionNum.getText()));
            newSection.put("semester", "Spring2022");
            newSection.put("draft", 1);
            newSection.put("capacity", 30);
            // Sends the section to the database
            DatabaseStatic.insertData("section", newSection);

            // Clears the values of the inputs
            MyAlert createAlert = new MyAlert("Insertion Complete", "The class has been added to the database", Alert.AlertType.INFORMATION);
            createAlert.show();

            deptName.clear();
            classNum.clear();
            className.clear();
            sectionNum.clear();

        }
    }

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
