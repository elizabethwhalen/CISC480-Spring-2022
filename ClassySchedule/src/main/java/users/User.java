package users;

public interface User {

    //TODO: add comments
    String getFirstName();

    void setFirstName(String firstName);

    String getLastName();

    void setLastName(String lastName);

    int getId();

    void setId(int id);

    float getTeachLoad();

    void setTeachLoad(float teachLoad);

    int getPrepNum();

    void setPrepNum(int prepNum);

    String getPassword();

    void setPassword(String password);
}
