import React, { useState } from 'react';
import axios from 'axios';
import { Link,useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Container } from 'react-bootstrap';

const ResetPassword = () => {
  const { username } = useParams();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:4000/resetPassword/${username}`, {
        otp,
        newPassword: password,
      });
      console.log(response);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', flexDirection: 'column' }}>
      <Card style={{ height: '413px', width: '616px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', marginBottom: '10px' }}>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ height: '50px', marginRight: 'px', marginBottom: '10px' }}>
              <title>doctor</title>
              <g id="doctor">
                <path fill="#095d7e" d="M21.14,14A6.45,6.45,0,0,0,23,9.5V4.43A2.43,2.43,0,0,0,20.57,2H12.43A2.43,2.43,0,0,0,10,4.43V9.5A6.49,6.49,0,0,0,11.82,14h-.09A8.73,8.73,0,0,0,3,22.73v3.74A3.53,3.53,0,0,0,6.53,30H25.47A3.53,3.53,0,0,0,29,26.47V22.73A8.74,8.74,0,0,0,21.14,14ZM12.43,4h8.14a.43.43,0,0,1,.43.43V8H12V4.43A.43.43,0,0,1,12.43,4Zm-.38,6H21a4.48,4.48,0,0,1-8.9,0ZM11,21a1,1,0,1,1-1,1A1,1,0,0,1,11,21Zm16,5.47A1.54,1.54,0,0,1,25.47,28H6.53A1.54,1.54,0,0,1,5,26.47V22.73a6.75,6.75,0,0,1,5-6.5v2.95a3,3,0,1,0,2,0V16h8v3.18A3,3,0,0,0,18,22v2a1,1,0,0,0,2,0V22a1,1,0,0,1,2,0v2a1,1,0,0,0,2,0V22a3,3,0,0,0-2-2.82V16.23a6.75,6.75,0,0,1,5,6.5ZM14,6a1,1,0,0,1,1-1h3a1,1,0,0,1,0,2H15A1,1,0,0,1,14,6Z" />
              </g>
            </svg>
            <h2 style={{ fontSize: '25px', fontWeight: '600', color: '#095d7e', marginBottom: '10px' }}>On The Run</h2>
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#343a40', marginBottom: '5px' }}>Reset Password</h4>
          <p style={{ textAlign: 'left', fontSize: '15px', fontWeight: '400', color: '#8a90a2' }}>
            Enter your username & email address and we'll send you an email with instructions to reset your password.
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formOTP">
              <Form.Control
                type="number"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Control
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Reset Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <p style={{ color: '#8a90a2', fontSize: '15px', fontWeight: '400' }}>Back to <Link to="/login" style={{ color: '#0055ff', fontSize: '15px', fontWeight: '600' }}>Log In</Link></p>
    </Container>











  );
};

export default ResetPassword;