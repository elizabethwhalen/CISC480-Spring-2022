package users;

import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import scenes.ChangeScene;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class FacultyController implements Initializable {
    @FXML
    TextField facultyName;

    @FXML
    TextField facultyID;

    //not in database
    @FXML
    TextField email;

    @FXML
    ChoiceBox<String> deptName;

    //not in database
    @FXML
    ChoiceBox<String> type;

    @FXML
    Button submitButton;

    @FXML
    Text nameWarning;

    @FXML
    Text IDWarning;

    @FXML
    Text emailWarning;

    @FXML
    Text departmentWarning;

    @FXML
    Text typeWarning;

    private Stage stage;

    public FacultyController() {}

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        //TODO: initial boxes from database
        type.getItems().add("Adjunct");
        type.getItems().add("Full Time");

        deptName.getItems().add("CISC");
        deptName.getItems().add("STAT");
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    @FXML
    public void submitData(ActionEvent event) {
        if (deptName.getSelectionModel().isEmpty()) {
            departmentWarning.setVisible(true);
            return;
        }
        if (facultyName.getText().isBlank()) {
            nameWarning.setVisible(true);
            return;
        }
        if (facultyID.getText().isBlank()) {
            IDWarning.setVisible(true);
            return;
        }
        if (email.getText().isBlank()) {
            emailWarning.setVisible(true);
            return;
        }
        if (type.getSelectionModel().isEmpty()) {
            typeWarning.setVisible(true);
            return;
        }

        // ID number validation
        try {
            Integer.parseInt(facultyID.getText());
        } catch (NumberFormatException e) {
            IDWarning.setVisible(true);
            return;
        }

        //made it to the end of validation, send to database and then clear fields
        // maybe update courses already added?


        //TODO: Send faculty info to database
        File file = new File("testfaculty.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Name: " + facultyName.getText() + " ID: " + facultyID.getText() + " email: " + email.getText() + " department: " + deptName.getValue() + " type: " + type.getValue());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        facultyName.clear();
        facultyID.clear();
        email.clear();
        deptName.setValue("Dept name");
        type.setValue(null);
        nameWarning.setVisible(false);
        IDWarning.setVisible(false);
        emailWarning.setVisible(false);
        departmentWarning.setVisible(false);
        typeWarning.setVisible(false);
    }

    /**
     * go back to homepage
     */
    @FXML
    public void goBack() {
        ChangeScene cs = new ChangeScene();
        cs.goToHomepage(stage);
    }

    /**
     * go to add course scene
     */
    @FXML
    public void goToAddCourse() {
        ChangeScene cs = new ChangeScene();
        cs.addCourseButtonClicked(stage);
    }

    /**
     * go to add classroom scene
     */
    @FXML
    public void goToAddClassroom() {
        ChangeScene cs = new ChangeScene();
        cs.addClassroomButtonClicked(stage);
    }

    /**
     * go to add faculty scene
     */
    @FXML
    public void goToAddFaculty() {
        ChangeScene cs = new ChangeScene();
        cs.addProfessorButtonClicked(stage);
    }

    /**
     * go to delete course scene
     */
    @FXML
    public void goToDeleteCourse() {
        ChangeScene cs = new ChangeScene();
        cs.deleteCourseButtonClicked(stage);
    }

    /**
     * go to delete classroom scene
     */
    @FXML
    public void goToDeleteClassroom() {
        ChangeScene cs = new ChangeScene();
        cs.deleteClassroomButtonClicked(stage);
    }

    /**
     * go to delete faculty scene
     */
    @FXML
    public void goToDeleteFaculty() {
        ChangeScene cs = new ChangeScene();
        cs.deleteFacultyButtonClicked(stage);
    }

    /**
     * go to view schedule scene
     */
    @FXML
    public void goToViewSchedule() {
        ChangeScene cs = new ChangeScene();
        cs.viewScheduleClicked(stage);
    }

}
