/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const crypto = require('crypto'); 

class Patient {

    constructor(patientId, firstName, lastName, email , password, age, phoneNumber, gender, weight , address, bloodGroup,
        changedBy='', reasonsForVisit = '', allergies = '', symptoms = '', diagnosis = '', treatment = '', medication = '', followUp = '', notes = '')
    {
        this.patientId = patientId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.weight = weight;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.changedBy = changedBy;
        this.reasonsForVisit = reasonsForVisit;
        this.allergies = allergies;
        this.symptoms = symptoms;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.medication = medication;
        this.followUp = followUp;
        this.notes = notes;
        this.newPatient = false;
        this.permissionGranted = [];
        return this;
    }
}

module.exports = Patient;