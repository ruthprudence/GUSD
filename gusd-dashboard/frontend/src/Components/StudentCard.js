import React from 'react';
import { calculateGraduationProgress } from './API/utils';

const StudentCard = ({ student }) => {
  console.log(`Rendering Student Card for ${student.First_Name} ${student.Last_Name}`);
  console.log('Student Data:', student);

  const formattedGraduationProgress =
    student.graduationProgress !== undefined ? `${student.graduationProgress.toFixed(1)}%` : 'N/A';
  
  const attendance = student.Attendance !== undefined ? `${student.Attendance}%` : 'N/A';

  return (
    <div className="student-card">
      <div className="student-header">
        <h4>{student.First_Name} {student.Last_Name}</h4>
      </div>
      <div className="student-content">
        <div className="demographics-section">
          <h5>Demographics</h5>
          <table>
            <tbody>
              <tr>
                <th>School</th>
                <td>{student.School}</td>
              </tr>
              <tr>
                <th>Grade</th>
                <td>{student.Grade}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="progress-section">
          <h5>Attendance and Graduation Progress</h5>
          <table>
            <tbody>
              <tr>
                <th>Attendance</th>
                <td>{attendance}</td>
              </tr>
              <tr>
                <th>Graduation Progress</th>
                <td>{formattedGraduationProgress}</td>
              </tr>
              <tr>
                <th>At Risk</th>
                <td>{student.isAtRisk ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;



// const StudentCard = ({ student }) => {
//   const graduationProgress = calculateGraduationProgress(student);
//   const formattedGraduationProgress = graduationProgress !== undefined ? 
//     `${graduationProgress.toFixed(1)}%` : 'N/A';
//   const attendance = student.Attendance !== undefined ? 
//     `${student.Attendance.toFixed(1)}%` : 'N/A';

//   const riskStatus = student.isAtRisk ? 
//     'bg-red-100 border-red-500' : 
//     'bg-green-100 border-green-500';

//   return (
//     <div className={`student-card border-2 p-4 rounded-lg ${riskStatus}`}>
//       <div className="student-header mb-4">
//         <h4 className="text-lg font-bold">
//           {student.First_Name} {student.Last_Name}
//         </h4>
//       </div>
//       <div className="student-content grid gap-4">
//         <div className="demographics-section">
//           <h5 className="font-semibold mb-2">Demographics</h5>
//           <table className="w-full">
//             <tbody>
//               <tr>
//                 <th className="text-left">School</th>
//                 <td>{student.School}</td>
//               </tr>
//               <tr>
//                 <th className="text-left">Grade</th>
//                 <td>{student.Grade}</td>
//               </tr>
//               <tr>
//                 <th className="text-left">ELL Status</th>
//                 <td>{student.ELL_Status}</td>
//               </tr>
//               <tr>
//                 <th className="text-left">Foster Care</th>
//                 <td>{student.Foster_Care}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         <div className="progress-section">
//           <h5 className="font-semibold mb-2">Progress</h5>
//           <table className="w-full">
//             <tbody>
//               <tr>
//                 <th className="text-left">Attendance</th>
//                 <td>{attendance}</td>
//               </tr>
//               <tr>
//                 <th className="text-left">Graduation Progress</th>
//                 <td>{formattedGraduationProgress}</td>
//               </tr>
//               <tr>
//                 <th className="text-left">Status</th>
//                 <td className={student.isAtRisk ? 'text-red-600' : 'text-green-600'}>
//                   {student.isAtRisk ? 'At Risk' : 'On Track'}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCard;