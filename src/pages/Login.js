import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send email, password, and role to the backend for login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      // Save the token to localStorage
      localStorage.setItem('token', response.data.token);

      // Show success alert with SweetAlert2
      Swal.fire({
        title: 'Login Successful!',
        text: 'You have successfully logged in.',
        icon: 'success',
        confirmButtonText: 'Go to Feed',
      }).then(() => {
        // Navigate to the feed page
        navigate('/feed');
        
        // Reload the page to reflect any updates
        window.location.reload();
      });
    } catch (err) {
      // Show error alert if login fails
      Swal.fire({
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid credentials',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {/* Links at the bottom */}
        <div className="text-center mt-3">
          <p>Don't have an account? <a href="/register" className="text-decoration-none">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
