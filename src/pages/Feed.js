import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Import Link from React Router

const Feed = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // Assuming token is saved in localStorage

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approvedReviews = response.data.filter(
        (review) => review.status === 'added'
      ); // Filter approved reviews
      setReviews(approvedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to render the star rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0; // Check if there is a half star
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

    let stars = [];

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push('★'); // Filled star
    }

    // Add half star if necessary
    if (halfStar) {
      stars.push('☆'); // Half-filled star (use a special character if needed)
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆'); // Empty star
    }

    return stars.join('');
  };

  // Format the date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats as 'MM/DD/YYYY, HH:MM AM/PM'
  };

  return (
    <div>
      <h2>Reviews Feed</h2>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <Spinner
          animation="border"
          role="status"
          style={{ display: 'block', margin: 'auto' }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Row>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Col md={4} key={review.id} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/public/images/${review.image}`}
                    alt={review.bookTitle}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{review.bookTitle}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {review.author}
                    </Card.Subtitle>
                    <Card.Text>{review.reviewText}</Card.Text>
                    <div className="mb-2">
                      {/* Render the star rating */}
                      <span>{renderStars(review.rating)}</span>
                      <span className="ms-2">({review.rating}/5)</span>
                    </div>
                    <Badge bg="info">Rating: {review.rating}</Badge>
                    <br />
                    <Badge
                      bg={review.status === 'added' ? 'success' : 'warning'}
                    >
                      {review.status === 'added' ? 'Approved' : 'Pending'}
                    </Badge>
                    <br />
                    <small className="text-muted">
                      {formatDate(review.createdAt)} {/* Display the date and time */}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center w-100">
              Approved reviews will appear here.
            </p>
          )}
        </Row>
      )}
    </div>
  );
};

export default Feed;
