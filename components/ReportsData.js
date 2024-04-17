// import { OtherHouses } from "@mui/icons-material";



function formatString(str) {
    const fstr = str.replace(/[\s,'_']/, ",").split(",")

    if (fstr.length == 1) {
        return `${fstr[0][0].toUpperCase()}${fstr[0].substring(1)}`
    } else {
        const ffstr = fstr.map(w => {
            return `${w.substring(0, 1).toUpperCase()}${w.substring(1)}`
        })


        return ffstr.toString().replace(",", " ")
    }
}


export function propsToGridData(props, index, orgUnitFilter = "county") {
    let isKeph, isOwner, isType, isCHUstatus = false;

    switch (index) {
        case 0:
            return {
                rows: Object.entries(props?.beds_and_cots_by_all_hierachies ?? {})?.map((result, index) => ({

                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    total_beds: result[1]?.total_beds,
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
                        headerName: 'Total Beds',
                        field: 'total_beds',
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
                rows: Object.entries(props?.facility_keph_level_report_all_hierachies ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.year_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    flex: 1
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    flex: 1
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    flex: 1
                                }
                            ]
                        }

                        return []

                    })(),
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
                rows: Object.entries(props?.facility_owner_report_all_hierachies ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    flex: 1
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    flex: 1
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    flex: 1
                                }
                            ]
                        }

                        return []

                    })()
                    ,
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
                rows: Object.entries(props?.facility_type_report_all_hierachies ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    flex: 1
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    flex: 1
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    flex: 1
                                }
                            ]
                        }

                        return []

                    })()
                    ,
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
                rows: Object.entries(props?.facility_regulatory_body_report_all_hierachies ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    flex: 1
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    flex: 1
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    flex: 1
                                }
                            ]
                        }

                        return []

                    })()
                    ,
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
                rows: Object.entries(props?.facility_services_report_all_hierachies ?? {})?.map((result, index) =>
                ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.facility__date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                        width: 200
                    },

                    {
                        headerName: 'Date',
                        field: 'date',
                        width: 200
                    },
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    width: 200
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    width: 200
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    width: 200
                                }
                            ]
                        }

                        return []

                    })(),
                    {
                        headerName: 'EMERGENCY PREPAREDNESS',
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
                rows: Object.entries(props?.facility_infrastructure_report_all_hierachies?.results_bycategory ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.facility__date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
                    cat_ict_infrastructure: result[1]["ICT_INFRASTRUCTURE"],
                    cat_communications: result[1]["COMMUNICATIONS"],
                    cat_water_source: result[1]["WATER_SOURCE"],
                    cat_medical_equipment: result[1]["MEDICAL_EQUIPMENT"],
                    cat_power_source: result[1]["POWER_SOURCE"],
                    cat_access_road: result[1]["ACCESS_ROADS"],
                    cat_cold_chain: result[1]["COLD_CHAIN"],
                    cat_waste_medical: result[1]["MEDICAL_WASTE_MANAGEMENT"],
                    id: index

                })),

                columns: [

                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        width: 200
                    },

                    {
                        headerName: 'Date',
                        field: 'date',
                        width: 200
                    },
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    width: 200
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    width: 200
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    width: 200
                                }
                            ]
                        }

                        return []

                    })()
                    ,
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

                    }



                ]
            }
        case 7:

            return {
                rows: Object.entries(props?.facility_infrastructure_report_all_hierachies?.results ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.facility__date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                        width: 200
                    },

                    {
                        headerName: 'Date',
                        field: 'date',
                        width: 200
                    },
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    width: 200
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    width: 200
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    width: 200
                                }
                            ]
                        }

                        return []

                    })()
                    ,
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
        case 8:
            return {
                rows: Object.entries(props?.facility_human_resource_category_report_all_hierachies?.results_bycategory ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]?.facility__date_established,
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
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
                        width: 200
                    },

                    {
                        headerName: 'Date',
                        field: 'date',
                        width: 200
                    },
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    width: 200
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    width: 200
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    width: 200
                                }
                            ]
                        }

                        return []

                    })(),
                    {
                        headerName: 'CLINICAL OFFICER',
                        field: 'clinical_officers',
                        width: 200

                    },
                    {
                        headerName: 'DENTAL STAFF',
                        field: 'dental_staff',
                        width: 200
                    },
                    {
                        headerName: 'MEDICAL ENGINEERING',
                        field: 'mdeical_engineering',
                        width: 200

                    },
                    {
                        headerName: 'ENVIROMENTAL HEALTH',
                        field: 'env_health',
                        width: 200
                    },
                    {
                        headerName: 'MEDICAL OFFICERS & SPECIALISTS',
                        field: 'medical_officer',
                        width: 200

                    },
                    {
                        headerName: 'GENERAL SUPPORT STAFF',
                        field: 'general_support_staffs',
                        width: 200

                    },
                    {
                        headerName: 'ICT OFFICER',
                        field: 'ict_office',
                        width: 200
                    },
                    {
                        headerName: 'MEDICAL LABORATORY',
                        field: 'medical_laboratory',
                        width: 200

                    },
                    {
                        headerName: 'COMMUNITY HEALTH SERVICES',
                        field: 'communty_health_services',
                        width: 200

                    },
                    {
                        headerName: 'PHARMACY STAFF',
                        field: 'pharmacy_staffs',
                        width: 200

                    },
                    {
                        headerName: 'MEDICAL SOCIAL WORK',
                        field: 'medical_social_work',
                        width: 200

                    },
                    {
                        headerName: 'NURSERS AND SPECIALIST',
                        field: 'nurses_and_specailist',
                        width: 200

                    },
                    {
                        headerName: 'HEALTH RECORDS AND INFORMATION',
                        field: 'health_records_and_info',
                        width: 200

                    },
                    {
                        headerName: 'HEALTH PROMOTION',
                        field: 'health_promotion',
                        width: 200

                    },
                    {
                        headerName: 'CLINICAL PYSCHOLOGY',
                        field: 'clinical_psychology',

                        width: 200

                    },
                    {
                        headerName: 'NUTRITION SERVICES',
                        field: 'nutrition_services',
                        width: 200

                    },
                    {
                        headerName: 'HEALTH ADMINISTRATIVE STAFF',
                        field: 'health_administrative_staffs',
                        width: 200

                    },
                    {
                        headerName: 'REHABILITATIVE STAFF',
                        field: 'rehabilitative_staff',
                        width: 200

                    },
                    // {
                    //     headerName: 'CLINICIANS',
                    //     field: 'clinicians',
                    //     width:200

                    // },
                    {
                        headerName: 'SUPPORT STAFFS',
                        field: 'support_staff',
                        width: 200

                    }

                ]

            }
        case 9:
            return {
                rows: Object.entries(props?.facility_human_resource_category_report_all_hierachies?.results ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    date: result[1]['facility__date_established'],
                    ...(() => {

                        if (result[1]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1]?.facility_keph_level }
                        }

                        if (result[1]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1]?.facility_owner }
                        }

                        if (result[1]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1]?.facility_type }
                        }

                        return {}

                    })(),
                    "Accidents_&_Emergency_Nurse": result[1]["Accidents_&_Emergency_Nurse"],
                    Rheumatologist: result[1]["Rheumatologist"],
                    "Nutrition_&_Dietetic_Technologist": result[1]["Nutrition_&_Dietetic_Technologist"],
                    Pharmaceutical_Technologist: result[1]["Pharmaceutical_Technologist"],
                    Supply_Chain_Assistant: result[1]["Supply_Chain_Assistant"],
                    "Obs/Gyne_Specialist": result[1]["Obs/Gyne_Specialist"],
                    Plaster_Technicians: result[1]["Plaster_Technicians"],
                    Patient_Attendants: result[1]["Patient_Attendants"],
                    Dental_Radiographer: result[1]["Dental_Radiographer"],
                    Urological_Surgeon: result[1]["Urological_Surgeon"],
                    Paediatric_Surgeon: result[1]["Paediatric_Surgeon"],
                    Palliative_Care_Specialist: result[1]["Palliative_Care_Specialist"],
                    Neonatologist: result[1]["Neonatologist"],
                    Orthodontist: result[1]["Orthodontist"],
                    Health_Records_and_Information_Managers: result[1]["Health_Records_and_Information_Managers"],
                    "Nutrition_&_Dietetic_Officer": result[1]["Nutrition_&_Dietetic_Officer"],
                    Mammographer: result[1]["Mammographer"],
                    KECHN: result[1]["KECHN"],
                    Radiologists: result[1]["Radiologists"],
                    Occupational_Therapist: result[1]["Occupational_Therapist"],
                    Medical_Laboratory_Technician: result[1]["Medical_Laboratory_Technician"],
                    Dermatologists: result[1]["Dermatologists"],
                    Health_Records_and_Information_Officer: result[1]["Health_Records_and_Information_Officer"],
                    "Radiation_Monitoring_&_Safety_Officer": result[1]["Radiation_Monitoring_&_Safety_Officer"],
                    Dental_Technologists: result[1]["Dental_Technologists"],
                    Forensic_Psychiatrist: result[1]["Forensic_Psychiatrist"],
                    Theater_Nurses: result[1]["Theater_Nurses"],
                    Oncology_Pharmacist: result[1]["Oncology_Pharmacist"],
                    Opthamologist: result[1]["Opthamologist"],
                    Oncologist: result[1]["Oncologist"],
                    Critical_Care_Nursing: result[1]["Critical_Care_Nursing"],
                    Paediatric_Nephrologist: result[1]["Paediatric_Nephrologist"],
                    Paeditrician: result[1]["Paeditrician"],
                    Public_Health_Technician: result[1]["Public_Health_Technician"],
                    CO_Reproductive_Health: result[1]["CO_Reproductive_Health"],
                    "CO_Dermatology/_Venereology": result[1]["CO_Dermatology/_Venereology"],
                    Paediatric_Dentist: result[1]["Paediatric_Dentist"],
                    "Nutrition_&_Dietetic_Technician": result[1]["Nutrition_&_Dietetic_Technician"],
                    Psychiatrist_Nurse: result[1]["Psychiatrist_Nurse"],
                    Nephrologist: result[1]["Nephrologist"],
                    General_Surgeon: result[1]["General_Surgeon"],
                    Public_Health_Officers: result[1]["Public_Health_Officers"],
                    Anaesthetist_Nurse: result[1]["Anaesthetist_Nurse"],
                    "Neuro-Surgeons": result[1]["Neuro-Surgeons"],
                    Public_Health_Physician: result[1]["Public_Health_Physician"],
                    Paediatric_Endocrinologist: result[1]["Paediatric_Endocrinologist"],
                    Community_Psychiatrist: result[1]["Community_Psychiatrist"],
                    "Clinical_Officer_ENT/Audiology": result[1]["Clinical_Officer_ENT/Audiology"],
                    General_Medical_Officers: result[1]["General_Medical_Officers"],
                    Casuals: result[1]["Casuals"],
                    Cleaners: result[1]["Cleaners"],
                    physiologist: result[1]["physiologist"],
                    Clinical_psychologists: result[1]["Clinical_psychologists"],
                    Security: result[1]["Security"],
                    "Specialist_Physician_(Internist)": result[1]["Specialist_Physician_(Internist)"],
                    Medical_Social_Worker: result[1]["Medical_Social_Worker"],
                    Dental_Officers: result[1]["Dental_Officers"],
                    Health_Economist: result[1]["Health_Economist"],
                    Therapy_Radiographer: result[1]["Therapy_Radiographer"],
                    Health_Promotion_Officers: result[1]["Health_Promotion_Officers"],
                    Cardiology_Nurse: result[1]["Cardiology_Nurse"],
                    Health_Administrative_Officers: result[1]["Health_Administrative_Officers"],
                    "CT_Scan_/MRI_Radiographer": result[1]["CT_Scan_/MRI_Radiographer"],
                    Mortuary_Attendant: result[1]["Mortuary_Attendant"],
                    Pharmacist: result[1]["Pharmacist"],
                    Secretaries: result[1]["Secretaries"],
                    facility__date_established: result[1]["facility__date_established"],
                    Pathologist: result[1]["Pathologist"],
                    BSN_Nurse: result[1]["BSN_Nurse"],
                    Ophthalmic_Nurse: result[1]["Ophthalmic_Nurse"],
                    CO_Paediatrics: result[1]["CO_Paediatrics"],
                    Human_Resource_Management_Officer: result[1]["Human_Resource_Management_Officer"],
                    CO_Orthopaedics: result[1]["CO_Orthopaedics"],
                    Nuclear_Medicine_Technologist: result[1]["Nuclear_Medicine_Technologist"],
                    Critical_Care_Physician: result[1]["Critical_Care_Physician"],
                    Cateress: result[1]["Cateress"],
                    Medical_Engineering_Technician: result[1]["Medical_Engineering_Technician"],
                    Gastroentologist: result[1]["Gastroentologist"],
                    dddd: result[1]["dddd"],
                    Kenya_Registered_Nurse: result[1]["Kenya_Registered_Nurse"],
                    Oromaxillofacial_Surgeon: result[1]["Oromaxillofacial_Surgeon"],
                    ENT_surgeon: result[1]["ENT_surgeon"],
                    Medical_Engineers: result[1]["Medical_Engineers"],
                    "Community_Health_Volunteers(CHV)": result[1]["Community_Health_Volunteers(CHV)"],
                    Health_Records_and_Information_Technician: result[1]["Health_Records_and_Information_Technician"],
                    Registered_Midwives: result[1]["Registered_Midwives"],
                    "Clinical_Officer_Lung_&_Skin": result[1]["Clinical_Officer_Lung_&_Skin"],
                    Medical_Laboratory_Technologists: result[1]["Medical_Laboratory_Technologists"],
                    Plaster_Technologists: result[1]["Plaster_Technologists"],
                    Enrolled_Nurse: result[1]["Enrolled_Nurse"],
                    "CO_Ophthalmology/Cataract_Surgery": result[1]["CO_Ophthalmology/Cataract_Surgery"],
                    Specialized_Physiotherapists: result[1]["Specialized_Physiotherapists"],
                    Cardiologist: result[1]["Cardiologist"],
                    ICT_Officer: result[1]["ICT_Officer"],
                    Supply_Chain_Officer: result[1]["Supply_Chain_Officer"],
                    Optiometrist: result[1]["Optiometrist"],
                    "CO_Psychiatry/Mental_Health": result[1]["CO_Psychiatry/Mental_Health"],
                    Drivers: result[1]["Drivers"],
                    Medical_Engineering_Technologists: result[1]["Medical_Engineering_Technologists"],
                    Cooks: result[1]["Cooks"],
                    ddds: result[1]["ddds"],
                    Medical_Endocrinologist: result[1]["Medical_Endocrinologist"],
                    KRCHN: result[1]["KRCHN"],
                    Paediatric_Neurologist: result[1]["Paediatric_Neurologist"],
                    BSc_Physiotherapy: result[1]["BSc_Physiotherapy"],
                    Ultrasonographer: result[1]["Ultrasonographer"],
                    Psychiatrist: result[1]["Psychiatrist"],
                    Cardiothoracic_Surgeon: result[1]["Cardiothoracic_Surgeon"],
                    Dental_Nurse: result[1]["Dental_Nurse"],
                    "Child_&_Adolescent_Psychiatrist": result[1]["Child_&_Adolescent_Psychiatrist"],
                    Accountants: result[1]["Accountants"],
                    Oncology_Nurse: result[1]["Oncology_Nurse"],
                    Clerks: result[1]["Clerks"],
                    Orthopaedic_Surgeon: result[1]["Orthopaedic_Surgeon"],
                    "CO_Oncology/Palli--ative_Care": result[1]["CO_Oncology/Palli--ative_Care"],
                    "Plastic_Surgeon(Recon-structive)": result[1]["Plastic_Surgeon(Recon-structive)"],
                    Orthopaedic_Technologist: result[1]["Orthopaedic_Technologist"],
                    Paediatric_Nurse: result[1]["Paediatric_Nurse"],
                    "General_Clinical_Officers(Diploma)": result[1]["General_Clinical_Officers(Diploma)"],
                    Neurologist: result[1]["Neurologist"],
                    Oromaxillofacial_Anesthesiologist: result[1]["Oromaxillofacial_Anesthesiologist"],
                    "Community_Health_Extension/Assistants": result[1]["Community_Health_Extension/Assistants"],
                    General_Physiotherapist: result[1]["General_Physiotherapist"],
                    Clinical_pharmacist: result[1]["Clinical_pharmacist"],
                    General_Radiographer: result[1]["General_Radiographer"],
                    Palliative_Care_Nurse: result[1]["Palliative_Care_Nurse"],
                    Community_Oral_Health_Officers: result[1]["Community_Oral_Health_Officers"],
                    Forensic_Nurse: result[1]["Forensic_Nurse"],
                    Sign_Language_Nurse: result[1]["Sign_Language_Nurse"],
                    "Nephrology_Nurse": result[1]["Nephrology_Nurse"],
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
                        width: 100
                    },
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    width: 100
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    width: 100
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    width: 100
                                }
                            ]
                        }

                        return []

                    })(),
                    {
                        headerName: 'Accidents  &_Emergency_Nurse',
                        field: 'Accidents_&_Emergency_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Rheumatologist',
                        field: 'Rheumatologist',
                        width: 100
                    },
                    {
                        headerName: 'Nutrition  &_Dietetic_Technologist',
                        field: 'Nutrition_&_Dietetic_Technologist',
                        width: 100
                    },
                    {
                        headerName: 'Pharmaceutical Technologist',
                        field: 'Pharmaceutical_Technologist',
                        width: 100
                    },
                    {
                        headerName: 'Supply Chain  Assistant',
                        field: 'Supply_Chain_Assistant',
                        width: 100
                    },
                    {
                        headerName: 'Obs/Gyne_Specialist',
                        field: 'Obs/Gyne_Specialist',
                        width: 100
                    },
                    {
                        headerName: 'Plaster Technicians',
                        field: 'Plaster_Technicians',
                        width: 100
                    },
                    {
                        headerName: 'Patient Attendants',
                        field: 'Patient_Attendants',
                        width: 100
                    },
                    {
                        headerName: 'Dental Radiographer',
                        field: 'Dental_Radiographer',
                        width: 100
                    },
                    {
                        headerName: 'Urological Surgeon',
                        field: 'Urological_Surgeon',
                        width: 100
                    },
                    {
                        headerName: 'Paediatric Surgeon',
                        field: 'Paediatric_Surgeon',
                        width: 100
                    },
                    {
                        headerName: 'Palliative Care  Specialist',
                        field: 'Palliative_Care_Specialist',
                        width: 100
                    },
                    {
                        headerName: 'Neonatologist',
                        field: 'Neonatologist',
                        width: 100
                    },
                    {
                        headerName: 'Orthodontist',
                        field: 'Orthodontist',
                        width: 100
                    },
                    {
                        headerName: 'Health Records  and Information Managers',
                        field: 'Health_Records_and_Information_Managers',
                        width: 100
                    },
                    {
                        headerName: 'Nutrition  &_Dietetic_Officer',
                        field: 'Nutrition_&_Dietetic_Officer',
                        width: 100
                    },
                    {
                        headerName: 'Mammographer',
                        field: 'Mammographer',
                        width: 100
                    },
                    {
                        headerName: 'KECHN',
                        field: 'KECHN',
                        width: 100
                    },
                    {
                        headerName: 'Radiologists',
                        field: 'Radiologists',
                        width: 100
                    },
                    {
                        headerName: 'Occupational Therapist',
                        field: 'Occupational_Therapist',
                        width: 100
                    },
                    {
                        headerName: 'Medical Laboratory  Technician',
                        field: 'Medical_Laboratory_Technician',
                        width: 100
                    },
                    {
                        headerName: 'Dermatologists',
                        field: 'Dermatologists',
                        width: 100
                    },
                    {
                        headerName: 'Health Records  and Information Officer',
                        field: 'Health_Records_and_Information_Officer',
                        width: 100
                    },
                    {
                        headerName: 'Radiation Monitoring_&_Safety_Officer',
                        field: 'Radiation_Monitoring_&_Safety_Officer',
                        width: 100
                    },
                    {
                        headerName: 'Dental Technologists',
                        field: 'Dental_Technologists',
                        width: 100
                    },
                    {
                        headerName: 'Forensic Psychiatrist',
                        field: 'Forensic_Psychiatrist',
                        width: 100
                    },
                    {
                        headerName: 'Theater Nurses',
                        field: 'Theater_Nurses',
                        width: 100
                    },
                    {
                        headerName: 'Oncology Pharmacist',
                        field: 'Oncology_Pharmacist',
                        width: 100
                    },
                    {
                        headerName: 'Opthamologist',
                        field: 'Opthamologist',
                        width: 100
                    },
                    {
                        headerName: 'Oncologist',
                        field: 'Oncologist',
                        width: 100
                    },
                    {
                        headerName: 'Critical Care  Nursing',
                        field: 'Critical_Care_Nursing',
                        width: 100
                    },
                    {
                        headerName: 'Paediatric Nephrologist',
                        field: 'Paediatric_Nephrologist',
                        width: 100
                    },
                    {
                        headerName: 'Paeditrician',
                        field: 'Paeditrician',
                        width: 100
                    },
                    {
                        headerName: 'Public Health  Technician',
                        field: 'Public_Health_Technician',
                        width: 100
                    },
                    {
                        headerName: 'CO Reproductive  Health',
                        field: 'CO_Reproductive_Health',
                        width: 100
                    },
                    {
                        headerName: 'CO Dermatology/ Venereology',
                        field: 'CO_Dermatology/_Venereology',
                        width: 100
                    },
                    {
                        headerName: 'Paediatric Dentist',
                        field: 'Paediatric_Dentist',
                        width: 100
                    },
                    {
                        headerName: 'Nutrition & Dietetic_Technician',
                        field: 'Nutrition_&_Dietetic_Technician',
                        width: 100
                    },
                    {
                        headerName: 'Psychiatrist Nurse',
                        field: 'Psychiatrist_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Nephrologist',
                        field: 'Nephrologist',
                        width: 100
                    },
                    {
                        headerName: 'General Surgeon',
                        field: 'General_Surgeon',
                        width: 100
                    },
                    {
                        headerName: 'Public Health  Officers',
                        field: 'Public_Health_Officers',
                        width: 100
                    },
                    {
                        headerName: 'Anaesthetist Nurse',
                        field: 'Anaesthetist_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Neuro-Surgeons',
                        field: 'Neuro-Surgeons',
                        width: 100
                    },
                    {
                        headerName: 'Public Health  Physician',
                        field: 'Public_Health_Physician',
                        width: 100
                    },
                    {
                        headerName: 'Paediatric Endocrinologist',
                        field: 'Paediatric_Endocrinologist',
                        width: 100
                    },
                    {
                        headerName: 'Community Psychiatrist',
                        field: 'Community_Psychiatrist',
                        width: 100
                    },
                    {
                        headerName: 'Clinical Officer  ENT/Audiology',
                        field: 'Clinical_Officer_ENT/Audiology',
                        width: 100
                    },
                    {
                        headerName: 'General Medical Officers',
                        field: 'General_Medical_Officers',
                        width: 100
                    },
                    {
                        headerName: 'Casuals',
                        field: 'Casuals',
                        width: 100
                    },
                    {
                        headerName: 'Cleaners',
                        field: 'Cleaners',
                        width: 100
                    },
                    {
                        headerName: 'physiologist',
                        field: 'physiologist',
                        width: 100
                    },
                    {
                        headerName: 'Clinical psychologists',
                        field: 'Clinical_psychologists',
                        width: 100
                    },
                    {
                        headerName: 'Security',
                        field: 'Security',
                        width: 100
                    },
                    {
                        headerName: 'Specialist Physician (Internist)',
                        field: 'Specialist_Physician_(Internist)',
                        width: 100
                    },
                    {
                        headerName: 'Medical Social  Worker',
                        field: 'Medical_Social_Worker',
                        width: 100
                    },
                    {
                        headerName: 'Dental Officers',
                        field: 'Dental_Officers',
                        width: 100
                    },
                    {
                        headerName: 'Health Economist',
                        field: 'Health_Economist',
                        width: 100
                    },
                    {
                        headerName: 'Therapy Radiographer',
                        field: 'Therapy_Radiographer',
                        width: 100
                    },
                    {
                        headerName: 'Health Promotion  Officers',
                        field: 'Health_Promotion_Officers',
                        width: 100
                    },
                    {
                        headerName: 'Cardiology Nurse',
                        field: 'Cardiology_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Health Administrative  Officers',
                        field: 'Health_Administrative_Officers',
                        width: 100
                    },

                    {
                        headerName: 'CT Scan / MRI Radiographer',
                        field: 'CT_Scan_/MRI_Radiographer',
                        width: 100
                    },
                    {
                        headerName: 'Mortuary Attendant',
                        field: 'Mortuary_Attendant',
                        width: 100
                    },
                    {
                        headerName: 'Pharmacist',
                        field: 'Pharmacist',
                        width: 100
                    },
                    {
                        headerName: 'Secretaries',
                        field: 'Secretaries',
                        width: 100
                    },
                    {
                        headerName: 'facility date established',
                        field: 'facility__date_established',
                        width: 100
                    },
                    {
                        headerName: 'Pathologist',
                        field: 'Pathologist',
                        width: 100
                    },
                    {
                        headerName: 'BSN Nurse',
                        field: 'BSN_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Ophthalmic Nurse',
                        field: 'Ophthalmic_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'CO Paediatrics',
                        field: 'CO_Paediatrics',
                        width: 100
                    },
                    {
                        headerName: 'Human Resource Management Officer',
                        field: 'Human_Resource_Management_Officer',
                        width: 100
                    },
                    {
                        headerName: 'CO Orthopaedics',
                        field: 'CO_Orthopaedics',
                        width: 100
                    },
                    {
                        headerName: 'Nuclear Medicine  Technologist',
                        field: 'Nuclear_Medicine_Technologist',
                        width: 100
                    },
                    {
                        headerName: 'Critical Care  Physician',
                        field: 'Critical_Care_Physician',
                        width: 100
                    },
                    {
                        headerName: 'Cateress',
                        field: 'Cateress',
                        width: 100
                    },
                    {
                        headerName: 'Medical Engineering  Technician',
                        field: 'Medical_Engineering_Technician',
                        width: 100
                    },
                    {
                        headerName: 'Gastroentologist',
                        field: 'Gastroentologist',
                        width: 100
                    },
                    {
                        headerName: 'dddd',
                        field: 'dddd',
                        width: 100
                    },
                    {
                        headerName: 'Kenya Registered  Nurse',
                        field: 'Kenya_Registered_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Oromaxillofacial Surgeon',
                        field: 'Oromaxillofacial_Surgeon',
                        width: 100
                    },
                    {
                        headerName: 'ENT surgeon',
                        field: 'ENT_surgeon',
                        width: 100
                    },
                    {
                        headerName: 'Medical Engineers',
                        field: 'Medical_Engineers',
                        width: 100
                    },
                    {
                        headerName: 'Community Health  Volunteers(CHV)',
                        field: 'Community_Health_Volunteers(CHV)',
                        width: 100
                    },
                    {
                        headerName: 'Health Records  and Information Technician',
                        field: 'Health_Records_and_Information_Technician',
                        width: 100
                    },
                    {
                        headerName: 'Registered Midwives',
                        field: 'Registered_Midwives',
                        width: 100
                    },
                    {
                        headerName: 'Clinical Officer  Lung_&_Skin',
                        field: 'Clinical_Officer_Lung_&_Skin',
                        width: 100
                    },
                    {
                        headerName: 'Medical Laboratory  Technologists',
                        field: 'Medical_Laboratory_Technologists',
                        width: 100
                    },
                    {
                        headerName: 'Plaster Technologists',
                        field: 'Plaster_Technologists',
                        width: 100
                    },
                    {
                        headerName: 'Enrolled Nurse',
                        field: 'Enrolled_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'CO Ophthalmology/Cataract_Surgery',
                        field: 'CO_Ophthalmology/Cataract_Surgery',
                        width: 100
                    },
                    {
                        headerName: 'Specialized Physiotherapists',
                        field: 'Specialized_Physiotherapists',
                        width: 100
                    },
                    {
                        headerName: 'Cardiologist',
                        field: 'Cardiologist',
                        width: 100
                    },
                    {
                        headerName: 'ICT Officer',
                        field: 'ICT_Officer',
                        width: 100
                    },
                    {
                        headerName: 'Supply Chain  Officer',
                        field: 'Supply_Chain_Officer',
                        width: 100
                    },
                    {
                        headerName: 'Optiometrist',
                        field: 'Optiometrist',
                        width: 100
                    },
                    {
                        headerName: 'CO Psychiatry/Mental_Health',
                        field: 'CO_Psychiatry/Mental_Health',
                        width: 100
                    },
                    {
                        headerName: 'Drivers',
                        field: 'Drivers',
                        width: 100
                    },
                    {
                        headerName: 'Medical Engineering  Technologists',
                        field: 'Medical_Engineering_Technologists',
                        width: 100
                    },
                    {
                        headerName: 'Cooks',
                        field: 'Cooks',
                        width: 100
                    },
                    {
                        headerName: 'ddds',
                        field: 'ddds',
                        width: 100
                    },
                    {
                        headerName: 'Medical Endocrinologist',
                        field: 'Medical_Endocrinologist',
                        width: 100
                    },
                    {
                        headerName: 'KRCHN',
                        field: 'KRCHN',
                        width: 100
                    },
                    {
                        headerName: 'Paediatric Neurologist',
                        field: 'Paediatric_Neurologist',
                        width: 100
                    },
                    {
                        headerName: 'BSc Physiotherapy',
                        field: 'BSc_Physiotherapy',
                        width: 100
                    },
                    {
                        headerName: 'Ultrasonographer',
                        field: 'Ultrasonographer',
                        width: 100
                    },
                    {
                        headerName: 'Psychiatrist',
                        field: 'Psychiatrist',
                        width: 100
                    },
                    {
                        headerName: 'Cardiothoracic Surgeon',
                        field: 'Cardiothoracic_Surgeon',
                        width: 100
                    },
                    {
                        headerName: 'Dental Nurse',
                        field: 'Dental_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Child  &_Adolescent_Psychiatrist',
                        field: 'Child_&_Adolescent_Psychiatrist',
                        width: 100
                    },
                    {
                        headerName: 'Accountants',
                        field: 'Accountants',
                        width: 100
                    },
                    {
                        headerName: 'Oncology Nurse',
                        field: 'Oncology_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Clerks',
                        field: 'Clerks',
                        width: 100
                    },
                    {
                        headerName: 'Orthopaedic Surgeon',
                        field: 'Orthopaedic_Surgeon',
                        width: 100
                    },
                    {
                        headerName: 'CO Oncology/Palli--ative_Care',
                        field: 'CO_Oncology/Palli--ative_Care',
                        width: 100
                    },
                    {
                        headerName: 'Plastic Surgeon(Recon-structive)',
                        field: 'Plastic_Surgeon(Recon-structive)',
                        width: 100
                    },
                    {
                        headerName: 'Orthopaedic Technologist',
                        field: 'Orthopaedic_Technologist',
                        width: 100
                    },
                    {
                        headerName: 'Paediatric Nurse',
                        field: 'Paediatric_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'General Clinical  Officers(Diploma)',
                        field: 'General_Clinical_Officers(Diploma)',
                        width: 100
                    },
                    {
                        headerName: 'Neurologist',
                        field: 'Neurologist',
                        width: 100
                    },
                    {
                        headerName: 'Oromaxillofacial Anesthesiologist',
                        field: 'Oromaxillofacial_Anesthesiologist',
                        width: 100
                    },
                    {
                        headerName: 'Community Health  Extension/Assistants',
                        field: 'Community_Health_Extension/Assistants',
                        width: 100
                    },
                    {
                        headerName: 'General Physiotherapist',
                        field: 'General_Physiotherapist',
                        width: 100
                    },
                    {
                        headerName: 'Clinical pharmacist',
                        field: 'Clinical_pharmacist',
                        width: 100
                    },
                    {
                        headerName: 'General Radiographer',
                        field: 'General_Radiographer',
                        width: 100
                    },
                    {
                        headerName: 'Palliative Care  Nurse',
                        field: 'Palliative_Care_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Community Oral Health Officers',
                        field: 'Community_Oral_Health_Officers',
                        width: 100
                    },
                    {
                        headerName: 'Forensic Nurse',
                        field: 'Forensic_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Sign Language  Nurse',
                        field: 'Sign_Language_Nurse',
                        width: 100
                    },
                    {
                        headerName: 'Nephrology Nurse',
                        field: 'Nephrology_Nurse',
                        width: 100
                    },

                ]

            }
        case 10:
            return {
                rows: Object.entries(props?.gis ?? {})?.map(([key, value], index) => ({
                    [`${orgUnitFilter}`]: key,
                    date: value?.map(({ facility_date_established }) => facility_date_established)[0],
                    ...(() => {

                        if (value?.map(({ facility_keph_level }) => facility_keph_level)[0] !== "All") {
                            isKeph = true;
                            return { keph: value?.map(({ facility_keph_level }) => facility_keph_level)[0] }
                        }

                        if (value?.map(({ facility_owner }) => facility_owner)[0] !== "All") {
                            isOwner = true;
                            return { owner: value?.map(({ facility_owner }) => facility_owner)[0] }
                        }

                        if (value?.map(({ facility_type }) => facility_type)[0] !== "All") {
                            isType = true;
                            return { type: value?.map(({ facility_type }) => facility_type)[0] }
                        }

                        return {}

                    })(),
                    facility_name: value?.map(({ facility_name }) => facility_name)[0],
                    facility_code: value?.map(({ facility_code }) => facility_code)[0],
                    facility_long: value?.map(({ facility_long }) => facility_long)[0],
                    facility_lat: value?.map(({ facility_lat }) => facility_lat)[0],
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
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    flex: 1
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    flex: 1
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    flex: 1
                                }
                            ]
                        }

                        return []

                    })(),
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
        case 11:
            return {
                rows: Object.entries(props?.facility_nhif_accreditation ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    facility_date_established: result[1][0]?.facility_date_established,

                    ...(() => {

                        if (result[1][0]?.facility_keph_level !== "All") {
                            isKeph = true;
                            return { keph: result[1][0]?.facility_keph_level }
                        }

                        if (result[1][0]?.facility_owner !== "All") {
                            isOwner = true;
                            return { owner: result[1][0]?.facility_owner }
                        }

                        if (result[1][0]?.facility_type !== "All") {
                            isType = true;
                            return { type: result[1][0]?.facility_type }
                        }

                        return {}

                    })(),
                    // facility_keph_level: result[1][0]?.facility_keph_level,
                    facility_name: result[1][0]?.facility_name,
                    // facility_type_name: result[1][0]?.facility_type_name,
                    // facility_sub_county: result[1]["facility_sub_county"],
                    // facility_county: result[1]["facility_county"],
                    facility_code: result[1][0]?.facility_code,
                    // facility_ward: result[1]["facility_ward"],
                    facility_accredited: result[1][0]?.facility_accredited,
                    // facility_owner: result[1][0]?.facility_owner,
                    id: index

                })),

                columns: [

                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    ...(() => {

                        if (isKeph) {
                            return [
                                {
                                    headerName: 'Keph Level',
                                    field: 'keph',
                                    flex: 1
                                }
                            ]
                        }

                        if (isOwner) {
                            return [
                                {
                                    headerName: 'Owner',
                                    field: 'owner',
                                    flex: 1
                                }
                            ]
                        }

                        if (isType) {
                            return [
                                {
                                    headerName: 'Type',
                                    field: 'type',
                                    flex: 1
                                }
                            ]
                        }

                        return []

                    })(),
                    {
                        headerName: 'Date',
                        field: 'facility_date_established',
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
                        headerName: 'NHIF Accreditation',
                        field: 'facility_accredited',
                        flex: 1
                    },
                    // {
                    //     headerName: 'Facility Owner',
                    //     field: 'facility_owner',
                    //     width: 200

                    // }



                ]
            }

        case 12:
            return {
                rows: Object.entries(props?.chul_status_all_hierachies ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    // facility__date_established: result[1]?.facility_date_established,
                    ...(() => {

                        if (result[1]?.chu_status !== "all") {
                            isCHUstatus = true;
                            return { chu_status: result[1]?.chu_status }
                        }

                        return {}
                    })(),
                    fully_functional: result[1]['Fully-functional'],
                    semi_functional: result[1]['semi-functional'],
                    non_functional: result[1]['Non-functional'],
                    closed: result[1]?.Closed,
                    id: index

                })),

                columns: [

                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        flex: 1
                    },
                    // {
                    //     headerName: 'Date',
                    //     field: 'facility__date_established',
                    //     flex: 1
                    // },
                    ...(() => {

                        if (isCHUstatus) {
                            return [
                                {
                                    headerName: 'CHU Status',
                                    field: 'chu_status',
                                    flex: 1
                                }
                            ]
                        }

                        return []
                    })(),
                    {
                        headerName: 'Fully Functional',
                        field: 'fully_functional',
                        flex: 1

                    },
                    {
                        headerName: 'Semi Functional',
                        field: 'semi_functional',
                        flex: 1

                    },
                    {
                        headerName: 'Non Functional',
                        field: 'non_functional',
                        flex: 1
                    },
                    {
                        headerName: 'Closed',
                        field: 'closed',
                        flex: 1

                    }



                ]
            }

        case 13:
            return {
                rows: Object.entries(props?.chul_services_all_hierachies ?? {})?.map((result, index) => ({
                    [`${orgUnitFilter}`]: result[0],
                    // chu_date_established: result[1]?.health_unit__date_established,
                    ...(() => {

                        if (result[1]?.chu_status !== "all") {
                            isCHUstatus = true;
                            return { chu_status: result[1]?.chu_status }
                        }

                        return {}
                    })(),
                    wash_sanitation: result[1]["WASH: Water, sanitation and hygiene education, including hand washing"],
                    iccm: result[1]["iCCM: Education on danger signs and referral for malaria, pneumonia and diarrhea"],
                    wash_water_treatment: result[1]["WASH: Water treatment provision"],
                    // ward: result[1]["health_unit__facility__ward__name"],
                    // county: result[1]["health_unit__facility__ward__sub_county__county__name"],
                    // sub_county: result[1]["health_unit__facility__ward__sub_county__name"],
                    hiv_tb_malaria_treatment: result[1]["HIV, TB and Malaria: Treatment defaulter tracing"],
                    hiv_tb_malaria_education: result[1]["HIV, TB and Malaria: Education, support for treatment adherence, and referral"],
                    iccm_malaria_drugs: result[1]["iCCM: Provision of AL drugs to treat malaria"],
                    hiv_tb_malaria_condoms: result[1]["HIV, TB and Malaria: Provision of condoms"],
                    referrals_health_facilities: result[1]["Referrals to health facilities"],
                    provision_of_information: result[1]["Provision of Information, Education & Communication (IEC) materials"],
                    iccm_rapid_diagnostic: result[1]["iCCM: Rapid diagnostic testing of malaria"],
                    nutrition_education: result[1]["Nutrition: Education, child growth monitoring, screening and referrals"],
                    mnch_education: result[1]["MNCH: Education, counseling of mothers, and referral for ANC"],
                    deworming_children: result[1]["Deworming of children"],
                    hiv_tb_malaria_ppsg: result[1]["HIV, TB and Malaria: Provision of psychosocial support groups"],
                    mgmt_diarrhea: result[1]["Management of diarrhea, injuries, wounds, jiggers and other minor illnesses."],
                    ncd_eduaction: result[1]["NCD: Education and support for treatment adherence"],
                    hiv_tb_malaria_provision: result[1]["HIV, TB and Malaria: Provision of home based care for PLWA"],
                    first_aid_services: result[1]["First Aid Services"],
                    iCCM_provision_long_lasting: result[1]["iCCM: Provision of Long Lasting Insecticide Treated Nets"],
                    growth_monitoring: result[1]["Growth monitoring for children under 5 years."],
                    ncd_diabetes: result[1]["NCD: Diabetes and hypertension screening and referral"],

                    id: index

                })),

                columns: [

                    {
                        headerName: formatString(orgUnitFilter),
                        field: `${orgUnitFilter}`,
                        width: 200
                    },
                    // {
                    //     headerName: 'Date',
                    //     field: 'chu_date_established',
                    //     width: 200
                    // },
                    ...(() => {

                        if (isCHUstatus) {
                            return [
                                {
                                    headerName: 'CHU Status',
                                    field: 'chu_status',
                                    width: 200
                                }
                            ]
                        }

                        return []
                    })(),

                    {
                        headerName: "WASH: Water, sanitation and hygiene education, including hand washing",
                        field: "wash_sanitation",
                        width: 200
                    },
                    {
                        headerName: "iCCM: Education on danger signs and referral for malaria, pneumonia and diarrhea",
                        field: "iccm",
                        width: 200
                    },
                    {
                        headerName: "WASH: Water treatment provision",
                        field: "wash_water_treatment",
                        width: 200
                    },
                    // {
                    //     headerName: "health_unit__facility__ward__name",
                    //     field: "ward",
                    //     flex: 1
                    // },
                    // {
                    //     headerName: "health_unit__facility__ward__sub_county__county__name",
                    //     field: "county",
                    //     flex: 1
                    // },
                    // {
                    //     headerName: "health_unit__facility__ward__sub_county__name",
                    //     field: "sub_county",
                    //     flex: 1
                    // },
                    {
                        headerName: "HIV, TB and Malaria: Treatment defaulter tracing",
                        field: "hiv_tb_malaria_treatment",
                        width: 200
                    },
                    {
                        headerName: "HIV, TB and Malaria: Education, support for treatment adherence, and referral",
                        field: "hiv_tb_malaria_education",
                        width: 200
                    },
                    {
                        headerName: "iCCM: Provision of AL drugs to treat malaria",
                        field: "iccm_malaria_drugs",
                        width: 200
                    },
                    {
                        headerName: "HIV, TB and Malaria: Provision of condoms",
                        field: "hiv_tb_malaria_condoms",
                        width: 200
                    },
                    {
                        headerName: "Referrals to health facilities",
                        field: "referrals_health_facilities",
                        width: 200
                    },
                    {
                        headerName: "Provision of Information, Education & Communication (IEC) materials",
                        field: "provision_of_information",
                        width: 200
                    },
                    {
                        headerName: "iCCM: Rapid diagnostic testing of malaria",
                        field: "iccm_rapid_diagnostic",
                        width: 200
                    },
                    {
                        headerName: "Nutrition: Education, child growth monitoring, screening and referrals",
                        field: "nutrition_education",
                        width: 200
                    },
                    {
                        headerName: "MNCH: Education, counseling of mothers, and referral for ANC",
                        field: "mnch_education",
                        width: 200
                    },
                    {
                        headerName: "Deworming of children",
                        field: "deworming_children",
                        width: 200
                    },
                    {
                        headerName: "HIV, TB and Malaria: Provision of psychosocial support groups",
                        field: "hiv_tb_malaria_ppsg",
                        width: 200
                    },
                    {
                        headerName: "Management of diarrhea, injuries, wounds, jiggers and other minor illnesses.",
                        field: "mgmt_diarrhea",
                        width: 200
                    },
                    {
                        headerName: "NCD: Education and support for treatment adherence",
                        field: "ncd_eduaction",
                        width: 200
                    },
                    {
                        headerName: "HIV, TB and Malaria: Provision of home based care for PLWA",
                        field: "hiv_tb_malaria_provision",
                        width: 200
                    },
                    {
                        headerName: "First Aid Services",
                        field: "first_aid_services",
                        width: 200
                    },
                    {
                        headerName: "iCCM: Provision of Long Lasting Insecticide Treated Nets",
                        field: "iCCM_provision_long_lasting",
                        width: 200
                    },
                    {
                        headerName: "Growth monitoring for children under 5 years.",
                        field: "growth_monitoring",
                        width: 200
                    },
                    {
                        headerName: "NCD: Diabetes and hypertension screening and referral",
                        field: "ncd_diabetes",
                        width: 200
                    },




                ]
            }

            case 14:
                return {
                    rows: Object.entries(props?.chul_count_all_hierachies ?? {})?.map((result, index) => ({
                        [`${orgUnitFilter}`]: result[0],
                        // facility__date_established: result[1]?.facility_date_established,
                        ...(() => {

                            if (result[1]?.chu_status !== "all") {
                                isCHUstatus = true;
                                return { chu_status: result[1]?.chu_status }
                            }
    
                            return {}
                        })(),
                        chvs: result[1]?.chvs,
                        chews: result[1]?.chews,
                        number_of_units: result[1]?.number_of_units,
                        id: index
    
                    })),
    
                    columns: [
    
                        {
                            headerName: formatString(orgUnitFilter),
                            field: `${orgUnitFilter}`,
                            flex: 1
                        },
                        // {
                        //     headerName: 'Date',
                        //     field: 'facility__date_established',
                        //     flex: 1
                        // },
                        ...(() => {

                            if (isCHUstatus) {
                                return [
                                    {
                                        headerName: 'CHU Status',
                                        field: 'chu_status',
                                        width: 200
                                    }
                                ]
                            }
    
                            return []
                        })(),
                        {
                            headerName: 'CHVs',
                            field: 'chvs',
                            flex: 1
    
                        },
                        {
                            headerName: 'CHEWS',
                            field: 'chews',
                            flex: 1
    
                        },
                        {
                            headerName: 'Number of Units',
                            field: 'number_of_units',
                            flex: 1
                        }
                        
    
    
    
                    ]
                }
    }
} 
