package users;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.Initializable;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import javafx.fxml.FXML;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;
import java.util.ResourceBundle;

public class DeleteFacultyFromDatabaseController implements Initializable {

    @FXML
    private Button back;

    @FXML
    private Button confirm;

    @FXML
    private TextField currCourseLoad;

    @FXML
    private ChoiceBox<String> facultyID;

    @FXML
    private TextField firstName;

    @FXML
    private TextField lastName;

    @FXML
    private TextField prevCourseLoad;

    @FXML
    private TextField title;

    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // Do not allow text-field to be edited
        firstName.setEditable(false);
        lastName.setEditable(false);
        title.setEditable(false);
        prevCourseLoad.setEditable(false);
        currCourseLoad.setEditable(false);

        // Initialize faculty id drop-down
        getFacultyID();
        // Whenever faculty id is selected/changed
        facultyID.valueProperty().addListener((observable, oldValue, newValue) -> {
            // Clear all of the previous text-fields
            clearTextField();
            // Initialize all of the text-fields
            title.setText(getTitle());
            firstName.setText(getFirstName());
            lastName.setText(getLastName());
            prevCourseLoad.setText(getPrevCourseLoad());
            currCourseLoad.setText(getCurrCourseLoad());
        });

        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the faculty, or 'Cancel' to cancel the following action.", false);
    }

    /**
     * Set the stage of the scene
     * @param stage the stage we want to use
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Iterate through the list of "faculty" table from the database and insert the faculty id
     * into the faculty id drop-down
     */
    private void getFacultyID() {
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            job.put("faculty_id", String.valueOf( job.get("faculty_id")));
            facultyID.getItems().add((String) job.get("faculty_id"));
        }
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's title
     * @return the title of the faculty
     */
    private String getTitle() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject: faculty) {
                JSONObject job = (JSONObject)jsonObject;
                job.put("title_id", String.valueOf( job.get("title_id")));
                // If matching selected faculty id then set result equal to title and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("title_id");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's first name
     * @return the first name of the faculty
     */
    private String getFirstName() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                // If matching selected faculty id then set result equal to first name and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("faculty_first");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's first name
     * @return the first name of the faculty
     */
    private String getLastName() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                // If matching selected faculty id then set result equal to last name and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("faculty_last");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's previous course load
     * @return the previous course load of the faculty
     */
    private String getPrevCourseLoad() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                job.put("prev_load", String.valueOf(job.get("prev_load")));
                // If matching selected faculty id then set result equal to previous course load and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("prev_load");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's current course load
     * @return the current course load of the faculty
     */
    private String getCurrCourseLoad() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                job.put("curr_load", String.valueOf(job.get("curr_load")));
                // If matching selected faculty id then set result equal to current course load and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("curr_load");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Clear all the text-fields from the scene
     */
    private void clearTextField() {
        title.clear();
        firstName.clear();
        lastName.clear();
        prevCourseLoad.clear();
        currCourseLoad.clear();
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
        if (!(facultyID.getSelectionModel().isEmpty())) {
            // The user selected faculty id
            //Integer facultyIDValue = Integer.parseInt(facultyID.getValue());
            String facultyIDValue = facultyID.getValue();
            // The "faculty" table from the database
            JSONArray faculty = DatabaseStatic.getData("faculty");

            // Iterate through the "faculty" table and find matching JSON object to the user's request
            for (Object jsonObject: faculty) {
                JSONObject job = (JSONObject) jsonObject;
                // If JSON object contain the user's selected request
                if (job.get("faculty_id").equals(Integer.parseInt(facultyIDValue))) {
                    try {
                        System.out.println(job);
                        job.remove("prev_load");
                        job.remove("curr_load");
                        job.remove("title_id");
                        job.remove("faculty_last");
                        job.remove("faculty_first");
                        job.put("faculty_id", facultyIDValue);
                        System.out.println(job);
                        // Delete the JSON object from the "faculty" table from the database
                        DatabaseStatic.deleteData("faculty", job);
                        // Set faculty id drop-down back to blank default
                        facultyID.getSelectionModel().clearSelection();
                        // Clear all the text-fields
                        clearTextField();
                    } catch (URISyntaxException | IOException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        // No faculty id has been selected show an error alert
        else {
            result = false;
            MyAlert createAlert = new MyAlert("No Faculty Selected", "Please Select A Faculty To Delete",
                    Alert.AlertType.ERROR);
            createAlert.show();
        }
        return result;
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
