// src/Components/GraduationDashboard.js
import React, { useState, useEffect } from 'react';
import { fetchStudents } from '../API/studentService';
import StudentSearch from '../Components/StudentSearch';
import StudentGrid from '../Components/StudentGrid';
import DemographicFilters from '../Components/DemographicFilters';

const GraduationDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [demographicFilters, setDemographicFilters] = useState({
    grade: '',
    school: '',
    gender: '',
    atRisk: '',
    ellStatus: '',
    fosterCare: '',
    expectedGraduation: ''
  });

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch students...');
        const data = await fetchStudents();
        console.log('Received student data:', data);
        setStudents(data);
        console.log('Set students state:', data);
      } catch (err) {
        console.error('Detailed error:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
        console.log('Loading complete');
      }
    };
    loadStudents();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setDemographicFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = !searchQuery || 
      `${student.First_Name} ${student.Last_Name}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = Object.entries(demographicFilters).every(([key, value]) => {
      if (!value) return true;
      switch (key) {
        case 'grade':
          return student.Grade === parseInt(value);
        case 'school':
          return student.School === value;
        case 'atRisk':
          return value === 'at-risk' ? student.isAtRisk : !student.isAtRisk;
        case 'ellStatus':
          return student.ELL_Status === value;
        case 'fosterCare':
          return student.Foster_Care === value;
        case 'expectedGraduation':
          return student.Expected_Graduation === value;
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const calculateMetrics = () => {
    const total = filteredStudents.length;
    const atRisk = filteredStudents.filter(s => s.isAtRisk).length;
    const averageProgress = filteredStudents.reduce((acc, s) => acc + s.graduationProgress, 0) / total;

    return {
      totalStudents: total,
      atRiskCount: atRisk,
      averageProgress: isNaN(averageProgress) ? 0 : averageProgress,
      onTrackCount: filteredStudents.filter(s => s.graduationProgress >= 90).length
    };
  };

  if (loading) return <div>Loading student data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const metrics = calculateMetrics();

  return (
    <div className="dashboard-container">
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Students</h3>
          <div className="metric-value">{metrics.totalStudents}</div>
        </div>
        <div className="metric-card">
          <h3>At Risk Students</h3>
          <div className="metric-value risk">{metrics.atRiskCount}</div>
        </div>
        <div className="metric-card">
          <h3>Average Progress</h3>
          <div className="metric-value">{metrics.averageProgress.toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <h3>On Track to Graduate</h3>
          <div className="metric-value">{metrics.onTrackCount}</div>
        </div>
      </div>

      <div className="filters-section">
        <StudentSearch
          searchQuery={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DemographicFilters
          demographicFilters={demographicFilters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <StudentGrid students={filteredStudents} />
    </div>
  );
};



export default GraduationDashboard;