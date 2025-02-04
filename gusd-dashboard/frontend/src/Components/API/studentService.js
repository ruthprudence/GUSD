// src/Components/API/studentService.js
import { API_BASE_URL, fetchWithError } from './config';
import { calculateGraduationProgress, calculateRiskStatus } from './utils';

export const fetchStudents = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
  
      const url = `${API_BASE_URL}/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Fetching from URL:', url);
  
      const response = await fetchWithError(url);
      console.log('Raw API response:', response);
  
      const data = Array.isArray(response) ? response : [];
      console.log('Processed data:', data);
  
      const mappedData = data.map(student => {
        console.log(`Processing Student ID: ${student.ID}`);
        console.log('Grades:', student.FinalGrades);
        console.log('Attendance:', student.Attendance);
  
        return {
          ...student,
          ID: student.ID || Math.random().toString(),
          First_Name: student.First_Name || '',
          Last_Name: student.Last_Name || '',
          School: student.School || '',
          Grade: student.Grade || 0,
          FinalGrades: student.FinalGrades || [],
          Attendance: student.Attendance || 0,
          graduationProgress: calculateGraduationProgress(student),
          isAtRisk: calculateRiskStatus(student),
          ELL_Status: student.Flag_EnglishLanguageLearner ? 'YES' : 'NO',
          Foster_Care: student.Flag_FosterCare ? 'YES' : 'NO',
          Expected_Graduation: student.Expected_Graduation?.toString() || ''
        };
      });
  
      console.log('Mapped data:', mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  };
  