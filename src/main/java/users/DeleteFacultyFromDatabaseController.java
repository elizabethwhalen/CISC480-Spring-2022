package users;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.Initializable;
import javafx.scene.chart.PieChart;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import javafx.fxml.FXML;
import org.controlsfx.control.CheckComboBox;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;

public class DeleteFacultyFromDatabaseController implements Initializable {

    /**
     * The back button
     */
    @FXML
    private Button back;

    /**
     * The confirmation button
     */
    @FXML
    private Button confirm;

    /**
     * The drop down faculty list
     */
    @FXML
    private CheckComboBox<String> faculty;

    /**
     * The list of faculty from the database
     */
    List<Faculty> professors;

    /**
     * The stage this scene uses
     */
    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        populateProfessors();
        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the faculty, or 'Cancel' to cancel the following action.", false);
    }

    /**
     * Populate the faculty dropdown with the professors from the database
     */
    private void populateProfessors() {
        faculty.getItems().clear();
        professors = new FacultyFactory().createFaculty();
        for (Faculty professor: professors) {
            faculty.getItems().add(professor.toString());
        }
    }

    /**
     * confirm button to delete the selected faculty. It checks if the drop-downs
     * are empty, if not then it checks for the JSON object of the selected drop-down of faculty id
     * to delete that JSON object from the database
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        boolean result = true;
        // If drop-down iss not empty
        if (faculty.getCheckModel().isEmpty()) {
            new MyAlert("No Faculty Selected", "Please Select A Faculty To Delete",
                    Alert.AlertType.ERROR).show();
            return false;
        } else {
            for (int prof : faculty.getCheckModel().getCheckedIndices()) {
                deleteProfessor(professors.get(prof));
            }
            populateProfessors();
            return true;
        }
    }

    /**
     * Builds the string to delete the professor from the database
     * @param faculty the faculty to delete
     */
    private void deleteProfessor(Faculty faculty) {
        String deletedProfessor = "faculty/" + faculty.getFacultyId();
        DatabaseStatic.deleteData(deletedProfessor, null);
    }

    /**
     * This method is the back confirmation action. Its parameters are taken into account for two different scenarios.
     * Scenarios include going back to the home page or canceling the deletion request which just stays on the same page.
     * @param button the button to initialize
     * @param title the title of the alert
     * @param message the message of the alert
     * @param goBackToPrevPage boolean variable to identify the two scenario
     */
    private void back(Button button, String title, String message, Boolean goBackToPrevPage) {
        // Initialize back confirmation button
        MyAlert createAlert = new MyAlert(title, message, Alert.AlertType.CONFIRMATION);
        // First scenario to go back to home screen
        if (goBackToPrevPage) {
            // Confirmation to go back to the home screen
            EventHandler<ActionEvent> confirmBack = event -> {
                // The Ok button from the alert
                Optional<ButtonType> Ok = createAlert.showButton();
                // If user pressed "OK"
                if (Ok.get().getText().equals("OK")) {
                    // Go back to home screen
                    goBack();
                }
            };
            // Set the button to have to go back to home screen functionality
            button.setOnAction(confirmBack);
        }
        // 2nd scenario, confirm deletion
        else {
            // Confirmation to delete from the database
            EventHandler<ActionEvent> confirmDelete = event -> {
                // The Ok button from the alert
                Optional<ButtonType> ok = createAlert.showButton();
                // If user pressed "OK"
                if (ok.get().getText().equals("OK")) {
                    // If delete was successful
                    if (confirmButton()) {
                        // Successful deletion alert
                        MyAlert createAlert1 = new MyAlert("Deleted", "The Selected Faculty Has Been Deleted", Alert.AlertType.INFORMATION);
                        createAlert1.show();
                    }
                }
            };
            // Set the button to have to confirmation delete functionality
            button.setOnAction(confirmDelete);
        }
    }

    /**
     * Set the stage of the scene
     * @param stage the stage we want to use
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Goes to the homepage
     */
    @FXML
    public void goBack() {
        cs.goToHomepage(stage);
    }

    /**
     * go to add course scene
     */
    @FXML
    public void goToAddCourse() {
        cs.addCourseButtonClicked(stage);
    }

    /**
     * go to add classroom scene
     */
    @FXML
    public void goToAddClassroom() {
        cs.addClassroomButtonClicked(stage);
    }

    /**
     * go to add faculty scene
     */
    @FXML
    public void goToAddFaculty() {
        cs.addProfessorButtonClicked(stage);
    }

    /**
     * go to edit course scene
     */
    @FXML
    public void goToEditCourse() { cs.editCourseButtonClicked(stage); }

    /**
     * go to edit faculty scene
     */
    @FXML
    public void goToEditFaculty() { cs.editFacultyButtonClicked(stage); }

    /**
     * go to edit classroom scene
     */
    @FXML
    public void goToEditClassroom() { cs.editClassroomButtonClicked(stage); }

    /**
     * go to delete course scene
     */
    @FXML
    public void goToDeleteCourse() {
        cs.deleteCourseButtonClicked(stage);
    }

    /**
     * go to delete classroom scene
     */
    @FXML
    public void goToDeleteClassroom() {
        cs.deleteClassroomButtonClicked(stage);
    }

    /**
     * go to delete faculty scene
     */
    @FXML
    public void goToDeleteFaculty() {
        cs.deleteFacultyButtonClicked(stage);
    }

    /**
     * go to view schedule scene
     */
    @FXML
    public void goToViewSchedule() {
        cs.viewScheduleClicked(stage);
    }
}
