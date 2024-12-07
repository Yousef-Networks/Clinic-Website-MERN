const Prescription=require('../models/perscriptionsModel')

const { default: mongoose } = require('mongoose');
const Doctor = require('../models/DoctorModel'); // Import your Doctor model
const Patient = require('../models/PatientModel');
const Admin = require('../models/AdmiModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const HealthPackage = require('../models/HealthPackages');
const multer = require('multer');
const path = require('path');




const createPatient = async(req,res) => {
   try{ const {
        username,
        password,
        name,
        email,
        date_of_birth,
        gender,
        mobileNumber,
        emergencyContact,
       
        
      } = req.body;
      const existingDoctor = await Doctor.findOne({ username });
    const existingPatient = await Patient.findOne({ username });
    const existingAdmin= await Admin.findOne({ username });
    if (existingDoctor||existingPatient||existingAdmin) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
      const newPatient = new Patient({
        username,
        password,
        name,
        email,
        date_of_birth,
        gender,
        mobileNumber,
        emergencyContact,
        myDoctors:[],
        myfamilymembers:[],
        prescriptions:[]

      });
      await newPatient.save();

    res.status(201).json({newPatient});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the Patient' });
  }
}
const getPatient=async(req,res)=>{
  try {
    // Get the patient ID from the URL parameters
    const { id } = req.params;
   

    // Fetch the patient from the database using the ID
    const patient = await Patient.findById(id);

    if (!patient) {
      // If no patient is found with the given ID, return a 404 status
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return the patient data as JSON response
    res.status(200).json(patient)
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const getPatients=async(req,res) =>{
  const users =await Patient.find({}).sort({createdAt:-1});
     // for(let index=0;index<users.length;index++){
       //  const element = users[index];
        // console.log(element.id);
      //}
      res.status(200).json(users)
}

const deletePatient = async(req,res) => {
  try {
    // Extract the doctor ID from the request parameters
    const { id } = req.params;

    // Find the doctor by ID and delete them from the database
    const deletedUser = await Patient.findByIdAndDelete({ _id:id });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor' });
  }
};
const searchPatientsByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patients = await Patient.find({ name: { $regex: new RegExp(name, 'i') } });

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found with the provided name.' });
    }

    res.status(200).json(patients);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const searchPatientsByUSername = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patient = await Patient.findOne({ usernaem: username });

    

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getMyPrescriptions = async (req, res) => {
  try {
    const { username} = req.params;
   

    // Find the doctor by ID and populate the 'patients' field
    const patient = await Patient.findOne({username:username});
   

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    

   
    
    const prescriptions = await Prescription.find({ patient: { $in: patient._id } });
    
    console.log(prescriptions)
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const searchPatientsByUserame = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patient = await Patient.findOne({ username:username });


    res.status(200).json(patient);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getPatientUsername = async (req, res) => {
  try {
    const { _id } = req.params;

    // Fetch the patient from the database
    const patient = await Patient.findById(_id);

    // If the patient exists, send the patient's username
    if (patient) {
      res.status(200).json({ username: patient.username });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error('Error getting patient username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const linkMemberByEmail=async(req,res)=>{
  try {
    const { username,email,relation,mobileNumber } = req.body;
    
    // Use a case-insensitive regular expression to search for patients by name
    const patient =await Patient.findOne({username:username});
   
    if(email){
      const patientToBeLinked = await Patient.findOne({ email:email });
      if (!patientToBeLinked||!patient) {
        return res.status(404).json({ message: 'No patients found with the provided email.' });
      }
      const p = await Patient.findOne({
        linkedPatients: {
          $elemMatch: {
            linkedPatientId: patientToBeLinked._id
          }
        }
      });

      if(!p){
        console.log("hena");
        patient.linkedPatients.push({
          linkedPatientId: patientToBeLinked._id,
          linkedPatientUsername: patientToBeLinked.username,
          linkedPatientRelation: relation,
          linkedPatientName:patientToBeLinked.name
        });
        await patient.save();
        patientToBeLinked.linkedPatients.push({
          linkedPatientId: patient._id,
          linkedPatientUsername: patient.username,
          linkedPatientRelation: relation,
          linkedPatientName: patient.name
        });
        await patientToBeLinked.save();
      }

    }
    else if(email&&mobileNumber){
      const patientToBeLinked = await Patient.findOne({ mobileNumber:mobileNumber,email:email });
     

      if (!patientToBeLinked||!patient) {
        return res.status(404).json({ message: 'No patients found with the provided email.' });
      }
      const p = await Patient.findOne({
        linkedPatients: {
          $elemMatch: {
            linkedPatientId: patientToBeLinked._id
          }
        }
      });

      if(!p){
        patient.linkedPatients.push({
          linkedPatientId: patientToBeLinked._id,
          linkedPatientUsername: patientToBeLinked.username,
          linkedPatientRelation: relation,
          linkedPatientName:patientToBeLinked.name
        });
        await patient.save();
        patientToBeLinked.linkedPatients.push({
          linkedPatientId: patient._id,
          linkedPatientUsername: patient.username,
          linkedPatientRelation: relation,
          linkedPatientName: patient.name
        });
        await patientToBeLinked.save();
      }
      

    }
    else{
      const patientToBeLinked = await Patient.findOne({ mobileNumber:mobileNumber });
      if (!patientToBeLinked||!patient) {
        return res.status(404).json({ message: 'No patients found with the provided email.' });
      }
      patient.linkedPatients.push({
        linkedPatientId: patientToBeLinked._id,
        linkedPatientUsername: patientToBeLinked.username,
        linkedPatientRelation: relation,
        linkedPatientName:patientToBeLinked.name
      });
      await patient.save();
      patientToBeLinked.linkedPatients.push({
        linkedPatientId: patient._id,
        linkedPatientUsername: patient.username,
        linkedPatientRelation: relation,
        linkedPatientName: patient.name
      });
      await patientToBeLinked.save();
    }
    
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error searching for patients by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getLinkedFamilyMembers = async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const linkedFamilyMembers = patient.linkedPatients;
    res.status(200).json(linkedFamilyMembers);
  } catch (error) {
    console.error('Error fetching linked family members:', error);
    res.status(500).json({ error: 'An error occurred while fetching linked family members.' });
  }
};
const getMedicalHistory= async (req, res) => {
  const { username } = req.params;

  try {
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const medicalHistory = patient.medicalHistory.map(record => ({
      filename: record.filename,
      path: record.path,
      mimetype: record.mimetype
    }));

    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteMedicalHistory= async (req, res) => {
  const { username, filename } = req.params;

  try {
    const patient = await Patient.findOne({ username });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const recordIndex = patient.medicalHistory.findIndex(record => record.filename === filename);
    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const record = patient.medicalHistory[recordIndex];
    patient.medicalHistory.splice(recordIndex, 1);
    await patient.save();

    res.status(200).json(record);
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

};

const payByPackage = async (req, res) => {
  try {
    const { username, paymentMethod, selectedPackage,discount,LinkedPatientId } = req.body;
    const packagee = await HealthPackage.findById(selectedPackage);
    console.log("pp" + packagee);
    const patient = await Patient.findOne({ username: username });
    if(LinkedPatientId===null){
      if(paymentMethod==='wallet'&&patient){
        if (packagee.price-discount > patient.wallet) {
          return res.status(400).json({ error: 'Not enough money in wallet' });
        }else{
          patient.wallet = patient.wallet - (packagee.price-discount);
  
        }
  
      }
      patient.healthpackage = packagee;
      patient.packageCancelledDate = null;
      patient.packageBoughtDate = new Date();
      console.log("date " + patient.packageBoughtDate);
  
        await patient.save();
    }
    else{
      const p = await Patient.findById(LinkedPatientId);
      if(paymentMethod==='wallet'&&patient&&p){
        if (packagee.price-discount > patient.wallet) {
          return res.status(400).json({ error: 'Not enough money in wallet' });
        }else{
          patient.wallet = patient.wallet - (packagee.price-discount);
  
        }
  
      }
      p.healthpackage = packagee;
      p.packageCancelledDate = null;
      p.packageBoughtDate = new Date();
      console.log("date " + p.packageBoughtDate);
  
        await p.save();

    }
   
  
      res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Error making wallet payment:', error);
    res.status(500).json({ error: 'Error making wallet payment' });
  }
};

const CancelPackage = async (req,res) => {
  const {username} = req.params;
  try {
  const patient = await Patient.findOne({username});
  if (patient.packageCancelledDate != null) {
    return res.status(400).json({error : 'No Subscription Found'});
  }
  patient.packageBoughtDate = null;
  console.log(patient.packageBoughtDate);
  patient.packageCancelledDate = new Date();
  console.log(patient.packageCancelledDate);
  console.log('Cancelled');
  patient.healthpackage=null;
  await patient.save();
  res.status(201).json({message :"cancelled"});
  }
  catch(error) {
    console.error('Error fetching Patient');
  }
}

const updatePasswordPatient = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const patient = await Patient.findOne({ username:username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Patient.updateOne(
      {
        username: username,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    await patient.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

const viewHealthPackages = async (req, res) => {
  const { username } = req.params;
  console.log("hereee");
  try {
    // Find the patient based on the provided username
    const patient = await Patient.findOne({ username }).populate('healthpackage');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Collect the health package for the patient
    const healthPackage = patient.healthpackage;

    return res.status(200).json({ healthPackage });
  } catch (error) {
    console.error('Error fetching health package:', error);
    return res.status(500).json({ error: 'Error fetching health package' });
  }
};
const getHighestDiscount = async(req,res)=>{
  try{
    const {username}=req.params;
    const patient=await Patient.findOne({username:username});
    const linkedPatients=patient.linkedPatients;
    let discount=0;

    // Loop over the linkedPatients array
    for (const linkedPatient of linkedPatients) {
      // Access each linked patient here
      const p=await Patient.findById(linkedPatient.linkedPatientId);
      if(p.healthpackage){
        if(p.healthpackage.discount>discount){
          discount=p.healthpackage.discount;
        }
      }
    }
    return res.status(200).json(discount );
  
  }
  catch{
    return res.status(500).json({ error: 'Error fetching discount' });
  }
}
const addToWallet = async (req, res) => {
  try {
    const { username } = req.params;
    const { amount } = req.params;

    // Fetch the patient from the database
    const patient = await Patient.findOne({ username });

    // If the patient exists, add the amount to the patient's wallet
    if (patient) {
      patient.wallet += amount;

      // Save the updated patient back to the database
      const updatedPatient = await patient.save();

      res.status(200).json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error('Error adding to wallet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPatientNotifications = async (req, res) => {
  try {
    const {username}=req.params;
    const patient=await Patient.findOne({username:username}).populate('notifications');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const notifications = patient.notifications;
    console.log(patient.username);

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching patient notifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getMyPrescriptions2 = async (req, res) => {
  try {
    const { username,usernameDoctor} = req.params;
   

    // Find the doctor by ID and populate the 'patients' field
    const patient = await Patient.findOne({username:username});
    const doctor = await Doctor.findOne({username:usernameDoctor});
    console.log(patient)
    console.log(doctor)
   

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (!doctor) {
      return res.status(404).json({ message: 'doctor not found' });
    }
    

    const pID = patient._id;
    const dID = doctor._id;
    
    const prescriptions = await Prescription.find({ patient: pID,doctor:dID });
    
    console.log(prescriptions)
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const addPrescription = async (req, res) => {
  const { medicationId, dosage, instructions } = req.body;
  const { username, usernameDoctor } = req.params;

  try {
    const newPrescription = new Prescription({
      patientUsername: username,
      doctorUsername: usernameDoctor,
      medicationId,
      dosage,
      instructions,
      date: new Date(),
      filled: falsetient
    });

    const savedPrescription = await newPrescription.save();

    res.status(200).json(savedPrescription);
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports={createPatient,getPatients,deletePatient,searchPatientsByName,getMyPrescriptions,searchPatientsByUserame,getPatient,searchPatientsByUSername,linkMemberByEmail,getLinkedFamilyMembers,getMedicalHistory,deleteMedicalHistory,payByPackage,updatePasswordPatient,viewHealthPackages,CancelPackage,getHighestDiscount,getPatientNotifications,getMyPrescriptions2,addToWallet,getPatientUsername}
