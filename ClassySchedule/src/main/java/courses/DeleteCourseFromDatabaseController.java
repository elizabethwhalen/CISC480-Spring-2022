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
import javafx.scene.control.*;
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
        dept.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear previous class number
                classNum.getItems().clear();
                // Initialize class number
                getClassNumber();
            }
        });

        // Whenever class number is selected/change
        classNum.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear previous course text-field
                course.clear();
                // Set selected course name
                course.setText(getCourse());
            }
        });
        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Deletion", "Click 'OK' to delete the class, or 'Cancel' to cancel the following action.", false);

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
            JSONObject job = (JSONObject)jsonObject;
            // If matching selected class number then set result to that JSON object class name
            if (job.get("class_num").equals(selectedClassNumber)) {
                if(job.get("class_name").equals(null)) {
                    result = "null";
                } else {
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
        // If drop-downs are not empty
        if (!(classNum.getSelectionModel().isEmpty()) && !(dept.getSelectionModel().isEmpty())) {
            // The user selected class number and department
            String selectedClassNum = classNum.getValue();
            String selectedDept = dept.getValue();

            // The "class" table from the database
            JSONArray classes = DatabaseStatic.getData("class");

            // Iterate through the "class" table and find matching JSON object to the user's request
            for (Object jsonObject: classes) {
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
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        // No course has been selected show an error alert
        else {
            result = false;
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("No Course Selected");
            alert.setContentText("Please select a course to delete");
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
