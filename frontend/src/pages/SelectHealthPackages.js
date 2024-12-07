import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
import { Card, ListGroup, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';

import { useParams,useNavigate } from 'react-router-dom';
const stripePromise = loadStripe('your-publishable-key');

function HealthPackageSubscriptionPage() {
  const { username } = useParams();
  const [discount,setDiscount]=useState(0);

  const [linkedFamilyMembers, setLinkedFamilyMembers] = useState([]); // Add this line
  
  const [patient,setPatient]=useState('')
  const [healthPackages, setHealthPackages] = useState([]);
  const [formData, setFormData] = useState({
    selectedPackage: '', // Store the selected package ID
    paymentMethod: 'creditCard',
    username:username,
    LinkedPatientId: null,
  });
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null); // Store the selected package details

  useEffect(() => {
    // Fetch available health packages from the backend when the component mounts
    async function fetchHealthPackages() {
      try {
        const response = await axios.get('http://localhost:4000/getPackages',{
          withCredentials: true
        });
        if (response.status === 200) {
          setHealthPackages(response.data);
        }
      } catch (error) {
        console.error('Error fetching health packages:', error);
      }
    }
    async function fetchWallet() {
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setPatient(response.data);
          console.log("patient:",patient);
          
        }
      } catch (error) {
        console.error('Error fetching health packages:', error);
      }
    }
    async function fetchDiscount(){
      try {
        const response = await axios.get(`http://localhost:4000/getPackageDiscount/${username}`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setDiscount(response.data);
          setFormData(prevFormData => ({
            ...prevFormData,
            discount: response.data,
          }));
          
          
        }
      }
      catch (error) {
        console.error('Error fetching discount:', error);
      }
    }
    const fetchFamilyMembers = async () => {
      try {
       
        const linkedResponse = await axios.get(`http://localhost:4000/getLinkedFamilyMembers/${username}`,{
          withCredentials: true
        });
        if (linkedResponse.status === 200) {
          setLinkedFamilyMembers(linkedResponse.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } 
    };

    fetchFamilyMembers();
    fetchDiscount();
    fetchWallet();
    fetchHealthPackages();
  }, []);

  const handleSelectPackage = (selectedPackageId) => {
    const selectedPackage = healthPackages.find((pkg) => pkg._id === selectedPackageId);
    if (selectedPackage) {
      setFormData({ ...formData, selectedPackage: selectedPackage._id });
      setSelectedPackageInfo(selectedPackage);
    }
  };
  const handleSelectFamilyMember = (e) => {
    setFormData({
      ...formData,
      LinkedPatientId: e.target.value
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(formData.selectedPackage===''){
      alert('Please select a package');}
      else{
        try {
          console.log(formData)
          const response = await axios.post('http://localhost:4000/payPackage', formData,{
            withCredentials: true
          });
          const response1 = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`,{
            withCredentials: true
          });
        if (response1.status === 200) {
          setPatient(response1.data);
          console.log("patient:",patient);
          
        }
          if (response.status === 200) {
            alert('Payment successful.');
            // You can navigate to the dashboard or another page
          }

        } catch (error) {
          console.error('Error processing wallet payment:', error);
          alert('An error occurred while processing the payment.');
        } 
      }
  
      
    
  };
  

  return (
    <div className="container">
      <h1 className="my-4">Health Package Subscription</h1>
      <p><strong>Wallet:</strong> {patient.wallet}</p>
      <p><strong>Discount from My family Members:</strong> {discount}</p>
  
      <h2 className="my-3">Select a Health Package:</h2>
      <div className="d-flex flex-wrap justify-content-between">
        {healthPackages.map((packagee) => (
          <Card style={{ width: '18rem', marginBottom: '1rem' }} key={packagee._id}>
            <Card.Header as="h5">{packagee.name}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>Cost: ${packagee.price}</ListGroup.Item>
            </ListGroup>
            <Card.Body>
              <Button variant="primary" onClick={() => handleSelectPackage(packagee._id)}>Select</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
  
      {selectedPackageInfo && (
        <Card className="my-4">
          <Card.Header as="h5">Selected Package Details:</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Name:</strong> {selectedPackageInfo.name}</ListGroup.Item>
            <ListGroup.Item><strong>Cost:</strong> ${selectedPackageInfo.price}</ListGroup.Item>
            <ListGroup.Item><strong>Services:</strong> {selectedPackageInfo.services}</ListGroup.Item>
            <ListGroup.Item><strong>Discount:</strong> {selectedPackageInfo.discount}</ListGroup.Item>
          </ListGroup>
        </Card>
      )}
  
      <Form onSubmit={handleSubscribe}>
        <Form.Group>
          <Form.Label>Subscribe for:</Form.Label>
          <Form.Control as="select" onChange={handleSelectFamilyMember}>
            <option value={null}>Me</option>
            {linkedFamilyMembers.map((member) => (
              <option key={member.linkedPatientId} value={member.linkedPatientId}>
                {member.linkedPatientName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
  
        <Form.Group>
          <Form.Label>Payment Method:</Form.Label>
          <Form.Check
            type="radio"
            label="Credit Card"
            name="paymentMethod"
            value="creditCard"
            checked={formData.paymentMethod === 'creditCard'}
            onChange={handleChange}
          />
          <Form.Check
            type="radio"
            label="Wallet"
            name="paymentMethod"
            value="wallet"
            checked={formData.paymentMethod === 'wallet'}
            onChange={handleChange}
          />
        </Form.Group>
  
        {formData.paymentMethod === 'creditCard' && (
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        )}
  
        <Button variant="primary" type="submit">Subscribe</Button>
      </Form>
    </div>
  );
}

export default HealthPackageSubscriptionPage;
