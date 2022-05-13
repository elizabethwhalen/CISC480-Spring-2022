package room;

import database.DatabaseStatic;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class RoomFactory {

    public RoomFactory() {

    }

    public List<Room> createRooms() {
        List<Room> rooms = new ArrayList<>();

        JSONArray classRooms = DatabaseStatic.getData("room");

        for (Object json : classRooms) {
            JSONObject room = (JSONObject) json;

            Room room1 = new Room();
            room1.setBuildingCode(room.getString("building_code"));
            room1.setRoomNum(room.getString("room_num"));

            try {
               room1.setCapacity(room.getInt("capacity"));
            } catch (JSONException e) {
                //noop
            }

            rooms.add(room1);
        }

        return rooms;
    }
}
