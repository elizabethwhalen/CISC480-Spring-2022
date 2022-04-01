package login;

import scheduler.AddCourseToScheduleController;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class LoginController implements Initializable {
    @FXML
    public Button submitButton;

    @FXML
    public TextField username;

    @FXML
    public TextField password;

    private Stage loginStage;

    public LoginController() {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {

    }

    public void setStage(Stage stage) {
        this.loginStage = stage;
    }

    @FXML
    public void submitButtonClicked() {
        final boolean usernameCorrect = validateUsername(username.getText());
        if (usernameCorrect) {
            final boolean passwordCorrect = validatePassword(username.getText(), password.getText());
            if (passwordCorrect) {
                // TODO: decide on what scene to show, for now just add course
                changeScene();
            }
        }

    }

    // TODO: Create validation for username and password

    private boolean validateUsername(String text) {
        //check if user exists in the database
        return true;
    }

    private boolean validatePassword(String username, String password) {
        //get user with username
        // check if password matches username
        return true;
    }

    public void changeScene() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/AddCourseToSchedule.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            AddCourseToScheduleController loginController = loader.getController();
            loginController.setStage(loginStage);

        } catch (IOException e) {
            e.printStackTrace();
        }
        loginStage.setTitle("Classy-Schedule");
        loginStage.setScene(new Scene(root, 600, 400));
        loginStage.show();
    }

}
