package room;

import alert.MyAlert;
import database.DatabaseStatic;

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

public class EditClassroomFromDatabaseController implements Initializable {

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

    @FXML
    private TextField changeBuildingCode;

    @FXML
    private TextField changeRoomNum;

    private boolean changeBuildingCodeVal;

    private boolean changeRoomNumVal;

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

        // Hide changing value to start
        changeBuildingCode.setVisible(false);
        changeRoomNum.setVisible(false);

        // Whenever building code is selected/changed
        listener();

        // Initialize back and confirmation alerts
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Update", "Click 'OK' to update the classroom, or 'Cancel' to cancel the following action.", false);
    }

    private void listener() {
        buildingCode.valueProperty().addListener((observable, oldValue, newValue) -> {
            // Clear previous room number
            roomNum.getItems().clear();
            // Initialize room number
            getRoomNumber();
        });

        roomNum.valueProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue != null) {
                changeBuildingCode.setText(buildingCode.getValue());
                changeBuildingCode.setVisible(true);
                changeRoomNum.setText(roomNum.getValue());
                changeRoomNum.setVisible(true);

                buildingCode.setVisible(false);
                roomNum.setVisible(false);
            }
        });

        changeBuildingCode.textProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue != null && !newValue.equals(buildingCode.getValue())) {
                setChangeBuildingCodeVal(true);
            }
        });

        changeRoomNum.textProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue != null && !newValue.equals(roomNum.getValue())) {
                setChangeRoomNumVal(true);
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
     * Iterate through the list of "room" table from the database and insert building code
     * into the building code drop-down
     */
    private void getBuildingCode() {
        JSONArray building = DatabaseStatic.getData("room");
        for (Object jsonObject: building) {
            JSONObject job = (JSONObject)jsonObject;
            if (!buildingCode.getItems().contains(job.get("building_code"))) {
                buildingCode.getItems().add((String) job.get("building_code"));
            }
        }
    }

    /**
     * Iterate through the list of "room" table from the database and insert room
     * into the room number drop-down
     */
    private void getRoomNumber() {
        String selectedBuildingCode = buildingCode.getValue();

        JSONArray room = DatabaseStatic.getData("room");
        for (Object jsonObject: room) {
            JSONObject job = (JSONObject)jsonObject;
            if (job.get("building_code").equals(selectedBuildingCode)) {
                roomNum.getItems().add((String) job.get("room_num"));
            }
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
        if (isChangeBuildingCodeVal() || isChangeRoomNumVal()) {
            // The "room" table from the database
            JSONArray classroom = DatabaseStatic.getData("room");
            // Iterate through the "room" table and find matching JSON object to the user's request
            for (Object jsonObject: classroom) {
                JSONObject job = (JSONObject) jsonObject;
                // If JSON object contain the user's selected request
                if (job.get("building_code").equals(buildingCode.getValue()) && job.get("room_num").equals(roomNum.getValue())) {
                    try {
                        // remove non-primary key
                        job.remove("capacity");
                        // Json object that contain the changing data
                        JSONObject data = new JSONObject();
                        if (isChangeBuildingCodeVal()) {
                            data.put("building_code", changeBuildingCode.getText());
                        }
                        if (isChangeRoomNumVal()) {
                            data.put("room_num", changeRoomNum.getText());
                        }
                        // Delete the JSON object from the "room" table from the database
                        DatabaseStatic.updateData("room", job, data);

                        // Clear the room number drop-down
                        roomNum.getItems().clear();
                        roomNum.setVisible(true);
                        // Set buildingCode drop-down back to blank default
                        buildingCode.getSelectionModel().clearSelection();
                        buildingCode.setVisible(true);
                        // Hide changing text-fields
                        changeBuildingCode.clear();
                        changeBuildingCode.setVisible(false);
                        changeRoomNum.clear();
                        changeRoomNum.setVisible(false);

                    } catch (URISyntaxException | IOException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        // No room has been selected show an error alert
        else {
            result = false;
            MyAlert createAlert = new MyAlert("No Room Updated", "No new data/information, nothing has changed", Alert.AlertType.INFORMATION);
            createAlert.show();

            // Clear the room number drop-down
            roomNum.getItems().clear();
            roomNum.setVisible(true);
            // Set buildingCode drop-down back to blank default
            buildingCode.getSelectionModel().clearSelection();
            buildingCode.setVisible(true);
            // Hide changing text-fields
            changeBuildingCode.clear();
            changeBuildingCode.setVisible(false);
            changeRoomNum.clear();
            changeRoomNum.setVisible(false);
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
                        MyAlert createAlert1 = new MyAlert("Deleted", "The selected room has been updated", Alert.AlertType.INFORMATION);
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

    public boolean isChangeBuildingCodeVal() {
        return changeBuildingCodeVal;
    }

    public void setChangeBuildingCodeVal(boolean changeBuildingCodeVal) {
        this.changeBuildingCodeVal = changeBuildingCodeVal;
    }

    public boolean isChangeRoomNumVal() {
        return changeRoomNumVal;
    }

    public void setChangeRoomNumVal(boolean changeRoomNumVal) {
        this.changeRoomNumVal = changeRoomNumVal;
    }
}

