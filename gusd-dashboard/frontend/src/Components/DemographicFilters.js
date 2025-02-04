// src/Components/DemographicFilters.js
import React from 'react';

const DemographicFilters = ({ demographicFilters, onFilterChange }) => {
  return (
    <div className="demographic-filters">
      <label>
        Grade:
        <select 
          value={demographicFilters.grade} 
          onChange={(e) => onFilterChange('grade', e.target.value)}
        >
          <option value="">All Grades</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
      </label>

      <label>
        Risk Status:
        <select 
          value={demographicFilters.atRisk} 
          onChange={(e) => onFilterChange('atRisk', e.target.value)}
        >
          <option value="">All Students</option>
          <option value="at-risk">At Risk</option>
          <option value="on-track">On Track</option>
        </select>
      </label>

      <label>
        ELL Status:
        <select 
          value={demographicFilters.ellStatus} 
          onChange={(e) => onFilterChange('ellStatus', e.target.value)}
        >
          <option value="">All</option>
          <option value="YES">ELL</option>
          <option value="NO">Non-ELL</option>
        </select>
      </label>

      <label>
        Foster Care:
        <select 
          value={demographicFilters.fosterCare} 
          onChange={(e) => onFilterChange('fosterCare', e.target.value)}
        >
          <option value="">All</option>
          <option value="YES">Foster Care</option>
          <option value="NO">Non-Foster Care</option>
        </select>
      </label>

      <label>
        Expected Graduation:
        <select 
          value={demographicFilters.expectedGraduation} 
          onChange={(e) => onFilterChange('expectedGraduation', e.target.value)}
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </label>
    </div>
  );
};

export default DemographicFilters;