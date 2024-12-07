import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Spinner, Container, Row, Col } from 'react-bootstrap';
//import Select from 'react-select';
const DoctorRegistrationForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [date_of_birth, setDateOfBirth] = useState('')
  const [hourly_rate, setHourlyRate] = useState('')
  const [Affiliation, setAffiliation] = useState('')
  const [educational_background, setEducational_background] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [reqDocs, setReqDocs] = useState([]); // New state variable for the file
  const [medicalLicense, setWorkingLicense] = useState(null);
  const [medicalDegree, setPharmacistDegree] = useState(null);
  const [doctorId, setPharmacistId] = useState(null);
  const [error, setError] = useState(null)
  const [isDoctorRegistered, setIsDoctorRegistered] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);


  const handleWorkingLicenseChange = (e) => {
    setWorkingLicense(e.target.files[0]);
  };

  const handlePharmacistDegreeChange = (e) => {
    setPharmacistDegree(e.target.files[0]);
  };

  const handlePharmacistIdChange = (e) => {
    setPharmacistId(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dr = { username, name, email, password, date_of_birth, hourly_rate, speciality, Affiliation, educational_background, reqDocs, medicalLicense, medicalDegree, doctorId }

    try {
      const response = await axios.post('http://localhost:4000/createRequest', dr, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        setUsername('')
        setName('')
        setEmail('')
        setPassword('')
        setDateOfBirth('')
        setHourlyRate('')
        setAffiliation('')
        setEducational_background('')
        setReqDocs([])
        setPharmacistDegree(null)
        setPharmacistId(null)
        setWorkingLicense(null)

        setIsDoctorRegistered(true); // Set registration success
        setIsRequestPending(true); // Set request as pending

        setError(null)
        // You can handle redirection or other actions here
        // navigate(`/dashboard/doctor/${username}`);
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
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '87vh', flexDirection: 'column' }}>
      <Card style={{height:'85vh'}}>
        <Card.Body>
        <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#343a40', marginBottom: '5px' }}>Register as Doctor</h4>
          {error && <p>{error}</p>}
          {isRequestPending ? (
            <p>Registration request is pending. Please wait for approval.</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="dateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" value={date_of_birth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>

                  <Form.Group controlId="hourlyRate">
                    <Form.Label>Hourly Rate</Form.Label>
                    <Form.Control type="number" value={hourly_rate} onChange={(e) => setHourlyRate(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="Affiliation">
                    <Form.Label>Affiliation</Form.Label>
                    <Form.Control type="text" value={Affiliation} onChange={(e) => setAffiliation(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="speciality">
                    <Form.Label>Speciality</Form.Label>
                    <Form.Control as="select" value={speciality} onChange={(e) => setSpeciality(e.target.value)} required>
                      <option value="">Select a speciality</option>
                      <option value="Allergy and Immunology">Allergy and Immunology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Gynecology">Gynecology</option>
                      <option value="Physical Medicine">Physical Medicine</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Otolaryngology">Otolaryngology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Cardiology">Cardiology</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="educational_background">
                    <Form.Label>Educational Background</Form.Label>
                    <Form.Control type="text" value={educational_background} onChange={(e) => setEducational_background(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="workingLicense">
                    <Form.Label>Medical License</Form.Label>
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" id="workingLicense" accept=".pdf" onChange={handleWorkingLicenseChange} />
                      <label className="custom-file-label" htmlFor="workingLicense">
                        Choose file...
                      </label>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>

                  {/* Pharmacist Degree PDF */}
                  <Form.Group controlId="pharmacistDegree">
                    <Form.Label>Medical Degree</Form.Label>
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" id="pharmacistDegree" accept=".pdf" onChange={handlePharmacistDegreeChange} />
                      <label className="custom-file-label" htmlFor="pharmacistDegree">
                        Choose file...
                      </label>
                    </div>
                  </Form.Group>
                </Col>
                <Col>


                  {/* Pharmacist ID PDF */}
                  <Form.Group controlId="pharmacistId">
                    <Form.Label>Doctor ID</Form.Label>
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" id="pharmacistId" accept=".pdf" onChange={handlePharmacistIdChange} />
                      <label className="custom-file-label" htmlFor="pharmacistId">
                        Choose file...
                      </label>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit" disabled={isRequestPending} style={{ marginTop: '10px' }}>
                {isRequestPending ? <Spinner animation="border" size="sm" /> : 'Register'}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
      <p style={{ color: '#8a90a2', fontSize: '15px', fontWeight: '400' }}>Back to <Link to="/login" style={{ color: '#0055ff', fontSize: '15px', fontWeight: '600' }}>Log In</Link></p>
    </Container>

  );
};

export default DoctorRegistrationForm;

//  this is a doctor page
