// Import necessary modules and models
const express = require('express');
const Appointment = require('../models/appointments');
const Doctor = require('../models/DoctorModel');
const Patient = require('../models/PatientModel');
const FamilyMember = require ('../models/FamilyMemberModel'); // Import your Patient model
const Notification = require ('../models/notificationModel');
const HealthPackage = require('../models/HealthPackages');
const nodemailer = require('nodemailer'); // For sending emails
const { ObjectId } = require('mongodb');

const mongoose = require('mongoose');


const transporter = nodemailer.createTransport({
  service: 'gmail', // Example: 'Gmail'
  auth: {
    user: 'ontherunclinic@gmail.com',
    pass: 'wkdy hbkz loda mebe',
  },
});

const createAppointment = async (req, res) => {
  try {

    const { patientId, doctorId, date, status, description , hour } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if(patientId==null){
      const appointment = new Appointment({ patientId:null,doctorId, date ,status:"Available",description : "empty", hour });
      await appointment.save();
      res.status(201).json({ message: 'Appointment created successfully', appointment });

    }else{

    const existingAppointment = await Appointment.findOne({ doctorId, date , hour });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Duplicate appointment found' });
    }

    // Fetch the doctor and patient objects
   
    const patient = await Patient.findById(patientId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!patient) {
      const appointment = new Appointment({ doctorId, date ,description : "empty", hour });
      await appointment.save();
      return  res.status(201).json({ message: 'Appointment created successfully', appointment });
    }

    const appointment = new Appointment({ patientId, doctorId, date, status, description , hour });
    await appointment.save();

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


    res.status(201).json({ message: 'Appointment created successfully', appointment });}
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
};

const reserveAppointment = async(req,res) => {
  try {
    const { appointmentId } = req.params;
    const { patientId, status, description , paymentMethod} = req.body;
    const appointment = await Appointment.findById(appointmentId);
    console.log(patientId + " pid"+ status) ;
    const doctor = await Doctor.findById(appointment.doctorId);
    console.log("d"+doctor);
    const patient = await Patient.findById(patientId);
    console.log("P"+patient);
    let discount =0
    if(patient.healthpackage) {
      const h=await HealthPackage.findById(patient.healthpackage);
      discount =h.discount;
    }

    if (!appointment) {
      console.log(" app not found");
    }

    if(paymentMethod=="wallet") {
      console.log("wallet " + patient.wallet); 
      if(patient.wallet<doctor.hourly_rate-discount) {
        return res.status(400).json({ error: 'Not enough money in wallet' });
      }
      else {
        patient.wallet = patient.wallet - doctor.hourly_rate+discount;
      console.log("wallet " + patient.wallet); 

      }
    }

    appointment.patientId = patientId;
    appointment.status = status;
    appointment.description = description;
    await appointment.save();



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

    const msgP = `You have successfully reserved an appointment with doctor ${doctor.name} on ${appointment.date} `;
    const notificationP = new Notification({ message: msgP }); // Corrected
    await notificationP.save();
    patient.notifications.push(notificationP);
    await patient.save();

    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: 'ahmedyasser17x@gmail.com',
        subject: 'Appointment Reservation Confirmation',
        text: msgP,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error email:', error);
    }
    
    const msgD = `${patient.name} has successfully reserved an appointment with you on ${appointment.date} `;
    const notificationD = new Notification({ message: msgD }); // Corrected
    await notificationD.save();
    doctor.notifications.push(notificationD);
    await doctor.save();

    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: 'ahmedyasser17x@gmail.com',
        subject: 'Appointment Reservation Confirmation',
        text: msgD,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error email:', error);
    }

    return res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error('Error reserving appointment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const reserveFamilyMemberAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { patientId ,status, description, familyMemberId , paymentMethod } = req.body;

    // Check if the family member ID is provided
    if (!familyMemberId) {
      return res.status(400).json({ error: 'Family member ID is required' });
    }

    const familyMember = await FamilyMember.findById(familyMemberId);
    
    if (!familyMember) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    const patient = await Patient.findById(patientId);
    if(!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    // Use the family member ID to find the family member
    
    const doctor = await Doctor.findById(appointment.doctorId);
    if(!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if(paymentMethod=="wallet") {
      if(patient.wallet<doctor.hourly_rate) {
        return res.status(400).json({ error: 'Not enough money in wallet' });
      }
      else {
        patient.wallet = patient.wallet - doctor.hourly_rate;
      }
    }
    // Update the appointment details
    appointment.patientId = patientId; // Assign the family member ID
    appointment.status = status;
    appointment.description = description;
    await appointment.save();


    // Update the doctor's patient list if necessary
    if (!doctor.patients.includes(familyMemberId)) {
      const doctorUsername = doctor.username;
      const familyMemberUsername = familyMember.username;
  
      if (Array.isArray(doctor.patients) && !doctor.patients.includes(familyMemberUsername)) {
        console.log('Before:', doctor.patients);
        doctor.patients.push(familyMemberId);
        await doctor.save();
        console.log('After:', doctor.patients);
      }
  
      if (Array.isArray(familyMember.myDoctors) && !familyMember.myDoctors.includes(doctorUsername)) {
        familyMember.myDoctors.push(doctor._id);
        await familyMember.save();
      }
    }

    return res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error('Error reserving family member appointment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const reserveLinkedPatientAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { patientId, status, description, linkedPatientId, paymentMethod } = req.body;

    // Check if the linked patient ID is provided
    if (!linkedPatientId) {
      return res.status(400).json({ error: 'Linked patient ID is required' });
    }

    const linkedPatient = await Patient.findById(linkedPatientId);
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const doctor = await Doctor.findById(appointment.doctorId);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!linkedPatient) {
      return res.status(404).json({ error: 'Linked patient not found' });
    }

    if (paymentMethod === 'wallet') {
      if (patient.wallet < doctor.hourly_rate) {
        return res.status(400).json({ error: 'Not enough money in the wallet' });
      } else {
        patient.wallet = patient.wallet - doctor.hourly_rate;
      }
    }

    // Update the appointment details
    appointment.patientId = linkedPatientId; // Assign the linked patient ID
    appointment.status = status;
    appointment.description = description;
    await appointment.save();

    // Update the doctor's patient list if necessary
    if (!doctor.patients.includes(linkedPatientId)) {
      const doctorUsername = doctor.username;
      const linkedPatientUsername = linkedPatient.username;

      if (Array.isArray(doctor.patients) && !doctor.patients.includes(linkedPatientUsername)) {
        console.log('Before:', doctor.patients);
        doctor.patients.push(linkedPatientId);
        await doctor.save();
        console.log('After:', doctor.patients);
      }

      if (Array.isArray(linkedPatient.myDoctors) && !linkedPatient.myDoctors.includes(doctorUsername)) {
        linkedPatient.myDoctors.push(doctor._id);
        await linkedPatient.save();
      }
    }

    return res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error('Error reserving linked patient appointment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching appointments' });
      }
};

const getAvailableDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params; // Get the doctor's ID from the request parameters

    // Check if the doctor exists
    
    // Fetch appointments for the specified doctor
    const appointments = await Appointment.find({ doctorId: id, status:'Available'});

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const filter=async(req,res) =>{
    try {
        const { date, status } = req.query;
        const filters = {};
        
        if (date) {
          filters.date = new Date(date);
        }
    
        if (status) {
          filters.status = status;
        }
    
        const filteredAppointments = await Appointment.find(filters);
        res.status(200).json(filteredAppointments);
      } catch (error) {
        console.error('Error filtering appointments:', error);
        res.status(500).json({ error: 'An error occurred while filtering appointments' });
      }
}
const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params; // Get the doctor's ID from the request parameters

    // Check if the doctor exists
    
    // Fetch appointments for the specified doctor
    const appointments = await Appointment.find({ doctorId: id });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params; 
    
    // Fetch appointments for the specified patient
    const appointments = await Appointment.find({ patientId: id });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({ message: 'Invalid appointment ID' });
  }
  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (new Date(appointment.date) <= new Date()) {
      return res.status(400).json({ message: 'Appointment date has passed or is today' });
    }
    appointment.status = 'Cancelled';
    await appointment.save();

    const doctor = await Doctor.findById(appointment.doctorId);
    console.log("d"+doctor);
    const patient = await Patient.findById(appointment.patientId);
    console.log("P"+patient);

    const msgP = `You have successfully cancelled an appointment with doctor ${doctor.name} on ${appointment.date} `;
    const notificationP = new Notification({ message: msgP }); // Corrected
    await notificationP.save();
    patient.notifications.push(notificationP);
    await patient.save();

    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: patient.email,
        subject: 'Appointment Cancellation Confirmation',
        text: msgP,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error email:', error);
    }
    
    const msgD = `${patient.name} has successfully cancelled an appointment with you on ${appointment.date} `;
    const notificationD = new Notification({ message: msgD }); // Corrected
    await notificationD.save();
    doctor.notifications.push(notificationD);
    await doctor.save();

    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: doctor.email,
        subject: 'Appointment Cancellation Confirmation',
        text: msgD,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error email:', error);
    }

    return res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return res.status(500).json({ error: 'An error occurred while cancelling the appointment' });
  }
};

const rescheduleAppointment = async (req, res) => {
  const { OldappointmentId, NewappointmentId } = req.body;
  
  try {
    console.log("Reschedule appointment endpoint called");
    console.log("Test Here " + OldappointmentId);
    console.log("Test Here " + NewappointmentId);

    // Fetch the old appointment from the database
    const oldAppointment = await Appointment.findById(OldappointmentId);
    console.log("Test Hereee " +oldAppointment);
    if(!oldAppointment) {
      return res.status(400).json({ message: 'Appointment not found' });
    }
    console.log("Test There");
    console.log("o" + oldAppointment);
    // Fetch the new appointment from the database
    const newAppointment = await Appointment.findById(NewappointmentId);
    if(!newAppointment) {
      return res.status(400).json({ message: 'Appointment not found' });
    }
    console.log("n"+newAppointment);

    const doctor = await Doctor.findById(oldAppointment.doctorId);
    console.log("d"+doctor);
    const patient = await Patient.findById(oldAppointment.patientId);
    console.log("P"+patient);

    // Check if both appointments exist
    if (!oldAppointment || !newAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the new appointment date is in the future
    const currentDate = new Date();
    const newAppointmentDate = new Date(newAppointment.date);

    if (newAppointmentDate <= currentDate) {
      return res.status(400).json({ message: 'New date must be in the future' });
    }

    // Update the new appointment details
    newAppointment.status = 'Scheduled';
    newAppointment.patientId = oldAppointment.patientId; // Set the patientId of the old appointment to the new one

    // Update the old appointment details
    oldAppointment.status = 'Available';
    oldAppointment.patientId = null; // Remove the patientId from the old appointment

    // Save the updated appointments
    await newAppointment.save();
    await oldAppointment.save();

    const msgP = `Your appointment with doctor ${doctor.name} has been rescheduled from ${oldAppointment.date} to ${newAppointment.date} `;
    const notificationP = new Notification({ message: msgP }); // Corrected
    await notificationP.save();
    patient.notifications.push(notificationP);
    await patient.save();

    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: patient.email,
        subject: 'Appointment Reschedule Confirmation',
        text: msgP,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error email:', error);
    }
    
    const msgD = `Your appointment with ${patient.name} has been rescheduled from ${oldAppointment.date} to ${newAppointment.date} `;
    const notificationD = new Notification({ message: msgD }); // Corrected
    await notificationD.save();
    doctor.notifications.push(notificationD);
    await doctor.save();

    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: doctor.email,
        subject: 'Appointment Reschedule Confirmation',
        text: msgD,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error email:', error);
    }



    res.status(200).json({ message: 'Appointment rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAppointment = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment); // Send the appointment in the response
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports={createAppointment,getAllAppointments,filter,getDoctorAppointments,getPatientAppointments,getAvailableDoctorAppointments,reserveAppointment,reserveFamilyMemberAppointment,reserveLinkedPatientAppointment,cancelAppointment,rescheduleAppointment,getAppointment}
