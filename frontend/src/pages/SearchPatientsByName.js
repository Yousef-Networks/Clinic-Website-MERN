import React, { useState } from 'react';
import axios from 'axios';

const SearchPatientByName = () => {
  const [name, setName] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      // Send a GET request to your server to search for patients by name
      const response = await axios.get(`http://localhost:4000/searchPatientsByName?name=${name}`);

      if (response.status === 200) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error('Error searching for patients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Patients by Name</h1>
      <input
        type="text"
        placeholder="Enter patient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
  
      {loading && <p>Loading...</p>}
  
      {patients.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {patients.map((patient) => (
              <li key={patient._id}>
                <strong>Name:</strong> {patient.name}<br />
                <strong>Mobile Number:</strong> {patient.mobileNumber}<br />
                <strong>Username:</strong> {patient.username}<br />
                <strong>Email:</strong> {patient.email}<br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPatientByName;