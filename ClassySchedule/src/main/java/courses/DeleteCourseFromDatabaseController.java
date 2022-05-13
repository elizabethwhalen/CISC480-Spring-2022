package courses;

import alert.MyAlert;
import database.DatabaseStatic;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;

import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

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
     * The text field that consist of the selected course name
     */
    @FXML
    private TextField course;

    /**
     * The department drop-down to select which dept of courses to delete
     */
    @FXML
    private ChoiceBox<String> dept;

    /**
     * The class number drop-down to select the unique class to delete
     */
    @FXML
    private ChoiceBox<String> classNum;

    /**
     * the current stage of this scene
     */
    @FXML
    private Stage stage;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * @param url
     * @param resourceBundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Do not allow text-field to be edited
        course.setEditable(false);

        // Initialize department drop-down
        getDept();
        // Whenever department is selected/changed
        dept.valueProperty().addListener((observable, oldValue, newValue) -> {
            // Clear previous class number
            classNum.getItems().clear();
            // Initialize class number
            getClassNumber();
        });

        // Whenever class number is selected/change
        classNum.valueProperty().addListener((observable, oldValue, newValue) -> {
            // Clear previous course text-field
            course.clear();
            // Set selected course name
            course.setText(getCourse());
        });
        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the class, or 'Cancel' to cancel the following action.", false);

    }


    /**
     * Set the stage of the scene
     *
     * @param stage the stage we want to use
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Iterate through the list of "class" table from the database and insert the department code
     * into the department drop-down
     */
    private void getDept() {
        JSONArray department = DatabaseStatic.getData("dept");
        for (Object jsonObject : department) {
            JSONObject job = (JSONObject) jsonObject;
            dept.getItems().add((String) job.get("dept_code"));
        }
    }

    /**
     * Iterate through the list of "class" table from the database and insert the class number
     * from the user selected department to the class number drop-down
     */
    private void getClassNumber() {
        // References to user selected department
        String selectedDepartment = dept.getValue();
        JSONArray classes = DatabaseStatic.getData("class");
        for (Object jsonObject : classes) {
            JSONObject job = (JSONObject) jsonObject;
            // If matching selected department then insert class number to class number drop-down
            if (job.get("dept_code").equals(selectedDepartment)) {
                classNum.getItems().add((String) job.get("class_num"));
            }
        }
    }

    /**
     * This method references the selected class number and return the string of the class name of that selected class number
     *
     * @return class name
     */
    private String getCourse() {
        String result = null;
        // References to user selected unique class number
        String selectedClassNumber = classNum.getValue();
        JSONArray classes = DatabaseStatic.getData("class");
        for (Object jsonObject : classes) {
            JSONObject job = (JSONObject) jsonObject;
            // If matching selected class number then set result to that JSON object class name
            if (job.get("class_num").equals(selectedClassNumber)) {
                if (!(job.get("class_name").equals(null))) {
                    result = (String) job.get("class_name");
                }
            }
        }
        return result;
    }


    /**
     * confirm button to delete the selected course. It checks if the drop-downs
     * are empty, if not then it checks for the JSON object of the selected drop-downs of department and class number
     * to delete that JSON object from the database
     *
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        boolean result = true;
        // If drop-downs are not empty
        if (!(classNum.getSelectionModel().isEmpty()) && !(dept.getSelectionModel().isEmpty())) {
            // The user selected class number and department
            String selectedClassNum = classNum.getValue();
            String selectedDept = dept.getValue();

            // The "class" table from the database
            JSONArray classes = DatabaseStatic.getData("class");

            // Iterate through the "class" table and find matching JSON object to the user's request
            for (Object jsonObject : classes) {
                JSONObject job = (JSONObject) jsonObject;
                // If JSON object contain the user's selected request
                if (job.get("class_num").equals(selectedClassNum) && job.get("dept_code").equals(selectedDept)) {
                    try {
                        job.remove("class_name");
                        // Delete the JSON object from the "class" table from the database
                        DatabaseStatic.deleteData("class", job);
                        //System.out.println(DatabaseStatic.deleteData("class", job));
                        // Clear the class number drop-down
                        classNum.getItems().clear();
                        // Set department drop-down back to blank default
                        dept.getSelectionModel().clearSelection();
                    } catch (URISyntaxException | IOException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        // No course has been selected show an error alert
        else {
            result = false;
            MyAlert createAlert = new MyAlert("No Course Selected", "Please Select A Course To Delete", Alert.AlertType.ERROR);
            createAlert.show();
        }
        return result;
    }

    /**
     * This method is the back confirmation action. Its parameters are taken into account for two different scenarios.
     * Scenarios include going back to the home page or canceling the deletion request which just stays on the same page.
     *
     * @param button           the button to initialize
     * @param title            the title of the alert
     * @param message          the message of the alert
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
                        new MyAlert("Deleted", "The Selected Course Has Been Deleted",
                                Alert.AlertType.INFORMATION).createAlert().showAndWait();
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
