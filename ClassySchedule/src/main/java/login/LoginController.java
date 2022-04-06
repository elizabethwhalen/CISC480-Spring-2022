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

/**
 * The controller for the login page
 */
public class LoginController implements Initializable {

    /**
     * The button to submit the login credentials
     */
    @FXML
    public Button submitButton;

    /**
     * The username input field
     */
    @FXML
    public TextField username;

    /**
     * The passowrd input field
     */
    @FXML
    public TextField password;

    /**
     * The login stage
     */
    private Stage loginStage;

    /**
     * The constructor for the login page
     */
    public LoginController() {}

    @Override
    public void initialize(URL location, ResourceBundle resources) {

    }

    /**
     * Sets the stage
     * @param stage the stage to be set
     */
    public void setStage(Stage stage) {
        this.loginStage = stage;
    }

    /**
     * Sends the username and password for validation
     * If the username or password is incorrect, it will create a popup dialog
     */
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

    /**
     * Validates the username
     * @param text the text to check
     * @return true if the username exists in the database, false if not
     */
    private boolean validateUsername(String text) {
        //check if user exists in the database
        return true;
    }

    /**
     * Checks that the password matches the username
     * @param username the username to check
     * @param password the password to check
     * @return true if the username and password are correct, false if otherwise
     */
    private boolean validatePassword(String username, String password) {
        //get user with username
        // check if password matches username
        return true;
    }

    /**
     * Changes the scene to add course to homescreen
     */
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
