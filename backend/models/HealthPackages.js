const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthPackage = new Schema({

    price: {
      type: Number,
      required: true,
   },
   services: 
    {
       type: String,
       required: true,
    },
 
   name: {
    type: String,
    required: true,
    unique:true
 }
 ,
  discount: {
    type: Number,
    required: false,
    default: 0.0
  }

   
});
const HealthPackage = mongoose.model('HealthPackage', healthPackage);

module.exports = HealthPackage;