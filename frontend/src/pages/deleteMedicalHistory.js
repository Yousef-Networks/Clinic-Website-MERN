import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function MedicalHistoryList() {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const { username } = useParams();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  async function fetchMedicalHistory() {
    try {
      const response = await axios.get(`http://localhost:4000/getMedicalHistory/${username}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        setMedicalHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  }
  useEffect(() => {


    fetchMedicalHistory();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleDelete = async (filename) => {
    try {
      const response = await axios.delete(`http://localhost:4000/deleteMedicalRecord/${username}/${filename}`, {
        withCredentials: true
      });
      const response1 = await axios.get(`http://localhost:4000/getMedicalHistory/${username}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        setMedicalHistory(response1.data);
      }
    } catch (error) {
      console.error('Error deleting medical record:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    console.log('Username:', username);
    console.log(formData);

    axios.post('http://localhost:4000/upload', formData)
      .then(res => {
        setMessage(res.data.message);
        fetchMedicalHistory();
        // Refresh the page
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>

      <h1>Manage Medical History</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
      <ul>
        {medicalHistory.map(record => (
          <li key={record.filename}>
            <Link to={`/${record.path}`}>
              {record.filename}
            </Link>
            <button onClick={() => handleDelete(record.filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicalHistoryList;