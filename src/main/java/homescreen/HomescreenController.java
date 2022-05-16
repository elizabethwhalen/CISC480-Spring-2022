package homescreen;

import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import scenes.ChangeScene;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.stage.Stage;

import java.net.URL;
import java.util.ResourceBundle;



/**
 *Controls the homescreen page, which allows the user to navigate to add course, add professor, add classroom, and view
 * schedule pages.
 */
public class HomescreenController implements Initializable {
    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * The constructor, since it implements initializable, the constructor is unused
     */
    public HomescreenController() {}

    /**
     * Initializes the scene
     * @param location the url of the fxml file
     * @param resources the resource bundle of the fxml file
     */
    @Override
    public void initialize(URL location, ResourceBundle resources) {}

    /**
     * Goes back to the homescreen
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
     * Goes to the generate schedule page
     */
    @FXML
    public void goToGenerateSchedule() { cs.goToGenerateSchedule(stage);}

    /**
     * Sets stage to homescreen
     * @param stage
     */
    @FXML
    public ImageView imageView;
    public void setStage(Stage stage) {
        this.stage = stage;
        Image logo = new Image("main/java/images/ClassyScheduler.png");
        imageView.setImage(logo);
    }

}
