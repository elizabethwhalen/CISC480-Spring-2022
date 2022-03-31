package homescreen;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;


        import courses.AddCourseToDatabaseController;

/**
 *Controls the homescreen page, which allows the user to navigate to add course, add professor, add classroom, and view
 * schedule pages.
 */
public class HomescreenController implements Initializable {
    @FXML
    public Button addCourse;
    public Button addClassroom;
    public Button addProfessor;

    private Stage homescreenStage;

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
        this.homescreenStage = stage;
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
            homescreenController.setStage(homescreenStage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        homescreenStage.setTitle("Classy-Schedule");
        homescreenStage.setScene(new Scene(root, 600, 400));
        homescreenStage.show();
    }


    /**
     * Changes scene to add classroom page when 'Add CLassroom' button is clicked
     */
    public void addClassroomButtonClicked(MouseEvent mouseEvent) {
        try {
            Parent root = FXMLLoader.load(getClass().getResource("/resources/fxml/ClassroomNew.fxml"));
            homescreenStage = (Stage) ((Node) mouseEvent.getSource()).getScene().getWindow();
            Scene scene = new Scene(root);
            homescreenStage.setScene(scene);
            homescreenStage.show();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Changes scene to add professor page when 'Add Professor' button is clicked
     */
    public void addProfessorButtonClicked(MouseEvent mouseEvent) {
        try {
            Parent root = FXMLLoader.load(getClass().getResource("/resources/fxml/Professor.fxml"));
            homescreenStage = (Stage) ((Node) mouseEvent.getSource()).getScene().getWindow();
            Scene scene = new Scene(root);
            homescreenStage.setScene(scene);
            homescreenStage.show();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
