const express = require('express');

const {createPatient,getPatients,searchPatientsByName,getMyPrescriptions,searchPatientsByUserame,deletePatient,getPatient,linkMemberByEmail,getLinkedFamilyMembers,getMedicalHistory,deleteMedicalHistory,payByPackage,updatePasswordPatient} = require("../controllers/patientController")


const router = express.Router();
router.post('/',createPatient);



module.exports = router;
