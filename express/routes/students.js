// routes/students.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Helper function to calculate credits from final grades
const calculateCredits = (finalGrades, classes) => {
  const credits = {
    ELA: 0,
    MTH: 0,
    SCI: 0,
    SS: 0,
    LANG: 0,
    ART: 0,
    PE: 0
  };

  if (!Array.isArray(finalGrades)) return credits;

  finalGrades.forEach(grade => {
    const relatedClass = classes.find(c => c.ID === grade.Classes_ID);
    if (!relatedClass) return;

    const creditType = (relatedClass.Credit_Type || '').toUpperCase();
    const creditValue = parseFloat(grade.Credit_Awarded) || 0;

    switch(creditType) {
      case 'ENGLISH':
      case 'ELA':
        credits.ELA += creditValue;
        break;
      case 'MATH':
      case 'MTH':
        credits.MTH += creditValue;
        break;
      case 'SCIENCE':
      case 'SCI':
        credits.SCI += creditValue;
        break;
      case 'SOCIAL STUDIES':
      case 'HISTORY':
      case 'SS':
        credits.SS += creditValue;
        break;
      case 'FOREIGN LANGUAGE':
      case 'WORLD LANGUAGE':
      case 'LANG':
        credits.LANG += creditValue;
        break;
      case 'FINE ARTS':
      case 'PERFORMING ARTS':
      case 'ART':
        credits.ART += creditValue;
        break;
      case 'PHYSICAL EDUCATION':
      case 'PE':
        credits.PE += creditValue;
        break;
    }
  });

  return credits;
};

// Helper function to calculate attendance rate
const calculateAttendanceRate = (attendance) => {
  if (!Array.isArray(attendance) || attendance.length === 0) return 0;

  const totalDays = attendance.length;
  const presentDays = attendance.filter(record => 
    record.Code === 'P'
  ).length;

  return (presentDays / totalDays) * 100;
};

// Helper function to determine risk level
const calculateRiskLevel = (credits, attendanceRate, expectedGradYear) => {
  const totalCredits = Object.values(credits).reduce((sum, val) => sum + val, 0);
  const currentYear = new Date().getFullYear();
  const yearsUntilGraduation = expectedGradYear - currentYear;
  
  const expectedCredits = yearsUntilGraduation <= 0 ? 24 : 24 * ((4 - yearsUntilGraduation) / 4);
  const creditProgress = totalCredits / expectedCredits;

  if (attendanceRate < 85 || creditProgress < 0.5) {
    return 'High Risk';
  } else if (attendanceRate < 90 || creditProgress < 0.75) {
    return 'Moderate Risk';
  }
  return 'Low Risk';
};

// GET /students - Fetch all students with transformed data
router.get('/', async (req, res) => {
  try {
    const [students] = await pool.execute(`
      SELECT 
        s.*,
        c.ID as class_id,
        c.Course_Name,
        c.Credit_Type,
        c.Possible_Credit,
        c.Start_Date,
        c.End_Date,
        c.Status as class_status,
        c.Term,
        c.School_Year,
        fg.Letter_Grade,
        fg.Credit_Awarded,
        a.Date as attendance_date,
        a.Code as attendance_code
      FROM Student s
      LEFT JOIN Classes c ON s.ID = c.Student_ID
      LEFT JOIN FinalGrades fg ON c.ID = fg.Classes_ID
      LEFT JOIN Attendance a ON c.ID = a.Classes_ID
    `);

    const studentMap = new Map();

    students.forEach(row => {
      if (!studentMap.has(row.ID)) {
        studentMap.set(row.ID, {
          ID: row.ID.toString(),
          First_Name: row.First_Name || '',
          Last_Name: row.Last_Name || '',
          School: row.School || '',
          Grade: row.Grade || 0,
          Expected_Graduation: row.Expected_Graduation ? row.Expected_Graduation.toString() : '',
          Flag_EnglishLanguageLearner: Boolean(row.Flag_EnglishLanguageLearner),
          Flag_FosterCare: Boolean(row.Flag_FosterCare),
          classes: [],
          attendance: [],
          final_grades: []
        });
      }

      const student = studentMap.get(row.ID);

      if (row.class_id) {
        // Add class if not already present
        if (!student.classes.some(c => c.ID === row.class_id)) {
          student.classes.push({
            ID: row.class_id,
            Course_Name: row.Course_Name,
            Credit_Type: row.Credit_Type,
            Possible_Credit: row.Possible_Credit,
            Start_Date: row.Start_Date,
            End_Date: row.End_Date,
            Status: row.class_status,
            Term: row.Term,
            School_Year: row.School_Year
          });
        }

        // Add final grade if not already present
        if (row.Letter_Grade && !student.final_grades.some(g => g.Classes_ID === row.class_id)) {
          student.final_grades.push({
            Classes_ID: row.class_id,
            Letter_Grade: row.Letter_Grade,
            Credit_Awarded: row.Credit_Awarded
          });
        }

        // Add attendance record if not already present
        if (row.attendance_date && !student.attendance.some(a => 
          a.Date === row.attendance_date && a.Classes_ID === row.class_id
        )) {
          student.attendance.push({
            Classes_ID: row.class_id,
            Date: row.attendance_date,
            Code: row.attendance_code
          });
        }
      }
    });

    const transformedStudents = Array.from(studentMap.values()).map(student => {
      const credits = calculateCredits(student.final_grades, student.classes);
      const attendanceRate = calculateAttendanceRate(student.attendance);
      const riskLevel = calculateRiskLevel(credits, attendanceRate, student.Expected_Graduation);

      return {
        ...student,
        credits,
        attendance_rate: attendanceRate,
        risk_level: riskLevel
      };
    });

    res.json(transformedStudents);
  } catch (err) {
    console.error('Error in students route:', err);
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// GET /students/:id - Fetch a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT 
        s.*,
        c.ID as class_id,
        c.Course_Name,
        c.Credit_Type,
        c.Possible_Credit,
        c.Start_Date,
        c.End_Date,
        c.Status as class_status,
        c.Term,
        c.School_Year,
        fg.Letter_Grade,
        fg.Credit_Awarded,
        a.Date as attendance_date,
        a.Code as attendance_code
      FROM Student s
      LEFT JOIN Classes c ON s.ID = c.Student_ID
      LEFT JOIN FinalGrades fg ON c.ID = fg.Classes_ID
      LEFT JOIN Attendance a ON c.ID = a.Classes_ID
      WHERE s.ID = ?
    `, [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentMap = new Map();
    
    results.forEach(row => {
      if (!studentMap.has(row.ID)) {
        studentMap.set(row.ID, {
          ID: row.ID.toString(),
          First_Name: row.First_Name || '',
          Last_Name: row.Last_Name || '',
          School: row.School || '',
          Grade: row.Grade || 0,
          Expected_Graduation: row.Expected_Graduation ? row.Expected_Graduation.toString() : '',
          Flag_EnglishLanguageLearner: Boolean(row.Flag_EnglishLanguageLearner),
          Flag_FosterCare: Boolean(row.Flag_FosterCare),
          classes: [],
          attendance: [],
          final_grades: []
        });
      }

      const student = studentMap.get(row.ID);

      if (row.class_id) {
        if (!student.classes.some(c => c.ID === row.class_id)) {
          student.classes.push({
            ID: row.class_id,
            Course_Name: row.Course_Name,
            Credit_Type: row.Credit_Type,
            Possible_Credit: row.Possible_Credit,
            Start_Date: row.Start_Date,
            End_Date: row.End_Date,
            Status: row.class_status,
            Term: row.Term,
            School_Year: row.School_Year
          });
        }

        if (row.Letter_Grade && !student.final_grades.some(g => g.Classes_ID === row.class_id)) {
          student.final_grades.push({
            Classes_ID: row.class_id,
            Letter_Grade: row.Letter_Grade,
            Credit_Awarded: row.Credit_Awarded
          });
        }

        if (row.attendance_date && !student.attendance.some(a => 
          a.Date === row.attendance_date && a.Classes_ID === row.class_id
        )) {
          student.attendance.push({
            Classes_ID: row.class_id,
            Date: row.attendance_date,
            Code: row.attendance_code
          });
        }
      }
    });

    const student = studentMap.get(results[0].ID);
    const credits = calculateCredits(student.final_grades, student.classes);
    const attendanceRate = calculateAttendanceRate(student.attendance);
    const riskLevel = calculateRiskLevel(credits, attendanceRate, student.Expected_Graduation);

    const transformedStudent = {
      ...student,
      credits,
      attendance_rate: attendanceRate,
      risk_level: riskLevel
    };

    res.json(transformedStudent);
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ message: 'Error fetching student details', error: err.message });
  }
});

module.exports = router;
