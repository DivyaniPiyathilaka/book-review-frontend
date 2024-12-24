import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle, FaUndo, FaInfoCircle, FaHourglass } from 'react-icons/fa';

const ManagePendingReviews = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const token = localStorage.getItem('token'); // Assuming token is saved in localStorage

  // Fetch pending reviews when the component mounts
  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter reviews with "pending" status
      const pendingReviews = response.data.filter((review) => review.status === 'pending');

      setPendingReviews(pendingReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load pending reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (reviewId, newStatus) => {
    try {
      if (!['pending', 'added', 'rejected'].includes(newStatus)) {
        Swal.fire('Error', 'Invalid status value', 'error');
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/api/reviews/${reviewId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire('Success', `Review status updated to ${newStatus}`, 'success');
      fetchPendingReviews(); // Refresh the list after status change
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire('Error', 'Failed to update review status. Please try again later.', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats as 'MM/DD/YYYY, HH:MM AM/PM'
  };

  const handleShowMoreInfo = (review) => {
    setSelectedReview(review);
    setShowMoreInfoModal(true);
  };

  const handleCloseMoreInfoModal = () => {
    setShowMoreInfoModal(false);
    setSelectedReview(null);
  };

  return (
    <div>
      <h2>Manage Pending Reviews</h2>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <Spinner animation="border" role="status" style={{ display: 'block', margin: 'auto' }}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Image</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingReviews.length > 0 ? (
              pendingReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.bookTitle}</td>
                  <td>{review.author}</td>
                  <td>{review.rating}</td>
                  <td>
                    {review.reviewText.length > 50
                      ? review.reviewText.slice(0, 50) + '...'
                      : review.reviewText}
                  </td>
                  <td>
                    {review.image ? (
                      <img
                        src={`http://localhost:5000/public/images/${review.image}`}
                        alt={review.bookTitle}
                        width="100"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>
  <Badge
    bg={
      review.status === 'pending'
        ? 'warning'
        : review.status === 'added'
        ? 'success'
        : 'danger'
    }
    className="d-flex align-items-center"
  >
    {review.status === 'pending' && <FaHourglass className="mr-2" />}
    {review.status === 'added' && <FaCheckCircle className="mr-2" />}
    {review.status === 'rejected' && <FaTimesCircle className="mr-2" />}
    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
  </Badge>
</td>
<td>{formatDate(review.createdAt)}</td>
<td>
  <div className="d-flex gap-3">
    {review.status === 'pending' && (
      <>
        <Button
          variant="success"
          onClick={() => handleChangeStatus(review.id, 'added')}
        >
          <FaCheckCircle />
        </Button>
        <Button
          variant="danger"
          onClick={() => handleChangeStatus(review.id, 'rejected')}
        >
          <FaTimesCircle />
        </Button>
      </>
    )}

    {(review.status === 'added' || review.status === 'rejected') && (
      <Button
        variant="warning"
        onClick={() => handleChangeStatus(review.id, 'pending')}
      >
        <FaUndo />
      </Button>
    )}

    <Button
      variant="info"
      onClick={() => handleShowMoreInfo(review)}
    >
      <FaInfoCircle />
    </Button>
  </div>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No pending reviews available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

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
            <strong>Status:</strong>{' '}
            <Badge
              bg={selectedReview?.status === 'approved' ? 'success' : 'warning'}
            >
              {selectedReview?.status === 'approved' ? 'Approved' : 'Pending'}
            </Badge>
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

export default ManagePendingReviews;
