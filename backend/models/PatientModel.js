 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const DoctorModel=require('./DoctorModel')
const Notification =require('./notificationModel')
const HealthPackageModel = require('./HealthPackages');

const PatientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  wallet:{
    default:0,
    type:Number
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
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  emergencyContact: {
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    relation_to_patient: {
      type: String,
      required: false,
    } 

    
  },
  healthpackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthPackage',
    required: false
  },

  packageBoughtDate : {
    type : Date,
    required : false
  },
  
  packageCancelledDate : {
    type : Date,
    required : false
  },
  
  myDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  myfamilymembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMem' }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  }],
  linkedPatients:[{
    linkedPatientId:{
      type: mongoose.Schema.Types.ObjectId, ref: 'Patient'
    }, linkedPatientUsername:{
      type: String, ref: 'Patient', required: false
    },
    linkedPatientRelation:{
    
        type: String,
        enum: ['Husband', 'Wife',"Child"],
        required: true,
    
    },
    linkedPatientName:{
      type: String,
    }
  }]
  ,medicalHistory: [{
    filename: String,
    path: String,
    mimetype: String,
    data: Buffer
  }],
  passwordReset: {
    type: String,
  },

  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  
  HealthRecord: [{
    filename: String,
    path: String,
    mimetype: String,
    data: Buffer
  }],
 
});

// Hash the password before saving to the database
PatientSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10; // Salt rounds for bcrypt
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;