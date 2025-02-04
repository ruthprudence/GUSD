// services/analytics/GraduationAnalyzer.js

const { CREDIT_REQUIREMENTS } = require('../constants/graduation');

class GraduationAnalyzer {
  calculateProgress(grades) {
    const creditsByType = {};
    
    // Initialize credit types
    Object.keys(CREDIT_REQUIREMENTS).forEach(type => {
      creditsByType[type] = 0;
    });

    // Sum credits by type
    grades.forEach(grade => {
      if (grade.Credit_Awarded && grade.Credit_Type) {
        creditsByType[grade.Credit_Type] = (creditsByType[grade.Credit_Type] || 0) + grade.Credit_Awarded;
      }
    });

    // Calculate progress for each type
    const progressByType = {};
    let totalProgress = 0;
    let totalRequired = 0;

    Object.entries(CREDIT_REQUIREMENTS).forEach(([type, required]) => {
      const earned = creditsByType[type] || 0;
      progressByType[type] = Math.min(100, (earned / required) * 100);
      totalProgress += Math.min(required, earned);
      totalRequired += required;
    });

    return {
      overallProgress: (totalProgress / totalRequired) * 100,
      creditsByType,
      progressByType
    };
  }
}

module.exports = new GraduationAnalyzer();
