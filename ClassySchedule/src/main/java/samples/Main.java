package samples;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import jfxtras.icalendarfx.VCalendar;
import jfxtras.scene.control.agenda.icalendar.ICalendarAgenda;

public class Main extends Application
{
    @Override
    public void start(Stage primaryStage) {
        VCalendar myCalendar = new VCalendar();
        ICalendarAgenda cal = new ICalendarAgenda(myCalendar);
        BorderPane root = new BorderPane();
        root.setCenter(cal);
        Scene scene = new Scene(root, 1366, 768);
        primaryStage.setScene(scene);
        primaryStage.show();
    }
}
//
//import javafx.application.Application;
//import javafx.fxml.FXMLLoader;
//import javafx.scene.Parent;
//import javafx.scene.Scene;
//import javafx.stage.Stage;
//import login.LoginController;
//
//
//public class Main extends Application {
//}
//
//    private Stage primaryStage;
//    @Override
//
//    public void start(Stage primaryStage) throws Exception {
//        this.primaryStage = primaryStage;
//        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/scheduler2.fxml"));
//        Parent root = loader.load();
//        primaryStage.setTitle("Classy-Schedule");
//        primaryStage.setScene(new Scene(root, 600, 450));
//        primaryStage.show();
//
//    }
//
//    public static void main(String[] args) {
//        launch(args);
//    }
//}
