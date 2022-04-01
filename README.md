# CISC480-Spring-2022
**Classy-Schedule Development Repository**
Online web app: http://classy-schedule.ddns.net </br>
API access: http://classy-schedule-api.ddns.net

## Network Structure
![Alt text](documentation/classy-schedule-network-layout.png?raw=true "Title")
- Please see "Database Team" below for descriptions of each block. 

## Database Team
**expressAPIServer** : Express-based API server (hosted on DB team azure)
  - Access via HTTP request to http://classy-schedule-api.ddns.net (please see documentation/api to understand how the API is connected to)

</br>

**expressWebServerExample** : Express-based developmental web server that connects to the expressAPIServer (hosted on DB team azure). Web development team, please look at this example.
  - Access via browser at http:/cs-dev.ddns.net

</br>

**expressWebServerExampleStandalone** : Express-based web server that connects directly to a developmental database scheme. Please disregard this example for your own team development.

</br>

## Web Development Team
- Folders???
- The database team has reserved the following URL for you if you would like to use it: http://classy-schedule.ddns.net

## Desktop Team
- classyScheduleJavafx : Java project
