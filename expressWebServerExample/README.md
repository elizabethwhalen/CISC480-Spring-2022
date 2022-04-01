# Express Web Server Example
**Classy-Schedule Express Web Server Example Development Repository**
PLEASE NOTE: This directory (along with expressAPIServer) do not currently work properly. Will be fixed by tomorrow night.
</br>
The Database Team's Express Web Server Example (Standalone) is a first version prototype that has no separation between the web interface and the API. Please see the diagram within the README for "CISC480-Spring-2022". Ideally, we hope to remove this repository by the week of 04/04/2022.
</br>
To deploy this folder locally or to Azure, please follow the guide below.

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
9. Use a web browser to visit http://cs-dev.ddns.net

Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal
