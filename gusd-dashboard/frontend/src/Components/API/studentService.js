// src/Components/API/studentService.js
import { API_BASE_URL, fetchWithError } from './config';
import { calculateGraduationProgress, calculateRiskStatus } from './utils';

export const fetchStudents = async (filters = {}) => {
  try {
    // Construct query parameters from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    // Construct request URL
    const url = `${API_BASE_URL}/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching from URL:', url);

    // Fetch data
    const response = await fetchWithError(url);
    console.log('Raw API response:', response);

    const data = Array.isArray(response) ? response : [];
    console.log('Processed data:', data);

    // Map API response to expected frontend structure
    const mappedData = data.map(student => {
      console.log(`Processing Student ID: ${student.ID}`);
      console.log('Classes:', student.classes);
      console.log('Final Grades:', student.final_grades);
      console.log('Attendance:', student.attendance);

      return {
        ...student,
        ID: student.ID || Math.random().toString(), // Ensure unique ID
        First_Name: student.First_Name || '',
        Last_Name: student.Last_Name || '',
        School: student.School || '',
        Grade: student.Grade || 0,
        Expected_Graduation: student.Expected_Graduation?.toString() || '',
        ELL_Status: student.Flag_EnglishLanguageLearner ? 'YES' : 'NO',
        Foster_Care: student.Flag_FosterCare ? 'YES' : 'NO',

        // Attendance processing
        Attendance: student.attendance ? student.attendance.length : 0, // Total attendance records

        // Grades processing
        FinalGrades: student.final_grades || [],

        // Classes processing
        Classes: student.classes || [],

        // Derived metrics
        graduationProgress: calculateGraduationProgress(student),
        isAtRisk: calculateRiskStatus(student)
      };
    });

    console.log('Mapped data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};
