/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Track the meidcal encounter of a patient
 * @param {nz.ac.auckland.MedicalEncounter} MedicalEncounter - the medical encounter to be processed
 * @transaction
 */
async function updatePatientEncounter(MedicalEncounter) {

    MedicalEncounter.patient.records = MedicalEncounter.updatedRecords;

    let assetRegistry = await getAssetRegistry('nz.ac.auckland.Patient');

    // emit a notification that a medical encounter has occurred
    let medicalEncounterNotification = getFactory().newEvent('nz.ac.auckland', 'MedicalEncounterNotification');
    medicalEncounterNotification.patient = MedicalEncounter.patient;
    emit(medicalEncounterNotification);

    // persist the state of the commodity
    await assetRegistry.update(MedicalEncounter.patient);
}

/**
 * Track the meidcal encounter of a patient
 * @param {nz.ac.auckland.RequestMedicalRecordSharing} RequestMedicalRecordSharing - 
 * @transaction
 */
async function requestMedicalRecordSharing(RequestMedicalRecordSharing) {
    // emit a notification that a medical encounter has occurred
    let requestMedicalRecordSharingNotification = getFactory().newEvent('nz.ac.auckland', 'RequestMedicalRecordSharingNotification');
    requestMedicalRecordSharingNotification.patient = RequestMedicalRecordSharing.patient;
    requestMedicalRecordSharingNotification.healthProvider = RequestMedicalRecordSharing.healthProvider;
    emit(requestMedicalRecordSharingNotification);
}

/**
 * 
 * @param {nz.ac.auckland.ShareMedicalRecords} ShareMedicalRecords - 
 * @transaction
 */
async function shareMedicalRecords(ShareMedicalRecords) {
    let shareMedicalRecordsNotification = getFactory().newEvent('nz.ac.auckland', 'ShareMedicalRecordsNotification');
    shareMedicalRecordsNotification.patient = ShareMedicalRecords.patient;
    shareMedicalRecordsNotification.healthProvider = ShareMedicalRecords.healthProvider;
    shareMedicalRecordsNotification.encryptedPatientKeyHPPublic = ShareMedicalRecords.encryptedPatientKeyHPPublic;
    emit(shareMedicalRecordsNotification);
}

/**
 * 
 * @param {nz.ac.auckland.RecordSharingComplete} RecordSharingComplete - 
 * @transaction
 */
async function recordSharingComplete(RecordSharingComplete) {

    let assetRegistry = await getAssetRegistry('nz.ac.auckland.PatientKey');

    let patientKey = getFactory().newResource('nz.ac.auckland', 'PatientKey', RecordSharingComplete.patient.id);
    patientKey.patient = RecordSharingComplete.patient;
    patientKey.healthProvider = RecordSharingComplete.healthProvider;
    patientKey.encryptedPatientKeyHPpass = RecordSharingComplete.encryptedPatientKeyHPPass;

    let recordSharingCompleteNotification = getFactory().newEvent('nz.ac.auckland', 'RecordSharingCompleteNotification');
    recordSharingCompleteNotification.patient = RecordSharingComplete.patient;
    recordSharingCompleteNotification.healthProvider = RecordSharingComplete.healthProvider;
    emit(recordSharingCompleteNotification);

    await assetRegistry.add(patientKey);
}

/**
 * 
 * @param {nz.ac.auckland.RevokeMedicalRecordsSharing} RevokeMedicalRecordsSharing - 
 * @transaction
 */
async function revokeMedicalRecordsSharing(RevokeMedicalRecordsSharing) {

    let assetRegistry = await getAssetRegistry('nz.ac.auckland.PatientKey');

    let patientKey = assetRegistry.get(RevokeMedicalRecordsSharing.patient.id);

    let revokeMedicalRecordsSharingNotification = getFactory().newEvent('nz.ac.auckland', 'RevokeMedicalRecordsSharingNotification');
    revokeMedicalRecordsSharingNotification.patient = RevokeMedicalRecordsSharing.patient;
    revokeMedicalRecordsSharingNotification.healthProvider = RevokeMedicalRecordsSharing.healthProvider;
    emit(revokeMedicalRecordsSharingNotification);

    await assetRegistry.remove(patientKey);
}