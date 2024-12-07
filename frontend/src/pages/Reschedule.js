import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Reschedule = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [selectedNewAppointment, setSelectedNewAppointment] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getAppointment/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setAppointment(response.data);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    };

    fetchAppointment();
  }, [id]);

  useEffect(() => {
    if (appointment) {
      const fetchAvailableAppointments = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/getAvailableDoctorAppointments/${appointment.doctorId}`, {
            withCredentials: true,
          });

          if (response.status === 200) {
            setAvailableAppointments(response.data);
          }
        } catch (error) {
          console.error('Error fetching available appointments:', error);
        }
      };

      fetchAvailableAppointments();
    }
  }, [appointment]);

  const handleReschedule = async () => {
    try {

        console.log("o"+ id);
        console.log("n"+selectedNewAppointment);
      const response = await axios.post(`http://localhost:4000/rescheduleAppointment`, {
        OldappointmentId: id,
        NewappointmentId: selectedNewAppointment,
      });

      if (response.status === 200) {
        alert('Appointment rescheduled successfully');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  return (
    <div>
      <h1>Reschedule Appointment</h1>
      {appointment && (
        <div>
          <h2>Old Appointment</h2>
          <p>Date: {appointment.date}</p>
          <p>Status: {appointment.status}</p>
          {/* Add more details as needed */}

          <h2>Available Appointments</h2>
          <ul>
            {availableAppointments.map((availableAppointment) => (
              <li key={availableAppointment._id}>
                Date: {availableAppointment.date}, Status: {availableAppointment.status}
                {/* Add more details as needed */}
                <button onClick={() => setSelectedNewAppointment(availableAppointment._id)}>Reschedule</button>
              </li>
            ))}
          </ul>

          <button onClick={handleReschedule}>Confirm Reschedule</button>
        </div>
      )}
    </div>
  );
};

export default Reschedule;
