import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";

const ViewFollowUpReqs = () => {
  const [followUpReqs, setFollowUpReqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { doctorId } = useParams();
  const [loadingButtonId, setLoadingButtonId] = useState(null);
  const navigate = useNavigate(); // React Router's useNavigate hook

  const fetchFollowUpReqs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/getFollowUpReqs/${doctorId}`);
      setFollowUpReqs(response.data);
    } catch (error) {
      console.error('Error getting follow-up requests:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFollowUpReqs();
  }, [doctorId]);

  const handleAccept = async (id) => {
    setLoadingButtonId(id);
    try {
      const response = await axios.post(`http://localhost:4000/acceptFollowUpReq/${id}`);
      console.log(`Accepted request ${id}`);
      fetchFollowUpReqs();
      // Update the state or do something with the response if needed
    } catch (error) {
      console.error(`Error accepting request ${id}:`, error);
    }
    setLoadingButtonId(null);
  };

  const handleReject = async (reqid) => {
    setLoadingButtonId(reqid);
    try {
      const response = await axios.post(`http://localhost:4000/rejectFollowUpReq/${reqid}`);
      console.log(`Rejected request ${reqid}`);
      fetchFollowUpReqs();
      // Update the state or do something with the response if needed
    } catch (error) {
      console.error(`Error rejecting request ${reqid}:`, error);
    }
    setLoadingButtonId(null);
  };

  const handleGoBack = () => {
    // Use the navigate function to go back
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="patients-list">
        <h2>All Requests</h2>
        {isLoading ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>
        ) : followUpReqs.length === 0 ? (
          <p>No Requests found</p>
        ) : (
          <ul className="patients-list">
            {followUpReqs.map((m) => (
              <li key={m._id}>
                <div className="patients-header">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Patient ID: </strong>{m.patientId}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Date: </strong>{m.date}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                    {loadingButtonId === m._id ? (
                      <BeatLoader color="#14967f" size={15} />
                    ) : (
                      <>
                        <button
                          style={{
                            backgroundColor: '#4CAF50',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px',
                            fontSize: '14px',
                            margin: '4px 2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleAccept(m._id)}
                        >
                          Accept
                        </button>
                        <button
                          style={{
                            backgroundColor: '#f44336',
                            border: 'none',
                            color: 'white',
                            padding: '10px 20px',
                            fontSize: '14px',
                            margin: '4px 2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleReject(m._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#2060a4',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleGoBack}
      >
        Back
      </button>
    </div>
  );
};

export default ViewFollowUpReqs;
