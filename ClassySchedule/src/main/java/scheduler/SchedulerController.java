package scheduler;

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

    @FXML
    BorderPane borderPane;

    @FXML
    Button addCourseButton;

    @FXML
    Button homeButton;

    @FXML
    Button anotherButton;

    Stage stage;

    Agenda agenda;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        this.agenda = new Agenda();
        borderPane.setCenter(agenda);
    }

    @FXML
    public void goToAddCourse(ActionEvent actionEvent) throws IOException {
//        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToSchedule.fxml"));
//        Parent root = loader.load();
//        AddCourseToScheduleController schedulerController = loader.getController();
//        schedulerController.setStage(stage);
//        stage.setTitle("Classy-Schedule");
//        stage.setScene(new Scene(root, 600, 450));
//        stage.show();

        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToSchedule.fxml"));
        Stage stage = new Stage();
        stage.initOwner(addCourseButton.getScene().getWindow());
        stage.setScene(new Scene((Parent) loader.load()));
        AddCourseToScheduleController controller = loader.getController();
        controller.setParent(this);

        // showAndWait will block execution until the window closes...
        stage.showAndWait();


    }

    @FXML
    public void goToHomeScreen(ActionEvent actionEvent) throws IOException {
//        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Homescreen.fxml"));
//        Parent root = loader.load();
//        HomescreenController hsController = loader.getController();
//        hsController.setStage(stage);
//        stage.setTitle("Classy-Schedule");
//        stage.setScene(new Scene(root, 600, 450));
//        stage.show();
    }

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
