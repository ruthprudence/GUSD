// services/analytics/RiskAnalyzer.js

const { RISK_THRESHOLDS } = require('../constants/graduation');

class RiskAnalyzer {
  assessRisk(attendanceRate, grades, graduationProgress) {
    const hasFailingGrades = grades.some(grade => grade.Letter_Grade === 'F');

    return {
      isAtRisk: attendanceRate < RISK_THRESHOLDS.ATTENDANCE || 
                hasFailingGrades || 
                graduationProgress < RISK_THRESHOLDS.GRADUATION_PROGRESS,
      factors: {
        lowAttendance: attendanceRate < RISK_THRESHOLDS.ATTENDANCE,
        failingGrades: hasFailingGrades,
        insufficientProgress: graduationProgress < RISK_THRESHOLDS.GRADUATION_PROGRESS
      }
    };
  }
}

module.exports = new RiskAnalyzer();
