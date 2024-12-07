import React from 'react';
import './PrescriptionList.css';

const PrescriptionList = ({ prescriptions, onAddMedicine, onDeleteMedicine,onIncrementDosage,onDecrementDosage }) => {
    return (
        <div className="prescription-container">
            {prescriptions.map((prescription, index) => (
                <div key={index} className="prescription">
                    {prescription.medicines.length > 0 ? (
                        prescription.medicines.map((medicine, medicineIndex) => (
                            <div key={medicineIndex}>{medicine.medicineName}
                           <div>
                             {medicine.dosage}
                            <button onClick={() => onIncrementDosage(prescription._id, medicine.medicineId)}>+</button>
                            <button onClick={() => onDecrementDosage(prescription._id, medicine.medicineId)}>-</button>
                            <button onClick={() => onDeleteMedicine(prescription._id, medicine.medicineId)}>Delete</button>
                            </div>
                            </div>
                        ))
                    ) : (
                        <div>No medicines in this prescription</div>
                    )}
                    <div>Instructions: {prescription.instructions}</div>
                    <div>Date: {prescription.date}</div>
                    <div>Filled: {prescription.filled ? 'Yes' : 'No'}</div>
                    <button onClick={() => onAddMedicine(prescription._id)}>Add Medicine</button>
                </div>
            ))}
        </div>
    );
};

export default PrescriptionList;