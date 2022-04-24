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
     * The buildingCode drop-down box to select which building we are referring to
     */
    @FXML
    private ChoiceBox<String> buildingCode;

    /**
     * The roomNum drop-down box to select the room to delete from the database
     */
    @FXML
    private ChoiceBox<String> roomNum;

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
        // Initialize the buildings drop-down
        getBuildingCode();
        // Whenever the building drop-down is selected call the getRoomNumber method to change
        // and initialize the roomNum drop-down
        buildingCode.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear previous drop-down roomNum
                roomNum.getItems().clear();
                // Set list of roomNum from selected building
                getRoomNumber();
            }
        });
        // Initialize back button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        // Set confirmation of confirm button to delete the selected course
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
     * Initialize and grab data of buildings from the database to put into the buildingCode drop-down box
     */
    private void getBuildingCode() {
        JSONArray building = database.getData("room");
        for (Object jsonObject: building) {
            JSONObject job = (JSONObject)jsonObject;
            buildingCode.getItems().add((String) job.get("building_code"));
        }
    }

    /**
     * Initialize and grab data of room number from the database to put into the roomNum drop-down box
     */
    private void getRoomNumber() {
        JSONArray room = database.getData("room");
        for (Object jsonObject: room) {
            JSONObject job = (JSONObject)jsonObject;
            roomNum.getItems().add((String) job.get("room_num"));
        }
    }

    /**
     * confirmButton to delete the selected classroom. It checks if the drop-down boxes
     * are empty, if not, then it checks for the JSON object of the selected drop-down box of buildingCode/RoomNumber
     * and call the deleteData function from the Database class to delete the selected classroom from the database
     * @return true if the course is deleted and false if there's an error
     */
    private boolean confirmButton() {
        boolean result = true;
        // If drop-down boxes are not empty
        if (!(buildingCode.getSelectionModel().isEmpty()) && !(roomNum.getSelectionModel().isEmpty())) {
            String selectedBuilding = buildingCode.getValue();
            String selectedRoom = roomNum.getValue();
            JSONArray classroom = database.getData("room");
            // Iterate through the database class table to find matching selected roomNum and buildingCode for deletion
            for (Object jsonObject: classroom) {
                JSONObject job = (JSONObject) jsonObject;
                // If the JSON object to be deleted is equal to the selected roomNum/buildingCode then delete it
                if (job.get("building_code").equals(selectedBuilding) && job.get("room_num").equals(selectedRoom)) {
                    try {
                        // Delete the room from the database
                        database.deleteData("room", job);
                        // Clear the room number drop-down box
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
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("No Room Selected");
            alert.setContentText("Please select a room to delete");
            alert.showAndWait();
        }
        return result;
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
                        // If deletion goes well then show a successful alert
                        if (confirmButton()) {
                            Alert alert = new Alert(Alert.AlertType.INFORMATION);
                            alert.setTitle("Deleted");
                            alert.setContentText("The selected course has been deleted.");
                            alert.showAndWait();
                        }
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

