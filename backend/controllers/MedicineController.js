
const { default: mongoose } = require('mongoose');

const Medicine = require('../models/MedicineModel');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const getMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id).exec();

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    console.error('Error fetching medicine by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMedicines=async(req,res) =>{
  const patients =await Medicine.find({}).sort({createdAt:-1});
      for(let index=0;index<patients.length;index++){
         const element = [patients][index];
         //console.log(element.id);
      }
      res.status(200).json(patients)
};
const getMedicines2=async(req,res) =>{
  const patients = await Medicine.find({ statuss: 'Unarchived' }).sort({ createdAt: -1 });
      for(let index=0;index<patients.length;index++){
         const element = [patients][index];
         //console.log(element.id);
      }
      res.status(200).json(patients)
};



module.exports = {  getMedicine, getMedicines,getMedicines2 };