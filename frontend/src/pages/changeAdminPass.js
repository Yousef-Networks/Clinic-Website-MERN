import React, { useState} from 'react';
import axios from 'axios';
import {useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Col, Row } from 'react-bootstrap';

const ChangeAdminPass = () => {
  const { username } = useParams();
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    const errors = {};

    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (values.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!/[A-Z]/.test(values.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(values.newPassword)) {
      errors.newPassword = 'Password must contain at least one lowercase letter';
    }

    if (!/\d/.test(values.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/updatePassAdmin`, {
        username,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }, {
        withCredentials: true
      });

      setSuccess(true);
      setErrors(null);
      setSubmitting(false);
    } catch (error) {
      setErrors({ server: error.response.data.message });
      setSuccess(false);
      setSubmitting(false);
    }
  };
  return (
    <>
      {errors && errors.server && (
      <div className="alert alert-danger" role="alert" style={{ fontSize: '15px' }}>
        {errors.server}
      </div>
    )}
      <h4 style={{fontSize: '17px',fontWeight: '600',marginTop: '0px'  }}>Password</h4>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Row className="mb-3">
            <Col lg={6}style={{ marginRight: '24px' }}>
              <label htmlFor="currentPassword" style={{fontSize: '13px', fontWeight: '600',color:'#495057'}}  >Current Password</label>
                <Field
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-control"
                  style={{fontSize: '15px', fontWeight: '400',color:'#495057',width: '300px', height: '40px'}}
                />
              </Col>
            </Row>
            <Row className="mb-3">
            <Col lg={6}style={{ marginRight: '24px' }}>
                <label htmlFor="newPassword" style={{fontSize: '13px', fontWeight: '600',color:'#495057'}}>New Password:</label>
                <Field
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="form-control"
                  style={{fontSize: '15px', fontWeight: '400',color:'#495057',width: '300px', height: '40px'}}
                />
                {errors && errors.newPassword && (
                <div className="alert alert-danger mt-2" role="alert" style={{ fontSize: '10px' }}>
                  {errors.newPassword}
                </div>
              )}
              </Col>
            </Row>
            <Row className="mb-3">
            <Col lg={6}style={{ marginRight: '24px' }}>
                <label htmlFor="confirmPassword" style={{fontSize: '13px', fontWeight: '600',color:'#495057'}}>Confirm New Password:</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  style={{fontSize: '15px', fontWeight: '400',color:'#495057',width: '300px', height: '40px'}}
                />
                {errors && errors.confirmPassword && (
                  <div className="alert alert-danger mt-2" role="alert" style={{ fontSize: '10px' }}>
                  {errors.confirmPassword}
                </div>
                )}
              </Col>
            </Row>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
             Change Password
           </button>
           {success && <p className="mt-3">Password Updated Successfully</p>}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangeAdminPass;