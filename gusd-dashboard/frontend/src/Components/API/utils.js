// src/Components/API/utils.js
export const calculateGraduationProgress = (student) => {
    if (!student?.FinalGrades?.length) return 0;
    
    const totalRequired = 220;
    const earned = student.FinalGrades.reduce((sum, grade) => {
      const creditAwarded = parseFloat(grade.Credit_Awarded) || 0;
      return sum + creditAwarded;
    }, 0);
    
    return Math.min(Math.round((earned / totalRequired) * 100), 100);
  };
  
  export const calculateRiskStatus = (student) => {
    if (!student?.FinalGrades?.length && student?.Attendance === undefined) return false;
    
    const attendanceThreshold = 80;
    const hasFailingGrades = student.FinalGrades?.some(grade => 
      grade.Letter_Grade === 'F' || grade.Letter_Grade === 'f'
    );
    const poorAttendance = student.Attendance < attendanceThreshold;
    
    return hasFailingGrades || poorAttendance;
  };