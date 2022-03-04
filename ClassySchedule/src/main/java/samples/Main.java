package samples;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.layout.GridPane;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import users.Admin;
import users.User;

public class Main extends Application {

    private Stage primaryStage;
    @Override
    public void start(Stage primaryStage) throws Exception{

        this.primaryStage = primaryStage;
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/addcourse.fxml"));
        Parent root = loader.load();
        primaryStage.setTitle("Classy-Schedule");
        primaryStage.setScene(new Scene(root, 600, 400));
        primaryStage.show();

//        // Username Field
//        TextField username = new TextField();
//        username.setText("Username");
//
//        // Password Field
//        TextField password = new TextField();
//        password.setText("Password");
//
//        //Login onclick event
//        EventHandler<ActionEvent> event = new EventHandler<ActionEvent>() {
//            public void handle(ActionEvent e)
//            {
//                login();
//            }
//        };
//
//        // Login Button
//        Button loginButton = new Button();
//        loginButton.setText("Login");
//        loginButton.setOnAction(event);
//
//
//        // Layout for the login menu
//        GridPane loginLayout = new GridPane();
//        loginLayout.addRow(0, new Label("Username: "), username);
//        loginLayout.addRow(1, new Label("Password: "), password);
//        loginLayout.addRow(2, loginButton);
//
//
//        Scene scene = new Scene(loginLayout, 500, 300);
//        primaryStage.setScene(scene);

    }

    public void login() {


        User test = new Admin("Bob", "Test", 123123,6,6,"easilyCrackable");
        Text text = new Text();
        text.setText(test.getFirstName() + " " + test.getLastName());

        GridPane screen = new GridPane();
        screen.addRow(0, text);
        Scene mainApplication = new Scene(screen, 500, 300);
        primaryStage.setScene(mainApplication);
    }


    public static void main(String[] args) {
        launch(args);
    }
}
