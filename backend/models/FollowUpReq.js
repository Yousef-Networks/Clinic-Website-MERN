const mongoose = require('mongoose');
const PatientModel=require('./PatientModel');
const DoctorModel=require('./DoctorModel');
const FollowUpReqSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the Patient model
    required: null,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Accepted','Pending', 'Rejected'],
    default: 'Pending',
  },
  description: {
    type: String,
    required: true,
  },
  hour:{
    type:Number,
    required:false
  }
  
});

const FollowUpReq = mongoose.model('FollowUpReq', FollowUpReqSchema);

module.exports = FollowUpReq;
