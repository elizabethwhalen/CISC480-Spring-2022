# Classy-Schedule Database Server
</br></br>
## Database Overview
For this project, the Database Team developed a MySQL database composed of 19 tables. These tables, shown in the figure below, allow our database system to account for (1) buildings, (2) room-feature attachments, (3) features, (4) features required by a class, (5) rooms, (6) departments, (7) class offerings, (8) section offerings for a class, (9) assignments between a room, section and timeslot, (10) faculty preferences for features, (11) whether a faculty member can teach a course, (12) what sections a faculty member teaches, (13) faculty members, (14) which timelots a faculty member prefers, (15) university timeslots, (16) special requests of faculty members, (17) the title of each faculty member, (18) available titles, and (19) login information. 
</br>
![Classy-Schedule Database ER Diagram](/docs/figures/final-ERD.jpg?raw=true "Classy-Schedule Database ER Diagram")
</br></br>
These tables are modified within our database schema through SQL queries. Please see the Domain Analysis section of our final report for more information about the database design. The database has multiple forms of security implemented. One aspect will the secure storage of passwords. Passwords are never stored in plaintext in our database system, therefore, providing a layer of security for all the users and faculty members. Because of the possibility for complex entity relationships, requiring a large set of unique SQL queries, we developed a structured API that serves as a layer between the other development teams. Our database is hosted on Azure and, outside of our own development team, is only accessible through our own API. 

## Database Access
Most commonly, the database is accessed through our API Server. Please see our ["classy-api"](/classy-api) directory for more information about the API Server. To access the database directly, we recommend using [MySQL WorkBench](https://www.mysql.com/products/workbench/) with the following information:
| Attirbute | Value |
|---------------|--------------|
| Conneciton method | Standard (TCP/IP) |
| Connection name | classy-schedule-database |
| Hostname | classy-schedule-database.mysql.database.azure.com |
| Port | 3306 |
| Username | db_test |
| Password | [HIDDEN](/classy-api/hidden/db_password.txt) |
| Default Schema | cs_dev |
<br />
Note: We have also used the schema "db_dev" for testing, but the other teams use "cs_dev". Before the final presentation, we may populate an example schema at "db_final".

## Database Archives
Gabbie

## Database Creation
The first step in creating the database was creating a schema for all of the tables to be in. This was created by running this SQL query
```
CREATE SCHEMA schemaname;
```
After the schema is set up, tables can be added to the schema. When creating a table the name of the table, column names, and column types should be present. Here's an example of a query to create a table.
```
CREATE TABLE building (
    building_name   VARCHAR(5),
    building_code   VARCHAR(5)
);
```
<br />
As part of our project replicability initiative, we created an stored procedure SQL script that can populate a MySQL schema according to the ERD above. Please see this script at [/classy-db/table_creation.sql](/classy-db/table_creation.sql)

Next
## Local Development
Local development and testing can be done by installing MySQL Server as well as [MySQL Workbench](https://www.mysql.com/products/workbench/). We followed the guide ["Getting Started with MySQL"](https://dev.mysql.com/doc/mysql-getting-started/en/) by [MySQL.com](https://mysql.com).

## Cloud Hosting
Using Azure, we set up an Azure MySQL Database with the guide ["Quickstart: Create an Azure Database for MySQL server by using the Azure portal"](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal). We then creted a user account "db_test" and password that is used to submit all queries through our API Server. Please see [/classy-api/app.js](/classy-api/app.js) for implementation details.
