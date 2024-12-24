import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        role,
      });

      // Show success alert with SweetAlert2
      Swal.fire({
        title: 'Registration Successful!',
        text: 'You have successfully registered. Please log in.',
        icon: 'success',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        // Navigate to login page after success
        navigate('/login');
      });
    } catch (err) {
      // Show error alert with SweetAlert2 if registration fails
      Swal.fire({
        title: 'Registration Failed',
        text: err.response?.data?.message || 'An error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>

        {/* Links at the bottom */}
        <div className="text-center mt-3">
          <p>Already have an account? <a href="/login" className="text-decoration-none">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
