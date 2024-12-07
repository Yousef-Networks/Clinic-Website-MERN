import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AdminRegistrationForm = () => {
  const navigate = useNavigate();
  const[username,setUsername]=useState('')
  const[password,setPassword]=useState('')
  const[error,setError]=useState(null)
const [isAdminRegistered, setIsAdminRegistered] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    const dr={username,password}
    try{const response = await axios.post('http://localhost:4000/AdminRegistrationForm', ad,{
      withCredentials: true
    });
    
    if (response.status === 201) {
      console.log('Registration successful:', response.data);
      setUsername('')
      setPassword('')
      setError(null)
    
    } else {
      console.error('Registration failed:', response.data);
      // Handle and display errors to the user
    }
  } catch (error) {
    console.error('Registration failed:', error);
    // Handle and display errors to the user
  }
    
  };

  
  return (
    <div>
      <h2>Admin Registration</h2>
      {isAdminRegistered && <p>Registration successful! You can now log in.</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e)=>setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        
        </div>
        <button type="submit">Register as Admin</button>
      </form>
    </div>
  );
};

export default AdminRegistrationForm;

//   this is an admin page
