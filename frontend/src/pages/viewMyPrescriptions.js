import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MyPrescription = () => {
  const { username } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [doctorUsername, setDoctorUsername] = useState('');
  const [filledOnly, setFilledOnly] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getMyPrescriptions/${username}`,{
          withCredentials: true
        });

        if (response.status === 200) {
          let filteredPrescriptions = response.data;

          // Apply filters to the prescriptions
          if (doctorUsername) {
            filteredPrescriptions = filteredPrescriptions.filter(
              (prescription) => prescription.doctorUsername === doctorUsername
            );
          }

          if (filledOnly) {
            filteredPrescriptions = filteredPrescriptions.filter(
              (prescription) => prescription.filled === true
            );
          }

          if (filterDate) {
            filteredPrescriptions = filteredPrescriptions.filter(
              (prescription) => prescription.date.substring(0, 10)  === filterDate
            );
          }

          setPrescriptions(filteredPrescriptions);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [username, doctorUsername, filledOnly, filterDate]);
  const handleViewPrescription = (prescription) => {
    // Set the selected prescription to display its details in a modal or side panel
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    // Clear the selected prescription to close the modal or side panel
    setSelectedPrescription(null);
  };

  return (
    <div>
      <h1>Prescriptions of {username}</h1>

      {/* Filter form */}
      <form>
        <div>
          <label>
            Doctor Username:
            <input
              type="text"
              value={doctorUsername}
              onChange={(e) => setDoctorUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Filled Only:
            <input
              type="checkbox"
              checked={filledOnly}
              onChange={() => setFilledOnly(!filledOnly)}
            />
          </label>
        </div>
        <div>
          <label>
            Filter by Date:
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length > 0 ? (
        <ul>
          {prescriptions.map((prescription) => (
             <li key={prescription._id}>
             Medication Name: {prescription.medicationName}<br />
             
             <button onClick={() => handleViewPrescription(prescription)}>View Prescription</button>
           </li>
          ))}
        </ul>
      ) : (
        <p>No Prescriptions found.</p>
      )}
      {selectedPrescription && (
        <div>
          {/* Display prescription details here */}
          <h2>Prescription Details</h2>
          <p>Medication Name: {selectedPrescription.medicationName}</p>
          <p>Dosage: {selectedPrescription.dosage}</p>
          <p>Instructions: {selectedPrescription.instructions}</p>
          <p>Date: {selectedPrescription.date}</p>
          <p>Doctor ID: {selectedPrescription.doctor}</p>
          <p>Filled: {selectedPrescription.filled ? 'Yes' : 'No'}</p>
          {/* Add close button or functionality to close the modal */}
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default MyPrescription;