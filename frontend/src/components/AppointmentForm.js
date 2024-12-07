import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AppointmentForm({ doctorId, onAppointmentsFetch }) {
    const { username } = useParams();
    const [newAppointmentDate, setNewAppointmentDate] = useState('');
    const [newAppointmentHour, setNewAppointmentHour] = useState('');
    const [appointments, setAppointments] = useState([]);
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/getDoctorAppointments/${doctorId}`, { withCredentials: true });
            onAppointmentsFetch(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };


    // Rest of your component

    const handleNewAppointmentSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/createAppointment', {
                patientId: null,
                doctorId: doctorId,
                date: newAppointmentDate,
                description: 'empty',
                staus: "Available",
                hour: newAppointmentHour,
            }, {
                withCredentials: true
            });

            if (response.status === 201) {
                fetchAppointments();

            }
        } catch (error) {
            console.error('Error creating new appointment:', error);
        }
    };



    return (
        <form onSubmit={handleNewAppointmentSubmit}>
            <div className="form-container">
                <h2>Create New Appointment</h2>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={newAppointmentDate}
                        onChange={(e) => setNewAppointmentDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="hour">Hour:</label>
                    <input
                        id="hour"
                        name="hour"
                        type="text"
                        value={newAppointmentHour}
                        onChange={(e) => setNewAppointmentHour(e.target.value)}
                        style={{ width: '100px' }} // Set the width of the textbox
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Submit Appointment</button>
                </div>
            </div>
        </form>
    );
}

export default AppointmentForm;