package homescreen;

import courses.AddCourseToDatabaseController;
import courses.DeleteClassroomFromDatabaseController;
import courses.DeleteCourseFromDatabaseController;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;
import room.RoomController;
import scheduler.SchedulerController;
import users.FacultyController;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 *Controls the homescreen page, which allows the user to navigate to add course, add professor, add classroom, and view
 * schedule pages.
 */
public class HomescreenController implements Initializable {
    @FXML
    public Button addCourse;
    public Button addClassroom;
    public Button addProfessor;

    private Stage homeScreenStage;

    public HomescreenController() {
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
    }


    /**
     * Sets stage to homescreen
     * @param stage
     */
    public void setStage(Stage stage) {
        this.homeScreenStage = stage;
    }

    /**
     * Changes scene to add course page when 'Add Course' button is clicked
     */
    @FXML
    public void addCourseButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            AddCourseToDatabaseController homescreenController = loader.getController();
            homescreenController.setStage(homeScreenStage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        homeScreenStage.setTitle("Classy-Schedule");
        homeScreenStage.setScene(new Scene(root, 600, 400));
        homeScreenStage.show();
    }


    /**
     * Changes scene to add classroom page when 'Add CLassroom' button is clicked
     */
    public void addClassroomButtonClicked(MouseEvent mouseEvent) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/ClassroomNew.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        RoomController roomController = loader.getController();
        roomController.setStage(homeScreenStage);
        homeScreenStage.setScene(new Scene(root, 800, 600));
        homeScreenStage.show();
    }

    /**
     * Changes scene to add professor page when 'Add Professor' button is clicked
     */
    public void addProfessorButtonClicked(MouseEvent mouseEvent) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Professor.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        FacultyController facultyController = loader.getController();
        facultyController.setStage(homeScreenStage);
        homeScreenStage.setScene(new Scene(root, 800, 600));
        homeScreenStage.show();
    }

    public void viewScheduleClicked(MouseEvent mouseEvent) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/scheduler.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        SchedulerController schedulerController = loader.getController();
        schedulerController.setStage(homeScreenStage);
        homeScreenStage.setScene(new Scene(root, 800, 600));
        homeScreenStage.show();
    }

    /**
     * Changes scene to delete course page when 'Delete Course' button is clicked
     */
    @FXML
    public void DeleteCourseButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteCourseFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteCourseFromDatabaseController homeScreenController = loader.getController();
            homeScreenController.setStage(homeScreenStage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        homeScreenStage.setTitle("Classy-Schedule");
        homeScreenStage.setScene(new Scene(root));
        homeScreenStage.show();
    }

    /**
     * Changes scene to delete course page when 'Delete Course' button is clicked
     */
    @FXML
    public void DeleteClassroomButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteClassroomFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteClassroomFromDatabaseController homeScreenController = loader.getController();
            homeScreenController.setStage(homeScreenStage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        homeScreenStage.setTitle("Classy-Schedule");
        homeScreenStage.setScene(new Scene(root));
        homeScreenStage.show();
    }
}
