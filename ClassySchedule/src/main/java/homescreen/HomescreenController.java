package homescreen;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;


        import courses.CourseController;
        import homescreen.HomescreenController;
        import javafx.fxml.FXML;
        import javafx.fxml.FXMLLoader;
        import javafx.fxml.Initializable;
        import javafx.scene.Parent;
        import javafx.scene.Scene;
        import javafx.scene.control.Button;
        import javafx.scene.control.TextField;
        import javafx.stage.Stage;

        import java.io.IOException;
        import java.net.URL;
        import java.util.ResourceBundle;

/**
 *
 */
public class HomescreenController implements Initializable {
    @FXML
    public Button addcourse;
    public Button addclassroom;
    public Button addprofessor;

    private Stage homescreenStage;

    public HomescreenController() {}


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


    @FXML
    public void addcourseButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/addcourse.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            CourseController homescreenController = loader.getController();
            homescreenController.setStage(homescreenStage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        homescreenStage.setTitle("Classy-Schedule");
        homescreenStage.setScene(new Scene(root, 600, 400));
        homescreenStage.show();
    }

    public void addclassroomButtonClicked(MouseEvent mouseEvent) {
    }

    public void addprofessorButtonClicked(MouseEvent mouseEvent) {
    }
}
