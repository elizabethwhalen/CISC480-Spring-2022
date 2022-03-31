package samples;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

//public class Main extends Application
//{
//    @Override
//    public void start(Stage primaryStage) {
////        VCalendar myCalendar = new VCalendar();
////        ICalendarAgenda cal = new ICalendarAgenda(myCalendar);
//        Agenda agenda = new Agenda();
//        agenda.appointments().addAll(
//                         new Agenda.AppointmentImplLocal()
//                             .withStartLocalDateTime(LocalDate.now().atTime(4, 00))
//                             .withEndLocalDateTime(LocalDate.now().atTime(15, 30))
//                             .withDescription("It's time")
//                             .withAppointmentGroup(new Agenda.AppointmentGroupImpl().withStyleClass("group1")) // you should use a map of AppointmentGroups
//                     );
//        BorderPane root = new BorderPane();
//        root.setCenter(agenda);
//        Scene scene = new Scene(root, 1366, 768);
//        primaryStage.setScene(scene);
//        primaryStage.show();
//    }
//}


public class Main extends Application {


    private Stage primaryStage;
    @Override

    public void start(Stage primaryStage) throws Exception {
        this.primaryStage = primaryStage;
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/scheduler2.fxml"));
        Parent root = loader.load();
        primaryStage.setTitle("Classy-Schedule");
        primaryStage.setScene(new Scene(root, 600, 450));
        primaryStage.show();

    }

    public static void main(String[] args) {
        launch(args);
    }
}
