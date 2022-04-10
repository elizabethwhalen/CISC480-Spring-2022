package samples;

import database.Database;
import javafx.application.Application;
import javafx.stage.Stage;
import org.json.JSONObject;


public class Main extends Application {


    private Stage primaryStage;

    @Override
    public void start(Stage stage) throws Exception {
        Database db = new Database();
        JSONObject json = new JSONObject();
        json.put("building_name", "x");
        json.put("building_code", "z");
        System.out.println(db.getData("building"));
        db.insertData("building", json);
        System.out.println(db.getData("building"));



//        JSONArray array = db.getData("class");
//        System.out.println(array);
//        List<AbstractMap.SimpleEntry<String, String>> test = new ArrayList<>();
//        test.add(new AbstractMap.SimpleEntry<>("building_code", "OSS"));
//        JSONArray array2 = db.getData("building", test);
//        System.out.println(array2);
//        List<AbstractMap.SimpleEntry<String, String>> test2 = new ArrayList<>();
//        test2.add(new AbstractMap.SimpleEntry<>("dept_code", "TEST2"));
//        test2.add(new AbstractMap.SimpleEntry<>("dept_name", "TESTNAME2"));
//        System.out.println( db.getData("dept"));
        db.insertData("dept", null);
      //  System.out.println(db.getData("dept"));
         // db.getData("building");
//        this.primaryStage = stage;
//        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/LoginPage.fxml"));
//        Parent root = loader.load();
//        LoginController loginController = loader.getController();
//        loginController.setStage(primaryStage);
//        primaryStage.setTitle("Classy-Schedule");
//        primaryStage.setScene(new Scene(root, 600, 450));
//        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
