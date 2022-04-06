package users;

import database.Database;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.sql.ResultSet;
import java.util.ResourceBundle;

public class FacultyController implements Initializable {
//public class FacultyController {

    private Stage addFaculty;
    @FXML
    TextField facultyName;

    @FXML
    TextField facultyID;

    //not in database
    @FXML
    TextField email;

    @FXML
    ComboBox<String> deptName;

    //not in database
    @FXML
    ComboBox<String> type;

    @FXML
    Button submitButton;

    @FXML
    Text nameWarning;

    @FXML
    Text IDWarning;

    @FXML
    Text emailWarning;

    @FXML
    Text departmentWarning;

    @FXML
    Text typeWarning;

    public FacultyController() {}

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        deptName.getItems().clear();
        try {
            Database database = new Database();
            ResultSet rs = database.getData("dept_code", "dept");
            while (rs.next()) {
                deptName.getItems().add(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setStage(Stage addFaculty) {
        this.addFaculty = addFaculty;
    }

    @FXML
    public void submitData(ActionEvent event) {
        if (deptName.getSelectionModel().isEmpty()) {
            departmentWarning.setVisible(true);
            return;
        }
        if (facultyName.getText().isBlank()) {
            nameWarning.setVisible(true);
            return;
        }
        if (facultyID.getText().isBlank()) {
            IDWarning.setVisible(true);
            return;
        }
        if (email.getText().isBlank()) {
            emailWarning.setVisible(true);
            return;
        }
        if (type.getSelectionModel().isEmpty()) {
            typeWarning.setVisible(true);
            return;
        }

        // ID number validation
        try {
            Integer.parseInt(facultyID.getText());
        } catch (NumberFormatException e) {
            IDWarning.setVisible(true);
            return;
        }

        //made it to the end of validation, send to database and then clear fields
        // maybe update courses already added?


        //TODO: Send faculty info to database
        File file = new File("testfaculty.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Name: " + facultyName.getText() + " ID: " + facultyID.getText() + " email: " + email.getText() + " department: " + deptName.getValue() + " type: " + type.getValue());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        facultyName.clear();
        facultyID.clear();
        email.clear();
        deptName.setValue("Dept name");
        type.setValue(null);
        nameWarning.setVisible(false);
        IDWarning.setVisible(false);
        emailWarning.setVisible(false);
        departmentWarning.setVisible(false);
        typeWarning.setVisible(false);
    }
}
