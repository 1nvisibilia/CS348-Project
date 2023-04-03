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

For milestone 2, the application finished up the residual implementations for feature 1. Feature 3(add/drop course components) and 6(displaying popular courses) are also implemented. Furthermore, the production dataset was also obtained. The team made minor adjustments to the ER diagrams and the SQL schema.

For the final milestone, we implemented feature 4 (admin login and components updates). We also performed various testings and UI optimizations for both the frontend, backend, and the SQL queries. We have also collectively recorded a demo video for our application.


## Current Features

### See Shared Courses/Components with Friends (R6)
- Upon logging in, in the FRIENDS panel. The user can add/remove friends. In addition, the use can see a list of components that his/her friends are taking with the user.
- Main implementation in: frontend\src\Friends.jsx

### Search for Courses/Components (R7)
- Upon arriving at the website, the user is prompted with a login UI. After logging in, in the SEARCH panel, the user can search for courses with complex query conditions, and will be displayed with matching results.
- Main implementation in: frontend\src\Schedule.jsx

### Add or remove Courses/Components (R8)
- The users can add components to their shedule in the search panel, by clicking the add icon located at the right of each component from the query result.
- The users can remove components they are currently enrolled in by clicking the trash icon besides the each course row in the schedule tab.
- Main implementation in: frontend\src\Schedule.jsx and frontend\src\ResultTable.jsx

### Professors updating Course/Component information (R9)
- Professors can login with their own id and password. Upon logging in, they will be redirected to an admin page for out application.
- The admin users(professors) can search for components in a similar fashions as students. However, they have the priviledge to update course/components information, such as course code, start/end time, capacity, etc.
- Main implementation in: frontend\src\Admin.jsx and frontend\src\AdminResultTable.jsx

### Displaying a weekly schedule of the user (R10)
- In the SCHEDULE panel. The user can see a list of components he/she is currently taking. The user can also drop the component they are taking, and add components back in the SEARCH panel.
- Main implementation in: frontend\src\Schedule.jsx

### Displaying popular courses
- For students, in the SEARCH panel. There is an option for them to see a list of popular courses. Upon clicking the button, a list of popular courses, ranked by the amount of likes they received will be displayed back to the students.
- Main implementation in: frontend\src\SearchPanel.jsx
