const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const express = require('express');
const FollowUpReq = require('../models/FollowUpReq');
const FamilyMember = require ('../models/FamilyMemberModel'); // Import your Patient model
const HealthPackage = require('../models/HealthPackages');
const mongoose = require('mongoose');
const Appointment = require('../models/appointments');


const createFollowUpReq = async (req, res) => {
    try {
  
      const { patientId, doctorId, date,status, description , hour } = req.body;
      const doctor = await Doctor.findById(doctorId);
      if(patientId==null){
        const followUpReq = new FollowUpReq({ patientId:null,doctorId, date,status:'Pending',description : "empty", hour });
        await followUpReq.save();
        res.status(201).json({ message: 'followUpReq created successfully', followUpReq });
  
      }else{
  
      const existingfollowUpReq = await FollowUpReq.findOne({ doctorId, date , hour });
  
      if (existingfollowUpReq) {
        return res.status(409).json({ message: 'Duplicate followUpReq found' });
      }
  
      // Fetch the doctor and patient objects
     
      const patient = await Patient.findById(patientId);
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      if (!patient) {
        const followUpReq = new FollowUpReq({ doctorId, date ,description : "empty", hour });
        await followUpReq.save();
        return  res.status(201).json({ message: 'followUpReq created successfully', followUpReq });
      }
  
      const followUpReq = new FollowUpReq({ patientId, doctorId, date,status, description , hour });
      await followUpReq.save();
  
      if (!doctor.patients.includes(patientId)) {
        const doctorUsername = doctor.username;
        const patientUsername = patient.username;
    
        if (Array.isArray(doctor.patients) && !doctor.patients.includes(patientUsername)) {
          console.log('Before:', doctor.patients);
          doctor.patients.push(patient._id);
          await doctor.save();
          console.log('After:', doctor.patients);
        }
    
        if (Array.isArray(patient.myDoctors) && !patient.myDoctors.includes(doctorUsername)) {
          patient.myDoctors.push(doctor._id);
          await patient.save();
        }
      }
  
  
      res.status(201).json({ message: 'followUpReq created successfully', followUpReq });}
    } catch (error) {
      console.error('Error creating followUpReq:', error);
      res.status(500).json({ error: 'An error occurred while creating the followUpReq' });
    }
  };

  const acceptFollowUpReq = async (req, res) => {
    try {
      const { reqid } = req.params;
  
      // Find the FollowUpReq by its ID
      const followUpReq = await FollowUpReq.findById(reqid);
      if (!followUpReq) {
        return res.status(404).json({ error: 'FollowUpReq not found' });
      }
  
      // Update the status field of the FollowUpReq to "accepted"
      followUpReq.status = 'Accepted';
      await followUpReq.save();
  
      // Create a new Appointment
      const appointment = new Appointment({
        patientId: followUpReq.patientId,
        doctorId: followUpReq.doctorId,
        date: followUpReq.date,
        status: 'Scheduled',
        description: followUpReq.description,
        hour: followUpReq.hour
      });
  
      // Save the new Appointment to the database
      await appointment.save();
  
      res.status(200).json({ message: 'FollowUpReq accepted successfully', followUpReq, appointment });
    } catch (error) {
      console.error('Error accepting FollowUpReq:', error);
      res.status(500).json({ error: 'An error occurred while accepting the FollowUpReq' });
    }
  };

  const rejectFollowUpReq = async (req, res) => {
    try {
      const { reqid } = req.params;
  
      // Find the FollowUpReq by its ID
      const followUpReq = await FollowUpReq.findOne({ _id: reqid });
      if (!followUpReq) {
        return res.status(404).json({ error: 'FollowUpReq not found' });
      }
  
      // Update the status field of the FollowUpReq to "rejected"
      followUpReq.status = 'Rejected';
      await followUpReq.save();
  
      res.status(200).json({ message: 'FollowUpReq rejected successfully', followUpReq });
    } catch (error) {
      console.error('Error rejecting FollowUpReq:', error);
      res.status(500).json({ error: 'An error occurred while rejecting the FollowUpReq' });
    }
  };

  const getFollowUpReqs = async (req, res) => {
    try {
        const { doctorId } = req.params;
      const followUpReqs = await FollowUpReq.find({ doctorId, status: 'Pending' });
      res.status(200).json(followUpReqs);
    } catch (error) {
      res.status(500).json({ message: 'Error getting follow-up requests:', error });
    }
  };    
  
  module.exports = { createFollowUpReq, acceptFollowUpReq, rejectFollowUpReq,getFollowUpReqs };