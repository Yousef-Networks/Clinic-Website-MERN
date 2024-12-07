const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
  },
    password: {
        type: String,
        required: true,
      },
      passwordReset:{
        type:Number,
        required:false,

      }
    });
    // Hash the password before saving to the database
adminSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    const saltRounds = 10; // Salt rounds for bcrypt
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  
  module.exports = Admin;