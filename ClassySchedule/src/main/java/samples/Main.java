package samples;


import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
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
        Parent root = FXMLLoader.load(getClass().getResource("/resources/fxml/sample.fxml"));
        primaryStage.setTitle("Classy-Schedule");
        primaryStage.setScene(new Scene(root, 1000, 700));
        primaryStage.show();

        // Username Field
        TextField username = new TextField();
        username.setText("Username");

        // Password Field
        TextField password = new TextField();
        password.setText("Password");

        //Login onclick event
        EventHandler<ActionEvent> event = new EventHandler<ActionEvent>() {
            public void handle(ActionEvent e)
            {
                adminLogin();
            }
        };


        // Login Button
        Button loginButton = new Button();
        loginButton.setText("Login");
        loginButton.setOnAction(event);


        // Layout for the login menu
        GridPane loginLayout = new GridPane();
        loginLayout.addRow(0, new Label("Username: "), username);
        loginLayout.addRow(1, new Label("Password: "), password);
        loginLayout.addRow(2, loginButton);


        Scene scene = new Scene(loginLayout, 500, 300);
        primaryStage.setScene(scene);

    }



    public void adminLogin() {


        User test = new Admin("Bob", "Test", 123123,6,6,"easilyCrackable");
        Text text = new Text();
        text.setText(test.getFirstName() + " " + test.getLastName()+"'s homepage (Admin)");

        GridPane screen = new GridPane();
        screen.addRow(0, text);

        // For adding new Users
        screen.add(new Text(),0,1);
        // Elements for adding a new user
        Button newUser = new Button("Add new user");
        EventHandler<ActionEvent> addNewUser = new EventHandler<ActionEvent>() {
            public void handle(ActionEvent e)
            {
                addNewUser();
            }
        };
        newUser.setOnAction(addNewUser);
        screen.add(newUser, 0,2);

        // Adding a new course offering
        Button newCourse = new Button("Add new course");
        EventHandler<ActionEvent> addNewCourse = new EventHandler<ActionEvent>() {
            public void handle(ActionEvent e)
            {
                addNewCourse();
            }
        };
        newCourse.setOnAction(addNewCourse);
        screen.add(newCourse, 0,3);

        Button viewSchedule = new Button("View Schedule");
        screen.add(viewSchedule, 0,4);


        Scene mainApplication = new Scene(screen, 1000, 700);
        primaryStage.setScene(mainApplication);
    }

    public void addNewCourse() {
        GridPane screen = new GridPane();

        EventHandler<ActionEvent> event = new EventHandler<ActionEvent>() {
            public void handle(ActionEvent e)
            {
                adminLogin();
            }
        };

        // For adding new Users
        screen.add(new Text(),0,1);
        // Elements for adding a new user
        screen.add(new Text("Add a new Course here"), 0, 2);
        screen.add(new TextField("Class Name"), 0,3);
        screen.add(new TextField("ID Number"), 0, 4);
        screen.add(new TextField("Section Number"), 0, 5);
        screen.add(new TextField("Department"), 0, 6);
        screen.add(new TextField("Capacity"), 0, 7);
        screen.add(new TextField("Modality"), 0, 8);
        screen.add(new TextField("Credits"), 0, 9);
        screen.add(new Button("Add Course"),0,10);
        screen.add(new Text(),0,11);

        Button home = new Button("Back to home screen");
        home.setOnAction(event);
        screen.add(home,0,12);

        Scene newUser = new Scene(screen, 1000, 700);
        primaryStage.setScene(newUser);
    }



    public void addNewUser() {
        GridPane screen = new GridPane();

        EventHandler<ActionEvent> event = new EventHandler<ActionEvent>() {
            public void handle(ActionEvent e)
            {
                adminLogin();
            }
        };

        // For adding new Users
        screen.add(new Text(),0,1);
        // Elements for adding a new user
        screen.add(new Text("Add a new user here"), 0, 2);
        screen.add(new TextField("First Name"), 0,3);
        screen.add(new TextField("Last Name"), 1, 3);
        screen.add(new Button("Add as Admin"),0,4);
        screen.add(new Button("Add as Adjunct"), 1,4);
        screen.add(new Button("Add as Full-Time"),2,4);
        screen.add(new Text(),0,5);

        Button home = new Button("Back to home screen");
        home.setOnAction(event);
        screen.add(home,0,6);

        Scene newUser = new Scene(screen, 1000, 700);
        primaryStage.setScene(newUser);
    }


    public static void main(String[] args) {
        launch(args);
    }
}
