package room;

import database.Database;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import homescreen.HomescreenController;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ResourceBundle;

/**
 * Controls the add room page, which allows a user to add a classroom to the database
 */
public class RoomController implements Initializable {

    private Stage addRoom;
    private Scene scene;
    private Parent root;

    @FXML
    TextField roomNum;

    @FXML
    ChoiceBox<String> buildingName;

    @FXML
    TextField capacity;

    @FXML
    Button submitButton;

    @FXML
    Button cancelButton;

    @FXML
    Text roomWarning;

    @FXML
    Text buildingWarning;

    @FXML
    Text capacityWarning;

    public RoomController() {
    }


    //May use in the future to reach into database for room options
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        buildingName.getItems().clear();
        try {
            Database database = new Database();
            JSONArray rs = database.getData("building");
            for (Object jsonObject: rs) {
                //buildingName.getItems().add(rs.getString(1));
                JSONObject job = (JSONObject)jsonObject;
                buildingName.getItems().add((String) job.get("building_code"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void setStage(Stage addRoom) {
        this.addRoom = addRoom;
    }

    /**
     * Submits data that has been entered when submit button is clicked.
     * @param event submit button being clicked
     */
    @FXML
    public void submitData(ActionEvent event) {

        if (capacity.getText().isEmpty()) {
            capacityWarning.setVisible(true);
            return;
        }
        if (roomNum.getText().isBlank()) {
            roomWarning.setVisible(true);
            return;
        }
        if (buildingName.getSelectionModel().isEmpty()) {
            buildingWarning.setVisible(true);
            return;
        }

        // room number validation
        try {
            if(roomNum.getLength() == 3) {
                Integer.parseInt(roomNum.getText());
            } else {
                roomWarning.setVisible(true);
            }
        } catch (NumberFormatException e) {
            roomWarning.setVisible(true);
            return;
        }

        Database database = new Database();

        JSONObject newRoom = new JSONObject();
        newRoom.put("room_num", roomNum.getText());
        newRoom.put("building_code", buildingName.getValue());
        newRoom.put("capacity", capacity.getText());

        try {
            database.insertData("room", newRoom);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }



        capacity.clear();
        roomNum.clear();
        buildingName.setValue(null);
        roomWarning.setVisible(false);
        buildingWarning.setVisible(false);
        capacityWarning.setVisible(false);
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
                homescreenController.setStage(addRoom);

            } catch (IOException e) {
                e.printStackTrace();
            }
            addRoom.setTitle("Classy-Schedule");
            addRoom.setScene(new Scene(root, 650, 400));
            addRoom.show();
    }


}
