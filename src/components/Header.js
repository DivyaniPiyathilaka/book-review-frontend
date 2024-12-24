import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of the system.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear user authentication (e.g., token)
        localStorage.removeItem('token');
        
        // Redirect to login page and reload the page
        navigate('/login'); // Navigate to login page
        window.location.reload(); // Reload the page after navigation
        Swal.fire(
          'Logged Out!',
          'You have been logged out successfully.',
          'success'
        );
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/home">Book Review System</a>
        <div className="d-flex">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
