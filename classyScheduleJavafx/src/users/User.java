package users;

public interface User {

    String getFirstName();

    void setFirstName(String firstName);

    String getLastName();

    void setLastName(String lastName);

    int getId();

    void setId(int id);

    float getRemainingTeachLoad();

    void setRemainingTeachLoad(float remainingTeachLoad);

    int getPrepNum();

    void setPrepNum(int prepNum);

    String getPassword();

    void setPassword(String password);
}
