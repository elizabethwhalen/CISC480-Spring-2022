package room;

/**
 * A room template, holds all the room basics
 */
public class Room {
    /**
     * The building code of the room
     * Ex. OSS
     */
    private String buildingCode;

    /**
     * The room number of the room
     * Ex. 415
     */
    private String roomNum;

    /**
     * The capacity of the room
     * Ex. 25
     */
    private int capacity;

    /**
     * Constructs a room object
     */
    public Room() {}

    /**
     * The following methods are all basic getters/setters that need
     * no further explanation. Allowed by Google Style Guide Section 7.3.1
     */
    public String getBuildingCode() {
        return buildingCode;
    }

    public void setBuildingCode(String buildingCode) {
        this.buildingCode = buildingCode;
    }

    public String getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(String roomNum) {
        this.roomNum = roomNum;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    /**
     * Builds the room information string
     * @return Returns a string with the building code and the room num
     */
    public String toString() {
        return getBuildingCode() + " " + getRoomNum();
    }
}
