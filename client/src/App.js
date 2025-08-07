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
function App() {
  const token = useSelector((state) => state.auth.token);
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
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          {/* <Route path="/" element={<FortnightDashboard />} />  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
