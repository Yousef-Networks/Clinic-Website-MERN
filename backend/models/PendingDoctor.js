const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PendingdoctorSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    hourly_rate: {
      type: String,
      required: true,
    },
    Affiliation: {
      type: String,
      required: false,
    },
    speciality: {
      type: String,
      required: false,
     
    },
    educational_background: {
      type: String,
      required: true,
    },medicalDegree: {
      data: Buffer,
      contentType: String,
    },
    doctorId: {
      data: Buffer,
      contentType: String,
    },
    medicalLicense: {
      data: Buffer,
      contentType: String,
    },
    Affiliation:{
      type:String,
      required:false
    }});

  
      
      const PendingDoctor = mongoose.model('PendingDoctor', PendingdoctorSchema);
      
      module.exports = PendingDoctor;