package login;

import javafx.fxml.FXML;
import javafx.scene.control.Button;

public class LoginController {
    @FXML
    public Button submitButton;

    @FXML
    public String username;

    @FXML
    public String password;

    public LoginController() {}

    public void initialize() {

    }

    @FXML
    public void submitButtonClicked() {
        System.out.println("This is a test of the submit button");
    }

}
