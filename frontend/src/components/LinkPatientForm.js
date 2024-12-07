import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function LinkForm({ onLinkSuccess }) {
    const { username } = useParams();
    const [formData, setFormData] = useState({
        username: username,
        email: '',
        mobileNumber: '',
        relation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const requestData = {
            username: formData.username,
            relation: formData.relation,
        };

        // Check if the emailOrMobile field is not empty, and if so, add it to the requestData
        if (formData.email.trim() !== '') {
            requestData.email = formData.email;
        }
        if (formData.mobileNumber.trim() !== '') {
            requestData.mobileNumber = formData.mobileNumber;
        }
        console.log(requestData)

        try {
            const response = await axios.post('http://localhost:4000/linkMember', requestData, {
                withCredentials: true
            });
            if (response.status === 200) {
                onLinkSuccess(true);
                console.log("Linking successful")
                
                // You can navigate to another page or update the UI as needed.
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('No such patient found');
              } else {
                setError('An error occurred while linking the patient.');
              }
        }
        finally {
            setLoading(false);
          }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <h2>Link Family Member</h2>
                {loading ? <p>Loading...</p> : (
                    <>
                   {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <input
                        type="tel"
                        id="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="relation">Relation:</label>
                    <select
                        id="relation"
                        value={formData.relation}
                        onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    >
                        <option value="">Select relation</option>
                        <option value="husband">Husband</option>
                        <option value="wife">Wife</option>
                        <option value="child">Child</option>
                    </select>
                </div>
                <div className="form-group">
                    <button type="submit">Submit Prescription</button>
                </div>
                </>
                  )}
            </div>
        </form>
    );
}

export default LinkForm;