# Express API Server
**Classy-Schedule Express API Server Repository**
</br>
The Database Team's Express API Server accepts HTTP requests from other teams. Based
on the received HTTP requests, the API then queries one of the Database Team's MySQL
database schemeas. The resulting data is return to the API where it is then sent to
the requesting client in the form of a JSON list.
</br></br>
To deploy this folder locally or to Azure, please follow the guide below:

## Local Deployment
To run the Express API Server locally, please complete the following steps:
1. $cd expressAPIServer
2. $npm install
3. $npm start

</br>
For information on how to connect to the locally-hosted API server, please see "/classy-api/versioning.md"

## Azure Deployment

### Deployment Versions
| Date     | API ver. | URI Connection                | Status | GitHub Commit ID                                                                                                  | Azure App Service   | Notes                                   |
|----------|----------|-------------------------------|--------|-------------------------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------|
| 04/18/22 | V2       | http://classy-api.ddns.net/V2 | Active | [7808348](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/7808348fe60cbf52408e3a0f5b2449acab0f9e55) | classy-schedule-api | Login and tokens                        |
| 04/04/22 | V0       | http://classy-api.ddns.net/   | Legacy | [0c7ec99](https://github.com/elizabethwhalen/CISC480-Spring-2022/commit/0c7ec9923d5abf9030e9a63c4d0e04b285c98129) | classy-schedule-api | Original version without update working |

### Deployment Process
To deploy the Express API Server to an Azure Web Service owned by the Database team, please complete the following steps:
1. $cd expressAPIServer
2. Install Visual Studio Code
3. Install Azure App Service extension for Visual Studio Code
4. Sign into your Azure account (Database Team members)
5. $code .
6. Select the "expressAPIServer" folder
7. Click the "Deploy to Web App" icon and select "classy-schedule-api"

</br>
Note: We followed this guide for Node.js application deployment to Azure: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-azure-portal
</br></br>
For information on how to connect to the locally-hosted API server, please see "/classy-api/versioning.md"
