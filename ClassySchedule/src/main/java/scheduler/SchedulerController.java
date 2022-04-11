package scheduler;

import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import jfxtras.scene.control.agenda.Agenda;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

// TODO: Add comments, persist appointments
public class SchedulerController implements Initializable {

    /**
     * The border pane
     */
    @FXML
    BorderPane borderPane;

    /**
     * The button to add the course
     */
    @FXML
    Button addCourseButton;

    /**
     * The home button
     */
    @FXML
    Button homeButton;

    /**
     * Another button for possible future functionality
     */
    @FXML
    Button anotherButton;

    /**
     * The stage
     */
    Stage stage;

    /**
     * The agenda to manipulate
     */
    Agenda agenda;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        this.agenda = new Agenda();
        borderPane.setCenter(agenda);
    }

    /**
     * Opens the popup dialog
     * @param actionEvent
     * @throws IOException
     */
    @FXML
    public void goToAddCourse(ActionEvent actionEvent) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToSchedule.fxml"));
        Stage stage = new Stage();
        stage.initOwner(addCourseButton.getScene().getWindow());
        stage.setScene(new Scene((Parent) loader.load()));
        AddCourseToScheduleController controller = loader.getController();
        controller.setParent(this);

        // showAndWait will block execution until the window closes...
        stage.showAndWait();
    }

    /**
     * Returns to the homescreen
     * @param actionEvent
     */
    @FXML
    public void goToHomeScreen(ActionEvent actionEvent) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Homescreen.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        HomescreenController hsController = loader.getController();
        hsController.setStage(stage);
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root, 650, 450));
        stage.show();
    }

    /**
     * Sets the stage
     * @param stage the stage to be set
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * This method receive the data from the user and insert into the calendar
     * @param appointments the created appoints to add to the scheduler
     */
    public void addCourse(List<Agenda.Appointment> appointments) {
        agenda.appointments().addAll(appointments);
    }

}
