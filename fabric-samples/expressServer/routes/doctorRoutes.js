const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const network = require('../../patient-assets/application-javascript/app.js')

async function authenticateToken(req, res, next){
    const token = req.headers['accesstoken'];
    if(!token){
      return res.sendStatus(400);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err){
        //   console.log(err);
        return res.sendStatus(400);
      }

      req.userrole = user.role;
      next();
    })
    
  }

router.get('/allPermissionedPatients', authenticateToken, async(req, res) => {
    const {hospitalid, doctorid} = req.headers;
    console.log(hospitalid, doctorid);

    if(req.userrole !== 'doctor'){
        return res.sendStatus(400);
    }

    const hospId = parseInt(hospitalid);
    const networkObj = await network.connectToNetwork(doctorid, hospId);
    if(networkObj.error){
        return res.status(404).send({"message":"Doctor not present in hospital"})
    }
    const response = await network.invoke(networkObj, true, 'DoctorContract:queryAllPatients', doctorid);
    if(response.error){
        console.log(`Could not access doctor`);
        return res.status(404).send({"message":"Could Not Access the Patients"})
    }
    const parsedResponse = await JSON.parse(response)
    console.log(parsedResponse);

    res.status(200).send(parsedResponse);
})

router.patch('/:hospitalId/:doctorId/addRecords/:patientId', authenticateToken, async (req, res) => {
    const { hospitalId, doctorId, patientId } = req.params;
    let hospId = parseInt(hospitalId);

    if(req.userrole !== 'doctor'){
        return res.sendStatus(400);
    }

    let args = {
        patientId: patientId,
        reasonsForVisit: req.body.reasonsForVisit,
        allergies: req.body.allergies,
        symptoms: req.body.symptoms,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
        followUp: req.body.followUp,
        notes: req.body.notes,
        medication: req.body.medication,
        changedBy : doctorId,
    }
    args= [JSON.stringify(args)];
    const networkObj = await network.connectToNetwork(doctorId, hospId);
    const response = await network.invoke(networkObj, false, 'DoctorContract:updatePatientMedicalDetails', args)
    if(response.error){
        return res.status(401).send("Could not add Patient Data");
    }
    res.status(200).send({
        status: true,
        messgae: "Success"
    });
})


router.patch('/:hospitalId/:doctorId/addRecs/:patientId', authenticateToken, async (req, res) => {
    const { hospitalId, doctorId, patientId } = req.params;
    let hospId = parseInt(hospitalId);

    if(req.userrole !== 'doctor'){
        return res.sendStatus(400);
    }

    let medRecs = req.body.medRecord;


    console.log('medRecord : ', medRecs);
    // return res.status(200).send('HI');

    medRecords = {};

    for(let record of medRecs){
        let key = record.key.trim();
        let value = record.value.trim();
        medRecords[key] = value;
    }
    let args = {};
    args.medRecords = medRecords;
    args.patientId = patientId;
    args.changedBy = doctorId;
    console.log(args);
    args= [JSON.stringify(args)];
    
    
    const networkObj = await network.connectToNetwork(doctorId, hospId);
    const response = await network.invoke(networkObj, false, 'DoctorContract:updatePatientMedicalDetails', args)
    if(response.error){
        return res.status(401).send("Could not add Patient Data");
    }
    res.status(200).send({
        status: true,
        messgae: "Success"
    });
})


router.get('/getMedicalHistory', authenticateToken, async(req, res) => {
    // return res.status(200).json({"hi" : "there"});

    if(req.userrole !== 'doctor'){
        return res.sendStatus(400);
    }

    const {hospitalid, doctorid, patientid} = req.headers;
    let hospId = parseInt(hospitalid);


    const networkObj = await network.connectToNetwork(doctorid, hospId);
    const response = await network.invoke(networkObj, true, 'DoctorContract:getPatientHistory', patientid);
    if(response.error){
        console.log(`Could not access patient Records`);
        return res.status(404).send({"message":"Could Not Access the Patient's Records"})
    }
    const parsedResponse = await JSON.parse(response)
    console.log('pr : ', parsedResponse);

    res.status(200).json(parsedResponse);
})





module.exports = router;