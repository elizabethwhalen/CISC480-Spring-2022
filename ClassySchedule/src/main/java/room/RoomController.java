package room;

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

//public class RoomController implements Initializable {
public class RoomController {

    private Stage addRoom;
    @FXML
    TextField room_number;

    @FXML
    TextField building;

    @FXML
    TextField campus;

    //@FXML
    //ComboBox<String> dept_name;

    @FXML
    Button submit_button;

    @FXML
    Text roomWarning;

    @FXML
    Text buildingWarning;

    @FXML
    Text campusWarning;

    public RoomController() {}

    /*@Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        dept_name.getItems().clear();
        try {
            Database database = new Database();
            ResultSet rs = database.getData("dept_code", "dept");
            while (rs.next()) {
                dept_name.getItems().add(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    public void setStage(Stage addRoom) {
        this.addRoom = addRoom;
    }

    @FXML
    public void submitData(ActionEvent event) {
        /*if (dept_name.getSelectionModel().isEmpty()) {
            departmentWarning.setVisible(true);
            return;
        }*/
        if (campus.getText().isBlank()) {
            campusWarning.setVisible(true);
            return;
        }
        if (room_number.getText().isBlank()) {
            roomWarning.setVisible(true);
            return;
        }
        if (building.getText().isBlank()) {
            buildingWarning.setVisible(true);
            return;
        }

        // room number validation. Testing it out by printing right now.
        try {
            if(room_number.getLength() == 3) {
                Integer.parseInt(room_number.getText());
            } else {
                roomWarning.setVisible(true);
            }
        } catch (NumberFormatException e) {
            roomWarning.setVisible(true);
            return;
        }

        //made it to the end of validation, send to database and then clear fields
        // maybe update courses already added?


        //TODO: Send course to database
        File file = new File("testroom.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Campus: " + campus.getText() + " building: " + building.getText() + " Room number: " + room_number.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        campus.clear();
        room_number.clear();
        building.clear();
        roomWarning.setVisible(false);
        buildingWarning.setVisible(false);
        campusWarning.setVisible(false);
    }
}
