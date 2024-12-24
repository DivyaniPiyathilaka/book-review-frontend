// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Import Sidebar
import MyReviews from './pages/MyReviews';
import Feed from './pages/Feed'; // Example Feed page
import ManagePendingReviews from './pages/ManagePendingReviews'; 
import ProtectedRoute from './pages/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div style={styles.wrapper}>
        <Header />  
        <div className="d-flex">
          <Sidebar /> 

          <div style={styles.content} className="container">
            <Routes>
              <Route
                path="/feed"
                element={<Feed />} 
              />
              <Route
                path="/my-reviews"
                element={
                  <ProtectedRoute>
                    <MyReviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-pending-reviews"
                element={
                  <ProtectedRoute>
                    <ManagePendingReviews />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>

        <Footer /> {/* Include Footer component */}
      </div>
    </Router>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    marginLeft: '10px',  // Ensures content is not hidden behind the sidebar
    padding: '20px',
  },
};

export default App;
