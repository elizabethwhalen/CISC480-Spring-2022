package samples;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import scheduler.SchedulerController;


public class Main extends Application {


    private Stage primaryStage;

    @Override
    public void start(Stage primaryStage) throws Exception {
        this.primaryStage = primaryStage;
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/scheduler.fxml"));
        Parent root = loader.load();
        SchedulerController schedulerController = loader.getController();
        schedulerController.setStage(primaryStage);
        this.primaryStage.setTitle("Classy-Schedule");
        this.primaryStage.setScene(new Scene(root, 600, 450));
        this.primaryStage.show();

    }

    public static void main(String[] args) {
        launch(args);
    }
}
