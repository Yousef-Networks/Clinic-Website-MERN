
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PatientModel=require('./PharmacistModel')

const PharmacistSchema = new mongoose.Schema({
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
  hourly_rate: {
    type: Number,
    required: true,
  },
  affiliation: {
    type:String,
    required:true,
  },
  educational_background:{
    type:String,
    required:true,
  },
  Working_license:{
    type:String,
    required:true,
  },
  Pharmacy_degree:{
    type:String,
    required:true,
  },
});

// Hash the password before saving to the database
PharmacistSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10; // Salt rounds for bcrypt
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const Pharmacist = mongoose.model('Pharmacist', PharmacistSchema);

module.exports = Pharmacist;