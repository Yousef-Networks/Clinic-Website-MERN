
const { default: mongoose } = require('mongoose');

const Medicine = require('./MedicineModel');

const addMedicine = async (req, res) => {
  try {
    const { name, picture, description, available_quantity, sales } = req.body;
    const medicine = await Medicine.create({
      name,
      picture,
      description,
      available_quantity,
      sales,
    });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMedicine = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMedicine = await Medicine.findByIdAndDelete(id);
    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the medicine' });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, picture, description, available_quantity, sales } = req.body;
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { name, picture, description, available_quantity, sales },
      { new: true }
    );
    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the medicine' });
  }
};

module.exports = { addMedicine, getMedicine, deleteMedicine, updateMedicine };