package courses;

import alert.MyAlert;
import database.Database;
import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import room.RoomController;
import scenes.ChangeScene;
import scheduler.SchedulerController;
import users.DeleteFacultyFromDatabaseController;
import users.FacultyController;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls add course page, which allows the user to add a course to the database.
 */
public class AddCourseToDatabaseController implements Initializable {
    @FXML
    TextField classNum;

    @FXML
    TextField className;

    @FXML
    ChoiceBox<String> deptName;

    @FXML
    Button submit_button;

    @FXML
    Button back_button;

    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();


    public AddCourseToDatabaseController() {}

    /**
     * Retrieves department codes from database for dropdown menu
     * @param url
     * @param resourceBundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        Database database = new Database();

        JSONArray depts = database.getData("dept");
        for (Object jsonObject: depts) {
            JSONObject job = (JSONObject)jsonObject;
            deptName.getItems().add((String) job.get("dept_code"));
        }
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits data that has been entered to the database.
     * @param event submit button clicked
     */
    @FXML
    public void submitData(ActionEvent event) {
        boolean warning = false;
        //checking if user inputs are entered:
        if (deptName.getSelectionModel().isEmpty()) {
            warning = true;
            MyAlert createAlert = new MyAlert("No Department Selected", "Please Select A Department", Alert.AlertType.ERROR);
            Alert alert = createAlert.createAlert();
            alert.showAndWait();
        }
        if (classNum.getText().isBlank()) {
            warning = true;
            MyAlert createAlert = new MyAlert("No Class Number", "Please Select A Class Number", Alert.AlertType.ERROR);
            Alert alert = createAlert.createAlert();
            alert.showAndWait();
        }
        if (className.getText().isBlank()) {
            warning = true;
            MyAlert createAlert = new MyAlert("No Class Name", "Please Select A Class Name", Alert.AlertType.ERROR);
            Alert alert = createAlert.createAlert();
            alert.showAndWait();
        }
        //checking if length of course code is 3 and course code is type int:
        if (classNum.getLength() == 3) {
            try {
                Integer.parseInt(classNum.getText());
            } catch (NumberFormatException e) {
                warning = true;
                MyAlert createAlert = new MyAlert("Invalid ClassNumber", "Please Select A Department", Alert.AlertType.ERROR);
                Alert alert = createAlert.createAlert();
                alert.showAndWait();
            }
        } else {
            warning = true;
            MyAlert createAlert = new MyAlert("Invalid Class Number", "Please Input A Valid Class Number", Alert.AlertType.ERROR);
            Alert alert = createAlert.createAlert();
            alert.showAndWait();
        }

        if (!warning) {

            Database database = new Database();

            JSONObject newClass = new JSONObject();
            newClass.put("dept_code", deptName.getValue());
            newClass.put("class_num", classNum.getText());
            newClass.put("class_name", className.getText());

            try {
                database.insertData("class", newClass);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }

            deptName.setValue("Dept name");
            classNum.clear();
            className.clear();

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
