import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import Login from './layouts/Login';
import { useSelector } from 'react-redux';
import SignUp from './layouts/SignUp';
import SetTargetForm from './layouts/TargetSet';
// import FortnightDashboard from './layouts/FortNightDashboard';
import { isAuthenticated } from './api/services';
import TargetKPI from './layouts/TargetKPI';
import ReportsHome from './layouts/Reports/ReportsHome';
function App() {
  const token = useSelector((state) => state.auth.token);
  const isReportsAllowed = useSelector((state) => state.auth.isReportsAllowed);
  console.log(token)


  return (
    <Router>
      <div>
        <Routes>
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} />
          {/* <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} /> */}
          <Route path="/signup" element={isAuthenticated() ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/settarget" element={isAuthenticated() ? <SetTargetForm/> : <Navigate to="/" />} />
          <Route path="/setkpi" element={isAuthenticated() ? <TargetKPI/> : <Navigate to="/" />} />
          {/* Reports is manager-only (admin/manager/demo). Guarded here too so a
              store login cannot reach it by typing the URL directly. */}
          <Route
            path="/reports"
            element={
              !isAuthenticated()
                ? <Navigate to="/" />
                : isReportsAllowed
                  ? <ReportsHome/>
                  : <Navigate to="/dashboard" replace />
            }
          />
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          {/* <Route path="/" element={<FortnightDashboard />} />  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
