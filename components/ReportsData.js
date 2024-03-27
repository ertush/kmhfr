import { OtherHouses } from "@mui/icons-material";

// export const propsToGridData = (props, index) => {


//     switch (index) {
//         // Beds and Cots, Theaters
//         case 0:
//             return {
//                 rows: props?.beds_and_cots_by_all_hierachies?.map((
//                     {
//                         ward__sub_county__county__name: county,
//                         ward__sub_county__name: sub_county,
//                         ward__name: ward,
//                         hdu_beds,
//                         icu_beds,
//                         maternity_beds,
//                         inpatient_beds,
//                         emergency_casualty_beds,
//                         cots
//                     },
//                     index
//                 ) => ({
//                     county,
//                     sub_county,
//                     ward,
//                     hdu_beds,
//                     icu_beds,
//                     maternity_beds,
//                     inpatient_beds,
//                     emergency_casualty_beds,
//                     cots,
//                     id: index

//                 })) ?? []

//                 , columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'HDU Beds',
//                         field: 'hdu_beds',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'ICU Beds',
//                         field: 'icu_beds',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Maternity Beds',
//                         field: 'maternity_beds',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Inpatient Beds',
//                         field: 'inpatient_beds',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Emergency Casualty Beds',
//                         field: 'emergency_casualty_beds',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Cots',
//                         field: 'cots',
//                         flex: 1
//                     },

//                 ]
//             };
//         // Keph Level
//         case 1:
//             return {
//                 rows: props?.facility_keph_level_report_all_hierachies?.map((
//                     {
//                         ward__sub_county__county__name: county,
//                         ward__sub_county__name: sub_county,
//                         ward__name: ward,
//                         "Level 2": level_2,
//                         "Level 3": level_3,
//                         "Level 4": level_4,
//                         "Level 5": level_5,
//                         "Level 6": level_6,
//                     },
//                     index
//                 ) => ({
//                     county,
//                     sub_county,
//                     ward,
//                     level_2,
//                     level_3,
//                     level_4,
//                     level_5,
//                     level_6,
//                     id: index

//                 })) ?? []

//                 , columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Level 2',
//                         field: 'level_2',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Level 3',
//                         field: 'level_3',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Level 4',
//                         field: 'level_4',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Level 5',
//                         field: 'level_5',
//                         flex: 1
//                     },
//                     {
//                         headerName: 'Level 6',
//                         field: 'level_6',
//                         flex: 1
//                     }

//                 ]
//             };
//         // Facility Ownership
//         case 2:
//             return {
//                 rows: props?.facility_owner_report_all_hierachies?.map((
//                     {
//                         ward__sub_county__county__name: county,
//                         ward__sub_county__name: sub_county,
//                         ward__name: ward,
//                         "Faith Based Organization": faith_based_org,
//                         "Ministry of Health Category": ministry_of_health_category,
//                         "Non-Governmental Organizations": ngo_category,
//                         "Private Pracitce": private_practice,
//                         // "Private company": private_company,
//                         // "Private Institution": private_institution,
//                         // "Public Institution": public_institution,
//                         // "Classified Facility (Armed Forces)": classified_facility,
//                         "Private Practice - General Practitioner": private_practice_general_practitioner,
//                         "Armed Forces": armed_forces,
//                         "Ministry of Health": ministry_of_health,
//                         "Christian Health Association of Kenya": christian_health_association_of_kenya,
//                         "Kenya Episcopal Conference-Catholic Secretariat": kenya_episcopal_confrence_catholic_secretariat,
//                         "Kenya Police Service": kenya_police_service,
//                         "National Youth Service": national_youth_services,
//                         "Non-Governmental Organizations": non_govermental_organizations,
//                         "Other Faith Based": other_faith_based,
//                         Prisons: prisons,
//                         "Private Practice - Clinical Officer": private_practice_clinical_officer,
//                         "Private Practice - Medical Specialist": private_practice_medical_specialist,
//                         "Private Practice - Nurse / Midwifery": private_practice_nurse_midwifery,
//                         "Private Practice - Private Company": private_practice_private_company,
//                         "Private Practice - Private Institution Academic": private_practice_private_institution_academic,
//                         "Private Practice -Physiotherapist": private_practice_physiotherapist,
//                         "Private Practice Lab Technician/Technologist": private_practice_lab_technician,
//                         "Private Practice- Kenya Nuclear Regulatory Authority": private_practice_knra,
//                         "Private Practice- Pharmacist": private_practice_pharmacist,
//                         "Public Institution - Academic": public_institution_academic,
//                         "Public Institution - Parastatal": public_institution_parastatal,
//                         "Seventh Day Adventist": seventh_day_adventist,
//                         "Supreme Council for Kenya Muslims": supreme_council_for_muslims, 
//                     },
//                     index
//                 ) => ({
//                     county,
//                     sub_county,
//                     ward,
//                     faith_based_org,
//                     ministry_of_health_category,
//                     ngo_category,
//                     private_practice,
//                     // private_company,
//                     // private_institution,
//                     // public_institution,
//                     // classified_facility,
//                     private_practice_general_practitioner,
//                     armed_forces,
//                     ministry_of_health,
//                     christian_health_association_of_kenya,
//                     kenya_episcopal_confrence_catholic_secretariat,
//                     kenya_police_service,
//                     national_youth_services,
//                     non_govermental_organizations,
//                     other_faith_based,
//                     prisons,
//                     private_practice_clinical_officer,
//                     private_practice_medical_specialist,
//                     private_practice_nurse_midwifery,
//                     private_practice_private_company,
//                     private_practice_private_institution_academic,
//                     private_practice_physiotherapist,
//                     private_practice_lab_technician,
//                     private_practice_knra,
//                     private_practice_pharmacist,
//                     public_institution_academic,
//                     public_institution_parastatal,
//                     seventh_day_adventist,
//                     supreme_council_for_muslims,
//                     id:index

//                 })) ?? []

//                 , columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         width:100

//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         width: 100
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         width: 100
//                     },
//                     {
//                         headerName: 'Faith Based Organization',
//                         field: 'faith_based_org',
//                         width:200
//                     },
//                     {
//                         headerName: 'Ministry of Health',
//                         field: 'ministry_of_health',
//                         width:200

//                     },
//                     {
//                         headerName: 'Non-Governmental Organizations',
//                         field: 'ngo_category',
//                         width:200

//                     },
//                     {
//                         headerName: 'Private Pracitce',
//                         field: 'private_practice',
//                         width:200

//                     }
//                     //, {
//                     //     headerName: 'Private company',
//                     //     field: 'private_company',
//                     //     width:200

//                     // },
//                     // {
//                     //     headerName: 'Private Institution',
//                     //     field: 'private_institution',
//                     //     width:200

//                     // },
//                     // {
//                     //     headerName: 'Public Institution',
//                     //     field: 'public_institution',
//                     //     width:200

//                     // },
//                     // {
//                     //     headerName: 'Classified Facility (Armed Forces)',
//                     //     field: 'classified_facility',
//                     //     width:200

//                     // }
//                     ,
//                     {
//                         headerName: 'Private Practice - General Practitioner',
//                         field: 'private_practice_general_practitioner',
//                         width:200
//                     },
//                     {
//                         headerName: 'Armed Forces',
//                         field: 'armed_forces',
//                         width:200

//                     },
//                     {
//                         headerName: 'Christian Health Association of Kenya',
//                         field: 'christian_health_association_of_kenya',
//                         width:200

//                     },
//                     {
//                         headerName: 'Kenya Episcopal Conference-Catholic Secretariat',
//                         field: 'kenya_episcopal_confrence_catholic_secretariat',
//                         width:200

//                     },
//                     {
//                         headerName: 'Kenya Police Service',
//                         field: 'kenya_police_service',
//                         width:200

//                     },
//                     {
//                         headerName: 'National Youth Service',
//                         field: 'national_youth_services',
//                         width:200

//                     },
//                     {
//                         headerName: 'Non-Governmental Organizations',
//                         field: 'non_govermental_organizations',
//                         width:200
//                     },
//                     {
//                         headerName: 'Other Faith Based',
//                         field: 'other_faith_based',
//                         width:200

//                     },
//                     {
//                         headerName: 'Prisons',
//                         field: 'prisons',
//                         width:200

//                     },
//                     {
//                         headerName: 'Private Practice - Clinical Officer',
//                         field: 'private_practice_clinical_officer',
//                         width:200
//                     },
//                     {
//                         headerName: 'Practice - Medical Specialist',
//                         field: 'private_practice_medical_specialist',
//                         width:200
//                     },
//                     {
//                         headerName: 'Private Practice - Nurse / Midwifery',
//                         field: 'private_practice_nurse_midwifery',
//                         width:200
//                     },
//                     {
//                         headerName: 'Private Practice - Private Company',
//                         field: 'private_practice_private_company',
//                         width:200
//                     },
//                     {
//                         headerName: 'Private Practice - Private Institution Academic',
//                         field: 'private_practice_private_institution_academic',
//                         width:200
//                     },

//                     {
//                         headerName: 'Private Practice -Physiotherapist',
//                         field: 'private_practice_physiotherapist',
//                         width:200
//                     },

//                     {
//                         headerName: 'Private Practice Lab Technician/Technologist',
//                         field: 'private_practice_lab_technician',
//                         width:200
//                     },
//                     {
//                         headerName: 'Private Practice- Pharmacist',
//                         field: 'private_practice_pharmacist',
//                         width:200
//                     },
//                     {
//                         headerName: 'Public Institution - Academic',
//                         field: 'public_institution_academic',
//                         width:200
//                     },
//                     {
//                         headerName: 'Public Institution - Parastatal',
//                         field: 'public_institution_parastatal',
//                         width: 200
//                     },
//                     {
//                         headerName: 'Seventh Day Adventist',
//                         field: 'seventh_day_adventist',
//                         width:200
//                     },
//                     {
//                         headerName: 'Supreme Council for Kenya Muslims',
//                         field: 'supreme_council_for_muslims',
//                         width:200
//                     },




//                 ]
//             };
//         // Facility Type 
//         case 3:
//             return {
//                 rows: props?.facility_type_report_all_hierachies?.map((
//                     {
//                         ward__sub_county__county__name: county,
//                         ward__sub_county__name: sub_county,
//                         ward__name: ward,
//                         "STAND ALONE": stand_alone,
//                         "HOSPITALS": hospitals,
//                         "MEDICAL CENTER": medical_center_category,
//                         DISPENSARY: dispensary_category,
//                         VCT: vct,
//                         "MEDICAL CLINIC": medical_clinic_category,
//                         "HEALTH CENTRE": health_center_category,
//                         "NURSING HOME": nursing_home_category,
//                         "Basic Health Centre": basic_health_center,
//                         "Blood Bank": blood_bank,
//                         "Comprehensive Health Centre": comprehensive_health_center,
//                         "Comprehensive Teaching & Tertiary Referral": comprehensive_teaching_referral,
//                         "Dental Clinic": dental_clinic,
//                         Dermatology: dermatology,
//                         "Dialysis Center": dialysis_center,
//                         Dispensary: dispensary,
//                         "Farewell Home": farewell_home,
//                         "Medical Center": medical_center,
//                         "Medical Clinic": medical_clinic,
//                         "Nursing Homes": nursing_homes,
//                         "Nursing and Maternity Home": nursing_maternity_home,
//                         "Nutrition and Dietetics": nutrition_dietetics,
//                         Ophthalmology: ophthalmology,
//                         Pharmacy: pharmacy,
//                         "Primary care hospitals": primary_care_hospitals,
//                         "Radiology Clinic": radiology_clinic,
//                         "Regional Blood Transfusion Centre": regional_blood_transfusion_centre,
//                         "Rehab. Center - Drug and Substance abuse": rehab_center_drugs,
//                         "Rehab. Center - Physiotherapy, Orthopaedic & Occupational Therapy": rehab_center_physiotherapy,
//                         "Satellite Blood Bank": satelite_blood_bank,
//                         "Secondary care hospitals": secondary_care_hospital,
//                         "Specialized & Tertiary Referral hospitals": specialized_tertiary_hospitals

//                     },
//                     index
//                 ) => ({
//                     county,
//                     sub_county,
//                     ward,
//                     stand_alone,
//                     hospitals,
//                     medical_center_category,
//                     dispensary_category,
//                     vct,
//                     medical_clinic_category,
//                     health_center_category,
//                     nursing_home_category,
//                     basic_health_center,
//                     blood_bank,
//                     comprehensive_health_center,
//                     comprehensive_teaching_referral,
//                     dental_clinic,
//                     dermatology,
//                     dialysis_center,
//                     dispensary,
//                     farewell_home,
//                     medical_center,
//                     nursing_homes,
//                     nursing_maternity_home,
//                     nutrition_dietetics,
//                     Ophthalmology: ophthalmology,
//                     Pharmacy: pharmacy,
//                     primary_care_hospitals,
//                     radiology_clinic,
//                     regional_blood_transfusion_centre,
//                     rehab_center_drugs,
//                     rehab_center_physiotherapy,
//                     satelite_blood_bank,
//                     secondary_care_hospital,
//                     specialized_tertiary_hospitals,
//                     id:index
//                 })
//                 ) ?? [],

//                  columns: [
//     {
//         headerName: 'Date',
//         field: 'date',
//         flex: 1
//     }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         width:100
//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         width:100
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         width:100
//                     },
//                     {
//                         headerName: 'STAND ALONE',
//                         field: 'stand_alone',
//                         width:200

//                     },
//                     {
//                         headerName: 'HOSPITALS',
//                         field: 'hospitals',
//                         width:200
//                     },
//                     {
//                         headerName: 'MEDICAL CENTER',
//                         field: 'medical_center_category',
//                         width:200

//                     },
//                     {
//                         headerName: 'DISPENSARY',
//                         field: 'dispensary_category',
//                         width:200
//                     },
//                     {
//                         headerName: 'VCT',
//                         field: 'vct',
//                         width:200

//                     },
//                     {
//                         headerName: 'MEDICAL CLINIC',
//                         field: 'medical_clinic_category',
//                         width:200

//                     },
//                     {
//                         headerName: 'HEALTH CENTRE',
//                         field: 'health_center_category,',
//                         width:200
//                     },
//                     {
//                         headerName: 'NURSING HOME',
//                         field: 'nursing_home_category,',
//                         width:200

//                     },
//                     {
//                         headerName: 'Health Center Clinic',
//                         field: 'health_center_clinic',
//                         width:200

//                     },
//                     {
//                         headerName: 'Basic Health Center',
//                         field: 'basic_health_center',
//                         width:200

//                     },
//                     {
//                         headerName: 'Blood Bank',
//                         field: ' blood_bank,',
//                         width:200


//                     },
//                     {
//                         headerName: 'Comprehensive Teaching & Tertiary Referral',
//                         field: 'comprehensive_teaching_referral',
//                         width:200


//                     },
//                     {
//                         headerName: 'Dentak Clinic',
//                         field: 'dental_clinic',
//                         width:200

//                     },
//                     {
//                         headerName: 'Dermatology',
//                         field: 'dermatology',
//                         width:200

//                     },
//                     {
//                         headerName: 'Dispensary',
//                         field: 'dispensary',
//                         width:200

//                     },
//                     {
//                         headerName: 'Farewell Home',
//                         field: 'farewell_home',
//                         width:200

//                     },
//                     {
//                         headerName: 'Medical Center',
//                         field: 'medical_center',
//                         width:200


//                     },
//                     {
//                         headerName: 'Nursing Homes',
//                         field: 'nursing_homes',
//                         width:200


//                     },
//                     {
//                         headerName: 'Nurising Maternity Homes',
//                         field: 'nursing_maternity_home',
//                         width:200



//                     },
//                     {
//                         headerName: 'Nutrition Dietetics',
//                         field: 'nutrition_dietetics',
//                         width:200

//                     },
//                     {
//                         headerName: 'Ophthalmology',
//                         field: 'ophthalmology',
//                         width:200

//                     },
//                     {
//                         headerName: 'Pharmacy',
//                         field: 'pharmacy',
//                         width:200


//                     },
//                     {
//                         headerName: 'Primary Care Hospital',
//                         field: 'primary_care_hospitals',
//                         width:200

//                     },
//                     {
//                         headerName: 'Radiology Clinic',
//                         field: 'radiology_clinic',
//                         width:200



//                     },
//                     {
//                         headerName: 'Regional Blood Transfusion Center',
//                         field: 'regional_blood_transfusion_centre',
//                         width:200

//                     },
//                     {
//                         headerName: 'Rehab. Center - Drug and Substance abuse"',
//                         field: 'rehab_center_drugs',
//                         width:200

//                     },
//                     {
//                         headerName: 'Rehab. Center - Physiotherapy, Orthopaedic & Occupational Therapy',
//                         field: 'rehab_center_physiotherapy',
//                         width:200

//                     },

//                     {
//                         headerName: 'Satelite Blood Bank',
//                         field: 'satelite_blood_bank',
//                         width:200

//                     },

//                     {
//                         headerName: 'Secondary Care Hospital',
//                         field: 'secondary_care_hospital',
//                         width:200

//                     },

//                     {
//                         headerName: 'Specialized & Tertiary Referral hospitalsL',
//                         field: 'specialized_tertiary_hospital',
//                         width:200

//                     },





//                 ]
//             }
//         // Regulatory Body
//         case 4:
//             return {
//                 rows: props?.facility_regulatory_body_report_all_hierachies?.map((
//                     {
//                         ward__sub_county__county__name: county,
//                         ward__sub_county__name: sub_county,
//                         ward__name: ward,
//                         "Clinical Officers Council": clinical_officers_council,
//                         "Kenya MPDB": kmpdb,
//                         "Kenya Medical Laboratory, Tech & Technologists Board": kmltb,
//                         "Kenya Nuclear Regulatory Council ( Radiation Board)": knra,
//                         "Kenya Nutrition and Dietetic Institute": kndi,
//                         "Kenya Physiotherapy Board": kpb,
//                         "Ministry of Health": moh,
//                         "Nursing Council of Kenya (Private Practice)": nck,
//                         Other: other,
//                         "Pharmacy & Poisons Board": ppb,

//                     },
//                     index
//                 ) => ({
//                     county,
//                     sub_county,
//                     ward,
//                     clinical_officers_council,
//                     kmpdb,
//                     kmltb,
//                     knra,
//                     kndi,
//                     kpb,
//                     moh,
//                     nck,
//                     other,
//                     ppb,
//                     id:index
//                 })
//                 ) ?? [],

//                 columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         width:100
//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         width:100
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         width:100
//                     },
//                     {
//                         headerName: 'Clinical Officers Council',
//                         field: 'clinical_officers_council',
//                         width:200

//                     },
//                     {
//                         headerName: 'Kenya MPDB',
//                         field: 'kmpdb',
//                         width:200
//                     },
//                     {
//                         headerName: 'Kenya Medical Laboratory, Tech & Technologists Board',
//                         field: 'kmltb',
//                         width:200

//                     },
//                     {
//                         headerName: 'Kenya Nuclear Regulatory Council ( Radiation Board)',
//                         field: 'knra',
//                         width:200
//                     },
//                     {
//                         headerName: 'Kenya Nutrition and Dietetic Institute',
//                         field: 'kndi',
//                         width:200

//                     },
//                     {
//                         headerName: 'Kenya Physiotherapy Board',
//                         field: 'kpb',
//                         width:200

//                     },
//                     {
//                         headerName: 'Ministry of Health',
//                         field: 'moh',
//                         width:200
//                     },
//                     {
//                         headerName: 'Nursing Council of Kenya (Private Practice)',
//                         field: 'nck',
//                         width:200

//                     },
//                     {
//                         headerName: 'Pharmacy & Poisons Board',
//                         field: 'ppb',
//                         width:200

//                     }

//                 ]
//             }
//         // Services
//         case 5:
//         return {
//             rows: props?.facility_services_report_all_hierachies?.map((
//                 {
//                     facility__ward__sub_county__county__name: county,
//                     facility__ward__sub_county__name: sub_county,
//                     facility__ward__name: ward,
//                     "EMERGENCY PREPAREDNESS": cat_emergency_prep,  
//                     "CURATIVE SERVICES": cat_curative,
//                     "ORTHOPAEDIC TECHNOLOGY SERVICES": cat_orthopaedic,
//                     IMMUNISATION: cat_immunisation,
//                     "ANTENATAL CARE": cat_antenatal_care,
//                     "REHABILITATION SERVICES": cat_rehabilitation,
//                     "TUBERCULOSIS DIAGNOSIS": cat_tb,
//                     "CANCER SCREENING": cat_cancer_screening,
//                     "RENAL SERVICES": cat_renal,
//                     "NEWBORN CARE SERVICE": cat_newborn_care,
//                     "MORTUARY SERVICES": cat_mortuary,
//                     "SPECIALIZED IN-PATIENT SERVICES": cat_inpatient,
//                     "ICU SERVICES": cat_icu,
//                     "HIV TREATMENT": cat_hiv,
//                     "POSTNATAL CARE SERVICES": cat_postnatal_care,
//                     "MATERNITY SERVICES": cat_maternity,
//                     "NUTRITION SERVICES": cat_nutrition,
//                     "FAMILY PLANNING": cat_fp,
//                     "OPHTHALMIC SERVICES": cat_opthalmic,
//                     "PHARMACY SERVICES": cat_pharmacy,
//                     "MENTAL HEALTH SERVICES": cat_mental_health,
//                     "ENT": cat_ent,
//                     "INTEGRATED MANAGEMENT OF CHILDHOOD ILLNESS": cat_inegrated_mgmt_childhood_illness,
//                     "ACCIDENT AND EMERGENCY CASUALTY SERVICES": cat_accident_casualty,
//                     "HOSPICE SERVICE": cat_hospice,
//                     "AMBULATORY SERVICES": cat_ambulatory,
//                     "FORENSIC SERVICES": cat_forensic,
//                     "SPECIALIZED OUTPATIENTS CLINIC": cat_specialized_outpatients,
//                     "LEPROSY TREATMENT": cat_leprosy_treatment,
//                     "DENTAL SERVICES": cat_dental,
//                     "TUBERCULOSIS TREATMENTS": cat_tb_t,
//                     "RADIOLOGY AND IMAGING": cat_radiology,
//                     "ONCOLOGY SERVICES": cat_oncology,
//                     "SERVICES FOR GENDER BASED VIOLENCE SURVIVORS": cat_gender_based_violence,
//                     "LEPROSY DIAGNOSIS": cat_leprosy,
//                     "LABORATORY SERVICES": cat_lab_services,
//                     "BLOOD SERVICES": cat_blood,
//                     "YOUTH FRIENDLY SERVICES": cat_youth_friendly,
//                     "HIGH DEPENDENCY SERVICES": cat_high_dependecy,
//                     "OPERATING THEATRES": cat_operating_theaters

//                 },
//                 index
//             ) => ({
//                 county,
//                 sub_county,
//                 ward,
//                 cat_emergency_prep,
//                 cat_curative,
//                 cat_orthopaedic,
//                 cat_immunisation,
//                 cat_antenatal_care,
//                 cat_rehabilitation,
//                 cat_tb,
//                 cat_cancer_screening,
//                 cat_renal,
//                 cat_newborn_care,
//                 cat_mortuary,
//                 cat_inpatient,
//                 cat_icu,
//                 cat_hiv,
//                 cat_postnatal_care,
//                 cat_maternity,
//                 cat_nutrition,
//                 cat_fp,
//                 cat_opthalmic,
//                 cat_pharmacy,
//                 cat_mental_health,
//                 cat_ent,
//                 cat_inegrated_mgmt_childhood_illness,
//                 cat_accident_casualty,
//                 cat_hospice,
//                 cat_ambulatory,
//                 cat_forensic,
//                 cat_specialized_outpatients,
//                 cat_leprosy_treatment,
//                 cat_dental,
//                 cat_tb_t,
//                 cat_radiology,
//                 cat_oncology,
//                 cat_gender_based_violence,
//                 cat_leprosy,
//                 cat_lab_services,
//                 cat_blood,
//                 cat_youth_friendly,
//                 cat_high_dependecy,
//                 cat_operating_theaters,
//                 id:index
//             })
//             ) ?? [],

//             columns: [
//     {
//         headerName: 'Date',
//         field: 'date',
//         flex: 1
//     }
// //             ,    {
//                     headerName: formatString(orgUnitFilter),
//                     field: `${orgUnitFilter}`,
//                     width:100
//                 },
//                 {
//                     headerName: 'Sub County',
//                     field: 'sub_county',
//                     width:100
//                 },
//                 {
//                     headerName: 'Ward',
//                     field: 'ward',
//                     width:100
//                 },
//                 {
//                     headerName: 'EMERGENCY PREPAREDNESS',
//                     field: 'cat_emergency_prep',
//                     width:200

//                 },
//                 {
//                     headerName: 'CURATIVE SERVICES',
//                     field: 'cat_curative',
//                     width:200
//                 },
//                 {
//                     headerName: 'ORTHOPAEDIC TECHNOLOGY SERVICES',
//                     field: 'cat_orthopaedic',
//                     width:200

//                 },
//                 {
//                     headerName: 'ANTENATAL CARE',
//                     field: 'cat_antenatal_care',
//                     width:200
//                 },
//                 {
//                     headerName: 'REHABILITATION SERVICES',
//                     field: 'cat_rehabilitation',
//                     width:200

//                 },
//                 {
//                     headerName: 'TUBERCULOSIS DIAGNOSIS',
//                     field: 'cat_tb',
//                     width:200

//                 },
//                 {
//                     headerName: 'CANCER SCREENING',
//                     field: 'cat_cancer_screening',
//                     width:200
//                 },
//                 {
//                     headerName: 'RENAL SERVICES',
//                     field: 'cat_renal',
//                     width:200

//                 },
//                 {
//                     headerName: 'NEWBORN CARE SERVICE',
//                     field: 'cat_newborn_care',
//                     width:200

//                 },
//                 {
//                     headerName: 'MORTUARY SERVICES',
//                     field: 'cat_mortuary',
//                     width:200

//                 },
//                 {
//                     headerName: 'SPECIALIZED IN-PATIENT SERVICES',
//                     field: 'cat_inpatient',
//                     width:200

//                 },
//                 {
//                     headerName: 'ICU SERVICES',
//                     field: 'cat_icu',
//                     width:200

//                 },
//                 {
//                     headerName: 'HIV TREATMENT',
//                     field: 'cat_hiv',
//                     width:200

//                 },
//                 {
//                     headerName: 'POSTNATAL CARE SERVICES',
//                     field: 'cat_postnatal_care',
//                     width:200

//                 },
//                 {
//                     headerName: 'MATERNITY SERVICES',
//                     field: 'cat_maternity',
//                     width:200

//                 },
//                 {
//                     headerName: 'NUTRITION SERVICES',
//                     field: 'cat_nutrition',
//                     width:200

//                 },
//                 {
//                     headerName: 'FAMILY PLANNING',
//                     field: 'cat_fp',
//                     width:200

//                 },
//                 {
//                     headerName: 'OPHTHALMIC SERVICES',
//                     field: 'cat_opthalmic',
//                     width:200

//                 },
//                 {
//                     headerName: 'PHARMACY SERVICES',
//                     field: 'cat_pharmacy',
//                     width:200

//                 },
//                 {
//                     headerName: 'MENTAL HEALTH SERVICES',
//                     field: 'cat_mental_health',
//                     width:200

//                 },
//                 {
//                     headerName: 'ENT',
//                     field: 'cat_ent',
//                     width:200

//                 },
//                 {
//                     headerName: 'INTEGRATED MANAGEMENT OF CHILDHOOD ILLNESS',
//                     field: 'cat_inegrated_mgmt_childhood_illness',
//                     width:200

//                 },
//                 {
//                     headerName: 'ACCIDENT AND EMERGENCY CASUALTY SERVICES',
//                     field: 'cat_accident_casualty',
//                     width:200

//                 },
//                 {
//                     headerName: 'HOSPICE SERVICE',
//                     field: 'cat_hospice',
//                     width:200

//                 },
//                 {
//                     headerName: 'AMBULATORY SERVICES',
//                     field: 'cat_ambulatory',
//                     width:200

//                 },
//                 {
//                     headerName: 'FORENSIC SERVICES',
//                     field: 'cat_forensic',
//                     width:200

//                 },
//                 {
//                     headerName: 'SPECIALIZED OUTPATIENTS CLINIC',
//                     field: 'cat_specialized_outpatients',
//                     width:200

//                 },
//                 {
//                     headerName: 'LEPROSY TREATMENT',
//                     field: 'cat_leprosy_treatment',
//                     width:200

//                 },
//                 {
//                     headerName: 'DENTAL SERVICES',
//                     field: 'cat_dental',
//                     width:200

//                 },
//                 {
//                     headerName: 'TUBERCULOSIS TREATMENTS',
//                     field: 'cat_tb_t',
//                     width:200

//                 },
//                 {
//                     headerName: 'RADIOLOGY AND IMAGING',
//                     field: 'cat_radiology',
//                     width:200

//                 },
//                 {
//                     headerName: 'ONCOLOGY SERVICES',
//                     field: 'cat_oncology',
//                     width:200

//                 },
//                 {
//                     headerName: 'SERVICES FOR GENDER BASED VIOLENCE SURVIVORS',
//                     field: 'cat_gender_based_violence',
//                     width:200

//                 },
//                 {
//                     headerName: 'LEPROSY DIAGNOSIS',
//                     field: 'cat_leprosy',
//                     width:200

//                 },
//                 {
//                     headerName: 'LABORATORY SERVICES',
//                     field: 'cat_lab_services',
//                     width:200

//                 },
//                 {
//                     headerName: 'BLOOD SERVICES',
//                     field: 'cat_blood',
//                     width:200

//                 },
//                 {
//                     headerName: 'YOUTH FRIENDLY SERVICES',
//                     field: 'cat_youth_friendly',
//                     width:200

//                 },
//                 {
//                     headerName: 'HIGH DEPENDENCY SERVICES',
//                     field: 'cat_high_dependecy',
//                     width:200

//                 },
//                 {
//                     headerName: 'OPERATING THEATRES',
//                     field: 'cat_operating_theaters',
//                     width:200

//                 },


//             ]
//         }
//         // Infrastructure
//         case 6:
//             return {
//                 rows: props?.facility_infrastructure_report_all_hierachies?.map((
//                     {

//                         "ICT INFRASTRUCTURE": cat_ict_infrastructure, 
//                         "COMMUNICATIONS": cat_communications,
//                         "WATER SOURCE": cat_water_source,
//                         "MEDICAL EQUIPMENT": cat_medical_equipment,
//                         "POWER SOURCE": cat_power_source,
//                         "ACCESS ROADS": cat_access_road,
//                         "COLD CHAIN": cat_cold_chain,
//                         "MEDICAL WASTE MANAGEMENT": cat_waste_medicall,
//                         "Ultrasound Machines": ultrasound_machines,
//                         "Dialysis machines": dialysis_machines,
//                         "Generator": generator,
//                         "Battery Backups": back_ups,
//                         "Furniture": furniture,
//                         "Oxygen Cylinders": oxygen_cylinder,
//                         "TV Screen": tv_screen,
//                         "Tarmac": tarmac,
//                         "facility__ward__sub_county__county__name": county,
//                         "Printers": printers,
//                         "MRI Machines": mri_machines,
//                         "Teleconferencing Facility": teleconferencing_facility,
//                         "Cold room": cold_room,
//                         "Freezers": freezers,
//                         "Gravel": gravel,
//                         "Open burning": open_burning,
//                         "Dump without burning": dump_without_burning,
//                         "Routers": routers,
//                         "Gas": gas,
//                         "Graded ( Murrum )": murrum,
//                         "Ventilators": ventilators,
//                         "Scanners": scanners,
//                         "Laptops": laptops,
//                         "Boiler": boiler,
//                         "Solar": solar,
//                         "facility__ward__name": ward,
//                         "Wireless Mobile": wireless_mobile,
//                         "CT Scan Machines": ct_scan_machines,
//                         "Incinerator": incinerator,
//                         "Main Grid": main_grid,
//                         "Sewer system": sewer_system,
//                         "Radio Call": radio_call,
//                         "Oxygen Plant": oxygen_plant,
//                         "Bio-Gas": bio_gas,
//                         "Roof Harvested Water": roof_harvested_water,
//                         "River / Dam / Lake": river_dam_lake,
//                         "Protected Wells / Springs": protected_wells,
//                         "Mobile Phone": mobile_phone,
//                         "Office desk": office_desk,
//                         "Cool boxes": cool_boxes,
//                         "Wi-Fi": wifi,
//                         "Remove offsite": remove_offsite,
//                         "X-Ray Machines": x_ray_machines,
//                         "Vaccine Carriers": vaccine_carriers,
//                         "Donkey Cart / Vendor": donkey_cart,
//                         "Video Conferencing space": video_conferencing_space,
//                         "Pipped Oxygen": pipped_oxygen,
//                         "LAN": lan,
//                         "Piped Water": piped_water,
//                         "WAN (Internet connectivity)": wan,
//                         "Video Conferencing Facility": video_confrencing_facility,
//                         "Servers": servers,
//                         "Fridges": fridges,
//                         "Desktops": desktops,
//                         "facility__ward__sub_county__name": sub_county,
//                         "Land Line": land_line,
//                         "Handheld devices": handhedl_devices,
//                         "Bore Hole": bore_hole,
//                         "Earthen Road": eathen_road

//                     },
//                     index
//                 ) => ({
//                     cat_ict_infrastructure, 
//                     cat_communications,
//                     cat_water_source,
//                    cat_medical_equipment,
//                    cat_power_source,
//                    cat_access_road,
//                    cat_cold_chain,
//                    cat_waste_medicall,
//                     ultrasound_machines,
//                     dialysis_machines,
//                    generator,
//                    back_ups,
//                    furniture,
//                     oxygen_cylinder,
//                    tv_screen,
//                    tarmac,
//                     county,
//                    printers,
//                    mri_machines,
//                    teleconferencing_facility,
//                     cold_room,
//                    freezers,
//                    gravel,
//                     open_burning,
//                    dump_without_burning,
//                    routers,
//                    gas,
//                     murrum,
//                     ventilators,
//                     scanners,
//                     laptops,
//                    boiler,
//                     solar,
//                    ward,
//                    wireless_mobile,
//                     ct_scan_machines,
//                     incinerator,
//                     main_grid,
//                     sewer_system,
//                    radio_call,
//                    oxygen_plant,
//                     bio_gas,
//                    roof_harvested_water,
//                     river_dam_lake,
//                     protected_wells,
//                     mobile_phone,
//                    office_desk,
//                    cool_boxes,
//                     wifi,
//                     remove_offsite,
//                    x_ray_machines,
//                    vaccine_carriers,
//                    donkey_cart,
//                     video_conferencing_space,
//                     pipped_oxygen,
//                    lan,
//                    piped_water,
//                     wan,
//                    video_confrencing_facility,
//                    servers,
//                    fridges,
//                    desktops,
//                    sub_county,
//                    land_line,
//                     handhedl_devices,
//                     bore_hole,
//                    eathen_road,
//                     id:index
//                 })
//                 ) ?? [],

//                 columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         width:100
//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         width:100
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         width:100
//                     },
//                     {
//                         headerName: 'ICT INFRASTRUCTURE',
//                         field: 'cat_ict_infrastructure',
//                         width:200

//                     },
//                     {
//                         headerName: 'COMMUNICATIONS',
//                         field: 'cat_communications',
//                         width:200
//                     },
//                     {
//                         headerName: 'WATER SOURCE',
//                         field: 'cat_water_source',
//                         width:200

//                     },
//                     {
//                         headerName: 'MEDICAL EQUIPMENT',
//                         field: 'cat_medical_equipment',
//                         width:200
//                     },
//                     {
//                         headerName: 'POWER SOURCE',
//                         field: 'cat_power_source',
//                         width:200

//                     },
//                     {
//                         headerName: 'ACCESS ROADS',
//                         field: 'cat_access_road',
//                         width:200

//                     },
//                     {
//                         headerName: 'COLD CHAIN',
//                         field: 'cat_cold_chain',
//                         width:200
//                     },
//                     {
//                         headerName: 'MEDICAL WASTE MANAGEMENT',
//                         field: 'cat_waste_medicall',
//                         width:200

//                     },
//                     {
//                         headerName: 'Dialysis machines',
//                         field: 'dialysis_machines',
//                         width:200

//                     },
//                     {
//                         headerName: 'Ultrasound Machines',
//                         field: 'ultrasound_machines',
//                         width:200

//                     },

//                     {
//                         headerName: 'Generator',
//                         field: 'generator',
//                         width:200

//                     },
//                     {
//                         headerName: 'Battery Backups',
//                         field: 'back_ups',
//                         width:200

//                     },

//                     {
//                         headerName: 'Furniture',
//                         field: 'furniture',
//                         width:200

//                     },
//                     {
//                         headerName: 'TV Screen',
//                         field: 'tv_screen',
//                         width:200

//                     },
//                     {
//                         headerName: 'Tarmac',
//                         field: 'tarmac',
//                         width:200

//                     },

//                     {
//                         headerName: 'Printers',
//                         field: 'printers',
//                         width:200

//                     },
//                     {
//                         headerName: 'MRI Machines',
//                         field: 'mri_machines',
//                         width:200

//                     },
//                     {
//                         headerName: 'Cold room',
//                         field: 'cold_room',
//                         width:200

//                     },
//                     {
//                         headerName: 'Freezers',
//                         field: 'freezers',
//                         width:200

//                     },
//                     {
//                         headerName: 'Gravel',
//                         field: 'gravel',
//                         width:200

//                     },
//                     {
//                         headerName: 'Open burning',
//                         field: 'open_burning',
//                         width:200

//                     },
//                     {
//                         headerName: 'Dump without burning',
//                         field: 'dump_without_burning',
//                         width:200

//                     },
//                     {
//                         headerName: 'Routers',
//                         field: 'routers',
//                         width:200

//                     },
//                     {
//                         headerName: 'Gas',
//                         field: 'gas',
//                         width:200

//                     },
//                     {
//                         headerName: 'Graded ( Murrum )',
//                         field: 'murrum',
//                         width:200

//                     },
//                     {
//                         headerName: 'Ventilators',
//                         field: 'ventilators',
//                         width:200

//                     },
//                     {
//                         headerName: 'Scanners',
//                         field: 'scanners',
//                         width:200

//                     },
//                     {
//                         headerName: 'Laptops',
//                         field: 'laptops',
//                         width:200

//                     },
//                     {
//                         headerName: 'Boiler',
//                         field: 'boiler',
//                         width:200

//                     },
//                     {
//                         headerName: 'Solar',
//                         field: 'solar',
//                         width:200

//                     },
//                     {
//                         headerName: 'Wireless Mobile',
//                         field: 'wireless_mobile',
//                         width:200

//                     },
//                     {
//                         headerName: 'CT Scan Machines',
//                         field: 'ct_scan_machines',
//                         width:200

//                     },
//                     {
//                         headerName: 'Incinerator',
//                         field: 'incinerator',
//                         width:200

//                     },
//                     {
//                         headerName: 'Main Grid',
//                         field: 'main_grid',
//                         width:200

//                     },
//                     {
//                         headerName: 'Sewer system',
//                         field: 'sewer_system',
//                         width:200

//                     },
//                     {
//                         headerName: 'Oxygen Plant',
//                         field: 'oxygen_plant',
//                         width:200

//                     },
//                     {
//                         headerName: 'Bio-Gas',
//                         field: 'bio_gas',
//                         width:200

//                     },
//                     {
//                         headerName: 'Roof Harvested Water',
//                         field: 'roof_harvested_water',
//                         width:200

//                     },
//                     {
//                         headerName: 'River / Dam / Lake',
//                         field: 'river_dam_lake',
//                         width:200

//                     },
//                     {
//                         headerName: 'Protected Wells / Springs',
//                         field: 'protected_wells',
//                         width:200

//                     },
//                     {
//                         headerName: 'Mobile Phone',
//                         field: 'mobile_phone',
//                         width:200

//                     },
//                     {
//                         headerName: 'Office desk',
//                         field: 'office_desk',
//                         width:200

//                     },
//                     {
//                         headerName: 'Cool boxes',
//                         field: 'cool_boxes',
//                         width:200

//                     },
//                     {
//                         headerName: 'Wi-Fi',
//                         field: 'wifi',
//                         width:200

//                     },
//                     {
//                         headerName: 'Remove offsite',
//                         field: 'remove_offsite',
//                         width:200

//                     },
//                     {
//                         headerName: 'X-Ray Machines',
//                         field: 'x_ray_machines',
//                         width:200

//                     },
//                     {
//                         headerName: 'Vaccine Carriers',
//                         field: 'vaccine_carriers',
//                         width:200

//                     },
//                     {
//                         headerName: 'Video Conferencing space',
//                         field: 'video_conferencing_space',
//                         width:200

//                     },
//                     {
//                         headerName: 'Pipped Oxygen',
//                         field: 'pipped_oxygen',
//                         width:200

//                     },
//                     {
//                         headerName: 'LAN',
//                         field: 'lan',
//                         width:200

//                     },
//                     {
//                         headerName: 'Piped Water',
//                         field: 'piped_water',
//                         width:200

//                     },
//                     {
//                         headerName: 'WAN (Internet connectivity)',
//                         field: 'wan',
//                         width:200

//                     },
//                     {
//                         headerName: 'Video Conferencing Facility',
//                         field: 'video_confrencing_facility',
//                         width:200

//                     },
//                     {
//                         headerName: 'Servers',
//                         field: 'servers',
//                         width:200

//                     },
//                     {
//                         headerName: 'Fridges',
//                         field: 'fridges',
//                         width:200

//                     },
//                     {
//                         headerName: 'Desktops',
//                         field: 'desktops',
//                         width:200

//                     },
//                     {
//                         headerName: 'Land Line',
//                         field: 'Handheld devices',
//                         width:200
//                     },
//                     {
//                         headerName: 'Bore Hole',
//                         field: 'bore_hole',
//                         width:200

//                     },
//                     {
//                         headerName: 'Earthen Road',
//                         field: 'eathen_road',
//                         width:200

//                     },



//                 ]
//             }
//         // CHU Status
//         case 7:

//             return {
//                 rows: props?.chul_status_all_hierachies?.map((
//                     {
//                         "Fully-functional": fully_functional,
//                         "Non-functional": non_functional,
//                         "facility__ward__sub_county__county__name": county,
//                         "Closed": closed,
//                         "facility__ward__name": ward,
//                         "semi-functional": semi_functional,
//                         "facility__ward__sub_county__name": sub_county

//                     },
//                     index
//                 ) => ({
//                     fully_functional,
//                     non_functional,
//                     county,
//                     closed,
//                     ward,
//                     semi_functional,
//                     sub_county,
//                     id:index
//                 })
//                 ) ?? [],

//                 columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         flex:1
//                     },
//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Fully-functional',
//                         field: 'fully_functional',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Semi-Functional',
//                         field: 'semi_functional',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Closed',
//                         field: 'closed',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Non-Functional',
//                         field: 'non_functional',
//                         flex:1
//                     }


//                 ]
//             }
//         // CHU Services
//         case 9:
//             return {
//                 rows: props?.chul_services_all_hierachies ?? [],
//                 columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         width:100
//                     },

//                     {
//                         headerName: 'Sub County',
//                         field: 'sub_county',
//                         width:100
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         width:100
//                     },
//                     {
//                         headerName: 'WASH: Water, sanitation and hygiene education, including hand washing"',
//                         field: 'wash_sanitation',
//                         width:200
//                     },
//                     {
//                         headerName: 'iCCM: Education on danger signs and referral for malaria, pneumonia and diarrhea',
//                         field: 'iccm',
//                         width:200
//                     },
//                     {
//                         headerName: 'WASH: Water treatment provision',
//                         field: 'wash_water_treatment',
//                         width:200
//                     },
//                     {
//                         headerName: 'HIV, TB and Malaria: Treatment defaulter tracing',
//                         field: 'hiv_tb_malaria_treatment',
//                         width:200
//                     },
//                     {
//                         headerName: 'HIV, TB and Malaria: Education, support for treatment adherence, and referral',
//                         field: 'hiv_tb_malaria_education',
//                         width:200
//                     },
//                     {
//                         headerName: 'iCCM: Provision of AL drugs to treat malaria',
//                         field: 'iccm_malaria_drugs',
//                         width:200
//                     },
//                     {
//                         headerName: 'HIV, TB and Malaria: Provision of condoms',
//                         field: 'hiv_tb_malaria_condoms',
//                         width:200
//                     },
//                     {
//                         headerName: 'Referrals to health facilities',
//                         field: 'referrals_health_facilities',
//                         width:200
//                     },
//                     {
//                         headerName: 'Provision of Information, Education & Communication (IEC) materials',
//                         field: 'provision_of_information',
//                         width:200
//                     },
//                     {
//                         headerName: 'iCCM: Rapid diagnostic testing of malaria',
//                         field: 'iccm_rapid_diagnostic',
//                         width:200
//                     },
//                     {
//                         headerName: 'Nutrition: Education, child growth monitoring, screening and referrals',
//                         field: 'nutrition_education',
//                         width:200
//                     },
//                     {
//                         headerName: 'MNCH: Education, counseling of mothers, and referral for ANC',
//                         field: 'mnch_education',
//                         width:200
//                     },
//                     {
//                         headerName: 'Deworming of children',
//                         field: 'deworming_children',
//                         width:200
//                     },
//                     {
//                         headerName: 'HIV, TB and Malaria: Provision of psychosocial support groups',
//                         field: 'hiv_tb_malaria_ppsg',
//                         width:200
//                     },
//                     {
//                         headerName: 'Management of diarrhea, injuries, wounds, jiggers and other minor illnesses.',
//                         field: 'mgmt_diarrhea',
//                         width:200
//                     },
//                     {
//                         headerName: 'NCD: Education and support for treatment adherence',
//                         field: 'ncd_eduaction',
//                         width:200
//                     },
//                     {
//                         headerName: 'HIV, TB and Malaria: Provision of home based care for PLWA',
//                         field: 'hiv_tb_malaria_provision',
//                         width:200
//                     },
//                     {
//                         headerName: 'First Aid Services',
//                         field: 'first_aid_services',
//                         width:200
//                     },
//                     {
//                         headerName: 'iCCM: Provision of Long Lasting Insecticide Treated Nets',
//                         field: 'iCCM_provision_long_lasting',
//                         width:200
//                     },
//                     {
//                         headerName: 'Growth monitoring for children under 5 years',
//                         field: 'growth_monitoring',
//                         width:200
//                     },
//                     {
//                         headerName: 'NCD: Diabetes and hypertension screening and referral',
//                         field: 'ncd_diabetes',
//                         width:200
//                     },
//                     {
//                         headerName: 'iCCM: Provision of antibiotics to treat pneumonia',
//                         field: 'iccm_antibiotics',
//                         width:200
//                     },
//                     {
//                         headerName: 'FP: Family planning and child spacing education',
//                         field: 'fp_child_spacing',
//                         width:200
//                     },
//                     {
//                         headerName: 'FP: Provision of, basic family planning commodities',
//                         field: 'fp_family_commodities',
//                         width:200
//                     },


//                 ]
//             }

//         // CHU Count
//         case 10:
//             return {
//                 rows: props?.chul_count_all_hierachies?.map((
//                     {
//                         "chvs": chv,
//                         "ward_name": ward,
//                         "county": county,
//                         "sub county": sub_county,
//                         "chews": chews,
//                         "number_of_units": number_of_units

//                     },
//                     index
//                 ) => ({
//                      chv,
//                      ward,
//                      county,
//                      sub_county,
//                      chews,
//                      number_of_units,
//                      id:index
//                 })
//                 ) ?? [],

//                 columns: [
    // {
    //     headerName: 'Date',
    //     field: 'date',
    //     flex: 1
    // }
//             ,        {
//                         headerName: formatString(orgUnitFilter),
//                         field: `${orgUnitFilter}`,
//                         flex:1
//                     },
//                     {
//                         headerName: 'Sub county',
//                         field: 'sub_county',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Ward',
//                         field: 'ward',
//                         flex:1
//                     },
//                     {
//                         headerName: 'CHVs',
//                         field: 'chv',
//                         flex:1
//                     },
//                     {
//                         headerName: 'Units',
//                         field: 'number_of_units',
//                         flex:1
//                     }



//                 ]
//             }
//         // Human resource
//         case 11:
//         return {
//             rows: props?.facility_human_resource_category_report_all_hierachies?.map((
//                 {

//                     facility_id__ward__sub_county__county__name: county,
//                     facility_id__ward__sub_county__name: sub_county,
//                     facility_id__ward__name: ward,
//                     'Clinical Officers': clinical_officers,
//                     'Dental staff': dental_staff,
//                     'Medical Engineering':mdeical_engineering,
//                     'Environmental Health': env_health,
//                     'Medical Officers & Specialists': medical_officer,
//                     'General Support Staffs': general_support_staffs,
//                     'ICT Office': ict_office,
//                     'Medical Laboratory': medical_laboratory,
//                     'Community Health Services': communty_health_services,
//                     'Pharmacy Staffs': pharmacy_staffs, 
//                     'Medical Social Work': medical_social_work,
//                     'Nurses and specialist': nurses_and_specailist,
//                     'Health Records and Information': health_records_and_info,
//                     'Health Promotion': health_promotion,
//                     'Clinical Psychology':	clinical_psychology,
//                     'Nutrition Services': nutrition_services,
//                     'Health Administrative Staffs': health_administrative_staffs,
//                     'Rehabilitative staff': rehabilitative_staff,
//                     'CLINICIANS': clinicians,
//                     'Diagnostics & Imaging': diagnostics_imaging,
//                     'Support Staff': support_staffs

//                 }, index) => ({
//                     county,
//                     sub_county,
//                     ward,
//                     clinical_officers,
//                     dental_staff,
//                     mdeical_engineering,
//                     env_health,
//                     medical_officer,
//                     general_support_staffs,
//                     ict_office,
//                     medical_laboratory,
//                     communty_health_services,
//                     pharmacy_staffs,
//                     medical_social_work,
//                     nurses_and_specailist,
//                     health_records_and_info,
//                     health_promotion,
//                     clinical_psychology,
//                     nutrition_services,
//                     health_administrative_staffs,
//                     rehabilitative_staff,
//                     clinicians,
//                     diagnostics_imaging,
//                     support_staffs,
//                     id:index
//                     })
//             ) ?? [],

// //             columns: [
//     {
//         headerName: 'Date',
//         field: 'date',
//         flex: 1
//     }
//             ,    {
//                     headerName: formatString(orgUnitFilter),
//                     field: `${orgUnitFilter}`,
//                     width:100
//                 },
//                 {
//                     headerName: 'Sub County',
//                     field: 'sub_county',
//                     width:100
//                 },
//                 {
//                     headerName: 'Ward',
//                     field: 'ward',
//                     width:100
//                 },
//                 {
//                     headerName: 'CLINICAL OFFICER',
//                     field: 'clinical_officers',
//                     width:200

//                 },
//                 {
//                     headerName: 'DENTAL STAFF',
//                     field: 'dental_staff',
//                     width:200
//                 },
//                 {
//                     headerName: 'MEDICAL ENGINEERING',
//                     field: 'mdeical_engineering',
//                     width:200

//                 },
//                 {
//                     headerName: 'ENVIROMENTAL HEALTH',
//                     field: 'env_health',
//                     width:200
//                 },
//                 {
//                     headerName: 'MEDICAL OFFICERS & SPECIALISTS',
//                     field: 'medical_officer',
//                     width:200

//                 },
//                 {
//                     headerName: 'GENERAL SUPPORT STAFF',
//                     field: 'general_support_staffs',
//                     width:200

//                 },
//                 {
//                     headerName: 'ICT OFFICER',
//                     field: 'ict_office',
//                     width:200
//                 },
//                 {
//                     headerName: 'MEDICAL LABORATORY',
//                     field: 'medical_laboratory',
//                     width:200

//                 },
//                 {
//                     headerName: 'COMMUNITY HEALTH SERVICES',
//                     field: 'communty_health_services',
//                     width:200

//                 },
//                 {
//                     headerName: 'PHARMACY STAFF',
//                     field: 'pharmacy_staffs',
//                     width:200

//                 },
//                 {
//                     headerName: 'MEDICAL SOCIAL WORK',
//                     field: 'medical_social_work',
//                     width:200

//                 },
//                 {
//                     headerName: 'NURSERS AND SPECIALIST',
//                     field: 'nurses_and_specailist',
//                     width:200

//                 },
//                 {
//                     headerName: 'HEALTH RECORDS AND INFORMATION',
//                     field: 'health_records_and_info',
//                     width:200

//                 },
//                 {
//                     headerName: 'HEALTH PROMOTION',
//                     field: 'health_promotion',
//                     width:200

//                 },
//                 {
//                     headerName: 'CLINICAL PYSCHOLOGY',
//                     field: 'clinical_psychology',

//                     width:200

//                 },
//                 {
//                     headerName: 'NUTRITION SERVICES',
//                     field: 'nutrition_services',
//                     width:200

//                 },
//                 {
//                     headerName: 'HEALTH ADMINISTRATIVE STAFF',
//                     field: 'health_administrative_staffs',
//                     width:200

//                 },
//                 {
//                     headerName: 'REHABILITATIVE STAFF',
//                     field: 'rehabilitative_staff',
//                     width:200

//                 },
//                 {
//                     headerName: 'CLINICIANS',
//                     field: 'clinicians',
//                     width:200

//                 },
//                 {
//                     headerName: 'SUPPORT STAFFS',
//                     field: 'support_staffs',
//                     width:200

//                 }


//             ]
//         }


//     }



// }

function formatString(str) {
    const fstr = str.replace(/[\s,'_']/, ",").split(",")

    if(fstr.length == 1) {
        return `${fstr[0][0].toUpperCase()}${fstr[0].substring(1)}`
    } else {
        const ffstr = fstr.map(w => {
           return `${w.substring(0,1).toUpperCase()}${w.substring(1)}`
        })
        

        return ffstr.toString().replace(",", " ")
    }
}


export function propsToGridData(props, index, orgUnitFilter = "county") {

    switch (index) {
        case 0:
            return {
                rows: Object.entries(props?.beds_and_cots_by_all_hierachies)?.map((result, index) => ({

                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    hdu_beds: result[1]?.total_hdu_beds,
                    icu_beds: result[1]?.total_icu_beds,
                    maternity_beds: result[1]?.total_maternity_beds,
                    inpatient_beds: result[1]?.total_inpatient_beds,
                    emergency_casualty_beds: result[1]?.total_emergency_casualty_beds,
                    cots: result[1]?.total_cots,
                    id: index
                })),
                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    
                    {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                    {
                        headerName: 'HDU Beds',
                        field: 'hdu_beds',
                        flex: 1
                    },
                    {
                        headerName: 'ICU Beds',
                        field: 'icu_beds',
                        flex: 1
                    },
                    {
                        headerName: 'Maternity Beds',
                        field: 'maternity_beds',
                        flex: 1
                    },
                    {
                        headerName: 'In-Patient Beds',
                        field: 'inpatient_beds',
                        flex: 1
                    },
                    {
                        headerName: 'Emergency Casualty Beds',
                        field: 'emergency_casualty_beds',
                        flex: 1
                    },
                    {
                        headerName: 'Cots',
                        field: 'cots',
                        flex: 1
                    }


                ]
            }
        case 1:
            return {
                rows: Object.entries(props?.facility_keph_level_report_all_hierachies)?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    level_2: result[1]?.Level_2,
                    level_3: result[1]?.Level_3,
                    level_4: result[1]?.Level_4,
                    level_5: result[1]?.Level_5,
                    level_6: result[1]?.Level_6,

                    id: index
                })),
                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    
                    {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                    {
                        headerName: 'Level 2',
                        field: 'level_2',
                        flex: 1
                    },
                    {
                        headerName: 'Level 3',
                        field: 'level_3',
                        flex: 1
                    },
                    {
                        headerName: 'Level 4',
                        field: 'level_4',
                        flex: 1
                    },
                    {
                        headerName: 'level 5',
                        field: 'level_5',
                        flex: 1
                    },
                    {
                        headerName: 'Level 6',
                        field: 'level_6',
                        flex: 1
                    }


                ]
            }
        case 2:
            return {
                rows: Object.entries(props?.facility_owner_report_all_hierachies)?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    moh: result[1]['Ministry_of_Health'],
                    private_practice: result[1]['Private_Practice'],
                    ngo: result[1]['Non-Governmental_Organizations'],
                    fbo: result[1]['Faith_Based_Organization'],
                    id: index
                })),
                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    
                    {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice',
                        field: 'private_practice',
                        flex: 1
                    },
                    {
                        headerName: 'Non Govermental Organisation',
                        field: 'ngo',
                        flex: 1
                    },
                    {
                        headerName: 'Faith Based Organisation',
                        field: 'fbo',
                        flex: 1
                    }

                ]
            }
        case 3:
            return {
                rows: Object.entries(props?.facility_type_report_all_hierachies)?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    medical_clinic: result[1]['MEDICAL_CLINIC'],
                    dispensary: result[1]['DISPENSARY'],
                    medical_center: result[1]['MEDICAL_CENTER'],
                    stand_alone: result[1]['STAND_ALONE'],
                    nursing_home: result[1]['NURSING_HOME'],
                    health_center: result[1]['HEALTH_CENTRE'],
                    hospitals: result[1]['HOSPITALS'],
                    id: index
                })),
                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    
                    {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                    {
                        headerName: 'MEDICAL CLINIC',
                        field: 'medical_clinic',
                        flex: 1
                    },
                    {
                        headerName: 'DISPENSARY',
                        field: 'dispensary',
                        flex: 1
                    },
                    {
                        headerName: 'MEDICAL CENTER',
                        field: 'medical_center',
                        flex: 1
                    },
                    {
                        headerName: 'STAND ALONE',
                        field: 'stand_alone',
                        flex: 1
                    },
                    {
                        headerName: 'NURSING HOME',
                        field: 'nursing_home',
                        flex: 1
                    },
                    {
                        headerName: 'HEALTH CENTER',
                        field: 'health_center',
                        flex: 1
                    },

                    {
                        headerName: 'HOSPITALS',
                        field: 'hospitals',
                        flex: 1
                    }

                ]
            }
        case 4:
            return {
                rows: Object.entries(props?.facility_regulatory_body_report_all_hierachies)?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    moh: result[1]['Ministry_of_Health'],
                    ppb: result[1]['Pharmacy_&_Poisons_Board'],
                    knrc: result[1]['Kenya_Nuclear_Regulatory_Council_(_Radiation_Board)'],
                    kmpdb: result[1]['Kenya_MPDB'],
                    nck: result[1]['Nursing_Council_of_Kenya_(Private_Practice)'],
                    kpb: result[1]['Kenya_Physiotherapy_Board'],
                    coc: result[1]['Clinical_Officers_Council'],
                    kmlttb: result[1]['Kenya_Medical_Laboratory,_Tech_&_Technologists_Board'],
                    kndi: result[1]['Kenya_Nutrition_and_Dietetic_Institute'],
                    other: result[1]['Other'],
                    id: index
                })),
                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    
                    {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                    {
                        headerName: 'Ministry of Health',
                        field: 'moh',
                        flex: 1
                    },
                    {
                        headerName: 'Pharmacy & Poisons Board',
                        field: 'ppb',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya Nuclear Regulatory Council ( Radiation Board)',
                        field: 'knrc',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya MPDB',
                        field: 'kmpdb',
                        flex: 1
                    },
                    {
                        headerName: 'Nursing Council of Kenya (Private Practice)',
                        field: 'nck',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya Physiotherapy Board',
                        field: 'kpb',
                        flex: 1
                    },

                    {
                        headerName: 'Clinical Officers Council',
                        field: 'coc',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya Medical Laboratory, Tech & Technologists Board',
                        field: 'kmlttb',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya Nutrition and Dietetic Institute',
                        field: 'kndi',
                        flex: 1
                    },
                    {
                        headerName: 'Other',
                        field: 'other',
                        flex: 1
                    }


                ]
            }
        case 5:
            return {
                rows: Object.entries(props?.facility_services_report_all_hierachies)?.map((result, index) =>
                ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    cat_emergency_prep: result[1]["EMERGENCY_PREPAREDNESS"],
                    cat_curative: result[1]["CURATIVE_SERVICES"],
                    cat_orthopaedic: result[1]["ORTHOPAEDIC_TECHNOLOGY_SERVICES"],
                    cat_immunisation: result[1]["IMMUNISATION"],
                    cat_antenatal_care: result[1]["ANTENATAL_CARE"],
                    cat_rehabilitation: result[1]["REHABILITATION_SERVICES"],
                    cat_tb: result[1]["TUBERCULOSIS_DIAGNOSIS"],
                    cat_cancer_screening: result[1]["CANCER_SCREENING"],
                    cat_renal: result[1]["RENAL_SERVICES"],
                    cat_newborn_care: result[1]["NEWBORN_CARE_SERVICE"],
                    cat_mortuary: result[1]["MORTUARY_SERVICES"],
                    cat_inpatient: result[1]["SPECIALIZED_IN-PATIENT_SERVICES"],
                    cat_icu: result[1]["ICU_SERVICES"],
                    cat_hiv: result[1]["HIV_TREATMENT"],
                    cat_postnatal_care: result[1]["POSTNATAL_CARE_SERVICES"],
                    cat_maternity: result[1]["MATERNITY_SERVICES"],
                    cat_nutrition: result[1]["NUTRITION_SERVICES"],
                    cat_fp: result[1]["FAMILY_PLANNING"],
                    cat_opthalmic: result[1]["OPHTHALMIC_SERVICES"],
                    cat_pharmacy: result[1]["PHARMACY_SERVICES"],
                    cat_mental_health: result[1]["MENTAL_HEALTH_SERVICES"],
                    cat_ent: result[1]["ENT"],
                    cat_inegrated_mgmt_childhood_illness: result[1]["INTEGRATED_MANAGEMENT_OF_CHILDHOOD_ILLNESS"],
                    cat_accident_casualty: result[1]["ACCIDENT_AND_EMERGENCY_CASUALTY_SERVICES"],
                    cat_hospice: result[1]["HOSPICE_SERVICE"],
                    cat_ambulatory: result[1]["AMBULATORY_SERVICES"],
                    cat_forensic: result[1]["FORENSIC_SERVICES"],
                    cat_specialized_outpatients: result[1]["SPECIALIZED_OUTPATIENTS_CLINIC"],
                    cat_leprosy_treatment: result[1]["LEPROSY_TREATMENT"],
                    cat_dental: result[1]["DENTAL_SERVICES"],
                    cat_tb_t: result[1]["TUBERCULOSIS_TREATMENTS"],
                    cat_radiology: result[1]["RADIOLOGY_AND_IMAGING"],
                    cat_oncology: result[1]["ONCOLOGY_SERVICES"],
                    cat_gender_based_violence: result[1]["SERVICES_FOR_GENDER_BASED_VIOLENCE_SURVIVORS"],
                    cat_leprosy: result[1]["LEPROSY_DIAGNOSIS"],
                    cat_lab_services: result[1]["LABORATORY_SERVICES"],
                    cat_blood: result[1]["BLOOD_SERVICES"],
                    cat_youth_friendly: result[1]["YOUTH_FRIENDLY_SERVICES"],
                    cat_high_dependecy: result[1]["HIGH_DEPENDENCY_SERVICES"],
                    cat_operating_theater: result[1]["OPERATING_THEATRES"],
                    id: index

                })),
                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        width: 100
                    },
                 
                 {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                       {
                        headerNpropsame: 'EMERGENCY PREPAREDNESS',
                        field: 'cat_emergency_prep',
                        width: 200

                    },
                    {
                        headerName: 'CURATIVE SERVICES',
                        field: 'cat_curative',
                        width: 200
                    },
                    {
                        headerName: 'ORTHOPAEDIC TECHNOLOGY SERVICES',
                        field: 'cat_orthopaedic',
                        width: 200

                    },
                    {
                        headerName: 'ANTENATAL CARE',
                        field: 'cat_antenatal_care',
                        width: 200
                    },
                    {
                        headerName: 'REHABILITATION SERVICES',
                        field: 'cat_rehabilitation',
                        width: 200

                    },
                    {
                        headerName: 'TUBERCULOSIS DIAGNOSIS',
                        field: 'cat_tb',
                        width: 200

                    },
                    {
                        headerName: 'CANCER SCREENING',
                        field: 'cat_cancer_screening',
                        width: 200
                    },
                    {
                        headerName: 'RENAL SERVICES',
                        field: 'cat_renal',
                        width: 200

                    },
                    {
                        headerName: 'NEWBORN CARE SERVICE',
                        field: 'cat_newborn_care',
                        width: 200

                    },
                    {
                        headerName: 'MORTUARY SERVICES',
                        field: 'cat_mortuary',
                        width: 200

                    },
                    {
                        headerName: 'SPECIALIZED IN-PATIENT SERVICES',
                        field: 'cat_inpatient',
                        width: 200

                    },
                    {
                        headerName: 'ICU SERVICES',
                        field: 'cat_icu',
                        width: 200

                    },
                    {
                        headerName: 'HIV TREATMENT',
                        field: 'cat_hiv',
                        width: 200

                    },
                    {
                        headerName: 'POSTNATAL CARE SERVICES',
                        field: 'cat_postnatal_care',
                        width: 200

                    },
                    {
                        headerName: 'MATERNITY SERVICES',
                        field: 'cat_maternity',
                        width: 200

                    },
                    {
                        headerName: 'NUTRITION SERVICES',
                        field: 'cat_nutrition',
                        width: 200

                    },
                    {
                        headerName: 'FAMILY PLANNING',
                        field: 'cat_fp',
                        width: 200

                    },
                    {
                        headerName: 'OPHTHALMIC SERVICES',
                        field: 'cat_opthalmic',
                        width: 200

                    },
                    {
                        headerName: 'PHARMACY SERVICES',
                        field: 'cat_pharmacy',
                        width: 200

                    },
                    {
                        headerName: 'MENTAL HEALTH SERVICES',
                        field: 'cat_mental_health',
                        width: 200

                    },
                    {
                        headerName: 'ENT',
                        field: 'cat_ent',
                        width: 200

                    },
                    {
                        headerName: 'INTEGRATED MANAGEMENT OF CHILDHOOD ILLNESS',
                        field: 'cat_inegrated_mgmt_childhood_illness',
                        width: 200

                    },
                    {
                        headerName: 'ACCIDENT AND EMERGENCY CASUALTY SERVICES',
                        field: 'cat_accident_casualty',
                        width: 200

                    },
                    {
                        headerName: 'HOSPICE SERVICE',
                        field: 'cat_hospice',
                        width: 200

                    },
                    {
                        headerName: 'AMBULATORY SERVICES',
                        field: 'cat_ambulatory',
                        width: 200

                    },
                    {
                        headerName: 'FORENSIC SERVICES',
                        field: 'cat_forensic',
                        width: 200

                    },
                    {
                        headerName: 'SPECIALIZED OUTPATIENTS CLINIC',
                        field: 'cat_specialized_outpatients',
                        width: 200

                    },
                    {
                        headerName: 'LEPROSY TREATMENT',
                        field: 'cat_leprosy_treatment',
                        width: 200

                    },
                    {
                        headerName: 'DENTAL SERVICES',
                        field: 'cat_dental',
                        width: 200

                    },
                    {
                        headerName: 'TUBERCULOSIS TREATMENTS',
                        field: 'cat_tb_t',
                        width: 200

                    },
                    {
                        headerName: 'RADIOLOGY AND IMAGING',
                        field: 'cat_radiology',
                        width: 200

                    },
                    {
                        headerName: 'ONCOLOGY SERVICES',
                        field: 'cat_oncology',
                        width: 200

                    },
                    {
                        headerName: 'SERVICES FOR GENDER BASED VIOLENCE SURVIVORS',
                        field: 'cat_gender_based_violence',
                        width: 200

                    },
                    {
                        headerName: 'LEPROSY DIAGNOSIS',
                        field: 'cat_leprosy',
                        width: 200

                    },
                    {
                        headerName: 'LABORATORY SERVICES',
                        field: 'cat_lab_services',
                        width: 200

                    },
                    {
                        headerName: 'BLOOD SERVICES',
                        field: 'cat_blood',
                        width: 200

                    },
                    {
                        headerName: 'YOUTH FRIENDLY SERVICES',
                        field: 'cat_youth_friendly',
                        width: 200

                    },
                    {
                        headerName: 'HIGH DEPENDENCY SERVICES',
                        field: 'cat_high_dependecy',
                        width: 200

                    },
                    {
                        headerName: 'OPERATING THEATRES',
                        field: 'cat_operating_theaters',
                        width: 200

                    },


                ]


            }
        case 6:

            return {
                rows: Object.entries(props?.facility_infrastructure_report_all_hierachies)?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    cat_ict_infrastructure: result[1]["ICT_INFRASTRUCTURE"],
                    cat_communications: result[1]["COMMUNICATIONS"],
                    cat_water_source: result[1]["WATER_SOURCE"],
                    cat_medical_equipment: result[1]["MEDICAL_EQUIPMENT"],
                    cat_power_source: result[1]["POWER_SOURCE"],
                    cat_access_road: result[1]["ACCESS_ROADS"],
                    cat_cold_chain: result[1]["COLD_CHAIN"],
                    cat_waste_medical: result[1]["MEDICAL_WASTE_MANAGEMENT"],
                    ultrasound_machines: result[1]["Ultrasound_Machines"],
                    dialysis_machines: result[1]["Dialysis_machines"],
                    generator: result[1]["Generator"],
                    back_ups: result[1]["Battery_Backups"],
                    furniture: result[1]["Furniture"],
                    oxygen_cylinder: result[1]["Oxygen_Cylinders"],
                    tv_screen: result[1]["TV_Screen"],
                    tarmac: result[1]["Tarmac"],
                    printers: result[1]["Printers"],
                    mri_machines: result[1]["MRI_Machines"],
                    teleconferencing_facility: result[1]["Teleconferencing_Facility"],
                    cold_room: result[1]["Cold_room"],
                    freezers: result[1]["Freezers"],
                    gravel: result[1]["Gravel"],
                    open_burning: result[1]["Open_burning"],
                    dump_without_burning: result[1]["Dump_without_burning"],
                    routers: result[1]["Routers"],
                    gas: result[1]["Gas"],
                    murrum: result[1]["Graded_(_Murrum_)"],
                    ventilators: result[1]["Ventilators"],
                    scanners: result[1]["Scanners"],
                    laptops: result[1]["Laptops"],
                    boiler: result[1]["Boiler"],
                    solar: result[1]["Solar"],
                    wireless_mobile: result[1]["Wireless_Mobile"],
                    ct_scan_machines: result[1]["CT_Scan_Machines"],
                    incinerator: result[1]["Incinerator"],
                    main_grid: result[1]["Main_Grid"],
                    sewer_system: result[1]["Sewer_system"],
                    radio_call: result[1]["Radio_Call"],
                    oxygen_plant: result[1]["Oxygen_Plant"],
                    bio_gas: result[1]["Bio-Gas"],
                    roof_harvested_water: result[1]["Roof_Harvested_Water"],
                    river_dam_lake: result[1]["River_/_Dam_/_Lake"],
                    protected_wells: result[1]["Protected_Wells_/_Springs"],
                    mobile_phone: result[1]["Mobile_Phone"],
                    office_desk: result[1]["Office_desk"],
                    cool_boxes: result[1]["Cool_boxes"],
                    wifi: result[1]["Wi-Fi"],
                    remove_offsite: result[1]["Remove_offsite"],
                    x_ray_machines: result[1]["X-Ray_Machines"],
                    vaccine_carriers: result[1]["Vaccine_Carriers"],
                    donkey_cart: result[1]["Donkey_Cart_/_Vendor"],
                    video_conferencing_space: result[1]["Video_Conferencing_space"],
                    pipped_oxygen: result[1]["Pipped_Oxygen"],
                    lan: result[1]["LAN"],
                    piped_water: result[1]["Piped_Water"],
                    wan: result[1]["WAN_(Internet_connectivity)"],
                    video_confrencing_facility: result[1]["Video_Conferencing_Facility"],
                    servers: result[1]["Servers"],
                    fridges: result[1]["Fridges"],
                    desktops: result[1]["Desktops"],
                    land_line: result[1]["Land_Line"],
                    handhedl_devices: result[1]["Handheld_devices"],
                    bore_hole: result[1]["Bore_Hole"],
                    eathen_roa: result[1]["Earthen_Road"],
                    id: index

                })),

                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        width: 100
                    },
                 
                 {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                       {
                        headerName: 'ICT INFRASTRUCTURE',
                        field: 'cat_ict_infrastructure',
                        width: 200

                    },
                    {
                        headerName: 'COMMUNICATIONS',
                        field: 'cat_communications',
                        width: 200
                    },
                    {
                        headerName: 'WATER SOURCE',
                        field: 'cat_water_source',
                        width: 200

                    },
                    {
                        headerName: 'MEDICAL EQUIPMENT',
                        field: 'cat_medical_equipment',
                        width: 200
                    },
                    {
                        headerName: 'POWER SOURCE',
                        field: 'cat_power_source',
                        width: 200

                    },
                    {
                        headerName: 'ACCESS ROADS',
                        field: 'cat_access_road',
                        width: 200

                    },
                    {
                        headerName: 'COLD CHAIN',
                        field: 'cat_cold_chain',
                        width: 200
                    },
                    {
                        headerName: 'MEDICAL WASTE MANAGEMENT',
                        field: 'cat_waste_medical',
                        width: 200

                    },
                    {
                        headerName: 'Dialysis machines',
                        field: 'dialysis_machines',
                        width: 200

                    },
                    {
                        headerName: 'Ultrasound Machines',
                        field: 'ultrasound_machines',
                        width: 200

                    },

                    {
                        headerName: 'Generator',
                        field: 'generator',
                        width: 200

                    },
                    {
                        headerName: 'Battery Backups',
                        field: 'back_ups',
                        width: 200

                    },

                    {
                        headerName: 'Furniture',
                        field: 'furniture',
                        width: 200

                    },
                    {
                        headerName: 'TV Screen',
                        field: 'tv_screen',
                        width: 200

                    },
                    {
                        headerName: 'Tarmac',
                        field: 'tarmac',
                        width: 200

                    },

                    {
                        headerName: 'Printers',
                        field: 'printers',
                        width: 200

                    },
                    {
                        headerName: 'MRI Machines',
                        field: 'mri_machines',
                        width: 200

                    },
                    {
                        headerName: 'Cold room',
                        field: 'cold_room',
                        width: 200

                    },
                    {
                        headerName: 'Freezers',
                        field: 'freezers',
                        width: 200

                    },
                    {
                        headerName: 'Gravel',
                        field: 'gravel',
                        width: 200

                    },
                    {
                        headerName: 'Open burning',
                        field: 'open_burning',
                        width: 200

                    },
                    {
                        headerName: 'Dump without burning',
                        field: 'dump_without_burning',
                        width: 200

                    },
                    {
                        headerName: 'Routers',
                        field: 'routers',
                        width: 200

                    },
                    {
                        headerName: 'Gas',
                        field: 'gas',
                        width: 200

                    },
                    {
                        headerName: 'Graded ( Murrum )',
                        field: 'murrum',
                        width: 200

                    },
                    {
                        headerName: 'Ventilators',
                        field: 'ventilators',
                        width: 200

                    },
                    {
                        headerName: 'Scanners',
                        field: 'scanners',
                        width: 200

                    },
                    {
                        headerName: 'Laptops',
                        field: 'laptops',
                        width: 200

                    },
                    {
                        headerName: 'Boiler',
                        field: 'boiler',
                        width: 200

                    },
                    {
                        headerName: 'Solar',
                        field: 'solar',
                        width: 200

                    },
                    {
                        headerName: 'Wireless Mobile',
                        field: 'wireless_mobile',
                        width: 200

                    },
                    {
                        headerName: 'CT Scan Machines',
                        field: 'ct_scan_machines',
                        width: 200

                    },
                    {
                        headerName: 'Incinerator',
                        field: 'incinerator',
                        width: 200

                    },
                    {
                        headerName: 'Main Grid',
                        field: 'main_grid',
                        width: 200

                    },
                    {
                        headerName: 'Sewer system',
                        field: 'sewer_system',
                        width: 200

                    },
                    {
                        headerName: 'Oxygen Plant',
                        field: 'oxygen_plant',
                        width: 200

                    },
                    {
                        headerName: 'Bio-Gas',
                        field: 'bio_gas',
                        width: 200

                    },
                    {
                        headerName: 'Roof Harvested Water',
                        field: 'roof_harvested_water',
                        width: 200

                    },
                    {
                        headerName: 'River / Dam / Lake',
                        field: 'river_dam_lake',
                        width: 200

                    },
                    {
                        headerName: 'Protected Wells / Springs',
                        field: 'protected_wells',
                        width: 200

                    },
                    {
                        headerName: 'Mobile Phone',
                        field: 'mobile_phone',
                        width: 200

                    },
                    {
                        headerName: 'Office desk',
                        field: 'office_desk',
                        width: 200

                    },
                    {
                        headerName: 'Cool boxes',
                        field: 'cool_boxes',
                        width: 200

                    },
                    {
                        headerName: 'Wi-Fi',
                        field: 'wifi',
                        width: 200

                    },
                    {
                        headerName: 'Remove offsite',
                        field: 'remove_offsite',
                        width: 200

                    },
                    {
                        headerName: 'X-Ray Machines',
                        field: 'x_ray_machines',
                        width: 200

                    },
                    {
                        headerName: 'Vaccine Carriers',
                        field: 'vaccine_carriers',
                        width: 200

                    },
                    {
                        headerName: 'Video Conferencing space',
                        field: 'video_conferencing_space',
                        width: 200

                    },
                    {
                        headerName: 'Pipped Oxygen',
                        field: 'pipped_oxygen',
                        width: 200

                    },
                    {
                        headerName: 'LAN',
                        field: 'lan',
                        width: 200

                    },
                    {
                        headerName: 'Piped Water',
                        field: 'piped_water',
                        width: 200

                    },
                    {
                        headerName: 'WAN (Internet connectivity)',
                        field: 'wan',
                        width: 200

                    },
                    {
                        headerName: 'Video Conferencing Facility',
                        field: 'video_confrencing_facility',
                        width: 200

                    },
                    {
                        headerName: 'Servers',
                        field: 'servers',
                        width: 200

                    },
                    {
                        headerName: 'Fridges',
                        field: 'fridges',
                        width: 200

                    },
                    {
                        headerName: 'Desktops',
                        field: 'desktops',
                        width: 200

                    },
                    {
                        headerName: 'Land Line',
                        field: 'Handheld devices',
                        width: 200
                    },
                    {
                        headerName: 'Bore Hole',
                        field: 'bore_hole',
                        width: 200

                    },
                    {
                        headerName: 'Earthen Road',
                        field: 'eathen_road',
                        width: 200

                    }



                ]
            }

        case 7:
            return {
                rows: Object.entries(props?.facility_human_resource_category_report_all_hierachies)?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    clinical_officers: result[1]["Clinical_Officers"],
                    dental_staff: result[1]["Dental_staff"],
                    mdeical_engineering: result[1]["Medical_Engineering"],
                    env_health: result[1]["Environmental_Health"],
                    medical_officer: result[1]["Medical_Officers_&_Specialists"],
                    general_support_staffs: result[1]["General_Support_Staffs"],
                    ict_office: result[1]["ICT_Office"],
                    medical_laboratory: result[1]["Medical_Laboratory"],
                    communty_health_services: result[1]["Community_Health_Services"],
                    pharmacy_staffs: result[1]["Pharmacy_Staffs"],
                    medical_social_work: result[1]["Medical_Social_Work"],
                    nurses_and_specailist: result[1]["Nurses_and_specialist"],
                    health_records_and_info: result[1]["Health_Records_and_Information"],
                    health_promotion: result[1]["Health_Promotion"],
                    clinical_psychology: result[1]["Clinical_Psychology"],
                    nutrition_services: result[1]["Nutrition_Services"],
                    health_administrative_staffs: result[1]["Health_Administrative_Staffs"],
                    rehabilitative_staff: result[1]["Rehabilitative_staff"],
                    // clinicians: result[1]["CLINICIANS"],
                    diagnostics_imaging: result[1]["Diagnostics_&_Imaging"],
                    support_staff: result[1]["Support_Staff"],
                    id: index
                })),

                columns: [
                    
                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        width: 100
                    },
                 
                 {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                       {
                        headerName: 'CLINICAL OFFICER',
                        field: 'clinical_officers',
                        width:200
                    
                    },
                    {
                        headerName: 'DENTAL STAFF',
                        field: 'dental_staff',
                        width:200
                    },
                    {
                        headerName: 'MEDICAL ENGINEERING',
                        field: 'mdeical_engineering',
                        width:200
                    
                    },
                    {
                        headerName: 'ENVIROMENTAL HEALTH',
                        field: 'env_health',
                        width:200
                    },
                    {
                        headerName: 'MEDICAL OFFICERS & SPECIALISTS',
                        field: 'medical_officer',
                        width:200
                    
                    },
                    {
                        headerName: 'GENERAL SUPPORT STAFF',
                        field: 'general_support_staffs',
                        width:200
                    
                    },
                    {
                        headerName: 'ICT OFFICER',
                        field: 'ict_office',
                        width:200
                    },
                    {
                        headerName: 'MEDICAL LABORATORY',
                        field: 'medical_laboratory',
                        width:200
                    
                    },
                    {
                        headerName: 'COMMUNITY HEALTH SERVICES',
                        field: 'communty_health_services',
                        width:200
                    
                    },
                    {
                        headerName: 'PHARMACY STAFF',
                        field: 'pharmacy_staffs',
                        width:200
                    
                    },
                    {
                        headerName: 'MEDICAL SOCIAL WORK',
                        field: 'medical_social_work',
                        width:200
                    
                    },
                    {
                        headerName: 'NURSERS AND SPECIALIST',
                        field: 'nurses_and_specailist',
                        width:200
                    
                    },
                    {
                        headerName: 'HEALTH RECORDS AND INFORMATION',
                        field: 'health_records_and_info',
                        width:200
                    
                    },
                    {
                        headerName: 'HEALTH PROMOTION',
                        field: 'health_promotion',
                        width:200
                    
                    },
                    {
                        headerName: 'CLINICAL PYSCHOLOGY',
                        field: 'clinical_psychology',
                    
                        width:200
                    
                    },
                    {
                        headerName: 'NUTRITION SERVICES',
                        field: 'nutrition_services',
                        width:200
                    
                    },
                    {
                        headerName: 'HEALTH ADMINISTRATIVE STAFF',
                        field: 'health_administrative_staffs',
                        width:200
                    
                    },
                    {
                        headerName: 'REHABILITATIVE STAFF',
                        field: 'rehabilitative_staff',
                        width:200
                    
                    },
                    // {
                    //     headerName: 'CLINICIANS',
                    //     field: 'clinicians',
                    //     width:200
                    
                    // },
                    {
                        headerName: 'SUPPORT STAFFS',
                        field: 'support_staff',
                        width:200
                    
                    }
                    
                ]

            }

        case 8:
            return {
                rows: Object.entries(props?.gis)?.map(([key, value], index) => ({
                    sub_county: key,
                    facility_name: value?.map(({facility_name}) =>  facility_name)[0],
                    facility_code: value?.map(({facility_code}) =>  facility_code)[0],
                    facility_long: value?.map(({facility_long}) =>  facility_long)[0],
                    facility_lat: value?.map(({facility_lat}) =>  facility_lat)[0],
                    id:index
                })),

                columns: [
                    
                    {
                        headerName: 'Sub County',
                        field: 'sub_county',
                        flex: 1

                    },
                     {
                        headerName: 'Date',
                        field: 'date',
                        flex: 1
                    },
                    {
                          headerName: 'Facility Name',
                        field: 'facility_name',
                        flex: 1
                    },
                    {
                        headerName: 'Facility Code',
                        field: 'facility_code',
                        flex: 1

                    },
                    {
                        headerName: 'Latitude',
                        field: 'facility_lat',
                        flex: 1

                    },
                    {
                        headerName: 'Longitude',
                        field: 'facility_long',
                        flex: 1

                    }

                ]

            }   
    }
} 
