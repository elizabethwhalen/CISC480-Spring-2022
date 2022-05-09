package alert;

import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;

import java.util.Optional;

/**
 * An Alert class for consistency when creating the alert for all the required scenes
 */
public class MyAlert {
    /**
     * The alert title
     */
    private String alertTitle;

    /**
     * the alert message or context
     */
    private String alertMessage;

    /**
     * The alert type
     */
    private Alert.AlertType alertType;

    /**
     * Constructor for the MyAlert class
     * @param title the title for the MyAlert object
     * @param message the context or message for the MyAlert object
     * @param type the alert type for the alert object
     */
    public MyAlert(String title, String message, Alert.AlertType type) {
        this.alertTitle = title;
        this.alertMessage = message;
        this.alertType = type;
    }

    /**
     * Create an actual alert object from the given object's parameters
     * @return an alert
     */
    public Alert createAlert() {
        Alert alert = new Alert(alertType);
        alert.setTitle(alertTitle);
        alert.setContentText(alertMessage);
        alert.setAlertType(alertType);
        return alert;
    }

    /**
     * Display the alert
     */
    public void show() {
        Alert alert = createAlert();
        alert.showAndWait();
    }


    public Optional<ButtonType> showButton() {
        Optional<ButtonType> Ok = createAlert().showAndWait();
        return Ok;
    }


}
