package login;

import database.DatabaseStatic;
import homescreen.HomescreenController;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.stage.Stage;
import scenes.ChangeScene;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controller for the login page, which is the fist page a user sees. If the login is successful, users will be taken to
 * the homepage.
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
    public void initialize(URL location, ResourceBundle resources){
        Platform.runLater(() -> username.requestFocus());
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
        if (validateLogin(username.getText(), password.getText())) {
            changeScene();
        } else {
            showIncorrectPasswordError();
         }
    }


    @FXML
    public void submitButton(KeyEvent keyEvent) {
        if (keyEvent.getCode() == KeyCode.ENTER) {
            if (validateLogin(username.getText(), password.getText())) {
                changeScene();
            } else {
                showIncorrectPasswordError();
            }
        }
    }

    private void showIncorrectPasswordError() {
        Alert invalidUser = new Alert(Alert.AlertType.ERROR);
        invalidUser.setTitle("Invalid Password");
        invalidUser.setContentText("INVALID USERNAME OR PASSWORD \n Please re-enter username and password");
        invalidUser.showAndWait();
    }

    /**
     * Checks if the user exists in the database
     * @param username user entered username to check
     * @param password user entered password to check
     * @return true if user exists, false if not
     */
    private boolean validateLogin(String username, String password) {
        return DatabaseStatic.login(username, password);
    }

    /**
     * Changes the view to the homescreen page
     */
    public void changeScene() {
        ChangeScene cs = new ChangeScene();
        cs.goToHomepage(loginStage);
    }

}
