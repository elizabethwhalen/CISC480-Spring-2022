package users;

import database.Database;
import homescreen.HomescreenController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.ComboBox;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ResourceBundle;

public class FacultyController implements Initializable {

    private Stage addFaculty;

    @FXML
    TextField facultyLast;

    @FXML
    TextField facultyFirst;

    @FXML
    TextField facultyID;

    //not in database
    //@FXML
    //TextField email;

    //not in database
    //@FXML
    //ChoiceBox<String> deptName;


    @FXML
    ChoiceBox<String> type;

    @FXML
    Button submitButton;

    @FXML
    Button cancelButton;

    @FXML
    Text firstNameWarning;

    @FXML
    Text lastNameWarning;

    @FXML
    Text IDWarning;

    //@FXML
    //Text emailWarning;

    //@FXML
    //Text departmentWarning;

    @FXML
    Text typeWarning;

    public FacultyController() {}

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        facultyFirst.clear();
        facultyLast.clear();
        facultyID.clear();
        type.setValue(null);
        Database database = new Database();

        JSONArray types = database.getData("title");
        for (Object jsonObject: types) {

            JSONObject job = (JSONObject)jsonObject;
            if (job.get("title_id") != JSONObject.NULL) {
                Title title = Title.valueOfLabel(String.valueOf(job.get("title_id")));
                type.getItems().add(String.valueOf(title));

            }
        }
    }

    public void setStage(Stage addFaculty) {
        this.addFaculty = addFaculty;
    }

    /**
     * Changes scene back to homescreen when cancelButton is clicked
     * @param event Clicking on cancelButton
     */
    @FXML
    public void cancelButtonClicked(ActionEvent event) {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/resources/fxml/Homescreen.fxml"));
        Parent root = null;
        try {
            root = loader.load();
            HomescreenController homescreenController = loader.getController();
            homescreenController.setStage(addFaculty);

        } catch (IOException e) {
            e.printStackTrace();
        }
        facultyFirst.clear();
        facultyLast.clear();
        facultyID.clear();
        type.setValue(null);

        addFaculty.setTitle("Classy-Schedule");
        addFaculty.setScene(new Scene(root, 650, 400));
        addFaculty.show();
    }


    @FXML
    public void submitData(ActionEvent event) {
        firstNameWarning.setVisible(false);
        lastNameWarning.setVisible(false);
        IDWarning.setVisible(false);
        typeWarning.setVisible(false);

        boolean warning = false;

        if (facultyFirst.getText().isBlank()) {
            firstNameWarning.setVisible(true);
            warning = true;
        }
        if (facultyLast.getText().isBlank()) {
            lastNameWarning.setVisible(true);
            warning = true;
        }
        if (facultyID.getText().isBlank()) {
            IDWarning.setVisible(true);
            warning = true;
        }
        if (type.getSelectionModel().isEmpty()) {
            typeWarning.setVisible(true);
            warning = true;
        }
        try {
            Integer.parseInt(facultyID.getText());
        } catch (NumberFormatException e) {
            IDWarning.setVisible(true);
            warning = true;
        }
        if (!warning){
            //create JSON Object to submit to database
            Database database = new Database();
            JSONObject newFaculty = new JSONObject();
            newFaculty.put("faculty_id", facultyID.getText());
            newFaculty.put("faculty_first", facultyFirst.getText());
            newFaculty.put("faculty_last", facultyLast.getText());
            newFaculty.put("title_id", Title.valueOf(type.getValue()));

            try {
                database.insertData("faculty", newFaculty);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }

            facultyFirst.clear();
            facultyLast.clear();
            facultyID.clear();
            type.setValue(null);
        }

    }

}
