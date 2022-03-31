package scheduler;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import jfxtras.scene.control.agenda.Agenda;

import java.net.URL;
import java.util.ResourceBundle;

public class DummyController implements Initializable {

    @FXML
    BorderPane borderPane;

    @FXML
    Button addCourseButton;

    @FXML
    Button homeButton;

    @FXML
    Button anotherButton;

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        Agenda agenda = new Agenda();
        //TODO:
        borderPane.setCenter(agenda);
    }

    public DummyController(){}


    public void goToAddCourse(ActionEvent actionEvent) {
    }

    public void goToHomeScreen(ActionEvent actionEvent) {
    }


}
