import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , useNavigate} from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/Stripe';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('your-publishable-key');

const ViewAppointments = () => {
  const { doctorUsername, patientUsername } = useParams();
  const [patient,setPatient]=useState('')
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId , setPatientId] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember , setSelectedFamilyMember] = useState([null]); 
  const [selectedLinkedPatient, setSelectedLinkedPatient] = useState(null);
 const [formData, setFormData] = useState({
    selectedAppointment: '', // Store the selected package ID
    paymentMethod: 'creditCard',
    username:patientUsername,
  });

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getDoctors',{
          withCredentials: true
        });
        if (response.status === 200) {
          const doctor = response.data.find((doc) => doc.username === doctorUsername);
          if (doctor) {
            setDoctorId(doctor._id);
          } else {
            console.error('Doctor not found:', doctorUsername);
          }
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    const fetchPatientId = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/getPatientByUsername/${patientUsername}`,{
              withCredentials: true
            });
            if (response.status === 200) {
                setPatientId(response.data._id);
                setPatient(response.data);
                console.log(patientId);
            }
        }
        catch(error) {
            console.error('Error fetching Patient',error);
        }
        }

    const fetchAppointments = async () => {
      try {
        if (doctorId) {
          const response = await axios.get(`http://localhost:4000/getAvailableDoctorAppointments/${doctorId}`,{
            withCredentials: true
          });
          if (response.status === 200) {
            setAppointments(response.data);
            console.log(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFamilyMembers = async () => {
        try {
         
          const response = await axios.get(`http://localhost:4000/getFamilyMem/${patientUsername}`,{
            withCredentials: true
          });
          console.log(response.data);
  
          if (response.status === 200) {
            setFamilyMembers(response.data);
          }
        } catch (error) {
          console.error('Error fetching family members:', error);
        } };

    fetchDoctorId();
    fetchPatientId();
    fetchAppointments();
    fetchFamilyMembers();
  }, [doctorUsername, doctorId]);

  const reserveAppointment = async (appointmentId) => {
    try {
        console.log("APP ID " + appointmentId);
      const response = await axios.post(`http://localhost:4000/reserveAppointment/${appointmentId}`, {
        patientId,
        status: 'Scheduled',
        description: 'Checkup',
        paymentMethod : formData.paymentMethod
      },{
        withCredentials: true
      });
      if (response.status === 200) {
        // Handle success, maybe show a success message or update the UI
        alert('Appointment reserved successfully');
        console.log('Appointment reserved successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error reserving appointment:', error);
    }
  };

  const reserveFamilyMemberAppointment = async (appointmentId) => {
    try {
        console.log("APP ID" + appointmentId);
        console.log("Request Data:", {
            patientId,
            status: 'Scheduled',
            description: 'Checkup',
            familyMemberId :selectedFamilyMember,
            paymentMethod: formData.paymentMethod,
          });
        const response = await axios.post(`http://localhost:4000/reserveFamilyMemberAppointment/${appointmentId}`, {
            patientId,
            status: 'Scheduled',
            description: 'Checkup',
            familyMemberId : selectedFamilyMember,
            paymentMethod : formData.paymentMethod
          },{
            withCredentials: true
          });
          if (response.status===200) {
            alert("Appointment reserved successfully");
            console.log("Appointment reserved successfully");
            window.location.reload();
          }
    }
    catch(error) {
        console.error('Error reserving appointment:', error);
    }
  };

  const reserveLinkedPatientAppointment = async (appointmentId) => {
    try {
      console.log("APP ID " + appointmentId);
      console.log("Request Data:", {
        patientId,
        status: 'Scheduled',
        description: 'Checkup',
        linkedPatientId: selectedLinkedPatient,
        paymentMethod: formData.paymentMethod,
      });

      const response = await axios.post(`http://localhost:4000/reserveLinkedPatientAppointment/${appointmentId}`, {
        patientId,
        status: 'Scheduled',
        description: 'Checkup',
        linkedPatientId: selectedLinkedPatient,
        paymentMethod: formData.paymentMethod,
      },{
        withCredentials: true
      });

      if (response.status === 200) {
        alert("Appointment reserved successfully");
        console.log("Appointment reserved successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error('Error reserving appointment:', error);
    }
  };
  

  return (
    <div>
      <h2>Available Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>Date: {appointment.date}</p>
              <p>Hour: {appointment.hour}</p>
              <p>Status: {appointment.status}</p>
              <button onClick={() => reserveAppointment(appointment._id)}>Reserve</button>
              <div>
                <label>Select Family Member:</label>
                <select onChange={(e) => setSelectedFamilyMember(e.target.value)}>
                  <option value={null}>Select Family Member</option>
                  {familyMembers.map((familyMember) => (
                    <option key={familyMember._id} value={familyMember._id}>
                      {familyMember.name}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={() => reserveFamilyMemberAppointment(appointment._id)}>
                Reserve for Family Member
              </button>
              <div>
                <label>Select Linked Patient:</label>
                <select onChange={(e) => setSelectedLinkedPatient(e.target.value)}>
                  <option value={null}>Select Linked Patient</option>
                  {patient.linkedPatients.map((linkedPatient) => (
                    <option key={linkedPatient.linkedPatientId} value={linkedPatient.linkedPatientId}>
                      {linkedPatient.linkedPatientName} - {linkedPatient.linkedPatientRelation}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={() => reserveLinkedPatientAppointment(appointment._id)}>
                Reserve for Linked Patient
              </button>
              <div>
                <label>Payment Method:</label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={formData.paymentMethod === 'creditCard'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  Credit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={formData.paymentMethod === 'wallet'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  Wallet
                </label>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No available appointments.</p>
      )}
      <h2>Payment Information</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <Elements stripe={stripePromise}>
            <div className="stripe-container">
              <PaymentForm />
            </div>
          </Elements>
        </div>
        <div style={{ flex: 1 }}>
          {/* Add the Wallet form or content here */}
        </div>
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
  
  
  
  };

export default ViewAppointments;
