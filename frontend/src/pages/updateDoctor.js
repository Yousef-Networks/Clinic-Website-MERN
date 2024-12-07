import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Button, Col, Row } from 'react-bootstrap';
import BeatLoader from "react-spinners/BeatLoader";


const UpdateDoctorInfo = () => {
  const { username } = useParams(); // Get the username from the URL parameter

  const [doctor, setDoctor] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Fetch the doctor's information based on the username from the URL
    axios.get(`http://localhost:4000/getDoctor/${username}`, {
      withCredentials: true
    })
      .then((response) => {
        setDoctor(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctor information:', error);
      });
  }, [username]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Send a put request to update the doctor with username
      const response = await axios.put(`http://localhost:4000/updateDoctor?username=${username}`, values, {
        withCredentials: true
      });

      if (response.status === 200) {
        console.log('Doctor information updated successfully:', response.data);
        setSuccessMessage('Doctor information updated successfully');
      }

      setSubmitting(false);
    } catch (error) {
      console.error('Error updating doctor information:', error);
      setSubmitting(false);
    }
  };



  return (
    <>
     {isLoading ? (
     <div className="spinner-container">
     <BeatLoader color="#14967f" size={15} />
   </div>
    ) : (
      <Formik>
        {/* ... */}
      </Formik>
    )}
      <h4 style={{fontSize: '17px',fontWeight: '600',marginTop: '0px'  }}>Account Information</h4>
      {doctor && (
        <Formik
          initialValues={{
            email: doctor.email || '', // Initialize with the existing data
            hourly_rate: doctor.hourly_rate || 0, // Initialize with the existing data
            Affiliation: doctor.Affiliation || '', // Initialize with the existing data
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
           <Form>
           <Row className="mb-3">
             <Col lg={6}style={{ marginRight: '24px' }}>
               <label htmlFor="email" style={{fontSize: '13px', fontWeight: '600',color:'#495057'}}  >Email</label>
               <Field type="email" id="email" name="email" className="form-control" placeholder="Enter email" style={{fontSize: '15px', fontWeight: '400',color:'#495057',width: '300px', height: '40px'}} />
             </Col>
             <Col lg={6}>
               <label htmlFor="hourly_rate" style={{fontSize: '13px', fontWeight: '600',color:'#495057'}}>Hourly Rate</label>
               <Field type="number" id="hourly_rate" name="hourly_rate" className="form-control" placeholder="Enter hourly rate" style={{fontSize: '15px', fontWeight: '400',color:'#495057',width: '300px', height: '40px'}} />
             </Col>
           </Row>
           <Row className="mb-3">
             <Col lg={6}>
               <label htmlFor="Affiliation" style={{fontSize: '13px', fontWeight: '600',color:'#495057'}}>Affiliation</label>
               <Field type="text" id="Affiliation" name="Affiliation" className="form-control" placeholder="Enter affiliation" style={{fontSize: '15px', fontWeight: '400',color:'#495057',width: '300px', height: '40px'}}/>
             </Col>
           </Row>
           <button type="submit" disabled={isSubmitting} className="btn btn-primary">
             Update Info
           </button>
           {successMessage && <p className="mt-3">{successMessage}</p>}
         </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default UpdateDoctorInfo;


// this is a doctor page
