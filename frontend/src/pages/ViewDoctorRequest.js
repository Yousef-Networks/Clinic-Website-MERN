
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";
import { faEye} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RequestModal from '../components/RequestModal';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [request, setRequest] = useState("");
  const [activeRequestId, setActiveRequestId] = useState(null);



  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/getRequests`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = async (id) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`http://localhost:4000/acceptRequest/${id}`, {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        setRequests(requests.filter((r) => r._id !== id));
        fetchRequests();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reqid) => {
    setIsProcessing(true);
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.put(`http://localhost:4000/rejectRequest/${reqid}`, {}, {
        withCredentials: true
      });

      // After successful deletion, refresh the patient list by re-fetching
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting doctor request:', error);
    }finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);


  return (
    <div className="container">
      <div className="patients-list">
        <h2>All Requests</h2>


        {loading ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>
        ) : requests.length === 0 ? (
          <p>No Requests found</p>
        ) : (
          <ul className="patients-list">
            {requests.map((m) => (
              <li key={m._id}>
                <div className="patients-header">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Username: </strong>{m.username}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Requesr ID: </strong>{m._id}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                    {m.status1 === 'pending' && (
                      <>
                        <button
                         disabled={isProcessing}
                          style={{
                            backgroundColor: '#4CAF50', /* Green */
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px', // Reduced padding
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontSize: '14px', // Reduced font size
                            margin: '4px 2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleAccept( m._id)}
                        >
                          Accept
                        </button>
                        <button
                         disabled={isProcessing}
                          style={{
                            backgroundColor: '#f44336', /* Red */
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px', // Reduced padding
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontSize: '14px', // Reduced font size
                            margin: '4px 2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleReject(m._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <FontAwesomeIcon
                      className="view-icon"
                      icon={faEye}
                      style={{ marginLeft: '10px' }}
                      onClick={() => {
                        setModalOpen(true);
                        setActiveRequestId(m._id)
                        setRequest(requests.find((p) => p._id === activeRequestId));
                      }}
                    />

                  </div>
                </div>
              </li>

            ))}
          </ul>
        )}
      </div>
      {modalOpen && request &&
        <RequestModal
          setOpenModal={setModalOpen}
          request={request}
        />
      }
    </div >
  );
};

export default ViewRequests;

//  this is a doctor page