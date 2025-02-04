# main.py

import csv
import mysql.connector
from credentials import DB_CONFIG

# Connect to the remote database
cnx = mysql.connector.connect(**DB_CONFIG)
cursor = cnx.cursor()

# Read the CSV file
with open('your_file.csv', 'r') as file:
 reader = csv.reader(file)
 next(reader)  # Skip the header row
 for row in reader:
     # Reorder columns to match the table structure
     row = (row[0], row[1], row[2], row[5], row[3], row[4], row[6], row[7], row[8])
     cursor.execute('''
         INSERT INTO Student (
           ID,
           First_Name,
           Last_Name,
           School,
           Grade,
           Expected_Graduation,
           Gender,
           Flag_FosterCare,
           Flag_EnglishLanguageLearner
         )
         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
     ''', row)

# Commit the changes and close the connection
cnx.commit()
cnx.close()