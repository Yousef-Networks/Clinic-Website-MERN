const FamilyMem = require('../models/FamilyMemberModel');
const Patient = require('../models/PatientModel');

const { default: mongoose } = require('mongoose');

const createMember = async(req,res) => {
   try{ const {
        name,
        national_id,
        age,
        gender,
        relation,
        patientUsername
        
      } = req.body;
      const newMember = new FamilyMem({
        name,
        national_id,
        age,
        gender,
        relation,
        patientUsername
      });
      await newMember.save();

      const patient = await Patient.findOne({ username: patientUsername });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      // Push the new family member's _id to the patient's myfamilymembers array
      patient.myfamilymembers.push(newMember._id);
  
      // Save the patient with the updated myfamilymembers array
      await patient.save();


    res.status(201).json({ message: 'Family Member added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the member' });
  }
}
const getFamilyMembers=async(req,res)=>{
  try {
    // Get the username from the request parameters
    const { username } = req.params;
    console.log({username})

    // Find all family members associated with the patient's username
    const familyMembers = await FamilyMem.find({ patientUsername: username });
    console.log(familyMembers)

    // Check if any family members were found
    
    // Send the family members as a JSON response
    res.status(200).json(familyMembers);

  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching family members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}

  module.exports={createMember,getFamilyMembers}









