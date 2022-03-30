package scheduler;

import courses.CourseController;
import courses.Display;
import courses.DisplayCourse;
import courses.Lecture;
import javafx.beans.Observable;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class SchedulerController implements Initializable {

    private Stage stage;

    private Scene scene;

    private Parent parent;

    @FXML
    private Button add;

    @FXML
    private TableView<DisplayCourse> calendar;

    @FXML
    private Button delete;

    @FXML
    private TableColumn<DisplayCourse, String> fridayColumn;

    @FXML
    private TableColumn<DisplayCourse, String> mondayColumn;

    @FXML
    private TableColumn<DisplayCourse, String> thursdayColumn;

    @FXML
    private TableColumn<DisplayCourse, String> tuesdayColumn;

    @FXML
    private TableColumn<DisplayCourse, String> wednesdayColumn;

    @FXML
    private void switchToCourse(ActionEvent event) throws IOException {
      parent = FXMLLoader.load(getClass().getResource("/resources/fxml/addcourse.fxml"));
      scene = new Scene(parent);
      stage = (Stage)((Node)event.getSource()).getScene().getWindow();
      stage.setScene(scene);
      stage.show();
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {

    }

    /**
     * This method receive the data from the database and insert into the calendar
     * @param givenDisplay the given display object information from the user's input
     */
    public void addCourse(DisplayCourse givenDisplay) {
      DisplayCourse display = new DisplayCourse(givenDisplay.getMonday(), givenDisplay.getTuesday(), givenDisplay.getWednesday(), givenDisplay.getThursday(), givenDisplay.getFriday());
      calendar.getItems().add(display);
    }

    /**
     * This method is to insert a test list of courses into the tableview during initialization.
     * @return a fixed ObservableList
     */
    private ObservableList<DisplayCourse> getCourse() {
        ObservableList<DisplayCourse> test = FXCollections.observableArrayList();
        test.add(new DisplayCourse("Intro to Programming \n" + "131 \n" + "CISC", "", "Intro to Programming \n" + "131 \n" + "CISC", "", "Intro to Programming \n" + "131 \n" + "CISC"));
        test.add(new DisplayCourse("Object-Oriented Programming \n" + "230 \n" + "CISC", "", "Object-Oriented Programming \n" + "230 \n" + "CISC", "", "Object-Oriented Programming \n" + "230 \n" + "CISC"));
        return test;
    }
}
