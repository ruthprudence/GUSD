// src/Components/API/statusService.js
import { API_BASE_URL, fetchWithError } from './config';

export const fetchDBStatus = async () => {
  try {
    const response = await fetchWithError(`${API_BASE_URL}/db-status`);
    return response.status;
  } catch (error) {
    console.error('Error checking DB status:', error);
    return 'error';
  }
};