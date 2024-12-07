
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MedicineModel=require('./MedicineModel')

const MedicineSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
    unique:true,
  },
  picture: {
    data: Buffer,
    contentType: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  available_quantity: {
    type: Number,
    required: true,
  },
  sales:{
    type:Number,    
    required:true,
  },
 
});



const Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports = Medicine;