import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Card } from 'react-bootstrap';

function HealthPackageList() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [hPackage, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Patient, setPatient] = useState(null);
  const [linkedPatients, setLinkedPatients] = useState([]);
  const [status, setStatus] = useState('');
  const fetchLinkedPatients = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/getLinkedFamilyMembers/${username}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        const linkedPatients = response.data;
        const linkedPatientsWithPackages = [];

        for (let patient of linkedPatients) {
          const patientResponse = await axios.get(`http://localhost:4000/getPatient/${patient.linkedPatientId}`, {
            withCredentials: true
          });
          const patientUsername = patientResponse.data.username;
          const packageResponse = await axios.get(`http://localhost:4000/mypackage/${patientUsername}`, {
            withCredentials: true
          });
          console.log("package", packageResponse.data.healthPackage);

          linkedPatientsWithPackages.push({
            ...patient,
            username: patientUsername,
            healthpackage: packageResponse.data.healthPackage
          });
        }
        setLinkedPatients(linkedPatientsWithPackages);
      }
    } catch (error) {
      console.error('Error fetching linked patients:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/mypackage/${username}`, {
          withCredentials: true
        });
        const pat = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setPackage(response.data.healthPackage); // Assuming the response contains the health package or null if not found
          console.log(response.data);
        }
        if (pat.status === 200) {
          setPatient(pat.data);
          calculateStatus(pat.data);
        }
      } catch (error) {
        console.error('Error fetching Health Packages:', error);
      } finally {
        setLoading(false);
      }
    };

    const calculateStatus = (patientData) => {
      const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
      const currentDate = new Date().getTime();
      const packageBoughtDate = new Date(patientData.packageBoughtDate).getTime();
      const packageCancelledDate = patientData.packageCancelledDate
        ? new Date(patientData.packageCancelledDate).getTime()
        : null;

      if (packageCancelledDate) {
        setStatus(`Cancelled (Package Cancellation Date: ${patientData.packageCancelledDate})`);
      } else if (packageBoughtDate + sixMonths >= currentDate) {
        const renewalDate = new Date(packageBoughtDate + sixMonths);
        setStatus(`Subscribed (Renewal Date: ${renewalDate.toDateString()})`);
      } else {
        setStatus('Unsubscribed');
      }
    };

    fetchPackage();

    fetchPackage();

    fetchLinkedPatients();
  }, [username]);

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/CancelPackage/${username}`, {}, {
        withCredentials: true
      });
      // You may want to refresh the status after cancelling
      if (response.status === (400)) {
        alert("No Subscription Found");
      }
      else {
        setStatus(`Cancelled (Package Cancelled Date: ` + new Date() + ')');
        alert('Health Package Subscription Cancelled');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };
  const handleCancelSubscription2 = async (id) => {
    try {
      const patientResponse = await axios.get(`http://localhost:4000/getPatient/${id}`, {
        withCredentials: true
      });
      const patientUsername = patientResponse.data.username;
      const response = await axios.post(`http://localhost:4000/CancelPackage/${patientUsername}`, {}, {
        withCredentials: true
      });
      // You may want to refresh the status after cancelling
      if (response.status === (400)) {
        alert("No Subscription Found");
        fetchLinkedPatients();
      }
      else {
        fetchLinkedPatients();
        alert('Health Package Subscription Cancelled');

      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };


  return (
    <Container>
      <Row >
        <Col md="auto">
        <h2 className="my-4 text-center">My health Package</h2>

          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : hPackage ? (
            <>
              
              <Card style={{ width: '18rem', marginBottom: '1rem' }}>
                <Card.Header as="h5">{hPackage.name}</Card.Header>
                <Card.Body>
                  <Card.Text>Price: {hPackage.price}</Card.Text>
                  <Card.Text>Discount: {hPackage.discount}</Card.Text>
                  <Card.Text>Services: {hPackage.services}</Card.Text>
                  <Card.Text>Status: {status}</Card.Text>
                  <Button variant="danger" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                </Card.Body>
              </Card>
              <h2 className="my-4 text-center">My Linked Patients Health Packages</h2>
              {linkedPatients.length > 0 ? (
                linkedPatients.map(patient => (
                  <Row key={patient.id}>
                    <Col md="6">
                      <Card style={{ width: '18rem', marginBottom: '1rem' }}>
                        <Card.Header as="h5">{patient.linkedPatientId}</Card.Header>
                        <Card.Body>
                          <Card.Text>Name: {patient.linkedPatientName}</Card.Text>
                          <Card.Text>Relation: {patient.linkedPatientRelation}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="6">
                      {patient.healthpackage ? (
                        <Card style={{ width: '18rem', marginBottom: '1rem' }}>
                          <Card.Header as="h5">{patient.healthpackage.name}</Card.Header>
                          <Card.Body>
                            <Card.Text>Price: {patient.healthpackage.price}</Card.Text>
                            <Card.Text>Discount: {patient.healthpackage.discount}</Card.Text>
                            <Card.Text>Services: {patient.healthpackage.services}</Card.Text>

                            <Button variant="danger" onClick={() => handleCancelSubscription2(patient.linkedPatientId)}>Cancel Subscription</Button>

                          </Card.Body>
                        </Card>
                      ) : (
                        <p>No Health Package Found for this Patient.</p>
                      )}
                    </Col>
                  </Row>
                ))
              ) : (
                <p>No Linked Patients Found.</p>
              )}
            </>
          ) : (
            <p>No Health Packages Found.</p>
          )}
          <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default HealthPackageList;