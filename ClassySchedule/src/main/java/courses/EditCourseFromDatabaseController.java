package courses;
import alert.MyAlert;
import database.DatabaseStatic;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;
import java.util.ResourceBundle;

public class EditCourseFromDatabaseController implements Initializable {

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
     * The text field that consist of the selected course name to display or change
     */
    @FXML
    private TextField course;

    /**
     * The text field for user to input in new department
     */
    @FXML
    private TextField changeDept;

    /**
     * The text field for user to input in new class number
     */
    @FXML
    private TextField changeClassNum;

    /**
     * The text field for user to input in new course name
     */
    @FXML
    private TextField changeCourse;

    /**
     * boolean variable to check if department has been changed
     */
    private boolean changeDeptVal;

    /**
     * boolean variable to check if class number has been changed
     */
    private boolean changeClassNumVal;

    /**
     * boolean variable to check if a course name has been changed
     */
    private boolean changeCourseVal;

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
        // Do not allow course text-field to be edited
        course.setEditable(false);

        // Hide changing text field at the start of stage
        changeClassNum.setVisible(false);
        changeDept.setVisible(false);

        // Set boolean if anything had been changed to false to begin with
        setChangeDeptVal(false);
        setChangeClassNumVal(false);
        setChangeCourseVal(false);

        // Initialize department drop-down
        getDept();

        // Listener to changes in values e.g. drop-down boxes, text fields
        listener();

        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Update", "Click 'OK' to update the class, or 'Cancel' to cancel the following action.", false);

    }

    /**
     * Listener method to check if any of the drop-down or text fields changes. If so then do the following
     * actions such as population another drop-down, etc...
     */
    private void listener() {
        // Whenever department is selected/changed
        dept.valueProperty().addListener((observable, oldValue, newValue) -> {
            // Clear previous class number
            classNum.getItems().clear();
            // Initialize class number
            getClassNumber();
        });

        // Whenever class number is selected/change
        classNum.valueProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue != null) {
                // Clear previous course text-field
                course.clear();
                // Set selected course name
                course.setText(getCourse());

                // Hide drop-down boxes and course text field to display user inputted change
                dept.setVisible(false);
                classNum.setVisible(false);
                course.setVisible(false);

                // Set change text fields to selected drop-down values and to begin with and
                // make them visible
                changeDept.setText(dept.getValue());
                changeDept.setVisible(true);
                changeClassNum.setText(classNum.getValue());
                changeClassNum.setVisible(true);
                changeCourse.setText(course.getText());
                changeCourse.setVisible(true);
                changeCourse.setEditable(true);
            }
        });

        // Whenever the change department text field is changed or modify
        changeDept.textProperty().addListener((observable, oldValue, newValue) -> {
            // If the new value is not null and does not equal the selected value,
            // then it is a new value so set its parameter to true to indicate changes
            if (newValue != null && !newValue.equals(dept.getValue())) {
                setChangeDeptVal(true);
            }
        });

        // Whenever the change class number text field is changed or modify
        changeClassNum.textProperty().addListener((observable, oldValue, newValue) -> {
            // If the new value is not null and does not equal the selected value,
            // then it is a new value so set its parameter to true to indicate changes
            if (newValue != null && !newValue.equals(classNum.getValue())) {
                setChangeClassNumVal(true);
            }
        });

        // Whenever the change course text field is changed or modify
        changeCourse.textProperty().addListener((observable, oldValue, newValue) -> {
            // If the new value is not null and does not equal the selected value,
            // then it is a new value so set its parameter to true to indicate changes
            if (!newValue.equals(course.getText())) {
                setChangeCourseVal(true);
            }
        });
    }

    /**
     * Set the stage of the scene
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
        for (Object jsonObject: department) {
            JSONObject job = (JSONObject)jsonObject;
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
        for (Object jsonObject: classes) {
            JSONObject job = (JSONObject)jsonObject;
            // If matching selected department then insert class number to class number drop-down
            if (job.get("dept_code").equals(selectedDepartment)) {
                classNum.getItems().add((String) job.get("class_num"));
            }
        }
    }

    /**
     * This method references the selected class number and return the string of the class name of that selected class number
     * @return class name
     */
    private String getCourse() {
        String result = null;
        // References to user selected unique class number
        String selectedClassNumber = classNum.getValue();
        JSONArray classes = DatabaseStatic.getData("class");
        for (Object jsonObject: classes) {
            JSONObject job = (JSONObject) jsonObject;
            // If matching selected class number then set result to that JSON object class name
            if (job.get("class_num").equals(selectedClassNumber)) {
                if (!(job.get("class_name") == JSONObject.NULL)) {
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
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        boolean result = true;
        // If there is a change
        if (isChangeDeptVal() || isChangeClassNumVal() || isChangeCourseVal()) {
            // The "class" table from the database
            JSONArray classes = DatabaseStatic.getData("class");
            // Iterate through the "class" table and find matching JSON object to the user's request
            for (Object jsonObject: classes) {
                JSONObject job = (JSONObject) jsonObject;
                if (job.get("dept_code").equals(dept.getValue()) && job.get("class_num").equals(classNum.getValue())) {
                    try {
                        // Remove non-primary key
                        job.remove("class_name");
                        // Json object that contain the changing data
                        JSONObject data = new JSONObject();
                        if (isChangeDeptVal()) {
                            data.put("dept_code", changeDept.getText());
                        }
                        if (isChangeClassNumVal()) {
                            data.put("class_num", Integer.parseInt(changeClassNum.getText()));
                        }
                        if (isChangeCourseVal()) {
                            data.put("class_name", changeCourse.getText());
                        }
                        // Update the database
                        DatabaseStatic.updateData("class", job, data);

                        // Clear changing variables and hide them
                        changeDept.clear();
                        changeDept.setVisible(false);
                        changeClassNum.clear();
                        changeClassNum.setVisible(false);
                        changeCourse.clear();
                        changeCourse.setVisible(false);

                        // Clear selected variables and show them
                        dept.getSelectionModel().clearSelection();
                        dept.setVisible(true);
                        classNum.getItems().clear();
                        classNum.setVisible(true);
                        course.clear();
                        course.setVisible(true);
                    } catch (URISyntaxException | IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        } else {
            result = false;
            MyAlert createAlert = new MyAlert("No Course Updated", "No new data/information, nothing has changed", Alert.AlertType.INFORMATION);
            createAlert.show();

            // Clear changing variables and hide them
            changeDept.clear();
            changeDept.setVisible(false);
            changeClassNum.clear();
            changeClassNum.setVisible(false);
            changeCourse.clear();
            changeCourse.setVisible(false);

            // Clear selected variables and show them
            dept.getSelectionModel().clearSelection();
            dept.setVisible(true);
            classNum.getItems().clear();
            classNum.setVisible(true);
            course.clear();
            course.setVisible(true);
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
                        MyAlert createAlert1 = new MyAlert("Updated", "The selected course has been updated", Alert.AlertType.INFORMATION);
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

    public boolean isChangeDeptVal() {
        return changeDeptVal;
    }

    public void setChangeDeptVal(boolean changeDeptVal) {
        this.changeDeptVal = changeDeptVal;
    }

    public boolean isChangeClassNumVal() {
        return changeClassNumVal;
    }

    public void setChangeClassNumVal(boolean changeClassNumVal) {
        this.changeClassNumVal = changeClassNumVal;
    }


    public boolean isChangeCourseVal() {
        return changeCourseVal;
    }

    public void setChangeCourseVal(boolean changeCourseVal) {
        this.changeCourseVal = changeCourseVal;
    }
}

