package room;

import alert.MyAlert;
import database.DatabaseStatic;

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
import javafx.scene.control.*;
import javafx.stage.Stage;

import org.json.JSONArray;
import org.json.JSONObject;
import room.RoomController;
import scenes.ChangeScene;
import scheduler.SchedulerController;
import users.DeleteFacultyFromDatabaseController;
import users.FacultyController;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;
import java.util.ResourceBundle;

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
    private ChoiceBox<String> buildingCode;

    /**
     * The roomNum drop-down to select the room to delete from the database
     */
    @FXML
    private ChoiceBox<String> roomNum;

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
        // Initialize building code drop-down
        getBuildingCode();
        // Whenever building code is selected/changed
        buildingCode.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear previous room number
                roomNum.getItems().clear();
                // Initialize room number
                getRoomNumber();
            }
        });
        // Initialize back and confirmation alerts
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the classroom, or 'Cancel' to cancel the following action.", false);
    }

    /**
     * Set the stage of the scene
     * @param stage the stage we want to use
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Iterate through the list of "room" table from the database and insert building code
     * into the building code drop-down
     */
    private void getBuildingCode() {
        JSONArray building = DatabaseStatic.getData("room");
        for (Object jsonObject: building) {
            JSONObject job = (JSONObject)jsonObject;
            buildingCode.getItems().add((String) job.get("building_code"));
        }
    }

    /**
     * Iterate through the list of "room" table from the database and insert room
     * into the room number drop-down
     */
    private void getRoomNumber() {
        JSONArray room = DatabaseStatic.getData("room");
        for (Object jsonObject: room) {
            JSONObject job = (JSONObject)jsonObject;
            roomNum.getItems().add((String) job.get("room_num"));
        }
    }

    /**
     * confirm button to delete the selected classroom. It checks if the drop-downs
     * are empty, if not then it checks for the JSON object of the selected drop-downs of building code and room number
     * to delete that JSON object from the database
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        boolean result = true;
        // If drop-downs are not empty
        if (!(buildingCode.getSelectionModel().isEmpty()) && !(roomNum.getSelectionModel().isEmpty())) {
            // The user selected building and room number
            String selectedBuilding = buildingCode.getValue();
            String selectedRoom = roomNum.getValue();

            // The "room" table from the database
            JSONArray classroom = DatabaseStatic.getData("room");

            // Iterate through the "room" table and find matching JSON object to the user's request
            for (Object jsonObject: classroom) {
                JSONObject job = (JSONObject) jsonObject;
                // If JSON object contain the user's selected request
                if (job.get("building_code").equals(selectedBuilding) && job.get("room_num").equals(selectedRoom)) {
                    try {
                        System.out.println(job);
                        job.remove("capacity");
                        System.out.println(job);
                        // Delete the JSON object from the "room" table from the database
                        DatabaseStatic.deleteData("room", job);
                        // Clear the room number drop-down
                        roomNum.getItems().clear();
                        // Set buildingCode drop-down back to blank default
                        buildingCode.getSelectionModel().clearSelection();
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        // No room has been selected show an error alert
        else {
            result = false;
            MyAlert createAlert = new MyAlert("No Room Selected", "Please Select A Room To Delete", Alert.AlertType.ERROR);
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
            EventHandler<ActionEvent> confirmBack = new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    // The Ok button from the alert
                    Optional<ButtonType> Ok = createAlert.showButton();
                    // If user pressed "OK"
                    if (Ok.get().getText().equals("OK")) {
                        // Go back to home screen
                        goBack();
                    }
                }
            };
            // Set the button to have to go back to home screen functionality
            button.setOnAction(confirmBack);
        }
        // 2nd scenario, confirm deletion
        else {
            // Confirmation to delete from the database
            EventHandler<ActionEvent> confirmDelete = new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    // The Ok button from the alert
                    Optional<ButtonType> ok = createAlert.showButton();
                    // If user pressed "OK"
                    if (ok.get().getText().equals("OK")) {
                        // If delete was successful
                        if (confirmButton()) {
                            // Successful deletion alert
                            MyAlert createAlert = new MyAlert("Deleted", "The Selected Course Has Been Deleted", Alert.AlertType.INFORMATION);
                            createAlert.show();
                        }
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
