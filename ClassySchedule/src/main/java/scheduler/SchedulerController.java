package scheduler;
import courses.CourseController;
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
        private void switchToCourse(ActionEvent event) throws IOException {
                parent = FXMLLoader.load(getClass().getResource("/resources/fxml/addcourse.fxml"));
                scene = new Scene(parent);
                stage = (Stage)((Node)event.getSource()).getScene().getWindow();
                stage.setScene(scene);
                stage.show();
        }


        @FXML
        private Button add;

        @FXML
        private TableView<Lecture> calendar;

        @FXML
        private Button delete;

        @FXML
        private TableColumn<Lecture, String> friday;

        @FXML
        private TableColumn<Lecture, String> monday;

        @FXML
        private TableColumn<Lecture, String>thursday;

        @FXML
        private TableColumn<Lecture, String> tuesday;

        @FXML
        private TableColumn<Lecture, String> wednesday;


        @Override
        public void initialize(URL location, ResourceBundle resources) {
        }

        // This method, after receiving the lecture(class) data from the addCourse controller will take
        // the given inputs and insert it into the calendar.
        public void addCourse(Lecture lecture) {
                calendar = new TableView<Lecture>();
                final ObservableList<Lecture> test = FXCollections.observableArrayList(
                        new Lecture("Intro to Programming", 131, "CISC"),
                        new Lecture("Object-Oriented", 230, "CISC"),
                        new Lecture("Data Structure", 231, "CISC")
                );

                calendar.setItems(test);
                calendar.getColumns().addAll(monday, tuesday, wednesday, thursday, friday);
                //Monday.getColumns().add("here");
        }
}
