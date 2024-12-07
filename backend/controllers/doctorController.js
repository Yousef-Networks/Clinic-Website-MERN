// Import necessary modules and models
const express = require('express');
const bcrypt = require('bcrypt');

const Doctor = require('../models/DoctorModel'); // Import your Doctor model
const Patient = require('../models/PatientModel');
const Admin = require('../models/AdmiModel');
const Request = require('../models/requestsModel');

// Register Doctor Controller
const createDoctor = async(req,res) => {
  try {
    // Extract data from the request body
    const {
      username,
      name,
      email,
      password,
      date_of_birth,
      hourly_rate,
      Affiliation,
      speciality,
      educational_background
    } = req.body;
    const existingDoctor = await Doctor.findOne({ username });
    const existingPatient = await Patient.findOne({ username });
    const existingAdmin= await Admin.findOne({ username });
    if (existingDoctor||existingPatient||existingAdmin) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    const r = await Request.findOne({ username });

    // Create a new doctor record
    const newDoctor = new Doctor({
      username,
      name,
      email,
      password, // Hash the password before saving (use a library like bcrypt)
      date_of_birth,
      hourly_rate,
      Affiliation,
      speciality,
      educational_background,
      patients:[],
    medicalLicense: r.medicalLicense,
    doctorId: r.doctorId,
    medicalDegree: r.medicalDegree,
    });

    // Save the new doctor to the database
    await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the doctor.' });
  }
};
const createDoctor1 = async(req,res) => {
  try {
    // Extract data from the request body
    const {
      username,
      name,
      email,
      password,
      date_of_birth,
      hourly_rate,
      speciality,
      Affiliation,
      educational_background
    } = req.params;
    const existingDoctor = await Doctor.findOne({ username });
    const existingPatient = await Patient.findOne({ username });
    const existingAdmin= await Admin.findOne({ username });
    if (existingDoctor||existingPatient||existingAdmin) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Create a new doctor record
    const newDoctor = new Doctor({
      username,
      name,
      email,
      password, // Hash the password before saving (use a library like bcrypt)
      date_of_birth,
      hourly_rate,
      speciality,
      Affiliation,
      educational_background,
      patients:[]
    });

    // Save the new doctor to the database
    await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the doctor.' });
  }
};
const getDocPatients = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the doctor by ID and populate the 'patients' field
    const doctor = await Doctor.findOne({username:username}).populate('patients');
   

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const patients = doctor.patients;
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const getDoctors=async(req,res) =>{
  const users =await Doctor.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
        console.log(element.id);
      }
      res.status(200).json(users)
}
// Delete Doctor Controller
const deleteDoctor = async(req,res) => {
  try {
    // Extracts the doctor ID from the request parameters
    const { id } = req.params;

    // Finds the doctor by ID and delete them from the database
    const deletedUser = await Doctor.findByIdAndDelete({ _id:id });

    res.status(200).json({ message: 'Doctor deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor.' });
  }
};
const updateDoctor = async (req, res) => {
  const { username } = req.query; // Get the username from the URL parameter
  const { email, Affiliation, hourly_rate } = req.body; // Get the updated data from the request body

  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({ username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Update the doctor's email, affiliation, or hourly rate if provided
    if (email) {
      doctor.email = email;
    }

    if (Affiliation) {
      doctor.Affiliation = Affiliation;
    }

    if (hourly_rate) {
      doctor.hourly_rate = hourly_rate;
    }

    // Save the updated doctor
    await doctor.save();

    res.status(200).json({ message: 'Doctor information updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 };
 const getDoctorByUsername = async (req, res) => {
  const { username } = req.params; // Get the username from the URL parameter

  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({ username:username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 const addPatientToDr =async(req,res)=>{
  try {
    const { doctorId, patientId } = req.body;

    // Check if the doctor and patient IDs are provided
    if (!doctorId || !patientId) {
      return res.status(400).json({ message: 'Doctor ID and Patient ID are required.' });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    // Check if the doctor exists
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Find the patient by ID
    const patient = await Patient.findById(patientId);

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Add the patient to the doctor's patients list
    doctor.patients.push(patient);

    // Save the updated doctor document
    await doctor.save();

    res.status(201).json({ message: 'Patient added to the doctor successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the patient to the doctor.' });
  }
}
const getDoctorbyId=async(req,res)=>{
  try {
    // Gets the patient ID from the URL parameters
    const { id } = req.params;

    // Fetch the patient from the database using the ID
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      // If no patient is found with the given ID, return a 404 status
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Return the patient data as JSON response
    res.status(200).json(doctor)
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const updatePasswordDoctor = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const dr = await Doctor.findOne({ username });

    if (!dr) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, dr.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Doctor.updateOne(
      {
        username: username,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    await dr.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};
 
const getDoctorNotifications = async (req, res) => {
  try {
    const { username } = req.params;
    const doctor = await Doctor.findOne({username:username}).populate('notifications');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const notifications = doctor.notifications;

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching doctor notifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Implement other controllers (e.g., update profile, view profile, list patients, etc.) following a similar structure

module.exports={createDoctor,getDocPatients,getDoctors,deleteDoctor,updateDoctor,addPatientToDr,getDoctorByUsername,getDoctorbyId,updatePasswordDoctor,createDoctor1,getDoctorNotifications}