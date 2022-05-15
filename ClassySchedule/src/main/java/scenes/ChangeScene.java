package scenes;

import courses.AddCourseToDatabaseController;
import courses.EditCourseFromDatabaseController;
import room.DeleteClassroomFromDatabaseController;
import courses.DeleteCourseFromDatabaseController;
import homescreen.HomescreenController;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import room.EditClassroomFromDatabaseController;
import room.RoomController;
import scheduler.GenerateScheduleController;
import scheduler.SchedulerController;
import users.DeleteFacultyFromDatabaseController;
import users.EditFacultyFromDatabaseController;
import users.FacultyController;

import java.io.IOException;

/**
 * A class to control the changing of scenes
 */
public class ChangeScene {

    /**
     * Constructs a chage scene class
     */
    public ChangeScene() {}

    /**
     * Changes scene to add course page when 'Add Course' button is clicked
     */
    public void addCourseButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            AddCourseToDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Add Course");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to add classroom page when 'Add Classroom' button is clicked
     */
    public void addClassroomButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/ClassroomNew.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            RoomController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Add Classroom");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to add professor page when 'Add Professor' button is clicked
     */
    public void addProfessorButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Professor.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            FacultyController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Add Faculty");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to edit course page when 'Edit Course' button is clicked
     */
    public void editCourseButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/EditCourseFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            EditCourseFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Edit Course");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to edit professor page when 'Edit Professor' button is clicked
     */
    public void editFacultyButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/EditFacultyFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            EditFacultyFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Edit Faculty");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to edit classroom page when 'Edit Classroom' button is clicked
     */
    public void editClassroomButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/EditClassroomFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            EditClassroomFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Edit Classroom");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes to the scheduler fxml page
     * @param stage the stage to use
     */
    public void viewScheduleClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Scheduler.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            SchedulerController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("View Schedule");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to delete course page
     */
    public void deleteCourseButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteCourseFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteCourseFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Delete Course");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes scene to delete classroom page
     */
    public void deleteClassroomButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteClassroomFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteClassroomFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Delete Classroom");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * changes scene to delete faculty page
     */
    public void deleteFacultyButtonClicked(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/DeleteFacultyFromDatabase.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            DeleteFacultyFromDatabaseController controller = loader.getController();
            controller.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Delete Faculty");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Changes the scene to the home page
     * @param stage the stage to use
     */
    public void goToHomepage(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Homescreen.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            HomescreenController controller = loader.getController();
            controller.setStage(stage);

        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Homepage");
        stage.setScene(new Scene(root));
        stage.show();
    }

    /**
     * Goes to the generate schedule page
     * @param stage the stage to use for the scene
     */
    public void goToGenerateSchedule(Stage stage) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/GenerateSchedule.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            GenerateScheduleController generateScheduleController = loader.getController();
            generateScheduleController.setStage(stage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root));
        stage.show();
    }
}
