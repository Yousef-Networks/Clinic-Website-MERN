// Import necessary modules and models
const express = require('express');
const bcrypt = require('bcrypt');

const Admin= require('../models/AdmiModel'); // Import your Admin model
const Doctor = require('../models/DoctorModel'); // Import your Doctor model
const Patient = require('../models/PatientModel');



// Register Doctor Controller
const createAdmin = async(req,res) => {
  try {
    // Extract data from the request body
    const {
      username,
      password
     } =req.body;
     const existingDoctor = await Doctor.findOne({ username });
    const existingPatient = await Patient.findOne({ username });
    const existingAdmin= await Admin.findOne({ username });
    if (existingDoctor||existingPatient||existingAdmin) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    const newAdmin = new Admin({
        username,
        password // Hash the password before saving (use a library like bcrypt)
      });
    
    // Save the new doctor to the database
    await newAdmin.save();

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the Admin' });
  }

};
const getAdmins=async(req,res) =>{
  const users =await Admin.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
        console.log(element.id);
      }
      res.status(200).json(users)
}
const getAdmin=async(req,res) =>{
  const users =await Admin.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
         console.log(element.id);
      }
      res.status(200).json(users)
}
const deleteAdmin = async(req,res) => {
  try {
    // Extract the doctor ID from the request parameters
    const { id } = req.params;

    // Find the doctor by ID and delete them from the database
    const deletedUser = await Admin.findByIdAndDelete({ _id:id });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
  }
};

const getAdminByUsername = async (req, res) => {
  const { username } = req.params; // Get the username from the URL parameter

  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username:username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePasswordAdmin = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Admin.updateOne(
      {
        username: username,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};





module.exports={createAdmin,getAdmin,getAdmins,deleteAdmin,getAdminByUsername,updatePasswordAdmin}
