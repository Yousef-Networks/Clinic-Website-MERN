import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate,Link } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import { Card, ListGroup, Button, Row, Col, Form } from 'react-bootstrap';

import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('your-publishable-key');
const SubPackage = () => {
    const { username, packageId } = useParams();
    const navigate = useNavigate();
    const [packagee, setPackage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        selectedPackage: '', // Store the selected package ID
        paymentMethod: 'creditCard',
        username: username,
        LinkedPatientId: null,
    });

    const [discount, setDiscount] = useState(0);

    const [linkedFamilyMembers, setLinkedFamilyMembers] = useState([]); // Add this line

    const [patient, setPatient] = useState('')

    useEffect(() => {
        async function fetchHealthPackage() {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/getPackage/${packageId}`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setPackage(response.data);
                    setFormData({
                        ...formData,
                        selectedPackage: packageId
                    });

                }
            } catch (error) {
                console.error('Error fetching health packages:', error);
            }
            setLoading(false);
        }
        async function fetchWallet() {
            try {
                const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setPatient(response.data);
                    console.log("patient:", patient);

                }
            } catch (error) {
                console.error('Error fetching health packages:', error);
            }
        }
        async function fetchDiscount() {
            try {
                const response = await axios.get(`http://localhost:4000/getPackageDiscount/${username}`, {
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

                const linkedResponse = await axios.get(`http://localhost:4000/getLinkedFamilyMembers/${username}`, {
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

        fetchHealthPackage();
    }, [username]);
    const handleSelectFamilyMember = (e) => {
        setFormData({
            ...formData,
            LinkedPatientId: e.target.value
        });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        console.log(formData)
        if (formData.selectedPackage === '') {
            alert('Please select a package');
        }
        else {
            try {
                console.log(formData)
                const response = await axios.post('http://localhost:4000/payPackage', formData, {
                    withCredentials: true
                });
                const response1 = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
                    withCredentials: true
                });
                if (response1.status === 200) {
                    setPatient(response1.data);
                    console.log("patient:", patient);

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
    const handleSelectPaymentMethod = (e) => {
        setFormData({
            ...formData,
            paymentMethod: e.target.value
        });
    };
    return (
        <>
          <div className="container mt-5">
            <div className="prescriptions-list mb-5">
              <h2 className="mb-3">My Wallet: ${patient.wallet}</h2>
              <p className="mb-3">You have discount from your family members: ${discount}</p>
              {loading ? (
                <BeatLoader color="#14967f" size={15} />
              ) : (
                <Card className="mb-4 shadow-sm">
                 <Card.Header as="h5" style={{ backgroundColor: '#14967f', color: 'white' }}>{packagee.name}</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Cost:</strong> ${packagee.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Services:</strong> {packagee.services}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Discount:</strong> {packagee.discount}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              )}
            </div>
            <div className="prescription-form mb-5">
              <Form>
                <Form.Group controlId="paymentMethod" className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Control as="select" custom onChange={handleSelectPaymentMethod}>
                    <option value="creditCard">Credit Card</option>
                    <option value="wallet">Wallet</option>
                  </Form.Control>
                </Form.Group>
                {formData.paymentMethod === 'creditCard' && (
                  <Elements stripe={stripePromise}>
                    <PaymentForm />
                  </Elements>
                )}
                <Form.Group controlId="subscriber" className="mb-3">
                  <Form.Label>Subscribe for</Form.Label>
                  <Form.Control as="select" custom onChange={handleSelectFamilyMember}>
                    <option value={null}>Me</option>
                    {linkedFamilyMembers.map((member) => (
                      <option key={member.linkedPatientId} value={member.linkedPatientId}>
                        {member.linkedPatientName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubscribe}>
                  Pay
                </Button>
              </Form>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '90px' }}>
          <Button variant="secondary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
          </div>
        </>
      );
}
export default SubPackage;