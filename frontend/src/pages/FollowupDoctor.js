import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import axios from 'axios';
const FollowupDoctor = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const {username,usernameDoctor} = useParams();
    const [patient, setPatient] = useState(null);
    const [doctor, setDoctor] = useState(null);
  useEffect(() => {

    const fetchPatientData = async () => {
      try {
        // Make an API request to get all patient information
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true
        });

        if (response.status === 200) {
          setPatient(response.data);
        }
      } catch (error) {
        // Handle API request errors more gracefully
        console.error('Error fetching patient data:', error);
      } 
    };
    const fetchDoctorData = async () => {
        try {
          // Make an API request to get all patient information
          const response = await axios.get(`http://localhost:4000/getDoctor/${usernameDoctor}`, {
            withCredentials: true
          });
  
          if (response.status === 200) {
            setDoctor(response.data);
          }
        } catch (error) {
          // Handle API request errors more gracefully
          console.error('Error fetching doctor data:', error);
        } 
      };

    // Call the fetchPatientData function when the component mounts
    fetchPatientData();
    fetchDoctorData();

  }, [username]);

  const handleSubmit = async () => {
    try {
        const pid=patient._id;
        const did=doctor._id;
        const hour = parseInt(time.split(':')[0], 10);
     const f={patientId:pid,doctorId:did,date:date,status:'Scheduled',description,hour}
      const response = await axios.post(`http://localhost:4000/createAppointment`, f, {
        withCredentials: true
      });
      if (response.status === 200) {
        console.log('Appointment created successfully');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Schedule Follow-up</button>
      </form>
    </div>
  );
};

export default FollowupDoctor;