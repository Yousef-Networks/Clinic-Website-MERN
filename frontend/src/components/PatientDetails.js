import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorHealthRecordModal from './DoctorHealthRecordModal';
import PatientHealthRecord from '../pages/PatientHealthRecord';

const PatientDetails = () => {
  const { username, usernameDoctor } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHealthRecordModalOpen, setIsHealthRecordModalOpen] = useState(false);
  const [viewHealthRecord, setViewHealthRecord] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true
        });

        if (response.status === 200) {
          setPatient(response.data);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [username]);

  const handleUploadHealthRecord = () => {
    setIsHealthRecordModalOpen(true);
  };

  const handleCloseHealthRecordModal = () => {
    setIsHealthRecordModalOpen(false);
    setViewHealthRecord(false); // Reset the state when closing the modal
  };

  const handleHealthRecordSubmit = () => {
    setIsHealthRecordModalOpen(false);
    setViewHealthRecord(true);
  };

  if (loading) {
    return <div>Loading patient details...</div>;
  }

  if (!patient) {
    return <div>Patient Not Found</div>;
  }

  return (
    <div className="container">
      <div className="details-container">
        <h2 className="title">Patient Details</h2>
        <table style={{ fontSize: '1.5em', padding: '10px' }}>
          <tbody>
            <tr>
              <th>Name:</th>
              <td>{patient.name}</td>
            </tr>
            <tr>
              <th>Username:</th>
              <td>{patient.username}</td>
            </tr>
            <tr>
              <th>Email:</th>
              <td>{patient.email}</td>
            </tr>
            <tr>
              <th>Date of Birth:</th>
              <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Gender:</th>
              <td>{patient.gender}</td>
            </tr>
            <tr>
              <th>Mobile Number:</th>
              <td>{patient.mobileNumber}</td>
            </tr>
            <tr>
              <th>Emergency Contact Name:</th>
              <td>{patient.emergencyContact.fullName}</td>
            </tr>
            <tr>
              <th>Emergency Contact Mobile Number:</th>
              <td>{patient.emergencyContact.mobileNumber}</td>
            </tr>
            {/* Add more patient details as needed */}
          </tbody>
        </table>
      </div>
      <div className="button-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to={`/managePrescriptions/${username}/${usernameDoctor}`}>
          <button className="button">Manage Prescriptions</button>
        </Link>
        <button className="button" onClick={handleUploadHealthRecord}>
          Upload Health Record
        </button>
        <button className="button" onClick={() => setViewHealthRecord(true)}>
          View Health Record
        </button>
        {/* Render the DoctorHealthRecordModal component based on the isHealthRecordModalOpen state */}
        {isHealthRecordModalOpen && (
          <DoctorHealthRecordModal onSubmit={handleHealthRecordSubmit} onClose={handleCloseHealthRecordModal} />
        )}
       {/* Render the PatientHealthRecord component based on the "View Health Record" button click */}
       {viewHealthRecord && <PatientHealthRecord username={username} onClose={handleCloseHealthRecordModal} />}
        <Link to={{
          pathname: `/followUpDoctor/${username}/${usernameDoctor}`,
          state: { patient: patient }
        }}>
          <button className="button">Schedule Follow-Up</button>
        </Link>
        <button className="button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default PatientDetails;