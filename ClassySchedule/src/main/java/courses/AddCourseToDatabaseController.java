package courses;

import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import room.RoomController;
import scheduler.SchedulerController;
import users.DeleteFacultyFromDatabaseController;
import users.FacultyController;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls add course page, which allows the user to add a course to the database.
 */
public class AddCourseToDatabaseController implements Initializable {
    private Stage addCourse;
    @FXML
    TextField classNum;

    @FXML
    TextField className;

    @FXML
    ComboBox<String> deptName;

    @FXML
    Button submit_button;

    @FXML
    Text classNumWarning;

    @FXML
    Text classNameWarning;

    @FXML
    Text departmentWarning;

    private Stage stage;

    public AddCourseToDatabaseController() {}

    /**
     * Retrieves department codes from database for dropdown menu
     * @param url
     * @param resourceBundle
     */
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        deptName.getItems().add("CISC");
        deptName.getItems().add("STAT");
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    /**
     * Submits data that has been entered to the database.
     * @param event submit button clicked
     */
    @FXML
    public void submitData(ActionEvent event) {
        //checking if user inputs are entered:
        if (deptName.getSelectionModel().isEmpty()) {
            departmentWarning.setVisible(true);
            return;
        }
        if (classNum.getText().isBlank()) {
            classNumWarning.setVisible(true);
            return;
        }
        if (className.getText().isBlank()) {
            classNameWarning.setVisible(true);
            return;
        }
        //checking if length of course code is 3 and course code is type int:
        if (classNum.getLength() == 3) {
            try {
                Integer.parseInt(classNum.getText());
            } catch (NumberFormatException e) {
                classNumWarning.setVisible(true);
                return;
            }
        } else {
            classNumWarning.setVisible(true);
            return;
        }


        //TODO: Send course to database
        File file = new File("test.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("classname: " + className.getText() + " deptname: " + deptName.getValue() + " class number: " + classNum.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        deptName.setValue("Dept name");
        classNum.clear();
        className.clear();
        departmentWarning.setVisible(false);
        classNumWarning.setVisible(false);
        classNameWarning.setVisible(false);
    }

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
        hsController.setStage(addCourse);
        addCourse.setTitle("Classy-Schedule");
        addCourse.setScene(new Scene(root, 650, 450));
        addCourse.show();
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
