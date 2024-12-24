// Footer.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div style={styles.wrapper}>
      <footer className="footer bg-light text-center py-3 mt-auto" style={styles.footer}>
        <p>&copy; 2024 Book Review System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  footer: {
    marginTop: 'auto', // Pushes footer to the bottom
  },
};

export default Footer;
