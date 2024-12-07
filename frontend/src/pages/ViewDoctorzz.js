import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Doctorz = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [SpecialtyFilter, setSpecialtyFilter] = useState('');
  const [doctors, setDoctors] = useState([]);
  const { username } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const[patient,setPatient]= useState(null);
  const[discount,setDiscount]= useState(null);
  

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDoctors`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setDoctors(response.data);
          setFilteredDoctors(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setPatient(response.data);
          if (response.data.healthpackage) {
            const healthPackageId = response.data.healthpackage;
            fetchHealthPackage(healthPackageId);
          }else{
            setDiscount(0);
          }
          
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }

    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getAllAppointments`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setAppointments(response.data);
          
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
   
    fetchDoctors();
   
    fetchAppointments();
  }, [username]);
  const fetchHealthPackage = async (healthPackageId) => {
      try {
        if(!healthPackageId) return setDiscount(0);
        const response = await axios.get(`http://localhost:4000/getPackage/${healthPackageId}`,{
          withCredentials: true
        });
        if (response.status === 200) {
          setDiscount(response.data.discount);
        }
      } catch (error) {
        console.error('Error fetching health package:', error);
      }
    };

  const handleSearch = () => {
    const filtered = doctors.filter((doctor) => {
      const hasAppointment = appointments.some((appointment) => {
        return (
          appointment.doctorId === doctor?._id &&
          appointment.date.substring(0, 10) === selectedDate &&
          "" + appointment.hour === selectedHour
        );
      });
  
      const nameMatch = doctor?.name?.toLowerCase()?.includes(searchName.toLowerCase());
      const specialtyMatch = doctor?.speciality?.toLowerCase()?.includes(SpecialtyFilter.toLowerCase());
  
      return !hasAppointment && (!searchName || nameMatch) && (!SpecialtyFilter || specialtyMatch);
    });
  
    setFilteredDoctors(filtered);
  };
  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };
  

  const resetFilters = () => {
    setSearchName('');
    setSpecialtyFilter('');
    setSelectedDate('');
    setSelectedHour('');
    setFilteredDoctors(doctors);
  };

  return (
    <div>
      <h1>Doctor Appointments</h1>
      <div>
        <input
          type="text"
          placeholder="Enter doctor's name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Specialty"
          value={SpecialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
        />
        <label>Date Filter:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Hour of Appointment"
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <button onClick={resetFilters}>Reset Filters</button>

      <ul>
      {filteredDoctors.map((m) => (
  <li
    key={m._id}
    className="medicine-item"
    onClick={() => handleDoctorClick(m)} // Add this click handler
  >
    <div className="medicine-details">
  <strong>Name:</strong> <Link to={`/doctor-details/${m.username}/${username}`}> {m.name} </Link><br />
  <strong>Speciality:</strong> {m.speciality}<br />
  <strong>Username:</strong> {m.username}<br />
  <strong>Price:</strong> {m.hourly_rate} - {discount} = {m.hourly_rate - discount}
</div>
<button onClick={(e) => {e.stopPropagation(); window.open('https://meet.google.com/', '_blank')}}>Video Call Doctor</button>  </li>
))}
</ul>
<button onClick={() => navigate(-1)}>Back</button>
</div>
  );
};

export default Doctorz;


//  this is a doctor page