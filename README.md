# CISC480-Spring-2022
**Classy-Schedule Development Repository**
</br>
expressAPIServer - API access: http://classy-api.ddns.net (please see expressAPIServer/README.MD for API connection info and examples)
</br>
expressWebServerExample - Online web app: http://classy-dev.ddns.net
</br>
~~expressWebServerExampleStandalone - Standalone web app (deprecated)~~

## Network Structure
![Alt text](documentation/classy-schedule-network-layout.png?raw=true "Title")
- Please see "Database Team" below for descriptions of each block. 

## Database Team
**expressAPIServer** : Express-based API server (hosted on DB team azure)
  - Access via HTTP request to http://classy-api.ddns.net (please see expressAPIServer/README.MD for API connection info and examples)

**expressWebServerExample** : Express-based developmental web server that connects to the expressAPIServer (hosted on DB team azure). Web development team, please look at this example.
  - Access via browser at http://classy-dev.ddns.net | NOTE: I cannot deploy to Azure tonight and will fix soon.

**expressWebServerExampleStandalone** : Express-based web server that connects directly to a developmental database scheme. Please disregard this example for your own team development. We are trying to phase out this design and have expressAPIServer and expressWebServerExample separated.

## Web Development Team
- Folders???
- The database team has reserved the following URL for you if you would like to use it: http://classy-schedule.ddns.net

## Desktop Team
- classyScheduleJavafx : Java project
