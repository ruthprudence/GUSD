// routes/students.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const createStudentDataService = require('../services/StudentDataService');

const studentDataService = createStudentDataService(pool);

// Get students with flexible filtering
router.get('/', async (req, res) => {
  try {
    const filters = {
      grade: req.query.grade ? parseInt(req.query.grade) : null,
      school: req.query.school,
      atRiskOnly: req.query.atRiskOnly === 'true',
      graduationYear: req.query.graduationYear ? parseInt(req.query.graduationYear) : null,
      ell: req.query.ell === 'true',
      fosterCare: req.query.fosterCare === 'true'
    };
    
    const students = await studentDataService.getFilteredStudents(filters);
    res.json(students);
  } catch (err) {
    console.error('Error in students route:', err);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Get a specific student by ID with detailed information
router.get('/:id', async (req, res) => {
  try {
    const [studentDetails] = await pool.execute(
      `SELECT s.*, 
              (SELECT COUNT(*) FROM Attendance a WHERE a.Student_ID = s.ID) as total_attendance,
              (SELECT AVG(CASE WHEN fg.Letter_Grade IN ('A', 'B') THEN 1 ELSE 0 END) FROM FinalGrades fg WHERE fg.Student_ID = s.ID) as academic_performance
       FROM Student s 
       WHERE s.ID = ?`, 
      [req.params.id]
    );

    if (studentDetails.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const [classes] = await pool.execute(
      'SELECT * FROM Classes WHERE Student_ID = ?', 
      [req.params.id]
    );

    const [attendance] = await pool.execute(
      'SELECT * FROM Attendance WHERE Student_ID = ? ORDER BY Date DESC LIMIT 10', 
      [req.params.id]
    );

    const [grades] = await pool.execute(
      'SELECT * FROM FinalGrades WHERE Student_ID = ?', 
      [req.params.id]
    );

    res.json({
      studentInfo: studentDetails[0],
      classes,
      recentAttendance: attendance,
      grades
    });
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});

module.exports = router;
