
const express = require('express');
const HealthPackage = require('../models/HealthPackages')


//create a new user


const createHealthPackage = async(req,res) => {
  //add a new user to the database with 
  //Name,type,password
  const{price,services,name} = req.body ;
  console.log(req.body);
  try {
     const h= new HealthPackage({price,services,name});
     console.log(h);
     await h.save();
     res.status(200).json({ message: 'Package added successfully' })
  }catch(error) {
        res.status(400).json({error:error.message})
      }    
  };

const getPackages = async (req, res) => {
  //retrieve all users from the database
  const users = await HealthPackage.find({}).sort({ createdAt: -1 });
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    console.log(element.id);
  }
  res.status(200).json(users)
};
const updateHealthPackage = async (req, res) => {
  const { id } = req.query;
  const updatedFields = req.body;

  try {
    const existingPackage = await HealthPackage.findById(id);

    if (!existingPackage) {
      return res.status(404).json({ message: 'Health package not found' });
    }

    // Iterate over the updatedFields and set them in the existing package
    for (const key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        existingPackage[key] = updatedFields[key];
      }
    }

    // Save the updated package
    await existingPackage.save();

    res.status(200).json({ message: 'Health package updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteHealthPackage = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedPackage = await HealthPackage.findByIdAndRemove(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Health package not found' });
    }

    res.status(200).json({ message: 'Health package deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getHealthPackage = async (req, res) => {
  const { id } = req.params;

  try {
    const healthPackage = await HealthPackage.findById(id);

    if (!healthPackage) {
      return res.status(404).json({ message: 'Health package not found' });
    }

    res.status(200).json(healthPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




module.exports = { createHealthPackage, getPackages, updateHealthPackage, deleteHealthPackage, getHealthPackage };