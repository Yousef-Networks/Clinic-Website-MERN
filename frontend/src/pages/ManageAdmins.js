import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminForm from '../components/AdminForm';
import Modal from 'react-modal';

const ManageAdmins = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [activeAdminId, setActiveAdminId] = useState(null);
  const [admin, setAdmin] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getAdmins`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);
  const handleDelete = async (adminId) => {
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.delete(`http://localhost:4000/deleteAdmin/${adminId}`, {
        withCredentials: true
      });

      // After successful deletion, refresh the patient list by re-fetching
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };
  const handleAdminAdded = (admin) => {
    // Add the new admin to the list of admins
    setAdmins(prevAdmins => [...prevAdmins, admin]);
    setIsFormVisible(false);
  };

  return (
    <div className="container">
      <div className="prescriptions-list">
        <h2>
          Admins
          <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
            style={{ color: '#14967f' }}
          />
        </h2>
        <ul>
          {admins.map((admin) => (
            <li key={admin._id}>
              <div className="prescription-card">
                <div className="prescription-header">
                  <span><strong>Username: </strong>  {admin.username}</span>
                  <FontAwesomeIcon
                      className="delete-icon"
                      icon={faTrash}
                      style={{ marginLeft: '10px' }}
                      onClick={() => {
                        setIsConfirmModalOpen(true)
                        setActiveAdminId(admin._id)
                       }

                      }
                        
                    />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="prescription-form">
        {isFormVisible && <AdminForm onAdminAdded={handleAdminAdded} />}
      </div>
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        contentLabel="Confirm Delete"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f4f4f4',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Confirm Delete</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>Are you sure you want to delete this doctor?</p>
       
        <div>
          <button style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: 'crimson', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => {
            handleDelete(activeAdminId);
            setIsConfirmModalOpen(false);
          }}>
            Yes
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => setIsConfirmModalOpen(false)}>
            No
          </button>
        </div>
      </Modal>

    </div>

  )
}
export default ManageAdmins
