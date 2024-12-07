const Request = require('../models/requestsModel'); 
const multer = require('multer');
const Doctor = require('../models/DoctorModel');
const PendingDoctor = require('../models/PendingDoctor'); 
const path = require('path');
const Patient = require('../models/PatientModel');
const Admin = require('../models/AdmiModel');


const storage = multer.memoryStorage();

// Create an instance of Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb('Error: Only PDF files are allowed.');
  },
}).fields([
  { name: 'medicalLicense', maxCount: 1 },
  { name: 'medicalDegree', maxCount: 1 },
  { name: 'doctorId', maxCount: 1 },
]);
const createRequest = async (req, res) => {
    try {
     
        upload(req, res, async (err) => {
          if (err) {
            return res.status(400).json({ message: err });
          }
    
        const {
          username,
          name,
          email,
          password,
          date_of_birth,
          hourly_rate,
          speciality,
          Affiliation,
          educational_background,
         
          
        } = req.body;
  // Access the uploaded files from req.files
  const medicalLicenseFile = req.files.medicalLicense[0];
  const medicalDegreeFile = req.files.medicalDegree[0];
  const doctorIdFile = req.files.doctorId[0];
  const existingDoctor = await Request.findOne({ username });
  const existingPatient = await Patient.findOne({ username });
  const existingAdmin= await Admin.findOne({ username });

  if (existingDoctor||existingPatient||existingAdmin) {
    return res.status(400).json({ error: 'Username already exists.' });
  }
        
    
    
        // Create a new request object
        const request = new Request({
          username,
          name,
          email,
          password,
          date_of_birth,
          hourly_rate,
          speciality,
          Affiliation,
          status1: 'pending',
          educational_background,
          medicalLicense: {
            data: medicalLicenseFile.buffer,
            contentType: medicalLicenseFile.mimetype,
          },
          medicalDegree: {
            data: medicalDegreeFile.buffer,
            contentType: medicalDegreeFile.mimetype,
          },
          doctorId: {
            data: doctorIdFile.buffer,
            contentType: doctorIdFile.mimetype,
          },

          
        });
    
        // Save the request to the database
        await request.save();
    
        // Respond with a success message
        res.status(201).json({ message: 'Doctor registration request submitted successfully.' });
      })
      } catch (error) {
        console.error('Error submitting doctor registration request:', error);
        res.status(500).json({ message: 'Internal server error' });
      }


      

};
const getOneRequest = async (req, res) => {
  try {
    const { username } = req.query;
    
    // Use a case-insensitive regular expression to search for requests by username
    const drequest = await Request.find({ username: username });

    if (drequest.length === 0) {
      return res.status(404).json({ message: 'No request found with the provided doctor username.' });
    }

    res.status(200).json(drequest);
  } catch (error) {
    console.error('Error searching for a doctor request by username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getRequests=async(req,res) =>{
  const users =await Request.find({}).sort({createdAt:-1});
      for(let index=0;index<users.length;index++){
         const element = users[index];
        console.log(element.id);
      }
      res.status(200).json(users)
}
const deleteRequest = async(req,res) => {
  try {
    // Extracts the doctor ID from the request parameters
    const { id } = req.params;

    // Finds the doctor by ID and delete them from the database
    const deletedUser = await Request.findByIdAndDelete({ _id:id });

    res.status(200).json({ message: 'Request deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the doctor.' });
  }
};
const rejectrequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Finds the request by ID and updates the status to "rejected"
    const updatedRequest = await Request.findByIdAndUpdate(
      { _id: id },
      { status1: 'rejected' },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request rejected successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the request.' });
  }
};
const acceptrequest = async (req, res) => {
  try {
    console.log("hello");
    const { id } = req.params;
    const request= await Request.findById(id);
    const username=request.username;
    const name=request.name;
    const email=request.email;
    const password=request.password;
    const date_of_birth=request.date_of_birth;
    const hourly_rate=request.hourly_rate;
    const speciality=request.speciality;
    const Affiliation=request.Affiliation;
    const educational_background=request.educational_background;
    const medicalLicense=request.medicalLicense;
    const medicalDegree=request.medicalDegree;
    const doctorId=request.doctorId;
    const newPendingDoctor = new PendingDoctor({
      username,
      name,
      email,
      password, // Hash the password before saving (use a library like bcrypt)
      date_of_birth,
      hourly_rate,
      speciality,
      Affiliation,
      educational_background,
      medicalLicense,
      medicalDegree,
      doctorId,
    });

    // Save the new doctor to the database
    await newPendingDoctor.save();

    // Finds the request by ID and updates the status to "rejected"
    const updatedRequest = await Request.findByIdAndUpdate(
      { _id: id },
      { status1: 'accepted' },
      { new: true }
    );
    await updatedRequest.save();

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request rejected successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the request.' });
  }
};




module.exports = { createRequest,getOneRequest,getRequests,deleteRequest,rejectrequest,acceptrequest };





