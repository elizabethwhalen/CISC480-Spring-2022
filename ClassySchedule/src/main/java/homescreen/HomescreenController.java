package homescreen;

import scenes.ChangeScene;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.MenuItem;
import javafx.stage.Stage;

import java.net.URL;
import java.util.ResourceBundle;

/**
 *Controls the homescreen page, which allows the user to navigate to add course, add professor, add classroom, and view
 * schedule pages.
 */
public class HomescreenController implements Initializable {
    private Stage stage;

    public HomescreenController() {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {}


    /**
     * go to add course scene
     */
    @FXML
    public void goToAddCourse() {
        ChangeScene cs = new ChangeScene();
        cs.addCourseButtonClicked(stage);
    }

    /**
     * go to add classroom scene
     */
    @FXML
    public void goToAddClassroom() {
        ChangeScene cs = new ChangeScene();
        cs.addClassroomButtonClicked(stage);
    }

    /**
     * go to add faculty scene
     */
    @FXML
    public void goToAddFaculty() {
        ChangeScene cs = new ChangeScene();
        cs.addProfessorButtonClicked(stage);
    }

    /**
     * go to delete course scene
     */
    @FXML
    public void goToDeleteCourse() {
        ChangeScene cs = new ChangeScene();
        cs.deleteCourseButtonClicked(stage);
    }

    /**
     * go to delete classroom scene
     */
    @FXML
    public void goToDeleteClassroom() {
        ChangeScene cs = new ChangeScene();
        cs.deleteClassroomButtonClicked(stage);
    }

    /**
     * go to delete faculty scene
     */
    @FXML
    public void goToDeleteFaculty() {
        ChangeScene cs = new ChangeScene();
        cs.deleteFacultyButtonClicked(stage);
    }

    /**
     * go to view schedule scene
     */
    @FXML
    public void goToViewSchedule() {
        ChangeScene cs = new ChangeScene();
        cs.viewScheduleClicked(stage);
    }

    /**
     * Sets stage to homescreen
     * @param stage
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

}
