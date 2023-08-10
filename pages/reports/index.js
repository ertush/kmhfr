import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { checkToken } from '../../controllers/auth/auth';
import MainLayout from '../../components/MainLayout';
import * as Tabs from "@radix-ui/react-tabs";
import { darken, styled } from '@mui/material/styles';

import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid';


const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid ${darken('rgba(5, 150, 105, 1)', 1)}`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        borderRight: `1px solid ${darken('rgba(5, 150, 105, 0.4)', 0.2)}`,
        FontFace: 'IBM Plex Sans'

    }
}))



const propsToGridData = (props, index) => {

    switch (index) {
        // Beds and Cots, Theaters
        case 0:
            return {
                rows: props[`${index}`]?.beds_and_cots_by_all_hierachies.map((
                    {
                        ward__sub_county__county__name: county,
                        ward__sub_county__name: sub_county,
                        ward__name: ward,
                        hdu_beds,
                        icu_beds,
                        maternity_beds,
                        inpatient_beds,
                        emergency_casualty_beds,
                        cots
                    },
                    index
                ) => ({
                    county,
                    sub_county,
                    ward,
                    hdu_beds,
                    icu_beds,
                    maternity_beds,
                    inpatient_beds,
                    emergency_casualty_beds,
                    cots,
                    id: index

                }))

                , columns: [
                    {
                        headerName: 'County',
                        field: 'county',
                        flex: 1
                    },
                    {
                        headerName: 'Sub County',
                        field: 'sub_county',
                        flex: 1
                    },
                    {
                        headerName: 'Ward',
                        field: 'ward',
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
                        headerName: 'Inpatient Beds',
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
                    },

                ]
            };
        // Keph Level
        case 1:
            return {
                rows: props[`${index}`]?.facility_keph_level_report_all_hierachies.map((
                    {
                        ward__sub_county__county__name: county,
                        ward__sub_county__name: sub_county,
                        ward__name: ward,
                        "Level 2": level_2,
                        "Level 3": level_3,
                        "Level 4": level_4,
                        "Level 5": level_5,
                        "Level 6": level_6,
                    },
                    index
                ) => ({
                    county,
                    sub_county,
                    ward,
                    level_2,
                    level_3,
                    level_4,
                    level_5,
                    level_6,
                    id: index

                }))

                , columns: [
                    {
                        headerName: 'County',
                        field: 'county',
                        flex: 1
                    },
                    {
                        headerName: 'Sub County',
                        field: 'sub_county',
                        flex: 1
                    },
                    {
                        headerName: 'Ward',
                        field: 'ward',
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
                        headerName: 'Level 5',
                        field: 'level_5',
                        flex: 1
                    },
                    {
                        headerName: 'Level 6',
                        field: 'level_6',
                        flex: 1
                    }

                ]
            };
        // Facility Ownership
        case 2:
            return {
                rows: props[`${index}`]?.facility_owner_report_all_hierachies.map((
                    {
                        ward__sub_county__county__name: county,
                        ward__sub_county__name: sub_county,
                        ward__name: ward,
                        "Faith Based Organization": faith_based_org,
                        "Ministry of Health Category": ministry_of_health_category,
                        "Non-Govermental Organizations": ngo_category,
                        "Private Pracitce": private_practice,
                        "Private company": private_company,
                        "Private Institution": private_institution,
                        "Public Institution": public_institution,
                        "Classified Facility (Armed Forces)": classified_facility,
                        "Private Practice - General Practitioner": private_practice_general_practitioner,
                        "Armed Forces": armed_forces,
                        "Ministry of Health": ministry_of_health,
                        "Christian Health Association of Kenya": christian_health_associtaion_of_kenya,
                        "Kenya Episcopal Conference-Catholic Secretariat": kenya_episcopal_confrence_catholic_secretariat,
                        "Kenya Police Service": kenya_police_service,
                        "National Youth Service": national_youth_services,
                        "Non-Governmental Organizations": non_govermental_organizations,
                        "Other Faith Based": other_faith_based,
                        Prisons: prisons,
                        "Private Practice - Clinical Officer": private_practice_clinical_officer,
                        "Private Practice - Medical Specialist": private_practice_medical_specialist,
                        "Private Practice - Nurse / Midwifery": private_practice_nurse_midwifery,
                        "Private Practice - Private Company": private_practice_private_company,
                        "Private Practice - Private Institution Academic": private_practice_institution_academic,
                        "Private Practice -Physiotherapist": private_practice_physiotherapist,
                        "Private Practice Lab Technician/Technologist": private_practice_lab_technician,
                        "Private Practice- Kenya Nuclear Regulatory Authority": private_practice_knra,
                        "Private Practice- Pharmacist": private_practice_pharmacist,
                        "Public Institution - Academic": public_institution_academic,
                        "Public Institution - Parastatal": public_institution_parastatal,
                        "Seventh Day Adventist": seventh_day_adventist,
                        "Supreme Council for Kenya Muslims": supreme_council_for_muslims,


                    },
                    index
                ) => ({
                    county,
                    sub_county,
                    ward,
                    faith_based_org,
                    ministry_of_health_category,
                    ngo_category,
                    private_practice,
                    private_company,
                    private_institution,
                    public_institution,
                    classified_facility,
                    private_practice_general_practitioner,
                    armed_forces,
                    ministry_of_health,
                    christian_health_associtaion_of_kenya,
                    kenya_episcopal_confrence_catholic_secretariat,
                    kenya_police_service,
                    national_youth_services,
                    non_govermental_organizations,
                    other_faith_based,
                    prisons,
                    private_practice_clinical_officer,
                    private_practice_medical_specialist,
                    private_practice_nurse_midwifery,
                    private_practice_private_company,
                    private_practice_institution_academic,
                    private_practice_physiotherapist,
                    private_practice_lab_technician,
                    private_practice_knra,
                    private_practice_pharmacist,
                    public_institution_academic,
                    public_institution_parastatal,
                    seventh_day_adventist,
                    supreme_council_for_muslims,
                    id:index

                }))

                , columns: [
                    {
                        headerName: 'County',
                        field: 'county',
                        flex: 1
                    },
                    {
                        headerName: 'Sub County',
                        field: 'sub_county',
                        flex: 1
                    },
                    {
                        headerName: 'Ward',
                        field: 'ward',
                        flex: 1
                    },
                    {
                        headerName: 'Faith Based Organization',
                        field: 'faith_based_org',
                        flex: 1
                    },
                    {
                        headerName: 'Ministry of Health',
                        field: 'ministry_of_health',
                        flex: 1
                    },
                    {
                        headerName: 'Non-Govermental Organizations',
                        field: 'ngo_category',
                        flex: 1
                    },
                    {
                        headerName: 'Private Pracitce',
                        field: 'private_practice',
                        flex: 1
                    },
                    {
                        headerName: 'Private company',
                        field: 'private_company',
                        flex: 1
                    },
                    {
                        headerName: 'Private Institution',
                        field: 'private_institution',
                        flex: 1
                    },
                    {
                        headerName: 'Public Institution',
                        field: 'public_institution',
                        flex: 1
                    },
                    {
                        headerName: 'Classified Facility (Armed Forces)',
                        field: 'classified_facility',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice - General Practitioner',
                        field: 'private_practice_general_practitioner',
                        flex: 1
                    },
                    {
                        headerName: 'Armed Forces',
                        field: 'armed_forces',
                        flex: 1
                    },
                    {
                        headerName: 'Christian Health Association of Kenya',
                        field: 'christian_health_association_of_kenya',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya Episcopal Conference-Catholic Secretariat',
                        field: 'kenya_episcopal_conference_catholic_secretariat',
                        flex: 1
                    },
                    {
                        headerName: 'Kenya Police Service',
                        field: 'kenya_police_service',
                        flex: 1
                    },
                    {
                        headerName: 'National Youth Service',
                        field: 'national_youth_services',
                        flex: 1
                    },
                    {
                        headerName: 'Non-Governmental Organizations',
                        field: 'non_govermental_organizations',
                        flex: 1
                    },
                    {
                        headerName: 'Other Faith Based',
                        field: 'other_faith_based',
                        flex: 1
                    },
                    {
                        headerName: 'Prisons',
                        field: 'prisons',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice - Clinical Officer',
                        field: 'private_practice_clinical_officer',
                        flex: 1
                    },
                    {
                        headerName: 'Practice - Medical Specialist',
                        field: 'private_practice_medical_specialist',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice - Nurse / Midwifery',
                        field: 'private_practice_nurse_midwifery',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice - Private Company',
                        field: 'private_practice_private_company',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice - Private Institution Academic',
                        field: 'private_practice_private_institution_academic',
                        flex: 1
                    },

                    {
                        headerName: 'Private Practice -Physiotherapist',
                        field: 'private_practice_physiotherapist',
                        flex: 1
                    },

                    {
                        headerName: 'Private Practice Lab Technician/Technologist',
                        field: 'private_practice_lab_technician',
                        flex: 1
                    },
                    {
                        headerName: 'Private Practice- Pharmacist',
                        field: 'private_practice_pharmacist',
                        flex: 1
                    },
                    {
                        headerName: 'Public Institution - Academic',
                        field: 'public_institution_academic',
                        flex: 1
                    },
                    {
                        headerName: 'Public Institution - Parastatal',
                        field: 'public_institution_parastatal',
                        flex: 1
                    },
                    {
                        headerName: 'Seventh Day Adventist',
                        field: 'seventh_day_adventist',
                        flex: 1
                    },
                    {
                        headerName: 'Supreme Council for Kenya Muslims',
                        field: 'supreme_council_for_muslims',
                        flex: 1
                    },




                ]
            };
        //Facility Type 
        case 3:
            return {
                rows: props[`${index}`]?.facility_type_report_all_hierachies.map((
                    {
                        ward__sub_county__county__name: county,
                        ward__sub_county__name: sub_county,
                        ward__name: ward,
                        "STAND ALONE": stand_alone,
                        "HOSPITALS": hospitals,
                        "MEDICAL CENTER": medical_center_category,
                        DISPENSARY: dispensary_category,
                        VCT: vct,
                        "MEDICAL CLINIC": medical_clinic_category,
                        "HEALTH_CENTER": health_center_category,
                        "NURSING HOME": nursing_home_category,
                        "HEALTH CENTER CLINIC": health_center_clinic,
                        "Basic Health Centre": basic_health_center,
                        "Blood Bank": blood_bank,
                        "Comprehensive Health Centre": comprehensive_health_center,
                        "Comprehensive Teaching & Tertiary Referral": comprehensive_teaching_referral,
                        "Dental Clinic": dental_clinic,
                        Dermatology: dermatology,
                        "Dialysis Center": dialysis_center,
                        Dispensary: dispensary,
                        "Farewell Home": farewell_home,
                        "Medical Center": medical_center,
                        "Medical Clinic": medical_clinic,
                        "Nursing Homes": nursing_homes,
                        "Nursing and Maternity Home": nursing_maternity_home,
                        "Nutrition and Dietetics": nutrition_dietetics,
                        Ophthalmology: ophthalmology,
                        Pharmacy: pharmacy,
                        "Primary care hospitals": primary_care_hospitals,
                        "Radiology Clinic": radiology_clinic,
                        "Regional Blood Transfusion Centre": regional_blood_transfusion_centre,
                        "Rehab. Center - Drug and Substance abuse": rehab_center_drugs,
                        "Rehab. Center - Physiotherapy, Orthopaedic & Occupational Therapy": rehab_center_physiotherapy,
                        "Satellite Blood Bank": satelite_blood_bank,
                        "Secondary care hospitals": secondary_care_hospital,
                        "Specialized & Tertiary Referral hospitals": specialized_tertiary_hospitals

                    },
                    index
                ) => ({
                    county,
                    sub_county,
                    ward,
                    stand_alone,
                    hospitals,
                    medical_center_category,
                    dispensary,
                    vct,
                    medical_clinic_category,
                    health_center_category,
                    nursing_home_category,
                    health_center_clinic,
                    basic_health_center,
                    blood_bank,
                    comprehensive_health_center,
                    comprehensive_teaching_referral,
                    dental_clinic,
                    dermatology,
                    dialysis_center,
                    dispensary,
                    farewell_home,
                    medical_center,
                    nursing_homes,
                    nursing_maternity_home,
                    nutrition_dietetics,
                    Ophthalmology: ophthalmology,
                    Pharmacy: pharmacy,
                    primary_care_hospitals,
                    radiology_clinic,
                    regional_blood_transfusion_centre,
                    rehab_center_drugs,
                    rehab_center_physiotherapy,
                    satelite_blood_bank,
                    secondary_care_hospital,
                    specialized_tertiary_hospitals,
                    id:index
                })
                ),

                columns: [
                    {
                        headerName: 'County',
                        field: 'county',
                        flex: '1'
                    },
                    {
                        headerName: 'Sub County',
                        field: 'sub_county',
                        flex: '1'
                    },
                    {
                        headerName: 'Ward',
                        field: 'ward',
                        flex: '1'
                    },
                    {
                        headerName: 'STAND ALONE',
                        field: 'stand_alone',
                        flex: '1'

                    },
                    {
                        headerName: 'HOSPITALS',
                        field: 'hospitals',
                        flex: '1'
                    },
                    {
                        headerName: 'MEDICAL CENTER',
                        field: 'medical_center_category',
                        flex: '1'


                    },
                    {
                        headerName: 'DISPENSARY',
                        field: 'dispensary_category',
                        flex: '1'
                    },
                    {
                        headerName: 'VCT',
                        field: 'vct',
                        flex: '1'

                    },
                    {
                        headerName: 'MEDICAL CLINIC',
                        field: 'medical_clinic_category',
                        flex: '1'

                    },
                    {
                        headerName: 'HEALTH CENTER',
                        field: ' health_center_category,',
                        flex: '1'
                    },
                    {
                        headerName: 'NURSING HOME',
                        field: 'nursing_home_category,',
                        flex: '1'
                    },
                    {
                        headerName: 'Health Center Clinic',
                        field: 'health_center_clinic',
                        flex: '1'

                    },
                    {
                        headerName: 'Basic Health Center',
                        field: 'basic_health_center',
                        flex: '1'

                    },
                    {
                        headerName: 'Blood Bank',
                        field: ' blood_bank,',
                        flex: '1'

                    },
                    {
                        headerName: 'Comprehensive Teaching & Tertiary Referral',
                        field: 'comprehensive_teaching_referral',
                        flex: '1'

                    },
                    {
                        headerName: 'Dentak Clinic',
                        field: 'dental_clinic',
                        flex: '1'

                    },
                    {
                        headerName: 'Dermatology',
                        field: 'dermatology',
                        flex: '1'

                        ,

                    },
                    {
                        headerName: 'Dispensary',
                        field: 'dispensary',
                        flex: '1'

                    },
                    {
                        headerName: 'Farewell Home',
                        field: 'farewell_home',
                        flex: '1'
                    },
                    {
                        headerName: 'Medical Center',
                        field: 'medical_center',
                        flex: '1'

                    },
                    {
                        headerName: 'Nursing Homes',
                        field: 'nursing_homes',
                        flex: '1'

                    },
                    {
                        headerName: 'Nurising Maternity Homes',
                        field: 'nursing_maternity_home',
                        flex: '1'


                    },
                    {
                        headerName: 'Nutrition Dietetics',
                        field: 'nutrition_dietetics',
                        flex: '1'
                    },
                    {
                        headerName: 'Ophthalmology',
                        field: 'ophthalmology',
                        flex: '1'


                    },
                    {
                        headerName: 'Pharmacy',
                        field: 'harmacy',
                        flex: '1'

                    },
                    {
                        headerName: 'Primary Care Hospital',
                        field: 'primary_care_hospitals',
                        flex: '1'
                    },
                    {
                        headerName: 'Radiology Clinic',
                        field: 'radiology_clinic',
                        flex: '1'


                    },
                    {
                        headerName: 'Regional Blood Transfusion Center',
                        field: 'regional_blood_transfusion_centre',
                        flex: '1'



                    },
                    {
                        headerName: 'Rehab. Center - Drug and Substance abuse"',
                        field: 'rehab_center_drugs',
                        flex: '1'


                    },
                    {
                        headerName: 'Rehab. Center - Physiotherapy, Orthopaedic & Occupational Therapy',
                        field: 'rehab_center_physiotherapy',
                        flex: '1'



                    },

                    {
                        headerName: 'Satelite Blood Bank',
                        field: 'satelite_blood_bank',
                        flex: '1'



                    },

                    {
                        headerName: 'Secondary Care Hospital',
                        field: 'secondary_care_hospital',
                        flex: '1'



                    },

                    {
                        headerName: 'Specialized & Tertiary Referral hospitalsL',
                        field: 'specialized_tertiary_hospital',
                        flex: '1'



                    },





                ]
            }
    }



}

  





function Reports(props) {

    console.log({ props })

    const [reportTitle, setReportTitle] = useState('Beds and Cots');

    useEffect(() => {

    }, [reportTitle])

    return (
        <div className="w-full">
            <Head>
                <title>KMHFR - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1  my-3">
                    {/* Header */}
                    <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start gap-4">
                        {/* Breadcramps */}
                        <div className="flex flex-row gap-2 text-sm md:text-base md:my-3">
                            <Link className="text-blue-700" href="/">
                                Home
                            </Link>
                            {"/"}
                            <Link className="text-blue-700" href="/reports">
                                Reports
                            </Link>
                            {"/"}
                            <span className="text-gray-700" href="/facilities">
                                {reportTitle} Report
                            </span>


                        </div>
                        {/* Header Bunner  */}
                        <div
                            className={
                                `col-span-5 mt-4 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-transparent border ${"border-blue-600"} drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 
                ${"border-blue-600"}
              `}
                        >
                            <div className="col-span-6 md:col-span-3">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                                    {reportTitle} Report
                                </h1>
                                <div className="flex flex-col gap-1 w-full items-start justify-start">

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Tabs */}
                    <div className='w-full col-span-1 md:col-span-7 flex border border-blue-600 px-0 mx-0 h-700 flex-1'>
                        <Tabs.Root
                            orientation="horizontal"
                            className="w-full flex flex-col tab-root"
                            defaultValue="beds_cots"
                        >
                            <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-blue-600">
                                <Tabs.Tab
                                    id={1}
                                    value="beds_cots"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Beds and Cots')}
                                >
                                    Beds and Cots
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={2}
                                    value="keph_level"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Keph Level')}
                                >
                                    Keph Level
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={3}
                                    value="facility_ownership"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Facility Ownership')}
                                >
                                    Facility Ownership
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={4}
                                    value="facility_type"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Facility Type')}
                                >
                                    Facility Type
                                </Tabs.Tab>

                                <Tabs.Tab
                                    id={5}
                                    value="regulatory_body"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Regulatory Body')}
                                >
                                    Regulatory Body
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={6}
                                    value="services"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Services')}
                                >
                                    Services
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={7}
                                    value="infrastructure"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Infrastructure')}
                                >
                                    Infrastructure
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={8}
                                    value="human_resources"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Human Resources')}

                                >
                                    Human resources
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id={9}
                                    value="Geo coordinates"
                                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                    onClick={() => setReportTitle('Geo Coordinates')}

                                >
                                    Geo Codes
                                </Tabs.Tab>
                                {/* <Tabs.Tab
                                id={4}
                                value="regulatory_body"
                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                            >
                                Facility Incharge Details
                            </Tabs.Tab> */}

                            </Tabs.List>
                            <Tabs.Panel
                                value="beds_cots"
                                className="grow-1 tab-panel"
                            >
                                {/* Beds and Cots Data Grid */}

                                <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                    <StyledDataGrid
                                        columns={propsToGridData(props, 0).columns}
                                        rows={propsToGridData(props, 0)?.rows}
                                        getRowClassName={() => `super-app-theme--Row`}
                                        rowSpacingType="border"
                                        showColumnRightBorder
                                        showCellRightBorder
                                        rowSelection={false}
                                        getCellClassName={() => 'super-app-theme--Cell'}
                                        slots={{
                                            toolbar: () => (
                                                <GridToolbar
                                                    sx={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        marginX: 'auto',
                                                        gap: 5,
                                                        padding: '0.45rem'
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                </div>


                            </Tabs.Panel>
                            <Tabs.Panel
                                value="keph_level"
                                className="grow-1 tab-panel"
                                
                            >
                                {/* Keph Level Data grid */}

                                <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                    <StyledDataGrid
                                        columns={propsToGridData(props, 1).columns}
                                        rows={propsToGridData(props, 1)?.rows}
                                        getRowClassName={() => `super-app-theme--Row`}
                                        rowSpacingType="border"
                                        showColumnRightBorder
                                        showCellRightBorder
                                        rowSelection={false}
                                        getCellClassName={() => 'super-app-theme--Cell'}
                                        slots={{
                                            toolbar: () => (
                                                <GridToolbar
                                                    sx={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        marginX: 'auto',
                                                        gap: 5,
                                                        padding: '0.45rem'
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                </div>

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="facility_ownership"
                                className="grow-1 tab-panel"

                            >
                                {/* Facility Ownership */}
                                <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                    <StyledDataGrid
                                        columns={propsToGridData(props, 2).columns}
                                        rows={propsToGridData(props, 2)?.rows}
                                        getRowClassName={() => `super-app-theme--Row`}
                                        rowSpacingType="border"
                                        showColumnRightBorder
                                        showCellRightBorder
                                        rowSelection={false}
                                        getCellClassName={() => 'super-app-theme--Cell'}
                                        slots={{
                                            toolbar: () => (
                                                <GridToolbar
                                                    sx={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        marginX: 'auto',
                                                        gap: 5,
                                                        padding: '0.45rem'
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                </div>

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="facility_type"
                                className="grow-1 tab-panel"

                            >
                                {/* Facility Type */}

                                <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                    <StyledDataGrid
                                        columns={propsToGridData(props, 3).columns}
                                        rows={propsToGridData(props, 3)?.rows}
                                        getRowClassName={() => `super-app-theme--Row`}
                                        rowSpacingType="border"
                                        showColumnRightBorder
                                        showCellRightBorder
                                        rowSelection={false}
                                        getCellClassName={() => 'super-app-theme--Cell'}
                                        slots={{
                                            toolbar: () => (
                                                <GridToolbar
                                                    sx={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        marginX: 'auto',
                                                        gap: 5,
                                                        padding: '0.45rem'
                                                    }}
                                                />
                                            ),
                                        }}
                                    />
                                </div>

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="regulatory_body"
                                className="grow-1 py-1 px-4 tab-panel"
                            >
                                {/* Regulatory Body  */}
                            </Tabs.Panel>
                            <Tabs.Panel
                                value="services"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="infrastructure"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="human_resources"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>
                            <Tabs.Panel
                                value="geocodes"
                                className="grow-1 py-1 px-4 tab-panel"
                            >

                            </Tabs.Panel>


                        </Tabs.Root>
                    </div>



                </div>
            </MainLayout>
        </div>
    )
}

Reports.getInitialProps = async (ctx) => {

    const reports = [
        'beds_and_cots_by_all_hierachies',
        'facility_keph_level_report_all_hierachies',
        'facility_owner_report_all_hierachies',
        'facility_type_report_all_hierachies',
        'facility_regulatory_body_report_all_hierachies',
        'chul_status_all_hierachies',
        'chul_services_all_hierachies'
    ];

    const allReports = [];

    // const fetchData = (token) => {
    //     let url = `${API_URL}/reporting/?report_type=beds_and_cots_by_all_hierachies`
    //     let query = { 'searchTerm': '' }
    //     if (ctx?.query?.qf) {
    //         query.qf = ctx.query.qf
    //     }
    //     if (ctx?.query?.q) {
    //         query.searchTerm = ctx.query.q
    //         url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
    //     }


    //     let current_url = url + '&page_size=100000'
    //     if (ctx?.query?.page) {

    //         url = `${url}&page=${ctx.query.page}`
    //     }

    //     return fetch(url, {
    //         headers: {
    //             'Authorization': 'Bearer ' + token,
    //             'Accept': 'application/json'
    //         }
    //     }).then(r => r.json())
    //         .then(json => {
    //             return {
    //                 data: json, query, token, path: ctx.asPath || '/users', current_url: current_url
    //             }

    //         }).catch(err => {
    //             console.log('Error fetching facilities: ', err)
    //             return {
    //                 error: true,
    //                 err: err,
    //                 data: [],
    //                 query: {},
    //                 path: ctx.asPath || '/users',
    //                 current_url: ''
    //             }
    //         })
    // }

    return checkToken(ctx.req, ctx.res).then(async (t) => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token;
            let url = '';

            // return fetchData(token).then(t => t);

            for (let i = 0; i < reports.length; i++) {
                const report = reports[i];
                switch (report) {
                    case 'beds_and_cots_by_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })


                            allReports.push({ beds_and_cots_by_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                beds_and_cots_by_all_hierachies: [],
                                url
                            });
                        }

                        break;
                    case 'facility_keph_level_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;

                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_keph_level_report_all_hierachies: (await _data.json()).results })


                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_types: [],
                            });
                        }
                        break;
                    case 'facility_owner_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_owner_report_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                owners: [],
                            });
                        }

                        break;
                    case 'facility_type_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_type_report_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                owner_types: [],
                            })
                        }

                        break;
                    case 'facility_regulatory_body_report_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ facility_regulatory_body_report_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                keph: [],
                            })
                        }

                        break;
                    case 'chul_status_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_status_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_admission_status: [],
                            })
                        }
                        break;
                    case 'chul_services_all_hierachies':
                        url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                        try {

                            const _data = await fetch(url, {
                                headers: {
                                    Authorization: 'Bearer ' + token,
                                    Accept: 'application/json',
                                },
                            })

                            allReports.push({ chul_services_all_hierachies: (await _data.json()).results })

                        }
                        catch (err) {
                            console.log(`Error fetching ${report}: `, err);
                            allReports.push({
                                error: true,
                                err: err,
                                facility_admission_status: [],
                            })
                        }
                        break;


                }
            }

            return allReports
        }
    })
        .catch((err) => {
            console.log('Error checking token: ', err);
            if (typeof window !== 'undefined' && window) {
                if (ctx?.asPath) {
                    window.location.href = ctx?.asPath;
                } else {
                    window.location.href = '/reports';
                }
            }
            setTimeout(() => {
                return {
                    error: true,
                    err: err,
                    data: [],
                };
            }, 1000);
        });

}

export default Reports