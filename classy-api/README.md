# Classy-Schedule Express API Server Repository
__NOTE: For information on how to connect to the azure-hosted API server, please see "/docs/versioning.md"__
</br></br>
The Database Team's Express API Server accepts HTTP requests from other teams. Based
on the received HTTP requests, the API then queries one of the Database Team's MySQL
database schemas. The resulting data is return to the API where it is then sent to
the requesting client in the form of a JSON list.
</br></br>
To deploy this folder locally or to Azure, please follow the guide below:

## Local Deployment
To run the Express API Server locally, please complete the following steps:
1. $cd classy-api
2. $npm install
3. $npm start

## Azure Deployment
Please see information below for the Deployment Versions and Deployment Process

### Deployment Versions
| Date     | API ver. | URI Connection                | Status | GitHub Commit ID                                                                                                  | Azure App Service   | Notes                                   |
|----------|----------|-------------------------------|--------|-------------------------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------|
| 04/24/22 | V3       | https://classy-api.ddns.net/V3 | Active | [b6a5538](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/b6a5538f54040d812b63ba8c5095f43991555e80) | classy-schedule-api | Async/await and more robust options for certain tables |
| 04/20/22 | V2       | https://classy-api.ddns.net/V2 | Active | [081fe98](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/081fe98a2d5377d59a871f55291b30573c68d751) | classy-schedule-api | Login and tokens |
| 04/04/22 | V0       | http://classy-api.ddns.net/   | Deprecated | [0c7ec99](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/0c7ec9923d5abf9030e9a63c4d0e04b285c98129) | classy-schedule-api | Original version without update working |

**Satus types:**
</br>
Active: Please use this! Our most recent version. </br>
Legacy: Still works, just not ideal! </br>
Deprecated: Nope! Removed from our code. </br>

### Deployment Process
To deploy the Express API Server to an Azure Web Service owned by the Database team, please complete the following steps:
1. $cd classy-api
2. Install Visual Studio Code
3. Install Azure App Service extension for Visual Studio Code
4. Sign into your Azure account (Database Team members)
5. $code .
6. Select the "classy-api" folder
7. Click the "Deploy to Web App" icon and select "classy-schedule-api". Note: Please select "classy-schedule-dev" if you are deploying to developmental API server.

</br>
Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal
