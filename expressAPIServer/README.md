# Express API Server
**Classy-Schedule Express API Server Development Repository**
The Database Team's Express API Server accepts HTTP requests from other teams. Based
on the received HTTP requests, the API then queries one of the Database Team's MySQL
database schemeas. The resulting data is return to the API where it is then sent to
the requesting client in the form of a JSON list.
<br>
To deploy this folder locally or to Azure, please follow the guide below.

## Local Deployment
To run the Express API Server locally, please complete the following steps:
1. $cd expressAPIServer
2. $npm install
3. $npm start
4. From another terminal, submit HTTP requests to http://localhost:3001
  - Ex1: $curl -X GET "http://localhost:3001/classes:id"
  - Ex2:

## Azure Deployment
To deploy the Express API Server to an Azure Web Service owned by the Database team, please complete the following steps:
1. $cd expressAPIServer
2. $npm install
3. Install Visual Studio Code
4. Install Azure App Service extension for Visual Studio Code
5. Sign into your Azure account (Database Team members)
6. $code .
7. Select the "expressAPIServer" folder
8. Click the "Deploy to Web App" icon and select "classy-schedule-api"

Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal
