package alert;

import javafx.scene.control.Alert;

public class MyAlert {
    private String alertTitle;
    private String alertMessage;
    private Alert.AlertType alertType;

    public MyAlert(String title, String message, Alert.AlertType type) {
        this.alertTitle = title;
        this.alertMessage = message;
        this.alertType = type;
    }

    public Alert createAlert() {
        Alert alert = new Alert(alertType);
        alert.setTitle(alertTitle);
        alert.setContentText(alertMessage);
        return alert;
    }

}
