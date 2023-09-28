
import { useContext, useRef, useEffect, useState, useCallback } from 'react';
import { Field, Form, Formik } from 'formik';
import { object, string, number } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FacilityIdContext, FormContext } from './Form';
import Select from './formComponents/FromikSelect';
import { FormOptionsContext } from '../../pages/facilities/add';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/solid';
import { useLocalStorageState } from './hooks/formHook';
import { useAlert } from 'react-alert';
import { defer } from "underscore";
import { handleBasicDetailsSubmit, handleBasicDetailsUpdates } from '../../controllers/facility/facilityHandlers';
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
// import { sortOptions } from '../../utils/sort';



export function BasicDeatilsForm({ useGeoJSON, useGeoData }) {

  const options = useContext(FormOptionsContext);

  const alert = useAlert();

  // Constants
  const formFields = {
    official_name: "",
    name: "",
    facility_type: "",
    facility_type_details: "",
    operation_status: "",
    date_established: "",
    accredited_lab_iso_15189: "",
    owner_type: "",
    owner: "",
    keph_level: "",
    number_of_beds: "",
    number_of_inpatient_beds: "",
    number_of_cots: "",
    number_of_emergency_casualty_beds: "",
    number_of_icu_beds: "",
    number_of_hdu_beds: "",
    number_of_maternity_beds: "",
    number_of_isolation_beds: "",
    number_of_general_theatres: "",
    number_of_maternity_theatres: "",
    facility_catchment_population: "",
    reporting_in_dhis: "",
    admission_status: "",
    nhif_accreditation: "",
    is_classified: "",
    open_whole_day: "",
    open_late_night: "",
    open_public_holidays: "",
    open_weekends: "",
    open_normal_day: "",
    county_id: "",
    sub_county_id: "",
    constituency_id: "",
    ward: "",
    town_name: "",
    plot_number: "",
    nearest_landmark: "",
    location_desc: "",
    // facility_checklist_document: "",
  };

  // handle Edit staff
  const facilityBasicDetails = {}

  for (let item of Object.keys(formFields)) {
    facilityBasicDetails[item] = (item.includes('nhif_accreditation') || item.includes('reporting_in_dhis') || item.includes('accredited_lab_iso_15189'))
     ? `${options['19']?.data[item]}` : options['19']?.data[item];
  }

  // State
  const [facilityTypeValue, setFacilityTypeValue] = useState(null);
  const [ownerTypeLabel, setOwnerTypeLabel] = useState(null);
  const [_, setGeoJSON] = useGeoJSON();
  const [__, setWardName] = useGeoData('ward_data');
  const [___, setGeoCenter] = useGeoData('geo_data');

  const { updatedSavedChanges, updateFacilityUpdateData } = options['19']?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }

  // Facility update data

  const [initialValues, handleFormUpdate] = useLocalStorageState({
    key: options['19']?.data ? 'basic_details_edit_form' : 'basic_details_form',
    value: options['19']?.data ? facilityBasicDetails : formFields
  }).actions.use();


  // console.log({ facilityBasicDetails });



  const formValues = options['19']?.data ? facilityBasicDetails : initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields

  
 
  // Modify form values


  const [filteredOptions, setFilteredOptions] = useState({
    facilityTypeDetailOptions: [],
    ownerTypeOptions: []
  });


  // Context
  const [formId, setFormId] = useContext(FormContext);
  const [facilityId, setFacilityId] = useContext(FacilityIdContext);


  // Options
  const facilityTypeOptions = (() => {
    const f_types = [
      'STAND ALONE',
      'DISPENSARY',
      'MEDICAL CLINIC',
      'NURSING HOME',
      'HOSPITALS',
      'HEALTH CENTRE',
      'MEDICAL CENTER'
    ]

    const all_ftypes = []

    for (let type in f_types) all_ftypes.push(options['0']?.facility_types?.filter(({ sub_division }) => sub_division === f_types[type]))

    return all_ftypes.map(arr => ({
      label: arr[0]?.sub_division,
      value: arr[0]?.parent
    }));

  })()


  // const facilityOptions = (() => {
	// 	const f_types = [
	// 		'STAND ALONE',
	// 		'DISPENSARY',
	// 		'MEDICAL CLINIC',
	// 		'NURSING HOME',
	// 		'HOSPITALS',
	// 		'HEALTH CENTRE',
	// 		'MEDICAL CENTRE'
	// 	]

	// 	const all_ftypes = []


	// 	for (let type in f_types) all_ftypes.push(options[0]?.facility_types.find(({ sub_division }) => sub_division === f_types[type]))

	// 	return [{
	// 		label: all_ftypes[0].sub_division,
	// 		value: all_ftypes[0].parent
	// 	},
	// 	{
	// 		label: all_ftypes[1].sub_division,
	// 		value: all_ftypes[1].parent
	// 	},
	// 	{
	// 		label: all_ftypes[2].sub_division,
	// 		value: all_ftypes[2].parent
	// 	},
	// 	{
	// 		label: all_ftypes[3].sub_division,
	// 		value: all_ftypes[3].parent
	// 	},
	// 	{
	// 		label: all_ftypes[4].sub_division,
	// 		value: all_ftypes[4].parent
	// 	},
	// 	{
	// 		label: all_ftypes[5].sub_division,
	// 		value: all_ftypes[5].parent
	// 	}

	// 	]

	// })()


  const operationStatusOptions = [
    {
      value: '190f470f-9678-47c3-a771-de7ceebfc53c',
      label: 'Non-Operational',
    },
    {
      value: 'ae75777e-5ce3-4ac9-a17e-63823c34b55e',
      label: 'Operational',
    },
  ];

 

  // Effects
  useEffect(() => {

    function filterFacilityTypeDetailOptions() {

      const f_types = [
        'STAND ALONE',
        'DISPENSARY',
        'MEDICAL CLINIC',
        'NURSING HOME',
        'HOSPITALS',
        'HEALTH CENTRE',
        'MEDICAL CENTER'
      ]

      const all_ftypes = []

      let i = 0;

      for (i = 0; i < f_types.length; i++) {
        all_ftypes.push(options['0']?.facility_types.filter(({ sub_division }) => sub_division === f_types[i]))
      }


      switch (facilityTypeValue) {
        // STAND ALONE 
        case '85f2099b-a2f8-49f4-9798-0cb48c0875ff':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[0].map(({ id: value, name: label }) => ({ label, value }))
          }))
          break;
        // DISPENSARY
        case '87626d3d-fd19-49d9-98da-daca4afe85bf':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[1].map(({ id: value, name: label }) => ({ label, value }))
          }))

          break;

        // MEDICAL CLINIC
        case '8949eeb0-40b1-43d4-a38d-5d4933dc209f':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[2].map(({ id: value, name: label }) => ({ label, value }))
          }))
          break;
        // NURSING HOME
        case '0b7f9699-6024-4813-8801-38f188c834f5':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[3].map(({ id: value, name: label }) => ({ label, value }))
          }))
          break;
        // HOSPITALS
        case '1f1e3389-f13f-44b5-a48e-c1d2b822e5b5':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[4].map(({ id: value, name: label }) => ({ label, value }))
          }))
          break;
        // HEALTH CENTER
        case '9ad22615-48f2-47b3-8241-4355bb7db835':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[5].map(({ id: value, name: label }) => ({ label, value }))
          }))
          break;
        // MEDICAL CENTER
        case 'df69577d-b90f-4b66-920a-d0f3ecd95191':
          setFilteredOptions((prev) => ({
            ...prev,
            facilityTypeDetailOptions: all_ftypes[5].map(({ id: value, name: label }) => ({ label, value }))
          }))
          break;

      }


    }

    filterFacilityTypeDetailOptions()

  }, [facilityTypeValue])

  useEffect(() => {

    function filterOwnerTypeOptions() {

      const own_types = [
        'Private Practice',
        'Non-Governmental Organizations',
        'Ministry of Health',
        'Faith Based Organization',

      ]


      switch (ownerTypeLabel) {
        case own_types[0]:
          setFilteredOptions((prev) => ({
            ...prev,
            ownerTypeOptions: [
              options['2']?.owners.filter(({ label }) => label == "Private Practice- Pharmacist")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice - Private Company")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice Lab Technician/Technologist")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice - Nurse / Midwifery")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice - Medical Specialist")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice - General Practitioner")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice - Clinical Officer")[0] || {},
              options['2']?.owners.filter(({ label }) => label == "Private Practice - Private Institution Academic")[0] || {}
            ]
          }))
          break;
        case own_types[1]:
          setFilteredOptions((prev) => ({
            ...prev,
            ownerTypeOptions: options['2']?.owners.filter(({ label }) => label == 'Non-Governmental Organizations')
          }))

          break;
        case own_types[2]:
          setFilteredOptions((prev) => ({
            ...prev,
            ownerTypeOptions: [
              options['2']?.owners.filter(({ label }) => label == "Public Institution - Parastatal")[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Ministry of Health')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Armed Forces')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Kenya Police Service')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'National Youth Service')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Prisons')[0] || {}

            ]
          }))
          break;
        case own_types[3]:
          setFilteredOptions((prev) => ({
            ...prev,
            ownerTypeOptions: [
              options['2']?.owners.filter(({ label }) => label == 'Seventh Day Adventist')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Supreme Council for Kenya Muslims')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Other Faith Based')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Seventh Day Adventist')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Kenya Episcopal Conference-Catholic Secretariat')[0] || {},
              options['2']?.owners.filter(({ label }) => label == 'Christian Health Association of Kenya')[0] || {},
            ]
          }))
          break;


      }
      // }

    }

    filterOwnerTypeOptions()

  }, [ownerTypeLabel])

  // Form Schema
  const formSchema = object({

    official_name: string({ required_error: "Facility Official Name is required" }),
    name: string({ required_error: "Facility Unique Name is required" }),
    facility_type: string({ required_error: "Facility Type is required" }).min(1),
    facility_type_details: string({ required_error: "Facility Type Details is required" }).min(1),
    operation_status: string({ required_error: "Operation Status is required" }),
    date_established: string({
      required_error: "Date established is required",
      invalid_type_error: "Invalid  date"
    }),
    owner_type: string({ required_error: "Owner Category is required" }).min(1),
    owner: string({ required_error: "Owner Deatils is required" }).min(1),
    number_of_beds: number({ required_error: "Total Functional In-patient Beds is required" }).min(0, 'Must be at least 0'),
    number_of_inpatient_beds: number({ required_error: "Number of General In-patient Beds is required" }).min(0, 'Must be at least 0'),
    number_of_cots: number({ required_error: "Number of Functional Cots is required" }).min(0, 'Must be at least 0'),
    number_of_emergency_casualty_beds: number({ required_error: "Number of Emergency Casulty Beds is required" }).min(0, 'Must be at least 0'),
    number_of_icu_beds: number({ required_error: "Number of Intensive Care Unit (ICU) Beds is required" }).min(0, 'Must be at least 0'),
    number_of_hdu_beds: number({ required_error: "Number of High Dependency Unit (HDU) Beds is required" }).min(0, 'Must be at least 0'),
    number_of_maternity_beds: number({ required_error: "Number of Maternity Beds is required" }).min(0, 'Must be at least 0'),
    number_of_isolation_beds: number({ required_error: "Number of Isolation Beds is required" }).min(0, 'Must be at least 0'),
    number_of_general_theatres: number({ required_error: "Number of General Theatres is required" }).min(0, 'Must be at least 0'),
    number_of_maternity_theatres: number({ required_error: "Number of Maternity Theatres is required" }).min(0, 'Must be at least 0'),
    admission_status: string({ required_error: "Facility admissions is required" }),
    reporting_in_dhis: string({ required_error: 'Reporting in DHIS is required' }),
    county_id: string({ required_error: "County is required" }).min(1),
    sub_county_id: string({ required_error: "Sub County is required" }).min(1),
    constituency_id: string({ required_error: "Constituency is required" }).min(1),
    ward: string({ required_error: "Ward is required" }).min(1),
    // facility_checklist_document: string({ required_error: "Checklist file upload is required" })

  });

  // Refs
  const facilityTypeDetailsRef = useRef(null);
  const checkListFileRef = useRef(null);

  if(options['19']?.data){

    formValues['facility_type'] = facilityTypeOptions.find(({label}) => label == options['19']?.data?.facility_type_parent)?.value
    formValues['facility_type_details'] = filteredOptions.facilityTypeDetailOptions.find(({label}) => label == options['19']?.data?.facility_type_name)?.value
    
    delete formValues['facility_checklist_document']; 

  
  }
  
  // console.log({formValues})

  return (
    <Formik
      initialValues={formValues}
      onSubmit={(values) => options['19']?.data ? 
      // Update existing facility
      handleBasicDetailsUpdates(options['22']?.token, values, facilityId, updatedSavedChanges, alert)
      .then((resp) => {
        defer(() => updatedSavedChanges(true));
 
        if (resp.ok) { 
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`,
            {
             headers: {
              'Authorization': 'Bearer ' + options['22']?.token,
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json;charset=utf-8'
             } 
      
            }
          )
            .then(async (resp) => {
              const results = await resp.json();

              if (results?.latest_update) {
                try {
                  const _facilityUpdateData = await (
                    await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${results?.latest_update}/`,
                      {
                        headers: {
                         'Authorization': 'Bearer ' + options['22']?.token,
                         'Accept': 'application/json, text/plain, */*',
                         'Content-Type': 'application/json;charset=utf-8'
                        } 
                 
                       }
                      
                    )
                  ).json();

                  _facilityUpdateData['code'] = results?.code;
                  _facilityUpdateData['facilityId'] = facilityId;

                  updateFacilityUpdateData(_facilityUpdateData);
                } catch (e) {
                  console.error(
                    "Encountered error while fetching facility update data",
                    e.message
                  );
                }
              }
            })
            .catch((e) =>
              console.error(
                "unable to fetch facility update data. Error:",
                e.message
              )
            );
        }
      })
      .catch((e) =>
        console.error(
          "unable to fetch facility data. Error:",
          e.message
        )
      )
        
      : 
      // Post new facility
      handleBasicDetailsSubmit(options['18']?.token, values, formId, setFormId, checkListFileRef.current, alert, setGeoJSON, setWardName, setGeoCenter, setFacilityId)}
      validationSchema={toFormikValidationSchema(formSchema)}
      enableReinitialize
    >

      {
        (formikState) => {
          const errors = formikState.errors;



          //Effects

          useEffect(() => {

            if(!options['19']?.data){
              handleFormUpdate(JSON.stringify(formikState?.values))
            }

          }, [handleFormUpdate, formikState?.values])

          // Form Validations

          // if(formikState?.values?.facility_type !== ""){
           

          //     const facilityTypeDetails =  options['1']?.facility_type_details?.find(
          //       ({ value }) => value.includes(formikState?.values?.facility_type)
          //     )?.value ?? " ";

             
          //     // console.log({facilityTypeDetails})
          // }

      
          // Hours/Days duration form rules
          if (formikState?.values?.open_whole_day) {
            formikState?.values?.open_late_night = true;
            formikState?.values?.open_public_holidays = true;
            formikState?.values?.open_weekends = true;
            formikState?.values?.open_normal_day = true;
          }

          // Number of beds form rule
          if (

            formikState?.values?.number_of_inpatient_beds !== "" ||
            formikState?.values?.number_of_icu_beds !== "" ||
            formikState?.values?.number_of_hdu_beds !== "" ||
            formikState?.values?.number_of_emergency_casualty_beds !== ""

          ) {

            formikState?.values?.number_of_beds = (Number(formikState?.values?.number_of_inpatient_beds) ?? 0) +
              (Number(formikState?.values?.number_of_icu_beds) ?? 0) +
              (Number(formikState?.values?.number_of_hdu_beds) ?? 0) +
              (Number(formikState?.values?.number_of_maternity_beds) ?? 0) +
              (Number(formikState?.values?.number_of_emergency_casualty_beds) ?? 0)
          }

          if (formikState?.values?.facility_type !== "") setFacilityTypeValue(formikState?.values?.facility_type)

        
          if (formikState?.values?.owner_type !== "" && options['3']?.owner_types ) setOwnerTypeLabel(() => {
            return options['3']?.owner_types?.filter(({ value }) => value === formikState?.values?.owner_type)[0]?.label
          })

          // if owner == 'armed forces' then check the facility classified field
          if(formikState?.values?.owner.includes("93c0fe24-3f12-4be2-b5ff-027e0bd02274")){
              formikState?.values?.is_classified = true;
          } else {
            formikState?.values?.is_classified = false;
          }

          // Facility type & Keph level form rule
          switch (formikState?.values?.facility_type) {
            // STAND ALONE 
            case '85f2099b-a2f8-49f4-9798-0cb48c0875ff':
              formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 2')?.value;
              break;
            // DISPENSARY
            case '87626d3d-fd19-49d9-98da-daca4afe85bf':
              formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 2')?.value
              break;

            // MEDICAL CLINIC
            case '8949eeb0-40b1-43d4-a38d-5d4933dc209f':
              formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 2')?.value
              break;

            // NURSING HOME
            case '0b7f9699-6024-4813-8801-38f188c834f5':
              formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 3')?.value
              break;

            // HEALTH CENTER
            case '9ad22615-48f2-47b3-8241-4355bb7db835':
              formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 3')?.value
              break;

            // MEDICAL CENTER
            case 'df69577d-b90f-4b66-920a-d0f3ecd95191':
              formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 3')?.value
              break;
            // HOSIPTALS
            case '1f1e3389-f13f-44b5-a48e-c1d2b822e5b5':

              // Comprehensive Teaching & Tertiary Referral Hospital
              if (formikState?.values?.facility_type_details === 'b9a51572-c931-4cc5-8e21-f17b22b0fd20') {
                formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 6')?.value
                break;
              }

              // Specialized & Tertiary Referral hospitals
              if (formikState?.values?.facility_type_details === '52ccbc58-2a71-4a66-be40-3cd72e67f798') {
                formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 6')?.value
                break;
              }


              // Secondary care hospitals
              if (formikState?.values?.facility_type_details === 'f222bab7-589c-4ba8-bd9a-fe6c96fcd085') {
                formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 5')?.value
                break;
              }


              // Primary care hospitals
              if (formikState?.values?.facility_type_details === '0fa47f39-d58e-4a16-845c-82818719188d') {
                formikState?.values?.keph_level = options['4']?.keph.find(({ label }) => label === 'Level 4')?.value
                break;

              }


          }

          return (

            <Form name='basic_details_form'
              className='flex flex-col w-full mt-4 items-start bg-blue-50 shadow-md p-3 justify-start gap-3'>

              {/* Facility Official Name */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='official_name'
                  className='text-gray-600 capitalize text-sm'>
                  Facility Official Name
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='text'
                  name='official_name'
                  className='flex-none w-full bg-blue-50 p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.official_name && <span className='font-normal text-sm text-red-500 text-start'>{errors.official_name}</span>}
              </div>
              {/* Facility Unique Name  */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-2'>
                <label
                  htmlFor='name'
                  className='text-gray-600 capitalize text-sm'>
                  Facility Unique Name
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='text'
                  name='name'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.name && <span className='font-normal text-sm text-red-500 text-start'>{errors.name}</span>}

              </div>
              {/* Facility Type */}
              <div className={`${options['19']?.data ? "cursor-not-allowed" : "cursor-default"} w-full flex flex-col items-start justify-start gap-1 mb-3`}>
                <label
                  htmlFor='facility_type'
                  className='text-gray-600 capitalize text-sm'>
                  Facility Type{' '}
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                {
                  
                  // console.log({facilityTypeOptions})
                }

                <Select
                  options={facilityTypeOptions}
                  placeholder="Select a facility type..."
                  required
                  name='facility_type'
                  disabled={options['19']?.data ? true: false}
                />
                {errors.facility_type && <span className='font-normal text-sm text-red-500 text-start'>{errors.facility_type}</span>}

              </div>
              {/* Facility Type Details */}
              
              <div className={`${options['19']?.data ? "cursor-not-allowed" : "cursor-default"} w-full flex flex-col items-start justify-start gap-1 mb-3`}>
                <label
                  htmlFor='facility_type_details'
                  className='text-gray-600 capitalize text-sm'>
                  Facility Type Details
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>

                <Select
                  ref={facilityTypeDetailsRef}
                  options={filteredOptions.facilityTypeDetailOptions} //options['1']?.facility_type_details //
                  placeholder="Select facility type details..."
                  required
                  name='facility_type_details'
                  disabled={options['19']?.data ? true: false}

                />

                {errors.facility_type_details && <span className='font-normal text-sm text-red-500 text-start'>{errors.facility_type_details}</span>}


              </div>
      

              {/* Operation Status*/}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='operation_status'
                  className='text-gray-600 capitalize text-sm'>
                  Operation Status
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Select
                  options={operationStatusOptions}
                  placeholder="Select operation status..."
                  required
                  name='operation_status'

                />
                {errors.operation_status && <span className='font-normal text-sm text-red-500 text-start'>{errors.operation_status}</span>}
              </div>
              {/* Date Established */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='date_established'
                  className='text-gray-600 capitalize text-sm'>
                  Date Established
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  type="date"
                  required
                  name="date_established"
                  className='flex-none w-full bg-transparent p-2 flex-grow placeholder-gray-500 border border-blue-600 focus:shadow-none  focus:border-black outline-none'

                />
                {errors.date_established && <span className='font-normal text-sm text-red-500 text-start'>{errors.collection_date}</span>}
              </div>

              {/* Is Facility accredited */}
              <div className='flex flex-col w-full items-start'>
                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <label
                    htmlFor='accredited_lab_iso_15189'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    *Is the facility accredited Lab ISO 15189?{' '}
                  </label>
                  <span className='flex items-center gap-x-1'>
                    <Field
                      type='radio'
                      name='accredited_lab_iso_15189'
                      value="true"

                    />
                    <small className='text-gray-700'>Yes</small>
                  </span>
                  <span className='flex items-center gap-x-1'>
                    <Field
                      type='radio'
                      name='accredited_lab_iso_15189'
                      value="false"

                    />
                    <small className='text-gray-700'>No</small>
                  </span>

                </div>
                {errors.accredited_lab_iso_15189 && <span className='font-normal text-sm text-red-500 text-start'>{errors.accredited_lab_iso_15189}</span>}

              </div>
              {/* Owner Category */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='owner_type'
                  className='text-gray-600 capitalize text-sm'>
                  Owner Category
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Select
                  options={options['3']?.owner_types}
                  placeholder="Select owner category.."
                  required
                  name='owner_type'

                />
                {errors.owner_type && <span className='font-normal text-sm text-red-500 text-start'>{errors.owner_type}</span>}
              </div>

              {/* Owner Details */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='owner'
                  className='text-gray-600 capitalize text-sm'>
                  Owner Details
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Select
                  options={filteredOptions.ownerTypeOptions}
                  placeholder="Select owner.."
                  required
                  name='owner'

                />
                {errors.owner && <span className='font-normal text-sm text-red-500 text-start'>{errors.owner}</span>}
              </div>

              {/* KEPH Level */}
              <div className={`${options['19']?.data ? "cursor-not-allowed" : "cursor-default"} w-full flex flex-col items-start justify-start gap-1 mb-3`}>
                <label
                  htmlFor='keph_level'
                  className='text-gray-600 capitalize text-sm'>
                  KEPH Level
                </label>
                <Select
                  options={options['4']?.keph}
                  placeholder="Select a KEPH Level.."
                  name='keph_level'
                  disabled={options['19']?.data ? true: false}

                />
              </div>

              {/* Total Functional In-patient Beds */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Total Functional In-patient Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  readOnly
                  type='number'
                  min={0}
                  name='number_of_beds'
                  className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_beds}</span>}


              </div>

              {/* No of General In-patient Beds */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_inpatient_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Number of General In-patient Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>

                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_inpatient_beds'
                  className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_inpatient_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_inpatient_beds}</span>}

              </div>

              {/* No. Functional cots */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_cots'
                  className='text-gray-600 capitalize text-sm'>
                  Number of Functional Cots
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_cots'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_cots && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_cots}</span>}

              </div>

              {/* No. Emergency Casulty Beds */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_emergency_casualty_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Number of Emergency Casulty Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_emergency_casualty_beds'
                  className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_emergency_casualty_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_emergency_casualty_beds}</span>}


              </div>

              {/* No. Intensive Care Unit Beds */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_icu_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Number of Intensive Care Unit (ICU) Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_icu_beds'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_icu_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_icu_beds}</span>}


              </div>

              {/* No. High Dependency Unit HDU */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_hdu_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Number of High Dependency Unit (HDU) Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_hdu_beds'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_hdu_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_hdu_beds}</span>}


              </div>

              {/* No. of maternity beds */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_maternity_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Number of Maternity Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_maternity_beds'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_maternity_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_maternity_beds}</span>}


              </div>

              {/* No. of Isolation Beds */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_isolation_beds'
                  className='text-gray-600 capitalize text-sm'>
                  Number of Isolation Beds
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_isolation_beds'

                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_isolation_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_isolation_beds}</span>}


              </div>

              {/* No. of General Theatres */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_general_theatres'
                  className='text-gray-600 capitalize text-sm'>
                  Number of General Theatres
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>

                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_general_theatres'

                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_general_theatres && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_general_theatres}</span>}


              </div>

              {/* No. of Maternity Theatres */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='number_of_maternity_theatres'
                  className='text-gray-600 capitalize text-sm'>
                  Number of Maternity Theatres
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Field
                  required
                  type='number'
                  min={0}
                  name='number_of_maternity_theatres'

                  className='flex-none w-full  bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
                {errors.number_of_maternity_theatres && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_maternity_theatres}</span>}

              </div>

              {/* Facility Catchment Population */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='facility_catchment_population'
                  className='text-gray-600 capitalize text-sm'>
                  Facility Catchment Population
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}

                  </span>
                </label>
                <Field
                  type='number'
                  min={0}
                  name='facility_catchment_population'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />

              </div>

              {/* Is Reportsing DHIS2 */}
              <div className='flex flex-col w-full items-start'>
                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <label
                    htmlFor='reporting_in_dhis'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    *Should this facility have reporting in DHIS2?{' '}

                  </label>
                  <span className='flex items-center gap-x-1'>
                    <Field
                      type='radio'
                      name='reporting_in_dhis'
                      value="true"

                    />
                    <small className='text-gray-700'>Yes</small>
                  </span>
                  <span className='flex items-center gap-x-1'>
                    <Field
                      type='radio'
                      name='reporting_in_dhis'
                      value="false"

                    />
                    <small className='text-gray-700'>No</small>
                  </span>

                </div>
                {errors.reporting_in_dhis && <span className='font-normal text-sm text-red-500 text-start'>{errors.reporting_in_dhis}</span>}

              </div>

              {/* Facility Admissions */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='admission_status'
                  className='text-gray-600 capitalize text-sm'>
                  Facility admissions
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>

                <Select
                  options={options['5']?.facility_admission_status}
                  required
                  placeholder='Select an admission status..'
                  name='admission_status'
                />
                {errors.admission_status && <span className='font-normal text-sm text-red-500 text-start'>{errors.admission_status}</span>}

              </div>

              {/* Is NHIF accredited */}
              <div className='flex flex-col w-full items-start'>
                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <label
                    htmlFor='nhif_accreditation'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    *Does this facility have NHIF accreditation?{' '}


                  </label>
                  <span className='flex items-center gap-x-1'>
                    <Field
                      type='radio'
                      name='nhif_accreditation'
                      value="true"

                    />
                    <small className='text-gray-700'>Yes</small>
                  </span>
                  <span className='flex items-center gap-x-1'>
                    <Field
                      type='radio'
                      name='nhif_accreditation'
                      value="false"

                    />
                    <small className='text-gray-700'>No</small>
                  </span>

                </div>
                {errors.nhif_accreditation && <span className='font-normal text-sm text-red-500 text-start'>{errors.nhif_accreditation}</span>}

              </div>

              {/* Armed Forces Facilities */}
              <div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transaprent h-auto'>
                <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
                  Armed Forces Facilities
                </h4>
                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <label
                    htmlFor='is_classified'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    {' '}
                    Is this an Armed Force facility?{' '}
                  </label>
                  <Field
                    type="checkbox"
                    name='is_classified'
                  />
                </div>

              </div>

              {/* Hours/Days of Operation */}
              <div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transaprent h-auto'>
                <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
                  Hours/Days of Operation
                </h4>
                <div className='w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3'>

                  <Field
                    type='checkbox'
                    name='open_whole_day'

                  />
                  <label
                    htmlFor='open_24hrs'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    {' '}
                    Open 24 hours
                  </label>
                </div>

                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <Field
                    type='checkbox'
                    name='open_late_night'

                  />
                  <label
                    htmlFor='open_late_night'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    {' '}
                    Open Late Night
                  </label>
                </div>

                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <Field
                    type='checkbox'
                    name='open_public_holidays'

                  />
                  <label
                    htmlFor='open_public_holidays'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    {' '}
                    Open on public holidays
                  </label>
                </div>

                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <Field
                    type='checkbox'
                    name='open_weekends'

                  />
                  <label
                    htmlFor='open_weekends'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    {' '}
                    Open during weekends
                  </label>
                </div>

                <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
                  <Field
                    type='checkbox'
                    name='open_normal_day'

                  />
                  <label
                    htmlFor='open_normal_day'
                    className='text-gray-700 capitalize text-sm flex-grow'>
                    {' '}
                    Open from 8am to 5pm
                  </label>
                </div>
              </div>


              {/* Location Details */}
              <div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transaprent h-auto'>
                <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
                  Location Details
                </h4>
                <div className='grid grid-cols-4 place-content-start gap-3 w-full'>
                  {/* County  */}
                  <div className='col-start-1 col-span-1'>
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                        
                        {/* {console.log({counties: sortOptions(options['6']?.counties), options:options['6']?.counties})} */}

                      <label
                        htmlFor='county_id'
                        className='text-gray-600 capitalize text-sm'>
                        County
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>
                      <Select
                        options={options['6']?.counties} //
                        required
                        placeholder="Select County ..."
                        name='county_id'

                      />
                      {errors.county_id && <span className='font-normal text-sm text-red-500 text-start'>{errors.county_id}</span>}

                    </div>
                  </div>

                  {/* Sub-county */}
                  <div className='col-start-2 col-span-1'>
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='sub_county_id'
                        className='text-gray-600 capitalize text-sm'>
                        Sub-county
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>
                      <Select
                        options={options['7']?.sub_counties}
                        required
                        placeholder="Select Sub County..."
                        name='sub_county_id'


                      />
                      {errors.sub_county_id && <span className='font-normal text-sm text-red-500 text-start'>{errors.sub_county_id}</span>}
                    </div>
                  </div>

                  {/* Constituency */}
                  <div className='col-start-3 col-span-1'>
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='constituency_id'
                        className='text-gray-600 capitalize text-sm'>
                        Constituency
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>
                      <Select
                        options={options['8']?.constituencies}
                        required
                        placeholder="Select Constituency..."
                        name='constituency_id'


                      />
                      {errors.constituency_id && <span className='font-normal text-sm text-red-500 text-start'>{errors.constituency_id}</span>}

                    </div>
                  </div>

                  {/* Ward */}
                  <div className='col-start-4 col-span-1'>
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                      <label
                        htmlFor='ward'
                        className='text-gray-600 capitalize text-sm'>
                        Ward
                        <span className='text-medium leading-12 font-semibold'>
                          {' '}
                          *
                        </span>
                      </label>
                      <Select
                        options={options['9']?.wards}
                        required
                        placeholder="Select Ward ..."
                        name='ward'

                      />
                      {errors.ward && <span className='font-normal text-sm text-red-500 text-start'>{errors.ward}</span>}

                    </div>
                  </div>



                </div>


              </div>

              {/* Nearest Town/Shopping Centre */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='town_name'
                  className='text-gray-600 capitalize text-sm'>
                  Nearest Town/Shopping Centre
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}

                  </span>
                </label>
                <Field

                  type='text'
                  name='town_name'
                  className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
              </div>

              {/* Plot Number */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='plot_number'
                  className='text-gray-600 capitalize text-sm'>
                  Plot number
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}

                  </span>
                </label>
                <Field

                  type='text'
                  name='plot_number'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
              </div>

              {/* Nearest landmark */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='nearest_landmark'
                  className='text-gray-600 capitalize text-sm'>
                  Nearest landmark
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}

                  </span>
                </label>
                <Field

                  type='text'
                  name='nearest_landmark'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
              </div>

              {/* Location Description */}
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='location_desc'
                  className='text-gray-600 capitalize text-sm'>
                  location description
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}

                  </span>
                </label>
                <Field

                  type='text'
                  name='location_desc'
                  className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                />
              </div>


              {/* check file upload */}
              <div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-300/70 bg-transparent border-blue-600 h-auto'>
                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                  <label
                    htmlFor='facility_checklist_document'
                    className='text-gray-600 capitalize text-sm'>
                    checklist file upload
                   
                  </label>

                  <Field
                    type='file'
                    innerRef={checkListFileRef}
                    name='facility_checklist_document'
                    className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                  />

                  {/* {errors.facility_checklist_document && <span className='font-normal text-sm text-red-500 text-start'>{errors.facility_checklist_document}</span>} */}

                </div>
              </div>


              {/* Cancel & Geolocation */}
              {
                options['19']?.data  ? 

                <div className='flex justify-end items-center w-full'>
                  <button
                    type='submit'
                    className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                    <span className='text-medium font-semibold text-white'>
                      Save & Finish
                    </span>
                    {/* <ChevronDoubleRightIcon className='w-4 h-4 text-white' /> */}
                  </button>
              </div>

                :

              <div className='flex justify-between items-center w-full'>
                <button className='flex items-center justify-start space-x-2 p-1 border border-blue-900  px-2'>
                  <ChevronDoubleLeftIcon className='w-4 h-4 text-blue-900' />
                  <span className='text-medium font-semibold text-blue-900 '>
                    Cancel
                  </span>
                </button>
                <button
                  type='submit'
                  className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                  <span className='text-medium font-semibold text-white'>
                    Geolocation
                  </span>
                  <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
                </button>
              </div>
            }

            </Form>

          )
        }

      }
    </Formik>

  )
}