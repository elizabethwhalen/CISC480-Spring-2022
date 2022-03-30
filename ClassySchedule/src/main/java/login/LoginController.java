package login;

import courses.CourseController;
import homescreen.HomescreenController;
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
 * Controller for the login page, which is the fist page a user sees. If the login is successful, users will be taken to
 * the homepage.
 */

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


    /**
     * Checks password validation (TBD) when submit button is clicked. Changes scene to homescreen if password is correct.
     */
    @FXML
    public void submitButtonClicked() {
        final boolean usernameCorrect = validateUsername(username.getText());
        if (usernameCorrect) {
            final boolean passwordCorrect = validatePassword(username.getText(), password.getText());
            if (passwordCorrect) {
                changeScene();
            }
        }
    }

    // TODO: Create validation for username and password: validateUsername and validatePassword functions

    /**
     * Checks if the user exists in the database
     * @param text user entered username to be checked
     * @return true if username exists, false if not
     */
    private boolean validateUsername(String text) {
        //check if user exists in the database
        return true;
    }

    /**
     * Checks if password matches username
     * @param username username of user
     * @param password user entered password to be validated
     * @return true if password is correct for username, false if not
     */
    private boolean validatePassword(String username, String password) {
        //get user with username
        //check if password matches username
        return true;
    }

    /**
     * Changes the view to the homescreen page
     */
    public void changeScene() {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Homescreen.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            HomescreenController loginController = loader.getController();
            loginController.setStage(loginStage);
        } catch (IOException e) {
            e.printStackTrace();
        }
        loginStage.setTitle("Classy-Schedule");
        loginStage.setScene(new Scene(root, 600, 400));
        loginStage.show();
    }

}
