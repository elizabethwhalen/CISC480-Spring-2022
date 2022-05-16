
#departments
#EX: "CISC","Computer Science"
CREATE TABLE dept (
    dept_code VARCHAR(5) NOT NULL,
    dept_name VARCHAR(40),
    PRIMARY KEY (dept_code)    
);

#classes- each one needs to be in a deptartment
#EX: "CISC","480","Capstone"
CREATE TABLE class (
    dept_code VARCHAR(5) NOT NULL,
    class_num VARCHAR(5) NOT NULL,
    class_name VARCHAR(100),
    PRIMARY KEY (dept_code , class_num),
    FOREIGN KEY (dept_code)
        REFERENCES dept (dept_code)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#faculty titles
#EX: 1,"Chair",6
CREATE TABLE title (
    title_id TINYINT NOT NULL AUTO_INCREMENT,
    title_name varchar(30),
    max_load DECIMAL(3,1),
    PRIMARY KEY (title_id)
);
#faculty
#EX: 98010986,"Jason","Sawin",1,2.5,2
CREATE TABLE faculty (
    faculty_id INT NOT NULL,
    faculty_first VARCHAR(50),
    faculty_last VARCHAR(50),
    title_id TINYINT NOT NULL,
    prev_load DECIMAL(3,1),
    curr_load DECIMAL(3,1),
    PRIMARY KEY (faculty_id),
    FOREIGN KEY (title_id)
        REFERENCES title (title_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#features of rooms that can be preferred by faculty or required for a course
#EX: 1,"whiteboard"
CREATE TABLE feature (
    feature_id TINYINT NOT NULL AUTO_INCREMENT,
    feature_name VARCHAR(100),
    PRIMARY KEY (feature_id)
);
#official timeslots in which a class can take place
#day_of_week: sunday=0, monday=1 .. saturday=6
#EX: 7,1,"5:30 PM","7:15 PM"
CREATE TABLE timeslot (
    time_id TINYINT NOT NULL AUTO_INCREMENT,
    day_of_week VARCHAR(7),
    time_start TIME,
    time_end TIME,
    PRIMARY KEY (time_id)
);
#buildings on campus
#EX:"OSS","O'Shaugnessy Science Hall"
CREATE TABLE building (
    building_code VARCHAR(5) NOT NULL,
    building_name VARCHAR(100),
    PRIMARY KEY (building_code)
);
#rooms that a class could be held in
#EX: "OSS","415",30
CREATE TABLE room (
    building_code VARCHAR(5) NOT NULL,
    room_num VARCHAR(5) NOT NULL,
    capacity SMALLINT,
    PRIMARY KEY (building_code , room_num),
    FOREIGN KEY (building_code)
        REFERENCES building (building_code)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#relationship between room and feature
#the features that exist in a room
#EX: "OSS","415",1
CREATE TABLE room_feature (
    building_code VARCHAR(5) NOT NULL,
    room_num VARCHAR(5) NOT NULL,
    feature_id TINYINT NOT NULL,
    PRIMARY KEY (building_code , room_num , feature_id),
    FOREIGN KEY (building_code , room_num)
        REFERENCES room (building_code , room_num)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#relationship between class and feature tables
#the features required by a class
#EX: "CISC","480",1
CREATE TABLE class_feature (
    dept_code VARCHAR(5) NOT NULL,
    class_num VARCHAR(5) NOT NULL,
    feature_id TINYINT NOT NULL,
    PRIMARY KEY (dept_code , class_num , feature_id),
    FOREIGN KEY (dept_code , class_num)
        REFERENCES class (dept_code , class_num),
    FOREIGN KEY (feature_id)
        REFERENCES feature (feature_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#relationship between faculty and feature tables
#the features a faculty member desires
#pref_level: -2=hate, -1=dislike, 0= no preference, 1=like, 2=love/need
#EX: 98010986,1,1
CREATE TABLE faculty_feature (
    faculty_id INT NOT NULL,
    feature_id TINYINT NOT NULL,
    pref_level TINYINT,
    PRIMARY KEY (faculty_id , feature_id),
    FOREIGN KEY (faculty_id)
        REFERENCES faculty (faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (feature_id)
        REFERENCES feature (feature_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#relationship between faculty and timeslot tables
#the timeslots a faculty member prefers
#pref_level: -2=hate, -1=dislike, 0= no preference, 1=like, 2=love/need
#EX: 98010986,7,2
CREATE TABLE faculty_timeslot (
    faculty_id INT NOT NULL,
    time_id TINYINT NOT NULL,
    pref_level TINYINT,
    PRIMARY KEY (faculty_id , time_id),
    FOREIGN KEY (faculty_id)
        REFERENCES faculty (faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (time_id)
        REFERENCES timeslot (time_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#general catch-all for unusual faculty requests
#are not used in automatically building a schedule
#EX: 98010986, "I only want to teach smart students"
CREATE TABLE faculty_other_request (
    faculty_id INT NOT NULL,
    request VARCHAR(130),
    PRIMARY KEY (faculty_id , request),
    FOREIGN KEY (faculty_id)
        REFERENCES faculty (faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#sections of a class
#EX: "CISC","480",2,"SPRING 2022",1,25
CREATE TABLE section (
    dept_code VARCHAR(5) NOT NULL,
    class_num VARCHAR(5) NOT NULL,
    section_num TINYINT NOT NULL,
    semester VARCHAR(15) NOT NULL,
    draft TINYINT NOT NULL,
    capacity SMALLINT,
    PRIMARY KEY (dept_code , class_num , section_num , semester , draft),
    FOREIGN KEY (dept_code , class_num)
        REFERENCES class (dept_code , class_num)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#relationship beetween faculty and section tables
#the sections taught by each faculty member
#EX: "CISC","480",2,"Spring 2022",1,98010986
CREATE TABLE teaches (
    dept_code VARCHAR(5) NOT NULL,
    class_num VARCHAR(5) NOT NULL,
    section_num TINYINT NOT NULL,
    semester VARCHAR(15) NOT NULL,
    draft TINYINT NOT NULL,
    faculty_id INT NOT NULL,
    PRIMARY KEY (dept_code , class_num , section_num , semester , draft , faculty_id),
    FOREIGN KEY (dept_code , class_num , section_num , semester , draft)
        REFERENCES section (dept_code , class_num , section_num , semester , draft)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (faculty_id)
        REFERENCES faculty (faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#relationship between faculty and class tables
#the classes a faculty member is qualified to teach
#pref_level: -2=hate, -1=dislike, 0= no preference, 1=like, 2=love/need
#EX: 98010986,"CISC","480",2
CREATE TABLE faculty_class (
    faculty_id INT NOT NULL,
    dept_code VARCHAR(5) NOT NULL,
    class_num VARCHAR(5) NOT NULL,
    pref_level TINYINT,
    PRIMARY KEY (faculty_id , dept_code , class_num),
    FOREIGN KEY (faculty_id)
        REFERENCES faculty (faculty_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (dept_code , class_num)
        REFERENCES class (dept_code , class_num)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#ternary relationship between section, room, and timeslot tables
#the time and place of each class section
#EX: "CISC","480",2,"Spring 2022",1,"OSS","415",7
CREATE TABLE meets (
    dept_code VARCHAR(5) NOT NULL,
    class_num VARCHAR(5) NOT NULL,
    section_num TINYINT NOT NULL,
    semester VARCHAR(15) NOT NULL,
    draft TINYINT NOT NULL,
    building_code VARCHAR(5) NOT NULL,
    room_num VARCHAR(5) NOT NULL,
    time_id TINYINT NOT NULL,
    PRIMARY KEY (building_code , room_num , time_id),
    FOREIGN KEY (dept_code , class_num , section_num , semester , draft)
        REFERENCES section (dept_code , class_num , section_num , semester , draft)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (building_code , room_num)
        REFERENCES room (building_code , room_num)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (time_id)
        REFERENCES timeslot (time_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
#login table used to validate usernames and passwords for access
#access_level: 1=faculty, 2=schedule maker
#EX: "jasonsawin123","Th@tsP3rsonal",98010986,2
CREATE TABLE login (
    email VARCHAR(130) NOT NULL,
    pass VARCHAR(100) NOT NULL,
    faculty_id INT,
    access_level TINYINT NOT NULL,
    tmp SMALLINT,
    PRIMARY KEY (email)
);
