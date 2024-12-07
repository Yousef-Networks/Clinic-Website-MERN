// PrescriptionDetailsModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Set the root element for accessibility

const AppointmentsModal = ({ setOpenModal, appointment, doctor }) => {
    const [patient, setPatient] = useState(null);

    const fetchPatient = async () => {
        try {
            if (appointment.patientId === null) {
                return;
            }
            const response = await axios.get(`http://localhost:4000/getPatient/${appointment.patientId}`, { withCredentials: true });
            setPatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
        }

    }
    useEffect(() => {
        fetchPatient();
    }, [appointment]);

    return (

        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <div className='title' style={{ marginBottom: '50px' }}>
                    <h1>Appointment Details</h1>
                </div>
                <div className="metadata" style={{}}>
                    <p style={{ fontSize: '20px', marginBottom: '40px' }}><strong>ID: </strong>{appointment._id}</p>
                    <p style={{ fontSize: '20px', marginBottom: '40px' }}><strong>Date: </strong>{new Date(appointment.date).toLocaleDateString('en-GB')}</p>
                    <p style={{ fontSize: '20px', marginBottom: '40px' }}><strong>Status: </strong>{appointment.status}</p>
                    {patient && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                                <strong>Patient:  </strong>{patient.name}
                                <Link to={`/patient-details/${patient.username}/${doctor._id}`}>
                                    <FontAwesomeIcon icon={faEye} style={{ marginLeft: '10px' }} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>




            </div>
        </div>
    );
};

export default AppointmentsModal;
