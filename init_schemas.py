import mysql.connector
import sys
import time

# Connection details
HOST = 'localhost'
USER = 'root'
PASSWORD = 'password'
PORT = 3306

# Create the database and schema
cnx = mysql.connector.connect(
    host=HOST,
	user=USER,
	password=PASSWORD,
	port=PORT,
    autocommit=True
)
cursor = cnx.cursor()
with open("schema_construct.sql") as f:
    sql_file = f.read()
    try:
        cursor.execute(sql_file, multi=True)
        print("Created database", file=sys.stderr)
    except mysql.connector.Error as err:
        print("Failed to create database: {}".format(err), file=sys.stderr)
        pass

cursor.close()
cnx.close()

