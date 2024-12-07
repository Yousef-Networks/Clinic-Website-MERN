import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from "react-router-dom";
import { Card, Form, Button, Container } from 'react-bootstrap';

const Login = () => {
  const { user } = useAuthContext()
  const [usernamee, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isLoading } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(usernamee, password);
  }

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', flexDirection: 'column' }}>
      <Card style={{ height: '420px', width: '500px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', marginBottom: '10px' }}>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ height: '50px', marginRight: 'px', marginBottom: '10px' }}>
              <title>doctor</title>
              <g id="doctor">
                <path fill="#095d7e" d="M21.14,14A6.45,6.45,0,0,0,23,9.5V4.43A2.43,2.43,0,0,0,20.57,2H12.43A2.43,2.43,0,0,0,10,4.43V9.5A6.49,6.49,0,0,0,11.82,14h-.09A8.73,8.73,0,0,0,3,22.73v3.74A3.53,3.53,0,0,0,6.53,30H25.47A3.53,3.53,0,0,0,29,26.47V22.73A8.74,8.74,0,0,0,21.14,14ZM12.43,4h8.14a.43.43,0,0,1,.43.43V8H12V4.43A.43.43,0,0,1,12.43,4Zm-.38,6H21a4.48,4.48,0,0,1-8.9,0ZM11,21a1,1,0,1,1-1,1A1,1,0,0,1,11,21Zm16,5.47A1.54,1.54,0,0,1,25.47,28H6.53A1.54,1.54,0,0,1,5,26.47V22.73a6.75,6.75,0,0,1,5-6.5v2.95a3,3,0,1,0,2,0V16h8v3.18A3,3,0,0,0,18,22v2a1,1,0,0,0,2,0V22a1,1,0,0,1,2,0v2a1,1,0,0,0,2,0V22a3,3,0,0,0-2-2.82V16.23a6.75,6.75,0,0,1,5,6.5ZM14,6a1,1,0,0,1,1-1h3a1,1,0,0,1,0,2H15A1,1,0,0,1,14,6Z" />
              </g>
            </svg>
            <h2 style={{ fontSize: '25px', fontWeight: '600', color: '#095d7e', marginBottom: '10px' }}>On-The-Run</h2>
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#343a40', marginBottom: '15px' }}>Welcome back!</h4>
          <Form onSubmit={handleSubmit}>
          {error && (
                <div className="alert alert-danger" role="alert" style={{ fontSize: '12px' }}>
                  {error}
                </div>
              )}

            <Form.Group controlId="formBasicEmail">
              <Form.Label style={{ fontSize: '13px', color: '#495057', fontWeight: '600' }}>Username:</Form.Label>
              <Form.Control style={{ maxWidth: '400px' }} type="text" placeholder="Enter username" value={usernamee} onChange={(e) => setUsername(e.target.value)} className="placeholderStyle" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label style={{ fontSize: '13px', color: '#495057', fontWeight: '600' }}>Password:</Form.Label>
              <Form.Control style={{ maxWidth: '400px' }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="placeholderStyle" />
            </Form.Group>

            <Button variant="primary" type="submit" style={{ width: '100%' }} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Log In'}
            </Button>
            <br />
            <Link to='/forgetPassword' style={{ fontSize: '13px', color: '#8a90a2', fontWeight: '400' }}> Forgot Password?</Link>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login