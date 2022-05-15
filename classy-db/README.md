# Classy-Schedule Database Server
</br></br>
## Database Overview
For this project, the Database Team developed a MySQL database composed of 19 tables. These tables, shown in the figure below, allow our database system to account for (1) buildings, (2) room-feature attachments, (3) features, (4) features required by a class, (5) rooms, (6) departments, (7) class offerings, (8) section offerings for a class, (9) assignments between a room, section and timeslot, (10) faculty preferences for features, (11) whether a faculty member can teach a course, (12) what sections a faculty member teaches, (13) faculty members, (14) which timelots a faculty member prefers, (15) university timeslots, (16) special requests of faculty members, (17) the title of each faculty member, (18) available titles, and (19) login information. 
</br>
![Classy-Schedule Database ER Diagram](/docs/figures/classy-schedule-full.jpg?raw=true "Classy-Schedule Database ER Diagram")
</br>
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
</br>
Note: We have also used the schema "db_dev" for testing, but the other teams use "cs_dev". Before the final presentation, we may populate an example schema at "db_final".

## Database Archives
What snapshots do we have of DB?

## Database Creation
The first step in creating the database was creating a schema for all of the tables to be in. This was created by running this SQL query
```
CREATE SCHEMA schemaname;
```
After the schema is set up, tables can be added to the schema. When creating a table the name of the table, column names, and column types should be present. 
Here's an example of a query to create a table.

```
CREATE TABLE building (
    building_name   VARCHAR(5),
    building_code   VARCHAR(5)
);
```

## Local Development
Local development and testing can be done by making changes to classy-api/app.js and running `npm start` from the terminal to test your changes. Node will continue to run the application locally until you manually stop the `npm start` command. Once the application is running, open another terminal and run you CURL requests from there. To test the changes you have made on your local machine, change `https://classy-api.ddns.net` in the URL to `http://localhost:3000`. Keep in mind any changes to the database you make using POST, PUT, or DELETE will be done on the production database. 


## Deployment
Deployment of the API to Azure can be completed using the Azure extension in [VS Code](https://docs.microsoft.com/en-us/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli#4---deploy-application-code-to-azure). 

LINK JOE'S DATABASE BUILD HERE

</br>
</br>
After we tear this project down, and we wanted to setup the database exactly how it was, what process do we need to pursue?
