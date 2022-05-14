package users;

import alert.MyAlert;
import database.DatabaseStatic;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.stage.Stage;
import javafx.fxml.FXML;
import org.json.JSONArray;
import org.json.JSONObject;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;
import java.util.ResourceBundle;

public class EditFacultyFromDatabaseController implements Initializable {

    /**
     * The back button
     */
    @FXML
    private Button back;

    /**
     * The confirm button
     */
    @FXML
    private Button confirm;

    /**
     * The current course load text field
     */
    @FXML
    private TextField currCourseLoad;

    /**
     * The faculty id choice box
     */
    @FXML
    private ChoiceBox<String> facultyID;

    /**
     * The faculty first name
     */
    @FXML
    private TextField firstName;

    /**
     * The faculty last name
     */
    @FXML
    private TextField lastName;

    /**
     * The previous course load text field
     */
    @FXML
    private TextField prevCourseLoad;

    /**
     * the faculty title text field
     */
    @FXML
    private TextField title;

    /**
     * the stage of the scene
     */
    private Stage stage;

    @FXML
    private TextField changeCurrLoad;

    @FXML
    private TextField changeFacultyId;

    @FXML
    private TextField changeFirst;

    @FXML
    private TextField changeLast;

    @FXML
    private TextField changePrevLoad;

    @FXML
    private TextField changeTitle;

    private boolean changeFacultyIdVal;

    private boolean changeTitleVal;

    private boolean changeFirstVal;

    private boolean changeLastVal;

    private boolean changePrevVal;

    private boolean changeCurrVal;


    /**
     * The change scene object to change between scenes
     */
    private final ChangeScene cs = new ChangeScene();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        // Do not allow text-field to be edited
        firstName.setEditable(false);
        lastName.setEditable(false);
        title.setEditable(false);
        prevCourseLoad.setEditable(false);
        currCourseLoad.setEditable(false);

        // Hide the change text fields
        changeFacultyId.setVisible(false);
        changeFirst.setVisible(false);
        changePrevLoad.setVisible(false);
        changeCurrLoad.setVisible(false);
        changeTitle.setVisible(false);
        changeLast.setVisible(false);

        // Initialize faculty id drop-down
        getFacultyID();

        listener();

        // Initialize back and confirmation button
        back(back, "Go Back To Home Screen", "Click ok to go back to home screen.", true);
        back(confirm, "Confirm Update", "Click 'OK' to update the faculty, or 'Cancel' to cancel the following action.", false);
    }

    private void listener() {
        // Whenever faculty id is selected/changed
        facultyID.valueProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // Clear all the previous text-fields
                clearTextField();
                // Initialize all the selected text-fields
                title.setText(getTitle());
                firstName.setText(getFirstName());
                lastName.setText(getLastName());
                prevCourseLoad.setText(getPrevCourseLoad());
                currCourseLoad.setText(getCurrCourseLoad());

                // Hide selected variables
                facultyID.setVisible(false);
                title.setVisible(false);
                firstName.setVisible(false);
                lastName.setVisible(false);
                prevCourseLoad.setVisible(false);
                currCourseLoad.setVisible(false);

                // Initialize user input changes text-fields and show them
                changeFacultyId.setText(facultyID.getValue());
                changeFacultyId.setVisible(true);
                changeTitle.setText(title.getText());
                changeTitle.setVisible(true);
                changeFirst.setText(firstName.getText());
                changeFirst.setVisible(true);
                changeLast.setText(lastName.getText());
                changeLast.setVisible(true);
                changePrevLoad.setText(prevCourseLoad.getText());
                changePrevLoad.setVisible(true);
                changeCurrLoad.setText(currCourseLoad.getText());
                changeCurrLoad.setVisible(true);
            }
        });

        changeFacultyId.textProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // If the new value is not null and does not equal the selected value,
                // then it is a new value so set its parameter to true to indicate changes
                if (newValue != null && !newValue.equals(facultyID.getValue())) {
                    setChangeFacultyIdVal(true);
                }
            }
        });

        changeTitle.textProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // If the new value is not null and does not equal the selected value,
                // then it is a new value so set its parameter to true to indicate changes
                if (newValue != null && !newValue.equals(title.getText())) {
                    setChangeTitleVal(true);
                }
            }
        });

        changeFirst.textProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // If the new value is not null and does not equal the selected value,
                // then it is a new value so set its parameter to true to indicate changes
                if (newValue != null && !newValue.equals(firstName.getText())) {
                    setChangeFirstVal(true);
                }
            }
        });

        changeLast.textProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // If the new value is not null and does not equal the selected value,
                // then it is a new value so set its parameter to true to indicate changes
                if (newValue != null && !newValue.equals(lastName.getText())) {
                    setChangeLastVal(true);
                }
            }
        });

        changePrevLoad.textProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // If the new value is not null and does not equal the selected value,
                // then it is a new value so set its parameter to true to indicate changes
                if (newValue != null && !newValue.equals(prevCourseLoad.getText())) {
                    setChangePrevVal(true);
                }
            }
        });

        changeCurrLoad.textProperty().addListener(new ChangeListener<String>() {
            @Override
            public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
                // If the new value is not null and does not equal the selected value,
                // then it is a new value so set its parameter to true to indicate changes
                if (newValue != null && !newValue.equals(currCourseLoad.getText())) {
                    setChangeCurrVal(true);
                }
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
     * Iterate through the list of "faculty" table from the database and insert the faculty id
     * into the faculty id drop-down
     */
    private void getFacultyID() {
        JSONArray faculty = DatabaseStatic.getData("faculty");
        for (Object jsonObject: faculty) {
            JSONObject job = (JSONObject)jsonObject;
            job.put("faculty_id", String.valueOf( job.get("faculty_id")));
            facultyID.getItems().add((String) job.get("faculty_id"));
        }
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's title
     * @return the title of the faculty
     */
    private String getTitle() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject: faculty) {
                JSONObject job = (JSONObject)jsonObject;
                job.put("title_id", String.valueOf( job.get("title_id")));
                // If matching selected faculty id then set result equal to title and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("title_id");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's first name
     * @return the first name of the faculty
     */
    private String getFirstName() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                // If matching selected faculty id then set result equal to first name and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("faculty_first");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's first name
     * @return the first name of the faculty
     */
    private String getLastName() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                // If matching selected faculty id then set result equal to last name and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("faculty_last");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's previous course load
     * @return the previous course load of the faculty
     */
    private String getPrevCourseLoad() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                job.put("prev_load", String.valueOf(job.get("prev_load")));
                // If matching selected faculty id then set result equal to previous course load and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("prev_load");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Iterate through the lists of "faculty" table from the database and find the matching selected
     * faculty id and retrieve that faculty's current course load
     * @return the current course load of the faculty
     */
    private String getCurrCourseLoad() {
        String result = null;
        // References to user selected faculty id
        if (!(facultyID.getValue() == null)) {
            Integer selectedFaculty = Integer.parseInt(facultyID.getValue());
            // Iterate through the faculty table
            JSONArray faculty = DatabaseStatic.getData("faculty");
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                job.put("curr_load", String.valueOf(job.get("curr_load")));
                // If matching selected faculty id then set result equal to current course load and break
                if (job.get("faculty_id").equals(selectedFaculty)) {
                    result = (String) job.get("curr_load");
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Clear all the text-fields from the scene
     */
    private void clearTextField() {
        title.clear();
        firstName.clear();
        lastName.clear();
        prevCourseLoad.clear();
        currCourseLoad.clear();
    }

    /**
     * confirm button to delete the selected faculty. It checks if the drop-downs
     * are empty, if not then it checks for the JSON object of the selected drop-down of faculty id
     * to delete that JSON object from the database
     * @return true if the course is deleted and false otherwise
     */
    private boolean confirmButton() {
        boolean result = true;
        if (isChangeFacultyIdVal() || isChangeTitleVal() || isChangeFirstVal() || isChangeLastVal() || isChangePrevVal() || isChangeCurrVal()) {
            JSONArray faculty = DatabaseStatic.getData("faculty");
            String facultyIDValue = facultyID.getValue();

            // Iterate through the "faculty" table and find matching JSON object to the user's request
            for (Object jsonObject : faculty) {
                JSONObject job = (JSONObject) jsonObject;
                if (job.get("faculty_id").equals(Integer.parseInt(facultyIDValue))) {
                    try {
                        JSONObject data = new JSONObject();
                        if (isChangeFacultyIdVal()) {
                            data.put("faculty_id", changeFacultyId.getText());
                        }
                        if (isChangeTitleVal()) {
                            data.put("title_id", changeTitle.getText());
                        }
                        if (isChangeFirstVal()) {
                            data.put("faculty_first", changeFirst.getText());
                        }
                        if (isChangeLastVal()) {
                            data.put("faculty_last", changeLast.getText());
                        }
                        if (isChangePrevVal()) {
                            data.put("prev_load", changePrevLoad.getText());
                        }
                        if (isChangeCurrVal()) {
                            data.put("curr_load", changeCurrLoad.getText());
                        }
                        System.out.println(data);
                        DatabaseStatic.updateData("faculty", job, data);
                    } catch (URISyntaxException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        } else {
            result = false;
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
                            MyAlert createAlert = new MyAlert("Deleted", "The Selected Faculty Has Been Deleted", Alert.AlertType.INFORMATION);
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

    public boolean isChangeFacultyIdVal() {
        return changeFacultyIdVal;
    }

    public void setChangeFacultyIdVal(boolean changeFacultyIdVal) {
        this.changeFacultyIdVal = changeFacultyIdVal;
    }

    public boolean isChangeTitleVal() {
        return changeTitleVal;
    }

    public void setChangeTitleVal(boolean changeTitleVal) {
        this.changeTitleVal = changeTitleVal;
    }

    public boolean isChangeFirstVal() {
        return changeFirstVal;
    }

    public void setChangeFirstVal(boolean changeFirstVal) {
        this.changeFirstVal = changeFirstVal;
    }

    public boolean isChangeLastVal() {
        return changeLastVal;
    }

    public void setChangeLastVal(boolean changeLastVal) {
        this.changeLastVal = changeLastVal;
    }

    public boolean isChangePrevVal() {
        return changePrevVal;
    }

    public void setChangePrevVal(boolean changePrevVal) {
        this.changePrevVal = changePrevVal;
    }

    public boolean isChangeCurrVal() {
        return changeCurrVal;
    }

    public void setChangeCurrVal(boolean changeCurrVal) {
        this.changeCurrVal = changeCurrVal;
    }
}
