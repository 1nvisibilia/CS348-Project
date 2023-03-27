import mysql.connector
import sys
""" 
    Ensures any raw data in prod_data_insert does not violate the schema of database.
    Sometimes, there may be constraints in our schema not reflected in the prod database.
    By reprocessing the raw data, we validate the data.

    Assumes the local database is empty. You should run this before loading the records into
    the database

    Output: A cleaned file - sanitized_prod_data_insert.sql
"""
cnx = mysql.connector.connect(
    host='localhost',
	user='root',
	password='password',
	database='myschedule',
	port=3306
)
cursor = cnx.cursor()

# Open the input file and read the lines
INPUT_FILE = "prod_data_insert.sql"  # Change this if you want to sanitize something else
with open(INPUT_FILE) as f:
    lines = f.read().splitlines()

failCount = 0
for query in lines:
    # Attempt to execute the SQL query
    # Print only if it succeeds
    try:
        cursor.execute(query)
        print(query)
    except:
        # Print to stderr so output redirection works properly
        print("stderr: failed: {}".format(query), file=sys.stderr)
        failCount += 1

print("stderr: total invalid SQL queries: {}".format(failCount), file=sys.stderr)

# Don't actually commit anything
cnx.rollback()