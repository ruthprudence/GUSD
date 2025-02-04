// services/cache/CacheManager.js

class CacheManager {
  constructor() {
    this._cache = {
      students: new Map(),
      classes: new Map(),
      attendance: new Map(),
      finalGrades: new Map()
    };
  }

  async initialize(pool) {
    try {
      const [students] = await pool.execute('SELECT * FROM Student');
      const [classes] = await pool.execute('SELECT * FROM Classes');
      const [attendance] = await pool.execute('SELECT * FROM Attendance');
      const [finalGrades] = await pool.execute('SELECT * FROM FinalGrades');

      students.forEach(student => this._cache.students.set(student.ID, student));
      classes.forEach(class_ => {
        if (!this._cache.classes.has(class_.Student_ID)) {
          this._cache.classes.set(class_.Student_ID, []);
        }
        this._cache.classes.get(class_.Student_ID).push(class_);
      });
      attendance.forEach(record => {
        if (!this._cache.attendance.has(record.Student_ID)) {
          this._cache.attendance.set(record.Student_ID, []);
        }
        this._cache.attendance.get(record.Student_ID).push(record);
      });
      finalGrades.forEach(grade => {
        if (!this._cache.finalGrades.has(grade.Student_ID)) {
          this._cache.finalGrades.set(grade.Student_ID, []);
        }
        this._cache.finalGrades.get(grade.Student_ID).push(grade);
      });

      console.log('Cache initialized successfully');
    } catch (error) {
      console.error('Error initializing cache:', error);
      throw error;
    }
  }

  getStudent(studentId) {
    return this._cache.students.get(studentId);
  }

  getStudentClasses(studentId) {
    return this._cache.classes.get(studentId) || [];
  }

  getStudentAttendance(studentId) {
    return this._cache.attendance.get(studentId) || [];
  }

  getStudentGrades(studentId) {
    return this._cache.finalGrades.get(studentId) || [];
  }

  getAllStudents() {
    return Array.from(this._cache.students.values());
  }
}

module.exports = new CacheManager();
