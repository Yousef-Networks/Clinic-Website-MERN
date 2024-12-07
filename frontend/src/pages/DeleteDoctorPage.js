
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';


import './List.css'; // Import your CSS file for styling
import DoctorDetailsModal from '../components/doctorDetailsModal';

const DeleteDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);




  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getDoctors`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);



  const handleDelete = async (doctorId) => {
    setIsDeleting(true);
    try {
      // Make a DELETE request to the backend to delete the patient
      await axios.delete(`http://localhost:4000/deleteDoctor/${doctorId}`, {
        withCredentials: true
      });

      // After successful deletion, refresh the patient list by re-fetching
      fetchDoctors();
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting doctor:', error);
    } finally {
     
    }
  };

  return (
    <div className="container">
      <div className="patients-list">
        <h2>All Doctors</h2>


        {loading || isDeleting ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>
        ) : doctors.length === 0 ? (
          <p>No doctors found</p>
        ) : (
          <ul className="patients-list">
            {doctors.map((m) => (

              <li key={m._id}>
                <div className="patients-header">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>USername: </strong>{m.username}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>ID: </strong>{m._id}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                    <FontAwesomeIcon
                      className="view-icon"
                      icon={faEye}
                      style={{ marginLeft: '10px' }}
                      onClick={() => {
                        setModalOpen(true);
                        setActiveDoctorId(m._id)
                        setDoctor(doctors.find((p) => p._id === activeDoctorId));
                      }}
                    />
                    <FontAwesomeIcon
                      className="delete-icon"
                      icon={faTrash}
                      style={{ marginLeft: '10px' }}
                      onClick={() => {
                        setIsConfirmModalOpen(true)
                        setActiveDoctorId(m._id)
                        setDoctor(doctors.find((p) => p._id === activeDoctorId));}

                      }
                        
                    />
                  </div>
                </div>
              </li>

            ))}
          </ul>

        )}
      </div>
      {modalOpen && doctor &&
        <DoctorDetailsModal
          setOpenModal={setModalOpen}
          doctor={doctor}
        />
      }
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
            handleDelete(activeDoctorId);
            setIsConfirmModalOpen(false);
          }}>
            Yes
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => setIsConfirmModalOpen(false)}>
            No
          </button>
        </div>
      </Modal>
    </div >
  );
};

export default DeleteDoctor;

//   this is a doctor page