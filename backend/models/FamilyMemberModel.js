const mongoose = require('mongoose');

const family_member_schema =new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      national_id: {
        type: String,
        required: true,
        unique: true
      },
      age: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
      },
      relation: {
        type: String,
        enum: ['Husband', 'Wife',"Child"],
        required: true,
      },
      patientUsername: {
        type: String,
        required: true,
      }
      
});

const FamilyMem = mongoose.model('FamilyMem', family_member_schema);

module.exports = FamilyMem;