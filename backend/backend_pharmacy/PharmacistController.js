

//create a new user
const { default: mongoose } = require('mongoose');


const Pharmacist = require('./PharmacistModel');

const createPharmacist = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      hourly_rate,
      affiliation,
      educational_background,
      Working_license,
      Pharmacy_degree,
    } = req.body;

    const newPharmacist = new Pharmacist({
      username,
      password,
      name,
      email,
      hourly_rate,
      affiliation,
      educational_background,
      Working_license,
      Pharmacy_degree,
    });

    await newPharmacist.save();

    res.status(201).json({ message: 'Pharmacist registered successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while registering the Pharmacist' });
  }
};



const getPharmacists = async (req, res) => {
  try {
    const pharmacists = await Pharmacist.findOne({...req.body});

    res.status(200).json(pharmacists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the Pharmacists' });
  }
};




  //const updatepharmacist = async (req, res) => {
  //  const { username } =  req.body;
 
  //  try {
       // Delete the pharmacist with the specified username
  //     const deletedUser = await userModel.findOneAndDelete({ username });
 
  //     if (!deletedUser) {
   //       return res.status(404).json({ message: 'Pharmacist not found' });
   //    }
 
   //    return res.status(200).json({ message: 'Pharmacist deleted successfully' });
   // } catch (error) {
   //    console.error(error);
    //   return res.status(500).json({ error: 'An error occurred while deleting the pharmacist' });
    //}
 //};


  const deletepharmacist = async (req, res) => {
    const { username } =  req.body;
 
    try {
       // Delete the pharmacist with the specified username
       const deletedUser = await userModel.findOneAndDelete({ username });
 
       if (!deletedUser) {
          return res.status(404).json({ message: 'Pharmacist not found' });
       }
 
       return res.status(200).json({ message: 'Pharmacist deleted successfully' });
    } catch (error) {
       console.error(error);
       return res.status(500).json({ error: 'An error occurred while deleting the pharmacist' });
    }
 };

module.exports = { createPharmacist, getPharmacists, deletepharmacist };