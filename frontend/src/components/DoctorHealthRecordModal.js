import React, { useState } from 'react';
import axios from 'axios';

const DoctorHealthRecordModal = ({ onSubmit, onClose }) => {
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

    axios.post(`http://localhost:4000/upload2?username=${patientUsername}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log('Upload Response:', res.data);
        setMessage(res.data.message);
        onSubmit(); // Notify the parent component about the successful submission
        onClose();
      })
      .catch(err => {
        console.error('Error uploading health record:', err);
      });
  };

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <h2 style={modalTitleStyle}>Upload Health Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Choose File:</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              style={inputStyle}
            />
          </div>
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Patient Username:</label>
            <input
              type="text"
              value={patientUsername}
              onChange={handleUsernameChange}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={submitBtnStyle}>
            Upload
          </button>
        </form>
        <p>{message}</p>
        <button onClick={onClose} style={closeBtnStyle}>
          Close
        </button>
      </div>
    </div>
  );
};

// Styles (adjust these styles as needed)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '100%',
  };
  
  const modalTitleStyle = {
    fontSize: '1.5em',
    marginBottom: '15px',
  };
  
  const formGroupStyle = {
    marginBottom: '15px',
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
  };
  
  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };
  
  const textareaStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };
  
  const submitBtnStyle = {
    width: '100%', // Center the button
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: '#fff',
  };
  
  const closeBtnStyle = {
    width: '100%', // Center the button
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#6c757d',
    color: '#fff',
    marginTop: '15px',
  };

export default DoctorHealthRecordModal;
