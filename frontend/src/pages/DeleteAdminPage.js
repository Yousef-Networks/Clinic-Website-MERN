



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './List.css'; // Import your CSS file for styling

const DeleteAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
 

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getAdmins`,{
        withCredentials: true
      });

      if (response.status === 200) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);
  const handleDelete = async (adminId) => {
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.delete(`http://localhost:4000/deleteAdmin/${adminId}`,{
        withCredentials: true
      });

      // After successful deletion, refresh the patient list by re-fetching
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="medicine-list-container">
      <h1>All Admins</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : admins.length > 0 ? (
        <ul className="medicine-list">
          {admins.map((m) => (
            <li key={m._id} className="medicine-item">
              <div className="medicine-details">
                
                <strong>Username:</strong> {m.username}<br />
                
               
                <Link to="#" onClick={() => handleDelete(m._id)}>Delete</Link>
                
                
              </div>
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No Admins found.</p>
      )}
    </div>
  );
};

export default DeleteAdmin;

//   this is an admin page