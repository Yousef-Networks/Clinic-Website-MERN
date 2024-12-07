
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PatientPModel=require('./PatientPModel')

const PatientPSchema = new mongoose.Schema({
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
    type: Date,
    required: true,
  },
  emergency_contact: {
    full_name: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    relation_to_patient: {
      type: String,
      required: true,
    },
  },
});

// Hash the password before saving to the database
PatientPSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10; // Salt rounds for bcrypt
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const PatientP = mongoose.model('PatientP', PatientPSchema);

module.exports = PatientP;