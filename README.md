# PostGUI

**A React web application to query and share any PostgreSQL database.**

## Introduction

A fundamental concept in scientific research is of producing and sharing good quality data sets to allow new hypothesis to be generated from existing knowledge. The emergence of the ‘Big Data’ phenomenon in scientific research has introduced data sharing as a new bottleneck. This web platform allows scientists (and others) to filter and share large data sets that are beyond the limits of traditional spreadsheet software.

PostGUI is a ReactJS web application that serves as a GUI front-end to any PostgreSQL database using the PostgREST automatic API tool. This front-end application provides an overview of the database schema, a query builder to precisely extract data, and an authentication system which grants edit access to the database table contents. This instance of PostGUI serves as a demo that shares a publicly available  DVD database.

#### Getting help

To get help with use cases/feasibility or anything else, please make a new issue on GitHub repository.


#### Pre-requisite
A local PostgreSQL database with your data. Alternatively, following the Installation section will get you started with a sample database.


## Features

#### Data compatibility

One of PostGUI’s design principle has been for it to be as database agnostic as possible. Hence, the user must organize the data set(s) to be shared in a PostgreSQL database instance running on a local computer (only data access using PostGUI) or web server (data access and data sharing using PostGUI).

Certain features of the PostGUI web application require specific database schema design. For example, to allow users to edit the database tables, the database tables must have a defined primary key (PK) attribute. However, if a PK is not defined for a table, PostGUI will gracefully disable the edit feature rather than force a PK to be defined.

#### Database Picker

![Database Picker](docs/images/db-picker.png)

The database picker allows multiple PostgreSQL databases to be shared from a single instance of PostGUI. The database name is customizable using the config.json file (databases -> title).

#### Database Schema

![Database Schema](docs/images/schema.png)

The database schema (tables, columns, and foreign keys) is shown in the left panel of the PostGUI user interface. The table and column names can be replaced with a custom string for a more user-friendly table and column name. Foreign key relationships are shown with “Referenced by” and “FK to” labels. 

#### Search Feature

![Search Box](docs/images/search.png)

Search feature can be used to filter and find a table or column quickly. To search for a specific table or a column, each search term can be tagged with ‘[table]’ or ‘[column]’.

#### Query Builder and Query Options

![Query Builder and Query Options](docs/images/query.png)

The integration of the JS Query Builder in this web application makes it easily usable by those who don’t know SQL. Query options can be used to fine tune the data being extracted from the database, and to ensure the full result is being shown (exact row count feature). 

#### Data Table

![Data Table](docs/images/table.png)

The query result component features a high-performance data table that can sort columns by their values and edit individual cell values (if edit feature is enabled).

#### Download Data

![Download Data](docs/images/downloads.png)

The Downloads card features options to download the currently loaded data in CSV, JSON, and XML formats. In addition, it allows for column values to be copied as comma-separated values – this may be used in lieu of a join-table VIEW.

#### Authentication System

![Authentication System](docs/images/auth.png)

Basic authentication system gets you started with the “database-first” approach to secure authentication system. Three basic users are available by simply executing the Authentication SQL script – read, edit, and admin.

#### Edit Contents

![Edit Database](docs/images/edit.png)

Edit Content feature can allow authenticated users to change the table contents if a primary key is defined for the table.


## Use Case Scenarios

This project was built to solve three main scenarios:

#### Accessing a large database (no data sharing)

Set up the PostgreSQL database, PostgREST API tool, and the PostGUI web application on a local computer for database access without any data sharing over the internet.

#### Sharing a large database (read-only data sharing mode)

Set up the PostgreSQL database, PostgREST API tool, and the PostGUI web application on a web server for data sharing over the internet.

#### Inventory management system (read and write access for authenticated users)

Set up the PostgreSQL database, PostgREST API tool, and the PostGUI web application on a web server. In addition, enable the edit feature by ensuring each table has a primary key defined, presence of the primary_keys function in the PostgreSQL database, and enabling the feature in the configuration file of PostGUI.

 
## Installation

### Get Software
1. Install [Node.js](https://nodejs.org/en/).
1. Install [PostgreSQL](https://www.postgresql.org/download/). If you already have a PostgreSQL database running on your personal computer, skip this step.
1. Download PostgREST (https://github.com/begriffs/postgrest/releases/tag/v0.4.4.0).

### Database Requirements Check
1. Setup a PostgreSQL database on your personal computer (supports Windows, Mac, and Linux).
   1. Having a well designed PostgreSQL database is entirely your resposibility because PostGUI does not enforce any hard requirements on the database schema design. However, to take full advantage of the PostGUI features, some changes may be required to the database schema.
   1. To set up a sample database on personal computer:
      1. Download the DVD Rentals database file from [PostgreSQL Tutorial website](http://www.postgresqltutorial.com/postgresql-sample-database/).
      1. Unzip the file to retrieve the .tar file.
      1. Follow these instructions: http://www.postgresqltutorial.com/load-postgresql-sample-database/.
      1. Skip the remaining Database Requirements Check section steps.
1. Ensure necessary column and table attributes are present:
   1. Foreign Key: required only to show two-way relationships in the left panel in addition to the foreign_key function.
   1. Primary Key: required to enable the Edit Feature in addition to the primary_key function.
   1. NOT NULL, CHECK, and data types should be carefully considered because they serve as back-end sanitation for the Edit Feature.
1. Create necessary VIEWs: nice to predefine table joins when queries spanning multiple tables will be executed frequently.
1. Create necessary indexes: nice to have for large tables to speed up query response time. When the CONTAINS operator will be used frequently with a string column, a pg_trgm idnex would be important to drastically improve performance.



### PostgREST Setup:
1. Download PostgREST (https://github.com/begriffs/postgrest/releases/tag/v0.4.4.0).
1. Extract the binary file into a folder.
1. Create a `db.conf` configuration file in the same folder as the PostgREST binary.
   1. Create this configuration file according to: https://postgrest.com/en/v4.4/install.html#configuration .
   1. Example PostgREST configuration file:
      ```
           db-uri = "postgres://DB_USER:DB_USER_PASS@localhost:5432/DB_NAME"
           db-schema = "public"
           db-anon-role = "DB_USER"
           db-pool = 10
           server-host = "*4"
           server-port = 3001
      ```
1. Using a command line tool, navigate to the folder containing the PostgREST binary and config file.
1. Run the PostgREST tool: `./postgrest.exe ./db.conf`.
1. You should see a "Connection successful" message.

### PostGUI Setup:
1. Clone this repository.
1. Using a command line tool, navigate into the cloned repository.
1. Execute `npm install`.
1. Create a basic config file:
   1. Configuration file location: `/src/data/config.json`.
   1. Change the `url` if any changes were made to the PostgREST port.
   1. Give an appropriate title to the database.
1. Execute `npm start` inside the PostGUI repository directory to run the web application.
1. Improve configuration file for better user experience.
   
## Security Setup
1. Harden PostgREST
   1. Go through the PostgREST docs.
   1. Go through https://postgrest.org/en/v5.0/admin.html section.
1. Enable HTTPS
   1. Install SSL/TLS certificate on the web server. This should automatically enable HTTPS for the web application.
   1. Force the web server to handle the PostgREST traffic as HTTPS by setting up a reverse proxy on the port used by PostgREST.
      1. Here is a sample reverse proxy configuration for NGINX:
      ```
      <coming soon>
      ```
1. Authentication System
   1. Go through the “Enable HTTPS” section because HTTPS communication protocol is necessary when transmitting sensitive information between clients and web server.
   1. Execute the authentication script below to create an authentication system schema in the database.
   1. Insert new emails and passwords for more users.
   1. Fine tune authentication control:
      1. Users
      1. Permissions



## Config file format
<coming soon>


## Contact

_Priyank K. Purohit, Dr. David Guttman, Dr. Nicholas Provart_

_Department of Cell and Systems Biology, University of Toronto_
