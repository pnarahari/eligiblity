/**
 * Universal Absence Types sample data
 * Columns from spreadsheet:
 * Universal_Absence_Type_ID, Universal_LOA_Family_Code, Universal_LOA_Family_Name,
 * Pay_Bucket_Code, FMLA_Tracking_Bucket, Derived_Absence_Type_Sequence,
 * Target_HCM_Absence_Type_Name, KPTIME_Absence_Type, Has_ESL_or_EIB_Plan, Active_Flag
 */
window.ABSENCE_TYPE_DATA = {
  familyCodes: ["MED", "FCB", "MCG", "IND"],
  familyNames: {
    MED: "Medical",
    FCB: "Family Care / Bonding",
    MCG: "Military Caregiver",
    IND: "Industrial"
  },
  payBuckets: ["SICK", "FPD", "FLOAT", "PTO", "UNPAID"],
  trackingBuckets: ["FMLA", "NON_FMLA"],

  types: [
    {
      universalAbsenceTypeId: "MED_SICK_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "SICK",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 10101,
      targetHcmAbsenceTypeName: "Leave of Absence Sick Medical FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - Sick/ESL",
      hasEslOrEibPlan: "Y",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_SICK_NON_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "SICK",
      fmlaTrackingBucket: "NON_FMLA",
      derivedAbsenceTypeSequence: 10102,
      targetHcmAbsenceTypeName: "Leave of Absence Sick Medical Non-FMLA",
      kptimeAbsenceType: "KPTIME - Non-FMLA - Sick/ESL",
      hasEslOrEibPlan: "Y",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_FPD_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "FPD",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 10201,
      targetHcmAbsenceTypeName: "Leave of Absence FPD Medical FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - Fixed Paid Days",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_FPD_NON_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "FPD",
      fmlaTrackingBucket: "NON_FMLA",
      derivedAbsenceTypeSequence: 10202,
      targetHcmAbsenceTypeName: "Leave of Absence FPD Medical Non-FMLA",
      kptimeAbsenceType: "KPTIME - FPD",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_FLOAT_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "FLOAT",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 10301,
      targetHcmAbsenceTypeName: "Leave of Absence Floating Holiday Medical FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - Floating Holiday",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_FLOAT_NON_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "FLOAT",
      fmlaTrackingBucket: "NON_FMLA",
      derivedAbsenceTypeSequence: 10302,
      targetHcmAbsenceTypeName: "Leave of Absence Floating Holiday Medical Non-FMLA",
      kptimeAbsenceType: "KPTIME - Floating Holiday",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_PTO_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "PTO",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 10401,
      targetHcmAbsenceTypeName: "Leave of Absence PTO Medical FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - PTO",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MED_PTO_NON_FMLA_01",
      universalLoaFamilyCode: "MED",
      universalLoaFamilyName: "Medical",
      payBucketCode: "PTO",
      fmlaTrackingBucket: "NON_FMLA",
      derivedAbsenceTypeSequence: 10402,
      targetHcmAbsenceTypeName: "Leave of Absence PTO Medical Non-FMLA",
      kptimeAbsenceType: "KPTIME - PTO",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "FCB_SICK_FMLA_01",
      universalLoaFamilyCode: "FCB",
      universalLoaFamilyName: "Family Care / Bonding",
      payBucketCode: "SICK",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 20101,
      targetHcmAbsenceTypeName: "Leave of Absence Sick Family Care or Bonding FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - Sick/ESL",
      hasEslOrEibPlan: "Y",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "FCB_SICK_NON_FMLA_01",
      universalLoaFamilyCode: "FCB",
      universalLoaFamilyName: "Family Care / Bonding",
      payBucketCode: "SICK",
      fmlaTrackingBucket: "NON_FMLA",
      derivedAbsenceTypeSequence: 20102,
      targetHcmAbsenceTypeName: "Leave of Absence Sick Family Care or Bonding Non-FMLA",
      kptimeAbsenceType: "KPTIME - Non-FMLA - Sick/ESL",
      hasEslOrEibPlan: "Y",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "FCB_PTO_FMLA_01",
      universalLoaFamilyCode: "FCB",
      universalLoaFamilyName: "Family Care / Bonding",
      payBucketCode: "PTO",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 20401,
      targetHcmAbsenceTypeName: "Leave of Absence PTO Family Care or Bonding FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - PTO",
      hasEslOrEibPlan: "N",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "MCG_SICK_FMLA_01",
      universalLoaFamilyCode: "MCG",
      universalLoaFamilyName: "Military Caregiver",
      payBucketCode: "SICK",
      fmlaTrackingBucket: "FMLA",
      derivedAbsenceTypeSequence: 30101,
      targetHcmAbsenceTypeName: "Leave of Absence Sick Military Caregiver FMLA",
      kptimeAbsenceType: "KPTIME - FMLA - Sick Military",
      hasEslOrEibPlan: "Y",
      activeFlag: "Y"
    },
    {
      universalAbsenceTypeId: "IND_SICK_NON_FMLA_01",
      universalLoaFamilyCode: "IND",
      universalLoaFamilyName: "Industrial",
      payBucketCode: "SICK",
      fmlaTrackingBucket: "NON_FMLA",
      derivedAbsenceTypeSequence: 40102,
      targetHcmAbsenceTypeName: "Leave of Absence Sick Industrial Non-FMLA",
      kptimeAbsenceType: "KPTIME - Non-FMLA - Sick/ESL",
      hasEslOrEibPlan: "Y",
      activeFlag: "N"
    }
  ]
};
