import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import PrescriptionDetailsModal from '../components/PrescriptionDetailsModal';
import PrescriptionForm from '../components/PrescriptionForm';

const ManagePrescriptions = () => {
  const { username, usernameDoctor } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);
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
    fetchPrescriptions();
  }, [username]);




  return (
    <div className="container">
    <div className="prescriptions-list">
      <h2>
        Your Prescriptions
        <FontAwesomeIcon
            className="add-icon"
            icon={faPlus}
            onClick={() => setIsFormVisible(true)}
            style={{ color: '#14967f' }}
          />
      </h2>
      <ul>
        {prescriptions.map((prescription) => (
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
    <div className="prescription-form">
      {isFormVisible && <PrescriptionForm />}
    </div>
    {modalOpen && prescription &&
      <PrescriptionDetailsModal
        setOpenModal={setModalOpen}
        prescription={prescription}
      />
    }
  </div>

  )
}
export default ManagePrescriptions
