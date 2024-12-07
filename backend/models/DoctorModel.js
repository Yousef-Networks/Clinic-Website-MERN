const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PatientModel=require('./PatientModel')

const doctorSchema = new mongoose.Schema({
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
  },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  wallet:{
    default:0,
    type:Number
  },  passwordReset: {
    type: String,
  },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  medicalDegree: {
    data: Buffer,
    contentType: String,
  },
  doctorId: {
    data: Buffer,
    contentType: String,
  },
  Affiliation:{
    type:String,
    required:false
  },medicalLicense: {
    data: Buffer,
    contentType: String,
  },
});

// Hash the password before saving to the database
doctorSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10; // Salt rounds for bcrypt
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;