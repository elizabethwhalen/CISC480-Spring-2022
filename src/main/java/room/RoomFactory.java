package room;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

/**
 * Builds room objects from the rooms stored in the database
 */
public class RoomFactory {

    /**
     * Constructs a room factory
     */
    public RoomFactory() {}

    /**
     * Creates the list of the room objects
     * @return returns a list of rooms that are stored in the database
     */
    public List<Room> createRooms() {
        List<Room> rooms = new ArrayList<>();

        JSONArray classRooms = DatabaseStatic.getData("room");

        if (classRooms == null) {
            return null;
        }
        for (Object json : classRooms) {
            JSONObject room = (JSONObject) json;

            Room room1 = new Room();
            room1.setBuildingCode(room.getString("building_code"));
            room1.setRoomNum(room.getString("room_num"));

            try {
               room1.setCapacity(room.getInt("capacity"));
            } catch (JSONException e) {
                // Capacity is not present in JSON, no need to do anything
            }

            rooms.add(room1);
        }

        return rooms;
    }
}
