
const mongoose = require('mongoose');


const MedicineSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required:true,
  },
  pictureUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required:true,
    
  },
  available_quantity: {
    type: Number,
    required:true, 
  },
  sales:{
    type:Number,   
    default:0
  },
  medicalUse:{
    type: String,
    required:true, 
  },
  activeIngredient:{
    type: String,
    required:false, 
  },
  price:{
    type:Number,
    required:true
  } , 
  statuss:{
    type:String,
    enum: ['Unarchived', 'Archived'],
    default: 'Unarchived'
  }
});



const Medicine = mongoose.model("Medicine", MedicineSchema);

module.exports = Medicine;