// UploadHealthRecordWindow.jsx

import React, { useState } from 'react';
import axios from 'axios';

function UploadHealthRecordWindow({ onClose }) {
  const [file, setFile] = useState(null);
  const [patientUsername, setPatientUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUsernameChange = (event) => {
    setPatientUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    // Send patient username as a query parameter
    axios.post(`http://localhost:4000/upload2?username=${patientUsername}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log('Upload Response:', res.data);
        setMessage(res.data.message);
        // You might want to clear the input fields or update the UI as needed
      })
      .catch(err => {
        console.error('Error uploading health record:', err);
      });
  };

  return (
    <div>
      <h1>Upload Health Record</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="healthRecord">Choose File:</label>
          <input
            type="file"
            id="healthRecord"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label htmlFor="patientUsername">Patient Username:</label>
          <input
            type="text"
            id="patientUsername"
            value={patientUsername}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <button type="submit">Upload</button>
        <button onClick={onClose}>Close</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default UploadHealthRecordWindow;
