// services/analytics/AttendanceAnalyzer.js

class AttendanceAnalyzer {
  calculateAttendanceRate(records) {
    if (records.length === 0) return 100;

    const presentCodes = ['P', 'T']; // Present and Tardy
    const present = records.filter(record => presentCodes.includes(record.Code)).length;
    return (present / records.length) * 100;
  }
}

module.exports = new AttendanceAnalyzer();
