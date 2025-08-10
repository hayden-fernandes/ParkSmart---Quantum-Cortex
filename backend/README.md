#
Park-Smart API Backend


This directory contains the backend server for the Park-Smart application,
built with Node.js and Express.


## Project Overview


This server provides a RESTful API for managing parking spots. It uses an
in-memory array for data storage, so the data will reset upon each server
restart. It also includes interactive API documentation generated with Swagger.


## Prerequisites


-   [Node.js](https://nodejs.org/) (v16
or higher)

-   npm


## Getting Started


Follow these steps to run the backend server locally.


### 1. Clone the Repository


Clone the project to your local machine (if you haven't already).


### 2. Navigate to the Backend Directory


```bash

cd path/to/Park-Smart/backend

3. Install Dependencies
Install all the required npm packages.
npm
install

4. Run the Server
Start the local development server.
node index.js

The server will start and be
accessible at http://localhost:3000.
API Documentation
Once the server is running, you can view and interact
with the API documentation via Swagger UI by navigating to the following URL in
your web browser:
http://localhost:3000/api-docs