import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../components/patientDetails.css';

const DoctorDetails = () => {
  const { doctorUsername, patientUsername } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Make an API request to get all doctor information
        const response = await axios.get('http://localhost:4000/getDoctors', {
          withCredentials: true
        });

        if (response.status === 200) {
          const allDoctors = response.data;

          // Find the doctor with the matching username
          const matchingDoctor = allDoctors.find((doc) => doc.username === doctorUsername);
          if (matchingDoctor) {
            setDoctor(matchingDoctor);
          } else {
            // Handle the case where no doctor with the username is found
            console.error('Doctor not found:', doctorUsername);
          }
        }
      } catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false); // Mark loading as complete, whether successful or not
      }
    };

    // Call the fetchDoctorData function when the component mounts
    fetchDoctorData();
  }, [doctorUsername]);

  if (loading) {
    return <div>Loading doctor details...</div>;
  }

  if (!doctor) {
    return <div>Doctor Not Found</div>;
  }

  return (
    <div className="container">
      <div className="details-container">
        <h2 className="title">Patient Details</h2>
        <table style={{ fontSize: '1.5em', padding: '10px' }}>
          <tbody>
            <tr>
              <th>Name:</th>
              <td>{doctor.name}</td>
            </tr>
            <tr>
              <th>Username:</th>
              <td>{doctor.username}</td>
            </tr>
            <tr>
              <th>Email:</th>
              <td>{doctor.email}</td>
            </tr>
            <tr>
              <th>Date of Birth:</th>
              <td>{new Date(doctor.date_of_birth).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Hourly Rate:</th>
              <td>${doctor.hourly_rate}</td>
            </tr>
            <tr>
              <th>Affiliation</th>
              <td>{doctor.Affiliation}</td>
            </tr>
            <tr>
              <th>Speciality:</th>
              <td>{doctor.speciality}</td>
            </tr>
            <tr>
              <th>Educational Background:</th>
              <td>{doctor.educational_background}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="button-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <Link to={`/viewAppointments/${doctorUsername}/${patientUsername}`}>
        <button className="button">View Appointments</button>
        </Link>
        <button className="button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>

  );
};

export default DoctorDetails;