const Prescription = require('../models/perscriptionsModel');
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const { default: mongoose } = require('mongoose');
const Medicine = require('../models/MedicineModel');

const createPrescription = async (req, res) => {
  const { medicines, instructions, doctor, patient } = req.body;
  console.log(req.body);
  try {
    const medicinesData = await Promise.all(medicines.map(async ({ id, dosage }) => {
      // Fetch the medicine name from your database using the id
      // Replace the following line with your own logic
      const medicine = await Medicine.findById(id);
      return {
        medicineId: id,
        medicineName: medicine.name,
        dosage
      };
    }));
  
    const p=await Patient.findOne({username:patient})
    const d=await Doctor.findOne({username:doctor})
    const newPrescription = new Prescription({
      medicines:medicinesData,
      instructions:instructions,
      patient:p._id,
      doctor:d._id,
      date: new Date(),
      filled: false
    });

    const savedPrescription = await newPrescription.save();

    res.status(200).json(savedPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Server Error',details:error.message });
  }
};
  
  // Get all prescriptions for a patient
  const getPrescriptionsForPatient = async (req, res) => {
    try {
      const { patientId } = req.params;
  
      // Check if the patient exists
      const patient = Patient.find((pat) => pat._id == patientId);

  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      // Retrieve all prescriptions for the patient
      const prescriptions = await Prescription.find({ patient: id });
  
      return res.status(200).json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  const deleteMedicineFromPrescription = async (req, res) => {
    const { prescriptionId, medicineId } = req.params;
    try {
      const prescription = await Prescription.findByIdAndUpdate(prescriptionId, {
        $pull: { medicines:{medicineId:medicineId}  }
      }, { new: true });
  
  
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
  
      await prescription.save();
      res.status(200).json({ message: 'deleted successfully' });
     
    } catch (error) {
      console.error('Error deleting medicine:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const addMedicineToPres = async (req, res) => {
    const { medicineId,prescriptionId,dosage} = req.body;
    try{
      const p=await Prescription.findById(prescriptionId);
      const m=await Medicine.findById(medicineId);
      p.medicines.push({
        medicineId:m._id,
        medicineName:m.name,
        dosage:dosage,
      })
      await p.save(); // Save the updated prescription document
      res.status(200).json({ message: 'Medicine added successfully' }); // Send a success response
    }
    catch(error){
      console.error('Error adding medicine:', error);
    }

  }
  const incrementDosage =async (req, res) => {
    const { prescriptionId, medicineId } = req.params;  
    try {
      const prescription = await Prescription.findById(prescriptionId);
      const medicine = prescription.medicines.find(med => med.medicineId.toString()=== medicineId);
      medicine.dosage++; // increment the dosage
      await prescription.save();
      res.status(200).json({ message: 'Dosage incremented successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error incrementing dosage' });
    }
  
  }
  const decrementDosage=async (req, res) => {
    try {
      const { prescriptionId, medicineId } = req.params;  
      const prescription = await Prescription.findById(prescriptionId);
      const medicine = prescription.medicines.find(med => med.medicineId.toString()=== medicineId);
      if (medicine.dosage > 0) {
        medicine.dosage--;
        await prescription.save();
        
      } 
      res.status(200).json({ message: 'Dosage decremented successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error decrementing dosage' });
    }
  }
  const getPrescriptionById = async (req, res) => {
    try {
      const { prescriptionId } = req.params;
      const prescription = await Prescription.findById(prescriptionId);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.status(200).json(prescription);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  module.exports = {
    createPrescription,
    getPrescriptionsForPatient,
    deleteMedicineFromPrescription,addMedicineToPres,incrementDosage,decrementDosage,getPrescriptionById
  };