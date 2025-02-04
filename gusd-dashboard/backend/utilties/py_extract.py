import csv

def parse_csv_to_sql(csv_file, table_name):
    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        headers = next(reader)
        
        # Map headers to SQL column names
        column_mapping = {
            'Student': {
                'ID': 'ID',
                'First_Name': 'First_Name',
                'Last_Name': 'Last_Name',
                'School': 'School',  # Corrected column order
                'Grade': 'Grade',
                'Expected_Graduation': 'Expected_Graduation',
                'Gender': 'Gender',
                'Flag_FosterCare': 'Flag_FosterCare',
                'Flag_EnglishLanguageLearner': 'Flag_EnglishLanguageLearner'
            },
            'Classes': {
                'ID': 'ID',
                'Student_ID': 'Student_ID',
                'Course_Name': 'Course_Name',
                'Credit_Type': 'Credit_Type',
                'Possible_Credit': 'Possible_Credit',
                'Start_Date': 'Start_Date',
                'End_Date': 'End_Date',
                'Status': 'Status',
                'Term': 'Term',
                'School_Year': 'School Year'
            },
            'Attendance': {
                'ID': 'ID',
                'Student_ID': 'Student_ID',
                'Classes_ID': 'Classes_ID',
                'Date': 'Date',
                'Code': 'Code'
            },
            'FinalGrades': {
                'ID': 'ID',
                'Student_ID': 'Student_ID',
                'Classes_ID': 'Classes_ID',
                'Letter_Grade': 'Letter_Grade',
                'Credit_Type': 'Credit_Type',
                'Credit_Potential': 'Credit_Potential',
                'Credit_Awarded': 'Credit_Awarded',
                'Grade_Level': 'Grade_Level'
            }
        }
        
        sql_statements = []
        
        for row in reader:
            # Reorder columns according to SQL table structure
            reordered_row = [row[headers.index(column)] for column in column_mapping[table_name].values()]
            
            # Generate SQL INSERT statement
            sql_statement = f"INSERT INTO {table_name} ({', '.join(column_mapping[table_name].keys())}) VALUES ({', '.join(['%s'] * len(reordered_row))});"
            sql_statements.append(sql_statement % tuple("'" + value + "'" if isinstance(value, str) else value for value in reordered_row))
        
        return sql_statements

# Parse CSV files and generate SQL statements
sql_statements = []
sql_statements.append("SET FOREIGN_KEY_CHECKS = 0;")  # Disable foreign key checks
sql_statements.extend(parse_csv_to_sql('Student.csv', 'Student'))
sql_statements.extend(parse_csv_to_sql('Classes.csv', 'Classes'))
sql_statements.extend(parse_csv_to_sql('Attendance.csv', 'Attendance'))
sql_statements.extend(parse_csv_to_sql('FinalGrades.csv', 'FinalGrades'))
sql_statements.append("SET FOREIGN_KEY_CHECKS = 1;")  # Re-enable foreign key checks

# Write SQL statements to a file
with open('sql_statements.txt', 'w') as file:
    for statement in sql_statements:
        file.write(statement + '\n')