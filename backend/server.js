require('dotenv').config()


const express = require("express")
const mongoose = require('mongoose')
const Patient = require('./models/PatientModel');
const cookieParser = require('cookie-parser');

const { createDoctor, createDoctor1, getDocPatients, getDoctors, updateDoctor, deleteDoctor, addPatientToDr, getDoctorByUsername, getDoctorbyId, updatePasswordDoctor, getDoctorNotifications } = require("./controllers/doctorController")

const { createAdmin, getAdmin, getAdmins, deleteAdmin, getAdminByUsername, updatePasswordAdmin } = require("./controllers/adminController")
const { createMember, getFamilyMembers } = require("./controllers/familymemController")
const cors = require('cors');

const { createFollowUpReq, acceptFollowUpReq, rejectFollowUpReq, getFollowUpReqs } = require("./controllers/followUpReqController")
const { createAppointment, filter, getAllAppointments, getDoctorAppointments, getPatientAppointments, getAvailableDoctorAppointments, reserveAppointment, reserveFamilyMemberAppointment, reserveLinkedPatientAppointment, cancelAppointment, getAppointment, rescheduleAppointment } = require("./controllers/appointmentsController")
const { createPatient, getPatients, searchPatientsByName, getMyPrescriptions, getMyPrescriptions2, searchPatientsByUserame, deletePatient, getPatient, linkMemberByEmail, getLinkedFamilyMembers, getMedicalHistory, deleteMedicalHistory ,payByPackage, updatePasswordPatient, viewHealthPackages, CancelPackage, getHighestDiscount, getPatientNotifications, addToWallet, getPatientUsername } = require("./controllers/patientController");



const { createPrescription, getPrescriptionsForPatient, deleteMedicineFromPrescription, addMedicineToPres, incrementDosage, decrementDosage, getPrescriptionById } = require("./controllers/perscriptionsController")
const { createRequest, getOneRequest, getRequests, deleteRequest, rejectrequest, acceptrequest } = require("./controllers/requestsController")
const { createHealthPackage, getPackages, updateHealthPackage, deleteHealthPackage, getHealthPackage } = require("./controllers/HealthPackagesController")
const { createPDoctor, getPDoctors, getPDoctor, deletePDoctor } = require("./controllers/pendingDoctorController")
const { requireAuthPatient, requireAuthPending, requireAuthDoctor, requireAuthAdmin, requireAuth } = require("./Middleware/requireAuth")
const { login, logout, forgetPassword, resetPassword } = require("./controllers/userController")
const { getMedicine, getMedicines, getMedicines2 } = require("./controllers/MedicineController")
const multer = require("multer");

//express app
const app = express()
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true // Replace with your frontend's URL
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './controllers/uploads')
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + file.originalname)
  }
})
const upload = multer({ storage: storage })
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Find the patient by their username
    const patient = await Patient.findOne({ username: req.body.username });
    console.log(patient);

    if (!patient) {
      console.error('Patient not found.');
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Check if a file was successfully uploaded
    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Update the patient's medicalHistory field with the file data
    patient.medicalHistory.push({
      filename: req.file.originalname,  // Use 'originalname' to get the original file name
      path: req.file.path,             // Use 'path' to get the path to the uploaded file
      mimetype: req.file.mimetype
    });

    // Save the updated patient model to the database
    await patient.save();

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
const path = require('path');

// ...

// Serve static files from the 'uploads' directory

app.use('/uploads', express.static(path.join(__dirname, 'controllers', 'uploads')));




// Your existing route to fetch health records
app.get('/getHealthRecords/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const patient = await Patient.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const healthRecords = patient.HealthRecord;
    res.status(200).json(healthRecords);
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.post('/upload2', upload.single('file'), async (req, res) => {
  try {
    const { username } = req.query; // Use query parameter

    // Find the patient by their username
    const patient = await Patient.findOne({ username });

    if (!patient) {
      console.error('Patient not found.');
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Check if a file was successfully uploaded
    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Add the health record to the patient's HealthRecord field
    patient.HealthRecord.push({
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
    });

    // Save the updated patient model to the database
    await patient.save();

    res.status(200).json({ message: 'Health record uploaded successfully' });
  } catch (error) {
    console.error('Error uploading health record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




//connect to DB
mongoose.connect('mongodb+srv://laylathabet:iwant28.@cluster0.vv8gqjs.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    // listen for req
    app.listen(4000, () => {
      console.log('Connected to DB & listenening on port 4000')
    })

  })
  .catch((error) => {
    console.log(error)
  })



app.post("/createAdmin", requireAuthAdmin, createAdmin);
app.post("/register/doctor", requireAuthPending, createDoctor);
app.put("/updateDoctor", requireAuthDoctor, updateDoctor);
app.post("/register/patient", createPatient);
app.get("/getDocPatients/:username", requireAuth, getDocPatients);
app.get("/getDoctors", getDoctors);//removed
app.get("/getPatients", getPatients);//removed
app.get("/getAdmins", requireAuthAdmin, getAdmins)
app.post("/addFamilyMember", requireAuthPatient, createMember);
app.delete("/deleteDoctor/:id", requireAuthAdmin, deleteDoctor);
app.patch("/ubdateDoctor", updateDoctor);
app.get("/getFamilyMem/:username", requireAuth, getFamilyMembers);
app.get("/searchPatientsByName", requireAuth, searchPatientsByName);
app.post("/addPatientToDr", requireAuth, addPatientToDr);
app.post("/addPrescription", createPrescription);
app.get("/getPrescriptions/:id", requireAuth, getPrescriptionsForPatient);
app.get("/getMyPrescriptions/:username", requireAuth, getMyPrescriptions);
app.get("/getMyPrescriptions2/:username/:usernameDoctor", requireAuth, getMyPrescriptions2);
app.post("/createRequest", createRequest);
app.post("/createPackage", createHealthPackage);
app.get("/getPackages", requireAuth, getPackages);
app.put("/updatePackage", requireAuthAdmin, updateHealthPackage);
app.delete("/deletePackage", requireAuthAdmin, deleteHealthPackage);
app.delete("/deleteAdmin/:id", requireAuthAdmin, deleteAdmin);
app.delete("/deletePatient/:id", requireAuthAdmin, deletePatient);
app.get("/getDoctor/:username", getDoctorByUsername);//removed
app.get("/getOneRequest", getOneRequest);
app.get("/getRequests", requireAuthAdmin, getRequests);
app.post("/createAppointment", createAppointment);//removed
app.get("/getAllAppointments", requireAuth, getAllAppointments);
app.get("/filterAppointments", requireAuth, filter);
app.get("/search/:username", requireAuth, searchPatientsByUserame);
app.get("/getDoctorAppointments/:id", requireAuth, getDoctorAppointments);
app.get("/getPatient/:id", getPatient);//removed
app.get("/getDoc/:id", getDoctorbyId);
app.get("/getPatientByUsername/:username", requireAuth, searchPatientsByUserame);
app.get("/getPackage/:id", requireAuth, getHealthPackage);
app.get("/getLinkedFamilyMembers/:username", getLinkedFamilyMembers);//removed
app.post("/linkMember", requireAuthPatient, linkMemberByEmail);
app.post("/payPackage", requireAuthPatient, payByPackage);
app.put("/updatePassPatient", requireAuthPatient, updatePasswordPatient);
app.put("/updatePassDoctor", requireAuthDoctor, updatePasswordDoctor);
app.get("/getMedicalHistory/:username", requireAuth, getMedicalHistory);
app.delete('/deleteMedicalRecord/:username/:filename', requireAuth, deleteMedicalHistory);
app.post("/login", login);
app.get("/logout", logout);

app.put("/rejectRequest/:id", requireAuthAdmin, rejectrequest);
app.post("/acceptRequest/:id", requireAuthAdmin, acceptrequest)
//app.post("/newAppointment/:username/:patientId/:doctorId/:date/:status/:description",createAppointment1);
app.post("/forgetPassword", forgetPassword);
app.post("/resetPassword/:username", resetPassword);

app.get("/getAdminByUsername/:username", requireAuthAdmin, getAdminByUsername);
app.put("/updatePassAdmin", requireAuthAdmin, updatePasswordAdmin);
app.get("/search/:username", searchPatientsByUserame);
app.get("/getPatientAppointments/:id", getPatientAppointments);;


app.get("/mypackage/:username", requireAuth, viewHealthPackages);
app.post("/CancelPackage/:username", requireAuthPatient, CancelPackage);
app.get("/getAvailableDoctorAppointments/:id", requireAuth, getAvailableDoctorAppointments);
app.post("/reserveAppointment/:appointmentId", requireAuth, reserveAppointment);
app.get("/getPackageDiscount/:username", requireAuth, getHighestDiscount);

app.post("/createPDoctor/:username/:name/:email/:password/:date_of_birth/:hourly_rate/:speciality/:Affiliation/:educational_background", requireAuthAdmin, createPDoctor);
app.delete("/deletePDoctor/:username", requireAuthPending, deletePDoctor);
app.post("/createDoctor1/:username/:name/:email/:password/:date_of_birth/:hourly_rate/:speciality/:Affiliation/:educational_background", createDoctor1);
app.get("/getPDoctor/:username", requireAuth, getPDoctor);
app.post("/reserveFamilyMemberAppointment/:appointmentId", requireAuth, reserveFamilyMemberAppointment);
app.post("/reserveLinkedPatientAppointment/:appointmentId", requireAuth, reserveLinkedPatientAppointment);
app.get("/getPatientNotifications/:username", getPatientNotifications);
app.get("/getDoctorNotifications/:username", getDoctorNotifications);
app.get("/getMedicines", getMedicines)
app.get("/getMedicines2", getMedicines2)

app.get("getPrescriptionById/:prescriptionId", getPrescriptionById)

app.put("/cancelAppointment/:appointmentId", cancelAppointment);
app.put("/addtoWallet/:username/:amount", addToWallet);
app.get("/getPatientUsername/:_id", getPatientUsername);
app.post("/createFollowUpReq", createFollowUpReq);
app.get("/getFollowUpReqs/:doctorId", getFollowUpReqs);
app.post("/acceptFollowUpReq/:reqid", acceptFollowUpReq);
app.post("/rejectFollowUpReq/:reqid", rejectFollowUpReq);
app.get("/getAppointment/:id", getAppointment);
app.post("/rescheduleAppointment", rescheduleAppointment);


