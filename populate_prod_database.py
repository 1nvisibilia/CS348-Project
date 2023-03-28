import mysql.connector
import sys
import time

# Connection details
HOST = 'localhost'
USER = 'root'
PASSWORD = 'password'
PORT = 3306


# Populate the database
cnx = mysql.connector.connect(
    host=HOST,
	user=USER,
	password=PASSWORD,
    database="myschedule",
	port=3306,
)
cursor = cnx.cursor()
# Executes the statements from the following files in order
ORDERED_INPUT_FILES = [
    "sanitized_prod_data_insert.sql",
    "prod_student_data_insert.sql"
]
for file in ORDERED_INPUT_FILES:
    with open(file, encoding='utf-8') as f:
        lines = f.read().split(';')
    print("Executing {}".format(file), file=sys.stderr)
    for query in lines:
        try:
            cursor.execute(query)
        except mysql.connector.Error as err:
            # print("Failed to execute: {}\n".format(err), file=sys.stderr)
            pass  
cnx.commit()
print("Completed. The database is now populated with production data", file=sys.stderr)
cursor.close()
cnx.close()


# Initiate any triggers that should be added after initializing the database
cnx = mysql.connector.connect(
    host=HOST,
	user=USER,
	password=PASSWORD,
	port=PORT,
    database="myschedule",
    autocommit=True
)
cursor = cnx.cursor()
with open("post_init_schema_triggers.sql") as f:
    sql_file = f.read()
    try:
        print("Creating post-init triggers\n", file=sys.stderr)
        cursor.execute(sql_file, multi=True)
        print("Success!", file=sys.stderr)
    except mysql.connector.Error as err:
        print("Failed to create post-init triggers: {}\n".format(err), file=sys.stderr)

cursor.close()
cnx.close()

