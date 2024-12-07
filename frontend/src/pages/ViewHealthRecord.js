import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewHealthRecord = () => {
  const { username } = useParams();
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getHealthRecords/${username}`, {
          withCredentials: true,
        });

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

  return (
    <div>
      <h1>Health Records for {username}</h1>
      <ul>
      {healthRecords.map((record) => (
  <li key={record.filename}>
    <a href={`http://localhost:4000/uploads/${encodeURIComponent(record.filename)}`} target="_blank" rel="noopener noreferrer">
      {record.filename}
    </a>
  </li>
))}

      </ul>
    </div>
  );
};

export default ViewHealthRecord;
