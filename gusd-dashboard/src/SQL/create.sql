CREATE TABLE Student (
  ID INTEGER PRIMARY KEY,
  First_Name VARCHAR(255),
  Last_Name VARCHAR(255),
  School VARCHAR(255),
  Grade INTEGER,
  Gender CHAR(1),
  Flag_EnglishLanguageLearner BOOLEAN,
  Flag_FosterCare BOOLEAN,
  Expected_Graduation INTEGER
);

CREATE TABLE Classes (
  ID INTEGER PRIMARY KEY,
  Student_ID INTEGER,
  Course_Name VARCHAR(255),
  Credit_Type VARCHAR(255),
  Possible_Credit FLOAT,
  Start_Date DATE,
  End_Date DATE,
  Status VARCHAR(255),
  Term VARCHAR(255),
  School_Year VARCHAR(255),
  FOREIGN KEY (Student_ID) REFERENCES Student(ID)
);

CREATE TABLE Attendance (
  ID INTEGER PRIMARY KEY,
  Student_ID INTEGER,
  Classes_ID INTEGER,
  Date DATE,
  Code CHAR(1),
  FOREIGN KEY (Student_ID) REFERENCES Student(ID),
  FOREIGN KEY (Classes_ID) REFERENCES Classes(ID)
);

CREATE TABLE FinalGrades (
  ID INTEGER PRIMARY KEY,
  Student_ID INTEGER,
  Classes_ID INTEGER,
  Letter_Grade CHAR(1),
  Credit_Type VARCHAR(255),
  Credit_Potential FLOAT,
  Credit_Awarded FLOAT,
  Grade_Level INTEGER,
  FOREIGN KEY (Student_ID) REFERENCES Student(ID),
  FOREIGN KEY (Classes_ID) REFERENCES Classes(ID)
);