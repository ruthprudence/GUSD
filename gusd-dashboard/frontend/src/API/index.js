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
    const data = await fetchWithError(url);
    
    return data.map(student => ({
      ...student,
      graduationProgress: calculateGraduationProgress(student),
      riskStatus: calculateRiskStatus(student)
    }));
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const fetchStudentDetails = async (studentId) => {
  try {
    const [student, attendance, grades] = await Promise.all([
      fetchWithError(`${API_BASE_URL}/students/${studentId}`),
      fetchWithError(`${API_BASE_URL}/attendance/student/${studentId}`),
      fetchWithError(`${API_BASE_URL}/final-grades/student/${studentId}`)
    ]);
    return { ...student, attendance, grades };
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw error;
  }
};