package room;

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
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;
import org.controlsfx.control.CheckComboBox;
import scenes.ChangeScene;

public class DeleteClassroomFromDatabaseController implements Initializable {

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
     * The buildingCode drop-down to select which building we are referring to
     */
    @FXML
    private CheckComboBox<String> rooms;

    /**
     * the current stage of this scene
     */
    @FXML
    private Stage stage;

    /**
     * List of the rooms that can be deleted
     */
    private List<Room> roomList;

    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    /**
     * @param url the url of the FXML file
     * @param resourceBundle the resource bundle to be used (default)
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Initialize room dropdown
        populateRooms();
        // Initialize back and confirmation alerts
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the classroom, or 'Cancel' to cancel the following action.", false);
    }

    private void populateRooms() {
        rooms.getItems().clear();
        roomList = new RoomFactory().createRooms();
        for (Room room: roomList) {
            rooms.getItems().add(room.toString());
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
     * confirm button to delete the selected classroom. It checks if the drop-downs
     * are empty, if not then it checks for the JSON object of the selected drop-downs of building code and room number
     * to delete that JSON object from the database
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        if (rooms.getCheckModel().isEmpty()) {
            new MyAlert("No rooms selected", "Please select at least one room to delete", Alert.AlertType.ERROR);
            return false;
        } else {
            for (int r : rooms.getCheckModel().getCheckedIndices()) {
                deleteRoom(roomList.get(r));
            }
            populateRooms();
            return true;
        }
    }

    private void deleteRoom(Room room) {
        String deletedRoom = "room/" + room.getBuildingCode().replace(" ", "%20") + "/" + room.getRoomNum().replace(" ", "%20");
        DatabaseStatic.deleteData(deletedRoom, null);
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
                        MyAlert createAlert1 = new MyAlert("Deleted", "The selected room has been deleted", Alert.AlertType.INFORMATION);
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

}

