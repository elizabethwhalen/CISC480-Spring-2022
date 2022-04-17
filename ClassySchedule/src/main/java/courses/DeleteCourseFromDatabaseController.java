package courses;

import database.Database;
import homescreen.HomescreenController;
import javafx.collections.FXCollections;
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
import jfxtras.scene.control.agenda.Agenda;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.sql.SQLOutput;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
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
     * Retrieves department codes from database for dropdown menu
     * @param url
     * @param resourceBundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Initialize dropdown boxes with observable database list
        dept.setItems(FXCollections.observableArrayList(getDept()));
        course.setItems(FXCollections.observableArrayList(getCourses()));
        // Initialize back button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);

    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * confirmButton to delete the selected course. It checks if the drop-down boxes
     * are empty, if not, then it checks for the JSON object of the selected drop-down box of course/dept
     * and call the deleteData function from the Database class to delete the selected course from the database
     */
    @FXML
    private void confirmButton() {
        // Connect to db
        Database database = new Database();
        // If drop-down boxes are not empty
        if (!(course.getSelectionModel().isEmpty()) && !(dept.getSelectionModel().isEmpty())) {
            // Set confirmation of confirm button to delete the selected course
            back(confirm, "Confirm Deletion", "Click 'OK' to delete the class, or 'Cancel' to cancel the following action.", false);
            String selectedClass = course.getValue();
            String selectedDept = dept.getValue();
            JSONArray classes = database.getData("class");
            // Iterate through the database class table to find matching selected dept/course for deletion
            for (Object jsonObject: classes) {
                JSONObject job = (JSONObject) jsonObject;
                // If the JSON object to be deleted is equal to the selected course/dept then delete it
                if (job.get("class_name").equals(selectedClass) && job.get("dept_code").equals(selectedDept)) {
                    try {
                        database.deleteData("class", job);
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                //TODO: alert button for mismatching dept and course
                /*else {
                    course.getItems().clear();
                    dept.getItems().clear();
                    Alert classNotInDept = new Alert(Alert.AlertType.ERROR);
                    classNotInDept.setTitle("Error Alert");
                    classNotInDept.setContentText("The selected class is not in the selected department or vice versa");
                    classNotInDept.showAndWait();
                } */
            }
        }
    }

    /**
     * return a list of string of courses from the database to pass into the observable list for initialization
     * @return a list of string of courses
     */
    private List<String> getCourses() {
        // Connect to db
        Database database = new Database();
        List<String> courses = new ArrayList<>();
        // Iterate through the classes data and add its info to the dropdown options
        JSONArray classes = database.getData("class");
        for (Object jsonObject: classes) {
            JSONObject job = (JSONObject)jsonObject;
            courses.add((String) job.get("class_name"));
        }
        return courses;
    }

    /**
     * return a list of string of departments from the database to pass into the observable list for initialization
     * @return a list of string of department
     */
    private List<String> getDept() {
        // Connect to the db
        Database database = new Database();
        List<String> dept = new ArrayList<>();
        // Iterate through the classes data and add its info to the dropdown options
        JSONArray department = database.getData("dept");
        for (Object jsonObject: department) {
            JSONObject job = (JSONObject)jsonObject;
            dept.add((String) job.get("dept_code"));
        }
        return dept;
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
                        Alert alert = new Alert(Alert.AlertType.INFORMATION);
                        alert.setTitle("Deleted");
                        alert.setContentText("The selected course has been deleted. You will be sent back to the home screen.");
                        alert.showAndWait();
                        goBack();
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
