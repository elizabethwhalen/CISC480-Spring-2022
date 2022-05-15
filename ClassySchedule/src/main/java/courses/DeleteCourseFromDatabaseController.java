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
import javafx.stage.Stage;

import org.controlsfx.control.CheckComboBox;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;

public class DeleteCourseFromDatabaseController implements Initializable {

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();
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
     * The department drop-down to select which dept of courses to delete
     */
    @FXML
    private CheckComboBox<String> course;

    /**
     * the current stage of this scene
     */
    @FXML
    private Stage stage;

    /**
     * A list of all the available course
     */
    private List<Lecture> classes;

    /**
     * @param url            the url of the resource
     * @param resourceBundle the resource bundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Initialize the course dropdown
       populateCourses();

        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the class, or 'Cancel' to cancel the following action.", false);

    }
    public void populateCourses() {
        course.getItems().clear();
        classes = new CourseFactory().createCourses();
        for (Lecture lecture : classes) {
            course.getItems().add(lecture.toString());
        }
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
     * confirm button to delete the selected course. It checks if the drop-downs
     * are empty, if not then it checks for the JSON object of the selected drop-downs of department and class number
     * to delete that JSON object from the database
     *
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        int numCourses = course.getCheckModel().getCheckedItems().size();
        if (numCourses > 0) {
            for (int courseIndex : course.getCheckModel().getCheckedIndices()) {
                deleteCourse(classes.get(courseIndex));
            }
            // repopulate the course dropdown
            populateCourses();
            return true;
        } else {
            new MyAlert("Confirm Delete Courses", "Please select at least one course to delete",
                    Alert.AlertType.WARNING).show();
            return false;
        }
    }

    private void deleteCourse(Lecture lecture) {
        String deleteLec = ("" +
                "section/" + lecture.getDeptCode() + "/" + lecture.getClassNum() + "/" +
                lecture.getSectionNum() + "/" + lecture.getSemester() + "/" + lecture.getDraft());

        DatabaseStatic.deleteData(deleteLec, null);
    }

    /**
     * This method is the back confirmation action. Its parameters are taken into account for two different scenarios.
     * Scenarios include going back to the home page or cancelling the deletion request which just stays on the same page.
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

    /**
     * Updates the stage to the homepage
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
    public void goToEditCourse() {
        cs.editCourseButtonClicked(stage);
    }

    /**
     * go to edit faculty scene
     */
    @FXML
    public void goToEditFaculty() {
        cs.editFacultyButtonClicked(stage);
    }

    /**
     * go to edit classroom scene
     */
    @FXML
    public void goToEditClassroom() {
        cs.editClassroomButtonClicked(stage);
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
