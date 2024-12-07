// MedicineSelect.js
// MedicineSelect.js
import React from 'react';
import './Medicine.css';

const MedicineSelect = ({ medicines, selectedMedicine, onMedicineChange }) => (
  <div className="medicine-grid">
    {medicines.map((medicine) => (
      <div 
        key={medicine._id} 
        className={`medicine-card ${selectedMedicine === medicine._id ? 'selected' : ''}`}
        onClick={() => onMedicineChange(medicine._id)}
      >
        <img src={medicine.pictureUrl} alt={medicine.name} />
        <p>{medicine.name}</p>
      </div>
    ))}
  </div>
);

export default MedicineSelect;