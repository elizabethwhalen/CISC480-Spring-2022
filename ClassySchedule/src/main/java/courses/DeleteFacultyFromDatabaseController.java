package courses;

import database.DatabaseStatic;
import homescreen.HomescreenController;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import javafx.fxml.FXML;
import org.json.JSONArray;
import org.json.JSONObject;

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


    @Override
    public void initialize(URL location, ResourceBundle resources) {
        getFacultyID();

        firstName.setEditable(false);
        lastName.setEditable(false);
        title.setEditable(false);
        prevCourseLoad.setEditable(false);
        currCourseLoad.setEditable(false);

        facultyID.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear previous drop-down course
                clearTextField();
                // Set list of new courses from selected department
                title.setText(getTitle());
                firstName.setText(getFirstName());
                lastName.setText(getLastName());
                prevCourseLoad.setText(getPrevCourseLoad());
                currCourseLoad.setText(getCurrCourseLoad());
            }
        });

        // Initialize back button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        // Set confirmation of confirm button to delete the selected course
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the faculty, or 'Cancel' to cancel the following action.", false);
    }

    /**
     * Set the stage of the scene
     * @param stage the stage we want to use
     */
    public void setStage(Stage stage) {
        this.stage = stage;
    }

    private void getFacultyID() {
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            job.put("faculty_id", String.valueOf( job.get("faculty_id")));
            facultyID.getItems().add((String) job.get("faculty_id"));
        }
    }

    private String getTitle() {
        String result = null;
        // Variable reference to the selected class number
        Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
        // Iterate through the class table
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            job.put("title_id", String.valueOf( job.get("title_id")));
            // json object matches class number then it is this object,
            // set result equal to class name of this selected object
            if (job.get("faculty_id").equals(selectedFaculty)) {
                result = (String) job.get("title_id");
                break;
            }
        }
        return result;
    }

    private String getFirstName() {
        String result = null;
        // Variable reference to the selected class number
        Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
        // Iterate through the class table
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            // json object matches class number then it is this object,
            // set result equal to class name of this selected object
            if (job.get("faculty_id").equals(selectedFaculty)) {
                result = (String) job.get("faculty_first");
                break;
            }
        }
        return result;
    }

    private String getLastName() {
        String result = null;
        // Variable reference to the selected class number
        Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
        // Iterate through the class table
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            // json object matches class number then it is this object,
            // set result equal to class name of this selected object
            if (job.get("faculty_id").equals(selectedFaculty)) {
                result = (String) job.get("faculty_last");
                break;
            }
        }
        return result;
    }

    private String getPrevCourseLoad() {
        String result = null;
        // Variable reference to the selected class number
        Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
        // Iterate through the class table
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            job.put("prev_load", String.valueOf( job.get("prev_load")));
            // json object matches class number then it is this object,
            // set result equal to class name of this selected object
            if (job.get("faculty_id").equals(selectedFaculty)) {
                result = (String) job.get("prev_load");
                break;
            }
        }
        return result;
    }

    private String getCurrCourseLoad() {
        String result = null;
        // Variable reference to the selected class number
        Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
        // Iterate through the class table
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            job.put("curr_load", String.valueOf( job.get("curr_load")));
            // json object matches class number then it is this object,
            // set result equal to class name of this selected object
            if (job.get("faculty_id").equals(selectedFaculty)) {
                result = (String) job.get("curr_load");
                break;
            }
        }
        return result;
    }

    private void clearTextField() {
        title.clear();
        firstName.clear();
        lastName.clear();
        prevCourseLoad.clear();
        currCourseLoad.clear();
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
        if (!(facultyID.getSelectionModel().isEmpty())) {
            Integer facultyIDValue = Integer.parseInt(facultyID.getValue());
            //String facultyIDValue = facultyID.getValue();
            JSONArray faculty = DatabaseStatic.getData("faculty");

            // Iterate through the database class table to find matching selected roomNum and buildingCode for deletion
            for (Object jsonObject: faculty) {
                JSONObject job = (JSONObject) jsonObject;
                // If the JSON object to be deleted is equal to the selected roomNum/buildingCode then delete it
                if (job.get("faculty_id").equals(facultyIDValue)) {
                    try {
                        // Delete the room from the database
                        DatabaseStatic.deleteData("faculty", job);
                        // Clear the room number drop-down box
                        facultyID.getItems().clear();
                        clearTextField();
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
            alert.setTitle("No Faculty Selected");
            alert.setContentText("Please select a faculty to delete");
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
                            alert.setContentText("The selected faculty has been deleted.");
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
