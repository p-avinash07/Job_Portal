import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import RecruiterDashboard from './pages/RecruiterDashboard.jsx';
import AIInterview from './pages/AIInterview.jsx';
import ATSChecker from './pages/ATSChecker.jsx';
import CandidateDetails from './pages/CandidateDetails.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/ai-interview" element={<AIInterview />} />
        <Route path="/ats-checker" element={<ATSChecker />} />
        <Route path="/candidate/:id" element={<CandidateDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
