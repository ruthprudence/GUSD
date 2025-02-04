// routes/students.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 🔹 Helper Function: Fetch all students
const getAllStudents = async () => {
  console.log("Fetching students...");
  const [students] = await pool.execute('SELECT * FROM Student');
  console.log(`Fetched ${students.length} students`);
  return students;
};

// 🔹 Helper Function: Fetch related data (Classes, Attendance, FinalGrades)
const getRelatedData = async () => {
  console.log("Fetching related data...");
  const [classes] = await pool.execute('SELECT * FROM Classes');
  const [attendance] = await pool.execute('SELECT * FROM Attendance');
  const [finalGrades] = await pool.execute('SELECT * FROM FinalGrades');
  return { classes, attendance, finalGrades };
};

// 🔹 GET /students - Fetch all students with related data
router.get('/', async (req, res) => {
  try {
    const students = await getAllStudents();
    const { classes, attendance, finalGrades } = await getRelatedData();

    // Safe filter function to avoid crashes
    const safeFilter = (data, key, value) => Array.isArray(data) ? data.filter(d => d[key] === value) : [];

    // Map related data into student objects
    const studentsWithData = students.map(student => ({
      ...student,
      Classes: safeFilter(classes, 'Student_ID', student.ID),
      Attendance: safeFilter(attendance, 'Student_ID', student.ID),
      FinalGrades: safeFilter(finalGrades, 'Student_ID', student.ID)
    }));

    res.json(studentsWithData);
  } catch (err) {
    console.error('Error in students route:', err);
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// 🔹 Helper Function: Fetch a single student by ID
const getStudentById = async (id) => {
  console.log(`Fetching student ID: ${id}`);
  const [studentDetails] = await pool.execute('SELECT * FROM Student WHERE ID = ?', [id]);
  return studentDetails.length ? studentDetails[0] : null;
};

// 🔹 GET /students/:id - Fetch a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await getStudentById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const [classes] = await pool.execute('SELECT * FROM Classes WHERE Student_ID = ?', [req.params.id]);
    const [attendance] = await pool.execute('SELECT * FROM Attendance WHERE Student_ID = ? ORDER BY Date DESC', [req.params.id]);
    const [grades] = await pool.execute('SELECT * FROM FinalGrades WHERE Student_ID = ?', [req.params.id]);

    res.json({
      studentInfo: student,
      Classes: classes,
      Attendance: attendance,
      FinalGrades: grades
    });

  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ message: 'Error fetching student details', error: err.message });
  }
});

module.exports = router;

