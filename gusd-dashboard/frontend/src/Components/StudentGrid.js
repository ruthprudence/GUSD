import React from 'react';
import StudentCard from './StudentCard';

const StudentGrid = ({ students }) => {
  return (
    <div className="students-grid">
      {students.map((student) => (
        <StudentCard key={student.ID} student={student} />
      ))}
    </div>
  );
};

export default StudentGrid;