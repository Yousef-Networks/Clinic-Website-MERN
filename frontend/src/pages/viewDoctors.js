import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './MedicineList.css'; // Import your CSS file for styling
import DoctorDetails from './doctorDetails';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { faEye, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BeatLoader from "react-spinners/BeatLoader";

const DoctorListPage = () => {
  const { username } = useParams();
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [originalDoctors, setOriginalDoctors] = useState([]); // Store original patient data
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [patient, setPatient] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getDoctors`, {
          withCredentials: true
        });
        if (response.status === 200) {

          setOriginalDoctors(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      try {
        const response = await axios.get(`http://localhost:4000/getPatientByUsername/${username}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setPatient(response.data);
          if (response.data.healthpackage) {
            const healthPackageId = response.data.healthpackage;
            fetchHealthPackage(healthPackageId);
          } else {
            setDiscount(0);
          }

        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }

    };

    fetchDoctors();
  }, [username]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getAllAppointments`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setAppointments(response.data);

        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };


    fetchAppointments();
  }, [username]);
  useEffect(() => {
    let filteredDoctors = originalDoctors;

    // Filter by speciality
    if (selectedSpeciality !== '') {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.speciality === selectedSpeciality);
    }

    // Filter by name
    if (searchName !== '') {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (selectedDate !== '') {
      filteredDoctors = filteredDoctors.filter(doctor =>
        appointments.some(appointment =>
          appointment.doctorId === doctor._id && appointment.date.split('T')[0] === selectedDate &&
          (selectedTime === '' || appointment.date.split('T')[1] === selectedTime)
        )
      );
    }
    setDoctors(filteredDoctors);


  }, [selectedSpeciality, searchName, selectedDate, selectedTime, originalDoctors, appointments]);
  const fetchHealthPackage = async (healthPackageId) => {
    try {
      if (!healthPackageId) return setDiscount(0);
      const response = await axios.get(`http://localhost:4000/getPackage/${healthPackageId}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        setDiscount(response.data.discount);
      }
    } catch (error) {
      console.error('Error fetching health package:', error);
    }
  };

  const handleSearchByName = (searchValue) => {
    const filteredPatientsByName = originalDoctors.filter((patient) =>
      patient.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDoctors(filteredPatientsByName);
  };

  const handleInputChange = (e) => {
    setSearchName(e.target.value);

  };

  return (


    <div className="container">
      <div className="patients-list">
        <h2>All Doctors</h2>
        <div className="search-bar">
          <input
            type="text"
            value={searchName}
            onChange={handleInputChange}
            placeholder="Search by name"
          />
        </div>
        <div className="filter-bar">
          <select className="speciality-filter" value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)}>
            <option value="">All Specialities</option>
            <option value="Allergy and Immunology">Allergy and Immunology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
            <option value="Gynecology">Gynecology</option>
            <option value="Physical Medicine">Physical Medicine</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Gastroenterology">Gastroenterology</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Otolaryngology">Otolaryngology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Radiology">Radiology</option>
            <option value="Surgery">Surgery</option>
            <option value="Cardiology">Cardiology</option>

          </select>
          <input className="date-filter" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <input className="time-filter" type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
        </div>
        {loading ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>

        ) : doctors.length === 0 ? (
          <p>No doctors found</p>
        ) : (
          <ul className="patients-list">
            {doctors.map((p) => (
              <li key={p._id}>
                <div className="patients-header">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Name: </strong>{p.name}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Speciality: </strong>{p.speciality}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong>Appointment Price: </strong>$ {p.hourly_rate - discount}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right', marginRight: '15px' }}>
                    <Link to={`/doctor-details/${p.username}/${username}`}>
                      <FontAwesomeIcon icon={faEye} color="#14967f" />
                    </Link>
                    <button style={{ background: 'transparent', border: 'none' }}  onClick={(e) => { e.stopPropagation(); window.open('https://meet.google.com/', '_blank') }}>
                      <FontAwesomeIcon icon={faVideo} color="#14967f" style={{ marginLeft: '10px' }} />
                    </button>

                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div >

  );
};

export default DoctorListPage;


//  this is a doctor page