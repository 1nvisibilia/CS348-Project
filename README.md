# CS348-Project

__Requires:__
##### Node Version: 16.14.0 or above
##### NPM Version:  8.3.1 or above

<br/>

## Database Setup
__Requires:__
* ##### MySQL Workbench 8.0.32 or above (exactly 8.0.31 on MacOS)
* ##### MySQL 8.0.32 or above
To create the sample database, 
1. First create a new local Instance. Use the following parameters:
    * __Connection Name (Optional):__ _MySchedule_ 
    * __Hostname:__ _localhost_
    * __Port:__ _3306_
    * __Username:__ _root_
    * __Password:__ _password_

2. Execute ___schema_construct.sql___ in MySQL workbench to construct the tables and schema.

3. Execute ___data_insert.sql___ to seed the sample database with data.

<br/>

## Running the Server
__Requires:__
* ##### Express.js 4.18.2 or above
    * ##### `npm install express`

To run the server, navigate to the ___backend___ directory. Execute the script:

`node index.js`

If the following error:

<span style="color:red">__Client does not support authentication protocol requested by server__</span>

appears, simply run the following queries:

`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`

`flush privileges;`

If the above doesn't work, try again without the `@'localhost'` part.

<br/>

## Starting the App
__Requires:__
* ##### vite.js 4.1.4 or above
    * ##### `npm i vite`
To start the app, navigate to the ___frontend___ directory. Execute the script:

`npm run dev`

Navigate to the localhost link that appears in the output. 

## Progress
For milestone 1, the application implements Feature 2, allowing users to browse through courses offered at the school (based on the sample dataset). Furthermore, there is a partial implementation for feature 1 (finding which course components the user is taking together with each friend) and feature 5 (display a valid weekly schedule involving user specified courses).
