import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    bookTitle: '',
    author: '',
    rating: '',
    reviewText: '',
    image: null, // Store the image file
    imagePreview: null, // Preview the image
  });
  const [editingReview, setEditingReview] = useState(null);
  
  // State for "More Info" modal
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats as 'MM/DD/YYYY, HH:MM AM/PM'
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Swal.fire('Error', 'Failed to fetch reviews.', 'error');
    }
  };

  const handleCreateReview = () => {
    setShowModal(true);
    setNewReview({
      bookTitle: '',
      author: '',
      rating: '',
      reviewText: '',
      image: null,
      imagePreview: null,
    });
    setEditingReview(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewReview({
        ...newReview,
        [name]: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      });
    } else {
      setNewReview({
        ...newReview,
        [name]: value,
      });
    }
  };

  const handleSaveReview = async () => {
    try {
      if (!newReview.bookTitle || !newReview.author || !newReview.rating || !newReview.reviewText) {
        Swal.fire('Error', 'Please fill in all fields.', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('bookTitle', newReview.bookTitle);
      formData.append('author', newReview.author);
      formData.append('rating', newReview.rating);
      formData.append('reviewText', newReview.reviewText);

      if (newReview.image) {
        formData.append('image', newReview.image);
      } else if (editingReview && editingReview.image) {
        formData.append('image', editingReview.image);
      }

      let response;
      if (editingReview) {
        response = await axios.put(`http://localhost:5000/api/reviews/${editingReview.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Success', 'Review updated successfully!', 'success');
      } else {
        response = await axios.post('http://localhost:5000/api/reviews', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Success', 'Review created successfully!', 'success');
      }

      fetchReviews();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving review:', error);
      Swal.fire('Error', 'There was an error saving your review.', 'error');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      bookTitle: review.bookTitle,
      author: review.author,
      rating: review.rating,
      reviewText: review.reviewText,
      image: review.image,
      imagePreview: review.image ? `http://localhost:5000/public/images/${review.image}` : null,
    });
    setShowModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire('Error', 'There was an error deleting your review.', 'error');
      }
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Handler for "More Info" button
  const handleMoreInfo = (review) => {
    setSelectedReview(review);
    setShowMoreInfoModal(true);
  };

  const handleCloseMoreInfoModal = () => {
    setShowMoreInfoModal(false);
    setSelectedReview(null);
  };

  return (
    <div>
      <h2>My Reviews</h2>
      <Button variant="primary" onClick={handleCreateReview} style={{ marginBottom: '20px' }}>
        Create New Review
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Image</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.bookTitle}</td>
                <td>{review.author}</td>
                <td>{review.rating}</td>
                <td>
                  {truncateText(review.reviewText, 50)}
                </td>
                <td>
                  {review.image ? (
                    <img
                      src={`http://localhost:5000/public/images/${review.image}`}
                      alt="Review"
                      width="100"
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{formatDate(review.createdAt)}</td>
                <td>
                <Badge
  bg={
    review.status === 'added'
      ? 'success' // Green badge for added
      : review.status === 'rejected'
      ? 'danger' // Red badge for rejected
      : review.status === 'pending'
      ? 'warning' // Yellow badge for pending
      : 'secondary' // Default badge for unknown statuses
  }
>
  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
</Badge>
                </td>
                <td>
  <div className="d-flex gap-2">
    <Button
      variant="warning"
      onClick={() => handleEditReview(review)}
      title="Edit"
      className="p-2" // Adds padding to the button
    >
      <FaEdit className="text-white" />
    </Button>
    <Button
      variant="danger"
      onClick={() => handleDeleteReview(review.id)}
      title="Delete"
      className="p-2" // Adds padding to the button
    >
      <FaTrashAlt className="text-white" />
    </Button>
    <Button
      variant="info"
      onClick={() => handleMoreInfo(review)}
      title="More Info"
      className="p-2" // Adds padding to the button
    >
      <FaInfoCircle className="text-white" />
    </Button>
  </div>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                You have not created any reviews yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for creating/editing a review */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingReview ? 'Edit Review' : 'Create Review'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="bookTitle">
              <Form.Label>Book Title</Form.Label>
              <Form.Control
                type="text"
                name="bookTitle"
                value={newReview.bookTitle}
                onChange={handleInputChange}
                placeholder="Enter book title"
              />
            </Form.Group>
            <Form.Group controlId="author" className="mt-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={newReview.author}
                onChange={handleInputChange}
                placeholder="Enter author"
              />
            </Form.Group>
            <Form.Group controlId="rating" className="mt-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={newReview.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                placeholder="Enter rating"
              />
            </Form.Group>
            <Form.Group controlId="reviewText" className="mt-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                name="reviewText"
                value={newReview.reviewText}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter your review"
              />
            </Form.Group>
            <Form.Group controlId="image" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
              />
              {newReview.imagePreview && (
                <div className="mt-3">
                  <img src={newReview.imagePreview} alt="Preview" width="100" />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveReview}>
            Save Review
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for "More Info" */}
      <Modal show={showMoreInfoModal} onHide={handleCloseMoreInfoModal}>
        <Modal.Header closeButton>
          <Modal.Title>More Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <strong>Book Title:</strong> {selectedReview?.bookTitle}
          </div>
          <div>
            <strong>Author:</strong> {selectedReview?.author}
          </div>
          <div>
            <strong>Rating:</strong> {selectedReview?.rating}
          </div>
          <div>
            <strong>Review:</strong> {selectedReview?.reviewText}
          </div>
          <div>
            <strong>Date Created:</strong> {formatDate(selectedReview?.createdAt)}
          </div>
          <div>
            <strong>Status:</strong> <Badge bg={selectedReview?.status === 'approved' ? 'success' : 'warning'}>{selectedReview?.status === 'approved' ? 'Approved' : 'Pending'}</Badge>
          </div>
          {selectedReview?.image && (
            <div className="mt-3">
              <strong>Image:</strong>
              <img
                src={`http://localhost:5000/public/images/${selectedReview.image}`}
                alt="Review"
                width="200"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMoreInfoModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyReviews;
