// PrescriptionDetailsModal.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from "jspdf";

// Set the root element for accessibility

const PrescriptionDetailsModal = ({ setOpenModal, prescription }) => {
    const downloadPdf = () => {
        const doc = new jsPDF();

        doc.text('Prescription', 10, 10);
        doc.text(`ID: ${prescription._id}`, 10, 20);
        doc.text(`Date: ${new Date(prescription.date).toLocaleDateString('en-GB')}`, 10, 30);
        doc.text(`Doctor ID: ${prescription.doctor}`, 10, 40);
        doc.text(`Filled: ${prescription.status === 'filled' ? 'Yes' : 'No'}`, 10, 50);
        doc.text('Medicines:', 10, 60);
        prescription.medicines.forEach((medicine, index) => {
            doc.text(`Medicine Name: ${medicine.medicineName}`, 10, 70 + (index * 20));
            doc.text(`Dosage: ${medicine.dosage}`, 10, 80 + (index * 20));
        });
        doc.text(`Instructions: ${prescription.instructions}`, 10, 90 + (prescription.medicines.length * 20));

        doc.save('prescription.pdf');
    };

    return (

        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button onClick={downloadPdf}>
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <div className='title'>
                    <h1>Prescription</h1>
                </div>
                <div className="metadata">
                    <p><strong>ID: </strong>{prescription._id}</p>
                    <p><strong>Date: </strong>{new Date(prescription.date).toLocaleDateString('en-GB')}</p>
                    <p><strong>Doctor ID: </strong>{prescription.doctor}</p>
                    <p><strong>Filled: </strong>{prescription.status === 'filled' ? 'Yes' : 'No'}</p>
                </div>
                <div className="medicine-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Medicine Name</th>
                                <th>Dosage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescription.medicines.map((medicine, index) => (
                                <tr key={index}>
                                    <td>{medicine.medicineName}</td>
                                    <td>{medicine.dosage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="metadata">

                    <p><strong>Instructions: </strong>{prescription.instructions}</p>

                </div>

            </div>
        </div>
    );
};

export default PrescriptionDetailsModal;
