const express = require('express');
const bcrypt = require('bcrypt');
const PendingDoctor = require('../models/PendingDoctor');
const Request = require('../models/requestsModel');

const createPDoctor = async(req,res) => {
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
      const r = await Request.findOne({ username });
  
      // Create a new doctor record
      const newPendingDoctor = new PendingDoctor({
        username,
        name,
        email,
        password, // Hash the password before saving (use a library like bcrypt)
        date_of_birth,
        hourly_rate,
        speciality,
        Affiliation,
        educational_background,
        medicalLicense: r.medicalLicense,
        doctorId: r.doctorId,
        medicalDegree: r.medicalDegree,
      });
  
      // Save the new doctor to the database
      await newPendingDoctor.save();
  
      res.status(201).json({ message: 'PDoctor registered successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while registering the PDoctor.' });
    }
  };

  const getPDoctors=async(req,res) =>{
    const users =await PendingDoctor.find({}).sort({createdAt:-1});
        for(let index=0;index<users.length;index++){
           const element = users[index];
          console.log(element.id);
        }
        res.status(200).json(users)
  }
  const getPDoctor = async(req, res) => {
    try {
        // Extracts the doctor username from the request parameters
        const { username } = req.params;

        // Finds the doctor by username
        const doctor = await PendingDoctor.findOne({ username: username });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the doctor.' });
    }
};


  // Delete Doctor Controller
  const deletePDoctor = async(req,res) => {
    try {
      // Extracts the doctor username from the request parameters
      const { username } = req.params;
  
      // Finds the doctor by username and delete them from the database
      const deletedUser = await PendingDoctor.findOneAndDelete({ username: username });
  
      res.status(200).json({ message: 'PDoctor deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the Pdoctor.' });
    }
};

  module.exports={createPDoctor,getPDoctors,getPDoctor,deletePDoctor};