import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import AppointmentsModal from '../components/AppointmentsModal';
import AppointmentForm from '../components/AppointmentForm';
import FilterPanel from '../components/filterPanel';
import Modal from 'react-modal';

const DoctorAppointment = () => {
  const { username } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUpcoming, setSelectedUpcoming] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedPast, setSelectedPast] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const [appointment, setAppointment] = useState("");
  const [activeAppointmentId, setAppointmentId] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const navigate = useNavigate(); // React Router's useNavigate hook

  const fetchAppointments = async () => {
    try {
      const response1 = await axios.get(`http://localhost:4000/getDoctor/${username}`, { withCredentials: true });

      setDoctor(response1.data);
      if (response1.data) {
        const response2 = await axios.get(`http://localhost:4000/getDoctorAppointments/${response1.data._id}`, { withCredentials: true });
        setAppointments(response2.data);
        console.log("Appointments:", response2.data);
        setFilteredAppointments(response2.data);
      }

    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, [filteredAppointments]);

  const handleAppointments = (newAppointments) => {
    setAppointments(newAppointments);
  };
    const handleDateFilterChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        filterAppointments(selectedDate, selectedStatus, selectedUpcoming);
    };

    const handleStatusFilterChange = (event) => {
        const selectedStatus = event.target.value;
        setSelectedStatus(selectedStatus);
        filterAppointments(selectedDate, selectedStatus, selectedUpcoming, selectedPast);
    };

    const handleUpcomingFilterChange = () => {
        const isUpcoming = !selectedUpcoming;
        setSelectedUpcoming(isUpcoming);
        filterAppointments(selectedDate, selectedStatus, isUpcoming, selectedPast);
    };

    const handlePastFilterChange = () => {
        const isPast = !selectedPast;
        setSelectedPast(isPast);
        filterAppointments(selectedDate, selectedStatus, selectedUpcoming, isPast);
    };

    const resetFilters = () => {
        setSelectedDate('');
        setSelectedStatus('');
        setSelectedUpcoming(false);
        setFilteredAppointments(appointments);
        setSelectedPast(false)// Reset filters to show all appointments
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


    const filterAppointments = async (date, status, upcoming, past) => {
        console.log('filterAppointments function called');

        const filtered = appointments.filter((appointment) => {
            console.log(appointment)
            const appointmentDate = new Date(appointment.date);
            const currentDate = new Date();

            if (!date && !status && !upcoming && !past) {
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
                    if (appointment.patientId != null) {
                        const response = await axios.get(`http://localhost:4000/getPatient/${appointment.patientId}`, {
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

    const handleGoBack = () => {
        // Use the navigate function to go back
        navigate(-1);
      };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isFilterVisible && (
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', backgroundColor: '#f2f2f2', borderRadius: '10px' }}>
                    {isFilterVisible && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', padding: '10px', backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
                                <div style={{ margin: '10px' }}>
                                    <label>Date Filter:</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateFilterChange}
                                    />
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <label>Status Filter:</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusFilterChange}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <option value="">All</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Available">Available</option>
                                    </select>
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <label>Upcoming Filter:</label>
                                    <input
                                        type="radio"
                                        name="timeFilter"
                                        checked={selectedUpcoming}
                                        onChange={handleUpcomingFilterChange}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </div>
                                <div style={{ margin: '10px' }}>
                                    <label>Past Filter:</label>
                                    <input
                                        type="radio"
                                        name="timeFilter"
                                        checked={selectedPast}
                                        onChange={handlePastFilterChange}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </div>
                                <button onClick={resetFilters} style={{ margin: '10px', padding: '10px', backgroundColor: '#14967f', color: 'white', border: 'none', borderRadius: '5px' }}>Reset Filters</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="container">

                <div className="prescriptions-list" >


                    <h2>
                        Your Appointments
                        <FontAwesomeIcon
                            className="add-icon"
                            icon={faPlus}
                            onClick={() => setIsFormVisible(!isFormVisible)}
                            style={{ color: '#14967f' }}
                        />
                        <FontAwesomeIcon
                            className="filter-icon"
                            icon={faFilter}
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            style={{ color: '#14967f' }}
                        />

                    </h2>
                    <ul>
                    {filteredAppointments.map((a) => (
    <li key={a._id}>
        <div className="prescription-card" style={{ width: '200%' }}>
            <div className="prescription-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ width: '50%' }}> {/* Adjust the width as needed */}
                    <span><strong>Date: </strong> {new Date(a.date).toLocaleDateString('en-GB')}</span>
                    <span><strong>Status: </strong> {a.status}</span>
                </div>
                <div style={{ width: '50%', textAlign: 'right' }}> {/* Adjust the width as needed */}
                    <span><strong>Appointment ID: </strong> {a._id}</span> {/* Move Appointment ID here */}
                    <FontAwesomeIcon
                        className="view-icon"
                        icon={faEye}
                        onClick={() => {
                            setModalOpen(true);
                            setAppointmentId(a._id);
                            setAppointment(appointments.find((l) => l._id === a._id));
                        }}
                    />
                </div>
            </div>
            {new Date(a.date) > new Date() && a.status === 'Scheduled' && (
                <>
                    <button className="cancel-button" onClick={() => {
                        setAppointmentId(a._id);
                        setIsConfirmModalOpen(true)
                    }}>Cancel</button>
                    <Link to={`/reschedule/${a._id}`}>
                        <button className="reschedule-button">Reschedule</button>
                    </Link>
                </>
            )}
        </div>
    </li>
))}



                    </ul>
                </div>
                <div className="prescription-form" >
                    {isFormVisible && doctor && <AppointmentForm doctorId={doctor._id} onAppointmentsFetch={handleAppointments} />}

                </div>

                {modalOpen && appointment && doctor &&
                    <AppointmentsModal
                        setOpenModal={setModalOpen}
                        appointment={appointment}
                        doctor={doctor}
                    />
                }
            </div>
            <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        contentLabel="Confirm Delete"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f4f4f4',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Confirm Cancellation</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>Are you sure you want to cancel this appointment?</p>
       
        <div>
          <button style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: 'crimson', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => {
            cancelAppointment(activeAppointmentId)
            setIsConfirmModalOpen(false);
          }}>
            Yes
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => setIsConfirmModalOpen(false)}>
            No
          </button>
        </div>
      </Modal>
      <button
          style={{ alignSelf: 'flex-end', marginTop: '20px',marginBottom:'10px', width:'500px', marginRight: '600px', padding: '10px 20px', backgroundColor: '#2060a4', color: '#fff', border: 'none', borderRadius: '5px' }}
          onClick={handleGoBack}
        >
          Back
        </button>
        </div>

    )
}
export default DoctorAppointment
