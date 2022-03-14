# databaseConnectionExample
Description: Add, modify, and remove courses from the list below. Uses the "classy_schedule" test database on our Azure MySQL server "classy-schedule-server".

## Step one: Download

- First, download the repository to your local machine.
- Edit the file under "models/taskModel.js" to add a host, username, password, and database name to connect to a MySQL server. If this information is not updated, the default connection to the Database Team test server will be used.

## Step two: Launch web application

- To launch the web app, change directory to "databaseConnectionExample".
- Next, get the necessary npm modules with "$npm install".
- Then, run the app with "$node index.js".

## Step three: Run app

- Visit "localhost:3000" in your web browser to view the application
- Interact by adding courses to the database.

## Note to other teams!

- Use the connection info under "models/taskModel.js" lines 7-10 to connect to our DB.
- Instead of using the "courses" database that this example uses, use "class" and "dept" databases to complete tasks for Monday.
