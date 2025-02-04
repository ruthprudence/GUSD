import logo from './logo.svg';
import './Styles/App.css';
import './Styles/GraduationDashboard.css';

import DBStatus from './Components/DBStatus';

import GraduationDashboard from './Components/GraduationDashboard';

function App() {

  return (
    <>
  <div>
    <h1>GUSD Student Data Dashboard</h1>
    <DBStatus />
  </div>
  <GraduationDashboard />
    </>
  );

}

export default App;
