// #Task route solution
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const Admin = require('../models/AdmiModel');
const { default: mongoose } = require('mongoose');
const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // For generating OTP
const nodemailer = require('nodemailer'); // For sending emails
const Pending= require('../models/PendingDoctor')


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username,role) => {
    return jwt.sign({ user:username,role }, 'supersecret', {
        expiresIn: maxAge
    });
};


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
      let user = await Patient.findOne({ username });
      let role="patient"
      if(!user){
          user = await Doctor.findOne({ username });
          role="doctor"
      }
      if(!user){
          user = await Admin.findOne({ username });
          role="admin"
      }
      if(!user){
        user = await Pending.findOne({ username });
        role="pending"
    }

      if(!user){
          return res.status(404).json({ error: "Username doesn't exist" });
      }
      let auth=false;
      if(role==="pending"){
        auth=(password===user.password)
      }
      else{
        auth = await bcrypt.compare(password, user.password);
      }

    

     
      if (auth) {
        const token = createToken(user.username,role);
        console.log(token);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: false });
        res.status(200).json({ user: user.username, role: role, token: token });
    } else {
        res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'User logged out' });
}

const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: 'Gmail'
    auth: {
      user: 'ontherunclinic@gmail.com',
      pass: 'wkdy hbkz loda mebe',
    },
  });
  
  // Generate and store OTP
  const generateOTP = () => {
    return crypto.randomInt(1000, 9999).toString();
  };
  
  // Send OTP via email
  const sendOTPByEmail = async (email, otp) => {
    try {
      const mailOptions = {
        from: 'ontherunclinic@hotmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  };
  
  // Route to initiate password reset
  const forgetPassword= async (req, res) => {
    const { username,email } = req.body;
 
    try {
      let user = await Patient.findOne({ username });
      if (!user) {
         user = await Doctor.findOne({ username });
      }
      if (!user) {
         user = await Admin.findOne({ username });
      }
      if (!user) {
        return res.status(404).json({ message: "Username doesn't exist" });
      }
     
  
      // Generate and store OTP
      const otp = generateOTP();
      
      user.passwordReset = otp;
  
      // Save user with OTP
      await user.save();
  
      // Send OTP via email
      await sendOTPByEmail(email, otp);
  
      return res.status(200).json({ message: 'Check your email for the OTP.' });
    } catch (error) {
      console.error('Error initiating password reset:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Route to reset the password
  const resetPassword= async (req, res) => {
    const { username } = req.params;
    const {otp, newPassword } = req.body;
    try {
      let user = await Patient.findOne({ username });
      if (!user) {
         user = await Doctor.findOne({ username });
      }
      if (!user) {
         user = await Admin.findOne({ username });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
  
      
  
  
      if (user.passwordReset!== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      if(user = await Patient.findOne({ username })){
        await Patient.updateOne(
          {
            username: username,
          },
          {
            $set: {
              password: hashedPassword,
              passwordReset: undefined,
            },
          }
        );
        await user.save();
      }
      if(user = await Doctor.findOne({ username })){
        await Doctor.updateOne(
          {
            username: username,
          },
          {
            $set: {
              password: hashedPassword,
              passwordReset: undefined,   // Clear the password reset data
            },
          }
        );
        await user.save();
      }
      if(user = await Admin.findOne({ username })){
        await Admin.updateOne(
          {
            username: username,
          },
          {
            $set: {
              password: hashedPassword,
              passwordReset: undefined,   // Clear the password reset data
            },
          }
        );
        await user.save();
      }
  
      
  
      // Save the updated user
     
  
      return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


module.exports = { logout, login, forgetPassword, resetPassword };