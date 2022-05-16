package samples;

import database.DatabaseStatic;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import login.LoginController;

public class Main extends Application {

    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/LoginPage.fxml"));
        Parent root = loader.load();
        LoginController loginController = loader.getController();
        loginController.setStage(stage);
        stage.setOnCloseRequest(event -> {
            DatabaseStatic.getTimer().cancel();
            DatabaseStatic.getTimer().purge();
        });
        stage.setTitle("Classy-Schedule");
        stage.setScene(new Scene(root, 600, 450));
        stage.setMaximized(true);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
