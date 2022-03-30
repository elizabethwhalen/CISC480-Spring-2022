package scheduler;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.stage.Stage;

import java.io.IOException;

public class SchedulerController {

        private Stage stage;
        private Scene scene;
        private Parent parent;

        @FXML
        private void switchToCourse(ActionEvent event) throws IOException {
                Parent root = FXMLLoader.load(getClass().getResource("/resources/fxml/AddCourse.fxml"));
                stage = (Stage)((Node)event.getSource()).getScene().getWindow();
                scene = new Scene(root);
                stage.setScene(scene);
                stage.show();
        }

        @FXML
        private Button Add;

        @FXML
        private Button Delete;

        @FXML
        private TableColumn<?, ?> Friday;

        @FXML
        private TableColumn<?, ?> Monday;

        @FXML
        private TableColumn<?, ?> Thursday;

        @FXML
        private TableColumn<?, ?> Tuesday;

        @FXML
        private TableColumn<?, ?> Wednesday;

}
