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

/**
 * Controls the add room page, which allows a user to add a classroom to the database
 */
public class RoomController {

    private Stage addRoom;

    @FXML
    TextField room_number;

    @FXML
    ComboBox<String> building;

    @FXML
    ComboBox<String> campus;

    @FXML
    Button submit_button;

    @FXML
    Text roomWarning;

    @FXML
    Text buildingWarning;

    @FXML
    Text campusWarning;

    public RoomController() {
    }

    //May use in the future to reach into database for room options
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

    /**
     * Submits data that has been entered when submit button is clicked.
     * @param event submit button being clicked
     */
    @FXML
    public void submitData(ActionEvent event) {

        if (campus.getSelectionModel().isEmpty()) {
            campusWarning.setVisible(true);
            return;
        }
        if (room_number.getText().isBlank()) {
            roomWarning.setVisible(true);
            return;
        }
        if (building.getSelectionModel().isEmpty()) {
            buildingWarning.setVisible(true);
            return;
        }

        // room number validation
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
        //TODO: Send course to database instead of text file
        File file = new File("testroom.txt");
        try {
            FileWriter fw = new FileWriter(file);
            fw.append("Campus: " + campus.getValue() + " building: " + building.getValue() + " Room number: " + room_number.getText());
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        campus.setValue(null);
        room_number.clear();
        building.setValue(null);
        roomWarning.setVisible(false);
        buildingWarning.setVisible(false);
        campusWarning.setVisible(false);
    }
}
