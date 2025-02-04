import React from 'react';

const StudentSearch = ({ searchQuery, onChange }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={onChange}
        placeholder="Search for a student"
      />
    </div>
  );
};

export default StudentSearch;