// src/AuthApp.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function AuthApp() {
  const [error, setError] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setError={setError} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default AuthApp;
