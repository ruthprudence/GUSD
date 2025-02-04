// services/StudentDataService.js
class StudentDataService {
  constructor(pool) {
    this.pool = pool;
  }

  async getFilteredStudents(filters = {}) {
    try {
      // Build the base query
      let query = `
        SELECT 
          s.*,
          GROUP_CONCAT(DISTINCT f.Letter_Grade) as grades,
          COUNT(DISTINCT a.ID) as attendance_count,
          SUM(DISTINCT f.Credit_Awarded) as total_credits
        FROM Student s
        LEFT JOIN FinalGrades f ON s.ID = f.Student_ID
        LEFT JOIN Attendance a ON s.ID = a.Student_ID
      `;

      const whereConditions = [];
      const params = [];

      // Add filter conditions
      if (filters.grade) {
        whereConditions.push('s.Grade = ?');
        params.push(filters.grade);
      }
      if (filters.school) {
        whereConditions.push('s.School = ?');
        params.push(filters.school);
      }
      if (filters.graduationYear) {
        whereConditions.push('s.Expected_Graduation = ?');
        params.push(filters.graduationYear);
      }
      if (filters.ell) {
        whereConditions.push('s.Flag_EnglishLanguageLearner = 1');
      }
      if (filters.fosterCare) {
        whereConditions.push('s.Flag_FosterCare = 1');
      }

      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ');
      }

      query += ' GROUP BY s.ID';
      console.log('Executing query:', query, 'with params:', params);

      const [students] = await this.pool.execute(query, params);
      console.log('Found students:', students.length);

      return students.map(student => ({
        ...student,
        graduationProgress: this.calculateGraduationProgress(student),
        isAtRisk: this.calculateRiskStatus(student)
      }));
    } catch (error) {
      console.error('Error in getFilteredStudents:', error);
      throw error;
    }
  }

  calculateGraduationProgress(student) {
    const totalCredits = parseFloat(student.total_credits) || 0;
    const requiredCredits = 220; // Your required credits
    return Math.min((totalCredits / requiredCredits) * 100, 100);
  }

  calculateRiskStatus(student) {
    const grades = student.grades ? student.grades.split(',') : [];
    const hasFailingGrade = grades.some(grade => grade === 'F');
    const lowCredits = this.calculateGraduationProgress(student) < 70;
    return hasFailingGrade || lowCredits;
  }
}

module.exports = pool => new StudentDataService(pool);
