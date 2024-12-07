import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

const DoctorRegistrationForm = ({ onRegistrationSuccess }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Send a POST request to register the doctor
      const response = await axios.post('/register/doctor', values);

      // Assuming the response contains the doctor's ID upon successful registration
      const doctorId = response.data.doctorId;

      // Call a callback function to handle registration success
      onRegistrationSuccess(doctorId);
    } catch (error) {
      console.error('Error registering doctor:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        name: '',
        email: '',
        password: '',
        date_of_birth: '',
        hourly_rate: 0,
        speciality: '',
        educational_background: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="username">Username</label>
          <Field type="text" id="username" name="username" />

          <label htmlFor="name">Name</label>
          <Field type="text" id="name" name="name" />

          <label htmlFor="email">Email</label>
          <Field type="email" id="email" name="email" />

          <label htmlFor="password">Password</label>
          <Field type="password" id="password" name="password" />

          <label htmlFor="date_of_birth">Date of Birth</label>
          <Field type="date" id="date_of_birth" name="date_of_birth" />

          <label htmlFor="speciality">Hourly Rate</label>
          <Field type="text" id="speciality" name="speciality" />

          <label htmlFor="educational_background">Hourly Rate</label>
          <Field type="text" id="educational_background" name="educational_background" />

          <label htmlFor="hourly_rate">Hourly Rate</label>
          <Field type="number" id="hourly_rate" name="hourly_rate" />

          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default DoctorRegistrationForm;