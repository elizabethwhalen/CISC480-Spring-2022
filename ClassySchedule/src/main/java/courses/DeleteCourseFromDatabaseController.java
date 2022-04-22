package courses;

import database.Database;
import homescreen.HomescreenController;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ChoiceBox;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;
import java.util.ResourceBundle;

public class DeleteCourseFromDatabaseController implements Initializable {

    /**
     * The back button to go back to home screen
     */
    @FXML
    private Button back;

    /**
     * The confirm button to confirm deletion
     */
    @FXML
    private Button confirm;

    /**
     * The course drop-down box to select which course to delete
     */
    @FXML
    private ChoiceBox<String> course;

    /**
     * The department drop-down box to select which dept of courses to delete
     */
    @FXML
    private ChoiceBox<String> dept;

    /**
     * the current stage of this scene
     */
    @FXML
    private Stage stage;

    /**
     * The database connectivity
     */
    Database database = new Database();

    /**
     * Retrieves department codes from database for dropdown menu
     * @param url
     * @param resourceBundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Initialize dropdown boxes with observable database list
        getDept();
        // Whenever the department drop-down is selected call the getCourse function to change
        // and initialize the course drop-down
        dept.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear previous drop-down course
                course.getItems().clear();
                // Set list of new courses from selected department
                getCourses();
            }
        });
        // Initialize back button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        // Set confirmation of confirm button to delete the selected course
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the class, or 'Cancel' to cancel the following action.", false);

    }


    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * confirmButton to delete the selected course. It checks if the drop-down boxes
     * are empty, if not, then it checks for the JSON object of the selected drop-down box of course/dept
     * and call the deleteData function from the Database class to delete the selected course from the database
     */
    private void confirmButton() {
        // If drop-down boxes are not empty
        if (!(course.getSelectionModel().isEmpty()) && !(dept.getSelectionModel().isEmpty())) {
            String selectedClass = course.getValue();
            String selectedDept = dept.getValue();
            //TODO: maybe include section number too for more specific class to delete?
            JSONArray classes = database.getData("class");
            // Iterate through the database class table to find matching selected dept/course for deletion
            for (Object jsonObject: classes) {
                JSONObject job = (JSONObject) jsonObject;
                // If the JSON object to be deleted is equal to the selected course/dept then delete it
                if (job.get("class_name").equals(selectedClass) && job.get("dept_code").equals(selectedDept)) {
                    try {
                        // Delete the class from the database
                        database.deleteData("class", job);
                        // Clear the course department
                        course.getItems().clear();
                        // Set department drop-down back to blank default
                        dept.getSelectionModel().clearSelection();
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
    }

    /**
     * Initialize and grab data from the database to put into the course drop-down box
     */
    private void getCourses() {
        // Variable reference to the selected department
        String selectedDepartment = dept.getValue();
        // Iterate through the class table and grab the selected department classes from the database to the drop-down
        JSONArray classes = database.getData("class");
        for (Object jsonObject: classes) {
            JSONObject job = (JSONObject)jsonObject;
            // If the selected data have the same department as the selected department
            // then add those data courses to the course drop-down
            if (job.get("dept_code").equals(selectedDepartment)) {
                course.getItems().add((String) job.get("class_name"));
            }
        }
    }

    /**
     * return a list of string of departments from the database to pass into the observable list for initialization
     * @return a list of string of department
     */
    private void getDept() {
        // Iterate through the class table and grab the data of department to the department drop-down
        JSONArray department = database.getData("dept");
        for (Object jsonObject: department) {
            JSONObject job = (JSONObject)jsonObject;
            dept.getItems().add((String) job.get("dept_code"));
        }
    }

    /**
     * This method is the back confirmation action. Its parameters are taken into account for different scenarios.
     * Scenarios include going back to the home page or canceling the deletion request which just stays on the same page.
     * @param button the button passed to activate its on-action functionality
     * @param title the title of the alert
     * @param message the message of the alert
     * @param goBackToPrevPage boolean variable to identify different scenario
     */
    private void back(Button button, String title, String message, Boolean goBackToPrevPage) {
        // Initialize the alert for going back to the home screen
        Alert backAlert = new Alert(Alert.AlertType.CONFIRMATION);
        backAlert.setTitle(title);
        backAlert.setContentText(message);
        // If it's to go back to the previous page
        if (goBackToPrevPage) {
            // confirmation action to go back to the previous page
            EventHandler<ActionEvent> confirmBack = new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    // Set button Ok to be the output button that the user clicked
                    // It is either "Cancel" or "Ok"
                    Optional<ButtonType> Ok = backAlert.showAndWait();
                    // If button is "Ok", then go back
                    if (Ok.get().getText().equals("OK")) {
                        // go back to the previous scene with this method
                        goBack();
                    }
                }
            };
            // Set the button to have the above functionality
            button.setOnAction(confirmBack);
        }
        // 2nd scenario, confirm deletion
        else {
            EventHandler<ActionEvent> confirmDelete = new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    // Set button Ok to be the output button that the user clicked
                    // It is either "Cancel" or "Ok"
                    Optional<ButtonType> ok = backAlert.showAndWait();
                    // If button is "Ok", then create information alert to notify successful removal
                    // and go back to home screen
                    if (ok.get().getText().equals("OK")) {
                        confirmButton();
                        Alert alert = new Alert(Alert.AlertType.INFORMATION);
                        alert.setTitle("Deleted");
                        alert.setContentText("The selected course has been deleted.");
                        alert.showAndWait();
                    }
                }
            };
            // Set the button to have the above functionality
            button.setOnAction(confirmDelete);
        }
    }

    /**
     * This method switch scene back to the home screen
     */
    @FXML
    public void goBack() {
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
}
