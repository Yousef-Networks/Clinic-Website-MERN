import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import HealthPackagesForm from '../components/HealthPackagesForm';

const ManageHealthPackages = () => {
 
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [packages, setPackages] = useState([]);

  const [packagee, setPackagee] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // Fetch the list of health packages from the server
    axios.get('http://localhost:4000/getPackages',{
      withCredentials: true
    })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching health packages:', error);
      });
  }, []);
  const handlePackagesFetched = (packages) => {
   setPackages(packages);
  };



  return (
    <div className="container">
    <div className="prescriptions-list">
      <h2>
        Health Packages
        <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
            style={{ color: '#14967f' }}
          />
      </h2>
      <ul>
        {packages.map((p) => (
          <li key={p._id}>
            <div className="prescription-card">
              <div className="prescription-header">
                <span><strong>Name: </strong>  {p.name}</span>
                <FontAwesomeIcon
                  className="view-icon"
                  icon={faEye}
                  onClick={() => {
                    setActiveId(p._id)
                    setPackagee(p.find((pp) => pp._id === activeId));
                  }}
                />
              </div>
              <div><strong>Package ID: </strong> {p._id}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="prescription-form">
      {isFormVisible && <HealthPackagesForm onPackagesFetched={handlePackagesFetched} />}
    </div>
    
  </div>

  )
}
export default ManageHealthPackages
