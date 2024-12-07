import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const AdminRegistrationForm = ({ onRegistrationSuccess }) => {
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Send a POST request to register the admin
      const response = await axios.post('http://localhost:4000/createAdmin', values,{
        withCredentials: true
      });

      // Assuming the response contains the admin's username upon successful registration
      const adminusername = response.data.username;

      // Set the success message and call a callback function to handle registration success
      setIsRegistrationSuccess(true);
      onRegistrationSuccess(adminusername);
    } catch (error) {
      console.error('Error registering Admin:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {isRegistrationSuccess ? (
        <div>
          <p>Admin was successfully added!</p>
          <Link to="/dashboard/admin">Go to Patient Dashboard</Link>
        </div>
      ) : (
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />

              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <button type="submit" disabled={isSubmitting}>
                Register
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AdminRegistrationForm;
