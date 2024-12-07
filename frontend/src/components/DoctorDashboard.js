import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";


const DoctorDashboard = () => {
  const { username } = useParams();
  const [doctor, setDoctor] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:4000/getdoctor/${username}`, { withCredentials: true });
        if (response.status === 200) {
          setDoctor(response.data);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
      setIsLoading(false);
    }
    fetchWallet();
  }, [username]);

  return (
    <div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '90vh' }}>
      <div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '400px', height: '400px', margin: '50px' }}>
        <Link to={`/viewMyPatients/${username}`} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="250" height="250" fill="white">
            <title>view my patients</title>
            <g id="people_sick" data-name="view my patients">
              <path fill="white" d="M7,11V8A1,1,0,0,1,9,8v3a1,1,0,0,1-2,0Zm23,5.72V29a1,1,0,0,1-1,1H16a1,1,0,0,1-1-1V29A10,10,0,0,1,6,19V16.9A5,5,0,0,1,2,12V8A5,5,0,0,1,6,3.1V3A1,1,0,0,1,8,3v.1A5,5,0,0,1,12,8v4a5,5,0,0,1-4,4.9V19a8,8,0,0,0,7,7.93V16.72A3.8,3.8,0,0,1,18.77,13,4.43,4.43,0,0,1,18,10.5V5a2,2,0,0,1,2-2h5a2,2,0,0,1,2,2v5.5A4.43,4.43,0,0,1,26.23,13,3.8,3.8,0,0,1,30,16.72ZM7,15a3,3,0,0,0,3-3V8A3,3,0,0,0,4,8v4A3,3,0,0,0,7,15Zm15.5-2A2.5,2.5,0,0,0,25,10.5V8H20v2.5A2.5,2.5,0,0,0,22.5,13ZM20,5V6h5V5Zm8,11.72A1.81,1.81,0,0,0,26.11,15H18.89A1.81,1.81,0,0,0,17,16.72V28H28ZM22,16H19a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2Z" />
            </g>
          </svg>
          <p style={{ color: 'white', fontSize: '35px', marginBottom: '20px' }}>Manage my  patients</p>
        </Link>
      </div>
      <div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '400px', height: '400px', margin: '50px' }}>
        <Link to={`/filterAppointments/${username}`} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="250" height="250" fill="white"><g id="calendar"><path d="M28,24a1,1,0,0,0-1,1v1.62A1.38,1.38,0,0,1,25.62,28H6.38A1.38,1.38,0,0,1,5,26.62V8.38A1.38,1.38,0,0,1,6.38,7H7v.42A1.58,1.58,0,0,0,8.58,9h2.84A1.58,1.58,0,0,0,13,7.42V3.58A1.58,1.58,0,0,0,11.42,2H8.58A1.58,1.58,0,0,0,7,3.58V5H6.38A3.39,3.39,0,0,0,3,8.38V26.62A3.39,3.39,0,0,0,6.38,30H25.62A3.39,3.39,0,0,0,29,26.62V25A1,1,0,0,0,28,24ZM9,4h2V7H9Z" /><path d="M25.62,5H25V3.58A1.58,1.58,0,0,0,23.42,2H20.58A1.58,1.58,0,0,0,19,3.58V5H16a1,1,0,0,0,0,2h3v.42A1.58,1.58,0,0,0,20.58,9h2.84A1.58,1.58,0,0,0,25,7.42V7h.62A1.38,1.38,0,0,1,27,8.38V21a1,1,0,0,0,2,0V8.38A3.39,3.39,0,0,0,25.62,5ZM23,7H21V4h2Z" /><path d="M13,15H11.77A1.77,1.77,0,0,0,10,16.77v2.46A1.77,1.77,0,0,0,11.77,21H13v1.23A1.77,1.77,0,0,0,14.77,24h2.46A1.77,1.77,0,0,0,19,22.23V21h1.23A1.77,1.77,0,0,0,22,19.23V16.77A1.77,1.77,0,0,0,20.23,15H19V13.77A1.77,1.77,0,0,0,17.23,12H14.77A1.77,1.77,0,0,0,13,13.77Zm1,2a1,1,0,0,0,1-1V14h2v2a1,1,0,0,0,1,1h2v2H18a1,1,0,0,0-1,1v2H15V20a1,1,0,0,0-1-1H12V17Z" /></g></svg>
          <p style={{ color: 'white', fontSize: '35px', marginBottom: '18px' }}>Manage my appointments</p>
        </Link>
      </div>
      <div className="expandable-div" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', padding: '20px', width: '400px', height: '400px', margin: '50px' }}>
        <Link to={`/viewFollowup/${doctor._id}`} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="250" height="250" fill="white"><g id="clipboard"><path d="M23.29,4H21V3a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1V7a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V6h2.29a.71.71,0,0,1,.71.71V27.29a.71.71,0,0,1-.71.71H8.71A.71.71,0,0,1,8,27.29V6.71A.71.71,0,0,1,8.71,6a1,1,0,0,0,0-2A2.72,2.72,0,0,0,6,6.71V27.29A2.72,2.72,0,0,0,8.71,30H23.29A2.72,2.72,0,0,0,26,27.29V6.71A2.72,2.72,0,0,0,23.29,4ZM19,6H13V4h6Z"/><path d="M11,13h4.57a1,1,0,0,0,0-2H11a1,1,0,0,0,0,2Z"/><path d="M11,18h8a1,1,0,0,0,0-2H11a1,1,0,0,0,0,2Z"/><path d="M11,23h8a1,1,0,0,0,0-2H11a1,1,0,0,0,0,2Z"/></g></svg>
        <p style={{ color: 'white', fontSize: '35px', marginBottom: '18px' }}>View Followup requests</p>
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard;