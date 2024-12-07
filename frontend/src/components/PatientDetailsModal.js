
import React from 'react';
const PatientDetailsModal = ({ setOpenModal, patient }) => {


    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">

                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <div className='title'>
                    <h1>Patient</h1>
                </div>
                <div className="metadata">
                <table style={{ fontSize: '16px' }}>
                        <tbody>
                            <tr><td><strong>ID:</strong></td><td>{patient._id}</td></tr>
                            <tr><td><strong>Username:</strong></td><td>{patient.username}</td></tr>
                            <tr><td><strong>Name:</strong></td><td>{patient.name}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>{patient.email}</td></tr>
                            <tr><td><strong>Date of Birth:</strong></td><td>{patient.date_of_birth} $</td></tr>
                            <tr><td><strong>Gender:</strong></td><td>{patient.gender}</td></tr>
                            <tr><td><strong>Mobile Number:</strong></td><td>{patient.mobileNumber}</td></tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default PatientDetailsModal;
