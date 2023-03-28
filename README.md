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

__AUTOMATIC METHOD:__
This method may flake out depending on your machine, but it is worth trying since it is quick and correct if it works.

2. From the CS348-Project root directory, with the local instance of the MySQL server running,
    * Run `python3 init_prod_database.py` to load the `production` data all at once.
    * OR run `python3 init_sample_database.py` to load the `sample` data all at once.
    * Note: If you wish to switch between the sample and production databases, then you must drop the database before running the other script.

__MANUAL METHOD:__

2. Alternatively, you may manually execute the `.sql` files to generate the production/sample databases in MySQL Workbench. Open and execute the scripts in MySQL Workbench in the presented order to initialize the databases. Note, some operations may time out the MySQL Workbench connection, before connecting to localhost, change Edit->Preferences->SQL Editor->DBMS connection time out interval = 90 (seconds) to avoid timing out.

__Production__: Execute these scripts in this order
 1.  `schema_construct.sql`
 2. `sanitized_prod_data_insert.sql`
 3. `prod_student_data_insert.sql`
 4. `post_init_schema_triggers.sql`
 
 
 __Sample__: Execute these scripts in this order
 1. `schema_construct.sql`
 2. `prod_data_insert.sql`
 3. `post_init_schema_triggers.sql`


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
