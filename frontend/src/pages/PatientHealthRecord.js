// PatientHealthRecord.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientHealthRecord = ({ username }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getHealthRecords/${username}`);
        if (response.status === 200) {
          setHealthRecords(response.data);
        }
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, [username]);

  if (loading) {
    return <div>Loading health records...</div>;
  }

  if (healthRecords.length === 0) {
    return <div>No health records found.</div>;
  }

  return (
    <div>
      <h2>Health Records</h2>
      <ul>
        {healthRecords.map((record) => (
          <li key={record._id}>
            <div>
              <strong>Filename:</strong> {record.filename}
            </div>
            {/* Add more details about the health record as needed */}
            <div>
            <a href={`http://localhost:4000/uploads/${record.filename}`} target="_blank" rel="noopener noreferrer">
  View Health Record
</a>





            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientHealthRecord;
