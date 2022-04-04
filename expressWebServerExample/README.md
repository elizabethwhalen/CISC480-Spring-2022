# Express Web Server Example
**Classy-Schedule Express Web Server Example Development Repository**
</br>
PLEASE NOTE: I cannot deploy to azure at the moment but local testing for expressWebServerExample and expressAPIServer should work.
</br>
The Database Team's Express Web Server Example is a prototype web server than connects to our API. Please see the diagram within the README for "CISC480-Spring-2022".
</br></br>
To deploy this folder locally or to Azure, please follow the guide below:
</br></br>
Note: When switching between local and azure testing, make sure to change the variable "deployment".
## Local Deployment
To run the Express Web Server Example locally, please complete the following steps:
1. $cd expressWebServerExample
2. $npm install
3. $npm start
4. Use a web browser to visit http://localhost:3000

## Azure Deployment
To deploy the Express Web Server Example to an Azure Web Service owned by the Database team, please complete the following steps:
1. $cd expressWebServerExample
2. $npm install
3. Install Visual Studio Code
4. Install Azure App Service extension for Visual Studio Code
5. Sign into your Azure account (Database Team members)
6. $code .
7. Select the "expressWebServerExample" folder
8. Click the "Deploy to Web App" icon and select "databaseconnectionexample"
9. Use a web browser to visit http://classy-dev.ddns.net

Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal
