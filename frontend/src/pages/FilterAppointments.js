import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams ,Link,useNavigate} from 'react-router-dom';



const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUpcoming, setSelectedUpcoming] = useState(false); // New state for upcoming filter
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [selectedPast, setSelectedPast] = useState(false);


const [newAppointmentHour, setNewAppointmentHour] = useState('');


  const { username } = useParams();
  const [doctor, setDoctor] = useState(null);

  const fetchAppointmentsWithPatients = async () => {
    try {
      // First, fetch the doctor based on the username
      const response1 = await axios.get(`http://localhost:4000/getDoctor/${username}`,{withCredentials: true});
      
      setDoctor(response1.data);

      // Then, fetch all appointments based on the doctor's ID
      if (response1.data) {
        const response2 = await axios.get(`http://localhost:4000/getDoctorAppointments/${response1.data._id}`, {withCredentials: true});
        console.log(response2.data)
        if (response2.status === 200) {
          const doctorAppointments = response2.data;

          // Create an array to store appointments with patient data
          const appointmentsWithPatients = [];

          // Loop through the doctor's appointments
          for (const appointment of doctorAppointments) {
            try {
              if(appointment.patientId!=null){
              const response = await axios.get(`http://localhost:4000/getPatient/${appointment.patientId}`,{withCredentials: true});
              if (response.status === 200) {
                const patientData = response.data;

                // Combine appointment and patient details
                const appointmentWithPatient = { ...appointment, patientInfo: patientData };
                appointmentsWithPatients.push(appointmentWithPatient);
              }}
              else{
                const appointmentWithPatient = { ...appointment, patientInfo: "empty" };
                appointmentsWithPatients.push(appointmentWithPatient);
              }
            } catch (error) {
              console.error('Error fetching patient details:', error);
            }
          }
          console.log("Appointments with Patients:", appointmentsWithPatients)

          // Set the state with the combined data
          setAppointments(appointmentsWithPatients);
          setFilteredAppointments(appointmentsWithPatients);
        }
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    const fetchAppointmentsWithPatients = async () => {
      try {
        // First, fetch the doctor based on the username
        const response1 = await axios.get(`http://localhost:4000/getDoctor/${username}`,{withCredentials: true});
        
        setDoctor(response1.data);
  
        // Then, fetch all appointments based on the doctor's ID
        if (response1.data) {
          const response2 = await axios.get(`http://localhost:4000/getDoctorAppointments/${response1.data._id}`,{withCredentials: true});
          console.log(response2.data)
          if (response2.status === 200) {
            const doctorAppointments = response2.data;
  
            // Create an array to store appointments with patient data
            const appointmentsWithPatients = [];
  
            // Loop through the doctor's appointments
            for (const appointment of doctorAppointments) {
              try {
                if(appointment.patientId!=null){
                const response = await axios.get(`http://localhost:4000/getPatient/${appointment.patientId}`,{withCredentials: true});
                if (response.status === 200) {
                  const patientData = response.data;
  
                  // Combine appointment and patient details
                  const appointmentWithPatient = { ...appointment, patientInfo: patientData };
                  appointmentsWithPatients.push(appointmentWithPatient);
                }}
                else{
                  const appointmentWithPatient = { ...appointment, patientInfo: "empty" };
                  appointmentsWithPatients.push(appointmentWithPatient);
                }
              } catch (error) {
                console.error('Error fetching patient details:', error);
              }
            }
            console.log("Appointments with Patients:", appointmentsWithPatients)
  
            // Set the state with the combined data
            setAppointments(appointmentsWithPatients);
            setFilteredAppointments(appointmentsWithPatients);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
  
    fetchAppointmentsWithPatients();
  }, [username]);
  const handlePastFilterChange = () => {
    const isPast = !selectedPast;
    setSelectedPast(isPast);
    filterAppointments(selectedDate, selectedStatus, selectedUpcoming, isPast);
  };

  const handleDateFilterChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    filterAppointments(selectedDate, selectedStatus, selectedUpcoming);
  };
  
  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
    filterAppointments(selectedDate, selectedStatus, selectedUpcoming);
  };

  const handleUpcomingFilterChange = () => {
    const isUpcoming = !selectedUpcoming;
    setSelectedUpcoming(isUpcoming);
    filterAppointments(selectedDate, selectedStatus, isUpcoming);
  };

  const resetFilters = () => {
    setSelectedDate('');
    setSelectedStatus('');
    setSelectedUpcoming(false);
    setFilteredAppointments(appointments); 
    setSelectedPast(false)// Reset filters to show all appointments
  };
  

  const filterAppointments = async (date, status, upcoming,past)=> {
    console.log('filterAppointments function called');
    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const currentDate = new Date();

      if (!date && !status && !upcoming&&!past) {
        return true; // No filters applied, return all appointments
      }
      if (date && status && upcoming) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status &&
          appointmentDate > currentDate
        );
      }
      if (date && status && past) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status &&
          appointmentDate < currentDate
        );
      }
      if (date && status) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointment.status === status
        );
      }
      if (date && upcoming) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointmentDate > currentDate
        );
      }
      if (date && past) {
        return (
          appointment.date.substring(0, 10) === date &&
          appointmentDate < currentDate
        );
      }
      if (status && upcoming) {
        return (
          appointment.status === status &&
          appointmentDate > currentDate
        );
      }
      if (status && past) {
        return (
          appointment.status === status &&
          appointmentDate < currentDate
        );
      }
      if (date) {
        return (
          appointment.date.substring(0, 10) === date
        );
      }
      if (status) {
        return (
          appointment.status === status
        );
      }
      if (upcoming) {
        return (
          appointmentDate > currentDate
        );
      }
      if (past) {
        return (
          appointmentDate < currentDate
        );
      }
      return false;
    });

    const appointmentsWithPatients = await Promise.all(
      filtered.map(async (appointment) => {
        try {
          if(appointment.patientId!=null){
            const response = await axios.get(`http://localhost:4000/getPatient/${appointment.patientId}`,{
              withCredentials: true
            });
            if (response.status === 200) {
              const patientData = response.data;
              console.log("Appointment Data:", appointment);
              console.log("Patient Data:", patientData);
    
              // Combine appointment and patient details
              const appointmentWithPatient = { ...appointment, patientInfo: patientData };
              console.log("both:", appointmentWithPatient);
    
              return appointmentWithPatient;
            }

          }
         
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
        return appointment; // In case of an error, keep the original appointment data
      })
    );
  
    console.log("Appointments with Patients:", appointmentsWithPatients);
  
    setFilteredAppointments(appointmentsWithPatients);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const appointmentToCancel = appointments.find(app => app._id === appointmentId);
      const differenceInHours = Math.abs(new Date() - new Date(appointmentToCancel.date)) / 36e5;
  
      
  
      const response = await axios.put(`http://localhost:4000/cancelAppointment/${appointmentId}`);
  
      if (differenceInHours > 24) {
        console.error('Cannot cancel appointment less than 24 hours before the appointment date');
        await axios.put(`http://localhost:4000/addtowallet/${appointmentToCancel.patientInfo.username}/${doctor.hourly_rate}`);
      }
      
      if (response.status === 200) {
        const updatedAppointments = appointments.map((appointment) => {
          if (appointment._id === appointmentId) {
            return { ...appointment, status: 'Cancelled' };
          }
  
          return appointment;
        });
  
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };
  return (
    <div>
      <h1>Doctor Appointments</h1>
      <div>
        <label>Date Filter:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilterChange}
        />
      </div>
      <div>
        <label>Status Filter:</label>
        <select
          value={selectedStatus}
          onChange={handleStatusFilterChange}
        >
          <option value="">All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
          <option value="Available">Available</option>
        </select>
      </div>
      <div>
        <label>Upcoming Filter:</label>
        <input
          type="checkbox"
          checked={selectedUpcoming}
          onChange={handleUpcomingFilterChange}
        />
      </div>
      <div>
  <label>Past Filter:</label>
  <input
    type="checkbox"
    checked={selectedPast} 
    onChange={handlePastFilterChange}
  />
</div>
      <button onClick={resetFilters}>Reset Filters</button>
      <ul>
        {filteredAppointments.map((appointment) => (
          <li key={appointment._id}>
            Date: {appointment.date}, Status: {appointment.status}, Description: {appointment.description} {appointment.patientInfo && (
        <span>, Patient Email: <Link to={`/patient-details/${appointment.patientInfo.username}`}>{appointment.patientInfo.name}</Link></span>
        )}
        {new Date(appointment.date) > new Date() && appointment.status === 'Scheduled'&& (
          <>
          <button onClick={() => cancelAppointment(appointment._id)}>Cancel Appointment</button>
          <Link to={`/reschedule/${appointment._id}`}>
                  <button>Reschedule</button>
                </Link>
              </>
        )}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Back</button>

      
    </div>
  );
};

export default DoctorAppointments;
