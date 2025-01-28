import csv
import mysql

# Connect to the database
conn = sqlite3.connect('your_database.db')
cursor = conn.cursor()

# Read the CSV file
with open('your_file.csv', 'r') as file:
    reader = csv.reader(file)
    next(reader)  # Skip the header row
    for row in reader:
        cursor.execute('''
            INSERT INTO Student (
              ID,
              First_Name,
              Last_Name,
              Grade,
              Expected_Graduation,
              Gender,
              School,
              Flag_FosterCare,
              Flag_EnglishLanguageLearner
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', row)

# Commit the changes and close the connection
conn.commit()
conn.close()