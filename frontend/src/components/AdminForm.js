import axios from 'axios';
import React, { useState, useEffect } from 'react';

function AdminForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);



    const handleSubmit = async (event) => {
        // Prevent the form from being submitted normally
        event.preventDefault();
      
        try {
          // Create an object that contains the form values
          const values = { username, password };
      
          // Send a POST request to register the admin
          const response = await axios.post('http://localhost:4000/createAdmin', values, {
            withCredentials: true
          });
          setMessage('Admin added successfully');
          setIsError(false);
          console.log("henaaaaaaaa",response.data.username);
          props.onAdminAdded(response.data);
        } catch (error) {
            setMessage('Error adding admin');
            setIsError(true);
            console.error('Error registering Admin:', error);
        }
      };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <h2>Add new Admin</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <button type="submit">Submit Admin</button>
                </div>
            </div>
            {message && <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>}
        </form>
    );
}

export default AdminForm;