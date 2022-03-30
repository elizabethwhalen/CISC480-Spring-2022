package samples;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import login.LoginController;


public class Main extends Application {

    private Stage primaryStage;
    @Override

    public void start(Stage primaryStage) throws Exception {
        this.primaryStage = primaryStage;
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/LoginPage.fxml"));
        Parent root = loader.load();
        LoginController loginController = loader.getController();
        loginController.setStage(primaryStage);
        primaryStage.setTitle("Classy-Schedule");
        primaryStage.setScene(new Scene(root, 600, 450));
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
