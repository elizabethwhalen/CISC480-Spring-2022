package courses;

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
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ChoiceBox;
import javafx.stage.Stage;

import org.json.JSONArray;
import org.json.JSONObject;
import room.RoomController;
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
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("No Room Selected");
            alert.setContentText("Please select a room to delete");
            alert.showAndWait();
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
        Alert backAlert = new Alert(Alert.AlertType.CONFIRMATION);
        backAlert.setTitle(title);
        backAlert.setContentText(message);
        // First scenario to go back to home screen
        if (goBackToPrevPage) {
            // Confirmation to go back to the home screen
            EventHandler<ActionEvent> confirmBack = new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    // The Ok button from the alert
                    Optional<ButtonType> Ok = backAlert.showAndWait();
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
                    Optional<ButtonType> ok = backAlert.showAndWait();
                    // If user pressed "OK"
                    if (ok.get().getText().equals("OK")) {
                        // If delete was successful
                        if (confirmButton()) {
                            // Successful deletion alert
                            Alert alert = new Alert(Alert.AlertType.INFORMATION);
                            alert.setTitle("Deleted");
                            alert.setContentText("The selected course has been deleted.");
                            alert.showAndWait();
                        }
                    }
                }
            };
            // Set the button to have to confirmation delete functionality
            button.setOnAction(confirmDelete);
        }
    }

    /**
     * This method switches the scene back to the home screen
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

    /**
     * Changes scene to add course page when 'Add Course' button is clicked
     */
    @FXML
    public void addCourseButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            AddCourseToDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root, 600, 400));
        stage.show();
    }


    /**
     * Changes scene to add classroom page when 'Add CLassroom' button is clicked
     */
    public void addClassroomButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/ClassroomNew.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        RoomController roomController = loader.getController();
        roomController.setStage(stage);
        stage.setScene(new Scene(root, 800, 600));
        stage.show();
    }

    /**
     * Changes scene to add professor page when 'Add Professor' button is clicked
     */
    public void addProfessorButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Professor.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        FacultyController facultyController = loader.getController();
        facultyController.setStage(stage);
        stage.setScene(new Scene(root, 800, 600));
        stage.show();
    }

    public void viewScheduleClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/scheduler.fxml"));
        Parent root = null;
        try {
            root = loader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        SchedulerController schedulerController = loader.getController();
        schedulerController.setStage(stage);
        stage.setScene(new Scene(root, 800, 600));
        stage.show();
    }

    /**
     * Changes scene to delete course page
     */
    @FXML
    public void deleteCourseButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteCourseFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteCourseFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to delete classroom page
     */
    @FXML
    public void deleteClassroomButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteClassroomFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteClassroomFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * changes scene to delete faculty page
     */
    @FXML
    public void deleteFacultyButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteFacultyFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteFacultyFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * changes scene to homepage page
     */
    @FXML
    public void homeButtonClicked() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Homescreen.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            HomescreenController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root));
        stage.show();
    }
}

