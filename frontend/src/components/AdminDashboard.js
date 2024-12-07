import React from 'react';
import { Link,useParams } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS file for styling
import { useAuthContext } from '../hooks/useAuthContext'
import {useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  
  return(
  <div className="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <ul className="admin-menu">
      <li>
        <Link to="/deleteAdmin" className="menu-link">
          <i className="fas fa-users"></i>
          Manage Admins
        </Link>
      </li>
      <li>
        <Link to="/deleteDoctor" className="menu-link">
          <i className="fas fa-user-md"></i>
          Manage Doctors
        </Link>
      </li>
      <li>
        <Link to="/deletePatient" className="menu-link">
          <i className="fas fa-clipboard-list"></i>
          Manage Patients
        </Link>
      </li>
      <li>
        <Link to="/viewRequests" className="menu-link">
          <i className="fas fa-clipboard-list"></i>
          View Requests
        </Link>
      </li>
      <li>
        <Link to="/healthPackages" className="menu-link">
          <i className="fas fa-clipboard-list"></i>
          Manage Health Packages
        </Link>
      </li>
    </ul>
  </div>
);
};

export default AdminDashboard;