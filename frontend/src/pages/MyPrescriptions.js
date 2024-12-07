import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, } from '@fortawesome/free-solid-svg-icons';
import PrescriptionDetailsModal from '../components/PrescriptionDetailsModal';
import BeatLoader from "react-spinners/BeatLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const MyPres = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const { username } = useParams();
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showFilled, setShowFilled] = useState(false);
    const [showUnfilled, setShowUnfilled] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [prescription, setPrescription] = useState("");
    const [activePrescriptionId, setActivePrescriptionId] = useState(null);



    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/getMyPrescriptions/${username}`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    console.log("P", response.data)
                    setPrescriptions(response.data);
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };
        const fetchMyDoctors = async () => {

            try {
                const response = await axios.get(`http://localhost:4000/getDoctors`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    console.log("P", response.data)
                    setDoctors(response.data);
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
            setIsLoading(false);
        }
        fetchMyDoctors();
        fetchPrescriptions();
    }, [username]);
    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
    };
    const handleFilledChange = (event) => {
        setShowFilled(event.target.checked);
    };
    const handleUnfilledChange = (event) => {
        setShowUnfilled(event.target.checked);
    };
    const filteredPrescriptions = prescriptions.filter(
        (prescription) =>
            (selectedDoctor === '' || prescription.doctor === selectedDoctor) &&
            (!showFilled || prescription.filled) &&
            (!showUnfilled || !prescription.filled) &&
            (!selectedDate || new Date(prescription.date).toDateString() === selectedDate.toDateString())
    );



    return (
        <div className="container">

            {isLoading ? (
                <div className="spinner-container">
                    <BeatLoader color="#14967f" size={15} />
                </div>
            ) : (
                <div className="prescriptions-list">
                    <h2>
                        Your Prescriptions

                    </h2>
                    <select value={selectedDoctor} onChange={handleDoctorChange}>
                        <option value="">All Doctors</option>
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="filledCheck" checked={showFilled} onChange={handleFilledChange} />
                        <label className="form-check-label" htmlFor="filledCheck">
                            Filled
                        </label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="unfilledCheck" checked={showUnfilled} onChange={handleUnfilledChange} />
                        <label className="form-check-label" htmlFor="unfilledCheck">
                            Unfilled
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '10px' }}>Date:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            className="custom-datepicker"
                        />
                    </div>
                    <ul>
                        {filteredPrescriptions.map((prescription) => (
                            <li key={prescription._id}>
                                <div className="prescription-card">
                                    <div className="prescription-header">
                                        <span><strong>Date: </strong>  {new Date(prescription.date).toLocaleDateString('en-GB')}</span>
                                        <FontAwesomeIcon
                                            className="view-icon"
                                            icon={faEye}
                                            onClick={() => {
                                                setModalOpen(true);
                                                setActivePrescriptionId(prescription._id)
                                                setPrescription(prescriptions.find((p) => p._id === activePrescriptionId));
                                            }}
                                        />
                                    </div>
                                    <div><strong>Prescription ID: </strong> {prescription._id}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {modalOpen && prescription &&
                <PrescriptionDetailsModal
                    setOpenModal={setModalOpen}
                    prescription={prescription}
                />
            }

        </div>

    )
}
export default MyPres;
