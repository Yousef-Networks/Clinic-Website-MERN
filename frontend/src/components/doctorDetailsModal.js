
import React from 'react';
const DoctorDetailsModal = ({ setOpenModal, doctor }) => {


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
                    <h1>Doctor</h1>
                </div>
                <div className="metadata">
                <table style={{ fontSize: '16px' }}>
                        <tbody>
                            <tr><td><strong>ID:</strong></td><td>{doctor._id}</td></tr>
                            <tr><td><strong>Username:</strong></td><td>{doctor.username}</td></tr>
                            <tr><td><strong>Name:</strong></td><td>{doctor.name}</td></tr>
                            <tr><td><strong>Affiliation:</strong></td><td>{doctor.Affiliation}</td></tr>
                            <tr><td><strong>Hourly Rate:</strong></td><td>{doctor.hourly_rate} $</td></tr>
                            <tr><td><strong>Speciality:</strong></td><td>{doctor.speciality}</td></tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default DoctorDetailsModal;
