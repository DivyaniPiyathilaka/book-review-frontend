import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken?.role || null;
    } catch (error) {
      console.error('Invalid token format');
      return null;
    }
  };

  const userRole = getUserRole();

  const navLinks = [
    { path: '/feed', label: 'Feed', roles: ['user', 'admin'] },
    { path: '/my-reviews', label: 'My Reviews', roles: ['user', 'admin'] },
    { path: '/manage-pending-reviews', label: 'Manage Pending Reviews', roles: ['admin'] },
  ];

  const styles = {
    container: {
      width: '250px',
      height: '100vh',
      backgroundColor: '#1e293b',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
    },
    title: {
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
      color: '#f1f5f9',
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navItem: {
      marginBottom: '1rem',
    },
    link: {
      fontSize: '1.1rem',
      padding: '0.8rem 1rem',
      color: '#94a3b8',
      textDecoration: 'none',
      borderRadius: '8px',
      display: 'block',
      transition: 'all 0.3s ease',
    },
    activeLink: {
      backgroundColor: '#0f172a',
      color: '#38bdf8',
    },
    hoverLink: {
      backgroundColor: '#334155',
      color: '#fff',
    },
  };

  return (
    <div style={styles.container}>
      <ul style={styles.navList}>
        {navLinks
          .filter(link => link.roles.includes(userRole))
          .map(link => (
            <li key={link.path} style={styles.navItem}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) =>
                  isActive
                    ? { ...styles.link, ...styles.activeLink }
                    : styles.link
                }
                onMouseEnter={e => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = styles.hoverLink.backgroundColor;
                    e.target.style.color = styles.hoverLink.color;
                  }
                }}
                onMouseLeave={e => {
                  if (!e.target.classList.contains('active')) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = styles.link.color;
                  }
                }}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
