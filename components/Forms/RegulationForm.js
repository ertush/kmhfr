import { useState, useContext, useMemo, useEffect, useRef, useCallback, createContext } from 'react';
import { Formik, Field, Form } from 'formik'
import { FormOptionsContext } from '../../pages/facilities/add';
import Select from './formComponents/FormikSelect';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlusIcon } from '@heroicons/react/outline';
import FacilityDepartmentUnits from './formComponents/FacilityDepartmentUnits'
import { handleRegulationSubmit, handleRegulationUpdates } from '../../controllers/facility/facilityHandlers';
import { useAlert } from 'react-alert';
import Spinner from '../Spinner';
import { useRouter } from 'next/router';
import { Alert } from '@mui/lab'
import { UpdateFormIdContext } from './Form';

export const FacilityDepartmentUnitsContext = createContext();

export function RegulationForm() {

    // Context
    const options = useContext(FormOptionsContext);
    const setFormId = useContext(UpdateFormIdContext)


    // Edit Stuff
    const facilityRegulationData = {};
    facilityRegulationData['regulatory_body'] = options?.data?.regulatory_body;
    facilityRegulationData['regulation_status'] = options?.data?.regulation_status;
    facilityRegulationData['license_number'] = options?.data?.license_number;
    facilityRegulationData['registration_number'] = options?.data?.registration_number;
    facilityRegulationData['license_document'] = options?.data?.facility_license_document

    options?.data?.facility_units?.forEach((unit, i) => {
    facilityRegulationData[`facility_unit_${i}`] = unit.unit
    facilityRegulationData[`facility_regulating_body_name_${i}`] = unit.regulating_body_name
    facilityRegulationData[`facility_license_number_${i}`] = unit.license_number
    facilityRegulationData[`facility_registration_number_${i}`] = unit.registration_number

    })

    const alert = useAlert()
    const router = useRouter()

 
    const [facilityId, setFacilityId] = useMemo(() => {
        let id = ''
    
        function setId(_id) {
            id = _id
        }
    
        if(window) {
            setId(new URL(window.location.href).searchParams.get('facilityId') ?? '')
        }
    
        return [id, setId]
    }, [])

    const [facilityContactsUrl, setFacilityContactsUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [licenseFile, setLicenseFile] = useState(null);
    const [formError, setFormError] = useState(null);



    const [facilityDepts, setFacilityDepts] = useState([
        (() => (
            <FacilityDepartmentUnits
            index={0}
            setFacilityDepts={() => null}
            facilityDeptOptions={options.facility_depts}
            fieldNames={['facility_unit', 'facility_regulating_body_name', 'facility_license_number', 'facility_registration_number']}
            
        />  
        ))()
    ]);

   
    // State
   
    const [hideLicenseNumber, setHideLicenseNumber] = useState(false);
    const [hideRegistrationNumber, setHideRegistrationNumber] = useState(false);

 
    const formFields = useMemo(() => {
        let vals = {}


        if (options?.data) {

             
        for(let i = 0; i < facilityDepts.length; i++){
            vals[`facility_unit_${i}`] = "";
            vals[`facility_regulating_body_name_${i}`] = "";
            vals[`facility_license_number_${i}`] = "";
            vals[`facility_registration_number_${i}`] = ""; 
        }
        
        
        vals['regulatory_body'] = "";
        vals['regulation_status'] = "";
        if(hideLicenseNumber) {
            vals['license_number'] = "";
            vals['registration_number'] = "";
        }
     
        vals['license_document'] = "";
        
    }
        return vals
    }, [facilityDepts])
    

    const [initialValues, handleFormUpdate] = useState(options?.data ? facilityRegulationData :  formFields)


    const [formValues, setFormValues] = useState(options?.data ? facilityRegulationData : formFields /*initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields*/)

    
   if(formValues) delete formValues['license_document'];

    // Ref
    const _regBodyRef = useRef(null)
    const fileRef = useRef(null)
    const formRef = useRef(null)

    // Event Handlers
 
 const handleRegulationPrevious = useCallback((event) => {
        // setFormId(`${formId - 1}`)

        event.preventDefault();



        router.push({
            pathname: '/facilities/add',
            query: {
                formId: 2,
                from:'previous',
                facilityId
            }
        })
        .then((navigated) => {
            if(navigated) setFormId(2)
        })


        // window.location.url = previous_url

    }
, []);

 
function handleLicenseFileChange (e) {
    e.preventDefault()

    setLicenseFile(e?.files)
 }

    // Effects
    useEffect(() => {

        const _units = [];

        const currentUrl = new URL(window.location.href)

        const initialValueObj = options?.data ? facilityRegulationData : typeof initialValues == 'string' ? JSON.parse(initialValues) : {}

        const unitCount = Object.keys(initialValueObj).filter(x => /^facility_unit_\d/.test(x)).length;

        if(window && currentUrl.searchParams.get("from") == "previous") {
            
            const regulationDataEnc = window.localStorage.getItem('regulation')
            const regulationDataStr = Buffer.from(regulationDataEnc ?? 'e30=' , 'base64').toString()
            const regulationData = JSON.parse(regulationDataStr)

            const regData = {}
            
            console.log({regulationDataEnc, regulationData})

            let i = 0

            for (const data of regulationData){
                for(const [k, v] of Object.entries(data)) {
                    if(k == "units"){
                        for(const unit of v){
                            for(const [_k, _v] of Object.entries(unit)){
                                regData[`facility_${_k}_${i}`] = _v
                            }
                            i += 1
                        } 
                    } else {
                         regData[k] = v

                    }
                }
            }

            setFormValues(regData)
        }

        if(unitCount > 1){
            for(let i = 0; i < unitCount; i++) {
                _units.push( (() => (
                    <FacilityDepartmentUnitsContext.Provider value={facilityDepts}>
                       <FacilityDepartmentUnits
                           setFacilityDepts={setFacilityDepts}
                           facilityDeptOptions={options.facility_depts}
                           index={i}
                           fieldNames={['facility_unit', 'facility_regulating_body_name', 'facility_license_number', 'facility_registration_number']}
                     
                       />  
                   </FacilityDepartmentUnitsContext.Provider>
                   ))())
            }
            
            setFacilityDepts([
                ..._units
            ])
        }

    },[])


    // Constants


    return (
        <Formik
            initialValues={formValues}
            onSubmit={(values) => {
                
                setSubmitting(true)
                
                options?.data ? 
                handleRegulationUpdates(options?.token, values, options?.data?.id, fileRef.current, setSubmitting, router, alert, setFormError)
                :
                handleRegulationSubmit(options.token, values, facilityId, setSubmitting, fileRef.current, alert, setFormError)
                

            }}
            // validationSchema={toFormikValidationSchema(formSchema)}
            enableReinitialize
            >
            {
                (formikState) => {
                    const errors = formikState.errors;

                    // Form 
                    
                    // Hide license and registration fields

                    if(formikState?.values?.regulatory_body?.includes('0b2311d1-6049-4b8d-9c74-cbda8bf6579c')){
                        setHideLicenseNumber(true)
                        setHideRegistrationNumber(true)
                        
                    } else {
                        setHideRegistrationNumber(false)
                        setHideLicenseNumber(false)

                    }

                    useEffect(() => {
                       
                        for(let i = 0; i < facilityDepts.length; i++){   
                            if(formikState.values[`facility_unit_${i}`]){
                                const reg_body = options.facility_depts.find(({value}) => value == formikState.values[`facility_unit_${i}`])?.reg_body_name;

                             
                                formikState.values[`facility_regulating_body_name_${i}`] = reg_body;
                            }
                         }   


                        handleFormUpdate(JSON.stringify(formikState.values))

                        
                    }, [formikState.values])

               

                                            
                  return (
                   <>
                        <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900">Facility Regulation</h4>
                        <Form ref={formRef} name="facility_regulation_form" className='flex flex-col w-full items-start bg-gray-50 p-4 justify-start gap-3' >

                            {formError && <Alert severity='error' className={'w-full'}>{formError}</Alert>}

                            {/* Regulatory Body */}
                            <div className="w-full flex flex-col background items-start justify-start gap-1 mb-3">
                                <label htmlFor="regulatory_body" className="text-gray-600 capitalize text-sm">Regulatory Body<span className='text-medium leading-12 font-semibold'> *</span> </label>
                                <Select
                                    options={((regOptions) => {

                                        return regOptions.filter(({ label }) => !(label === 'Other'))

                                    })(options.regulating_bodies || [])}
                                    required
                                    ref={_regBodyRef}
                                    placeholder="Select Regulatory Body"
                                    name='regulatory_body'
                                   />

                            </div>

                            {/* Regulation Status */}
                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label htmlFor="regulation_status" className="text-gray-600 capitalize text-sm">Regulation Status</label>
                                <Select
                                    options={((regStateOpts) => {

                                        let filteredRegState
                                        if (_regBodyRef.current) {

                                            if (formikState.values.regulatory_body === '0b2311d1-6049-4b8d-9c74-cbda8bf6579c') {
                                                filteredRegState = regStateOpts.filter(({ label }) => (!(label.match(/.*[L|l]icense.*/) !== null) && !(label.match(/.*Regist.*/) !== null) ))
                                            }
                                            else {
                                                filteredRegState = regStateOpts
                                            }
                                        }
                                        else {
                                            filteredRegState = regStateOpts
                                        }

                                        return filteredRegState

                                    })(options.regulation_status || [])}
                                    required
                                    placeholder="Select Regulation Status"
                                    name='regulation_status'
                                    />
                            </div>

                            {/* License Number */}
                            {
                             !hideLicenseNumber &&
                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label htmlFor="license_number" className="text-gray-600 bg-transparent capitalize text-sm">License Number</label>
                                <Field type="text" name="license_number" className="flex-none  w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none" />
                            </div>
                            }


                            {/* Registration Number */}
                            {
                              !hideRegistrationNumber &&
                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label htmlFor="registration_number" className="text-gray-600 bg-transparent capitalize text-sm">Registration Number</label>
                                <Field type="text" name="registration_number" className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none" />
                            </div>
                            }       

                            {/* check file upload */}
                            <div className=" w-full flex flex-col items-start justify-start py-3  h-auto">
                                <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                    <label htmlFor="license_document" className="text-gray-600 capitalize text-sm">Upload license document</label>
                                    <Field type="file" onChange={handleLicenseFileChange} name="license_document" innerRef={fileRef} className="flex-none w-full   p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none" />
                                </div>
                            </div>

                            {/* Facility Departments Regulation  */}
                            <h5 className="text-lg uppercase pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900">Facility Departments Regulation</h5>
                            <div className='grid grid-cols-4 place-content-start gap-3 w-full border border-gray-400 rounded  p-3'>

                                {/* Contact Headers */}
                                <h3 className='text-medium font-semibold text-gray-900'>Name</h3>
                                <h3 className='text-medium font-semibold  text-gray-900'>Regulatory Body</h3>
                                <h3 className='text-medium font-semibold  text-gray-900'>License Number</h3>
                                <h3 className='text-medium font-semibold  text-gray-900'>Reg. Number</h3>

                                <hr className='col-span-4' />

                                {/* add other fields */}
                                <div className='flex flex-col items-start justify-start gap-y-4'>

                                    {
                                        facilityDepts.map((facilityDept, i) => (
                                            <div className="w-full flex items-center justify-between gap-3 mt-3" key={i}>
                                    
                                                {facilityDept}

                                            
                                            </div>

                                        ))
                                    }
                                </div>

                            </div>


                            {/* Add btn */}
                            <div className='w-full flex justify-end items-center mt-2'>
                                {/* { console.log({facilityDepts: options.facility_depts}) } */}
                                
                                <button onClick={(e) => {
                                    e.preventDefault(); 


                                    setFacilityDepts([
                                        ...facilityDepts,
                                        (() => (
                                         <FacilityDepartmentUnitsContext.Provider value={facilityDepts}>
                                            <FacilityDepartmentUnits
                                                setFacilityDepts={setFacilityDepts}
                                                facilityDeptOptions={options.facility_depts}
                                                index={(facilityDepts.length + 1) - 1}
                                                fieldNames={['facility_unit', 'facility_regulating_body_name', 'facility_license_number', 'facility_registration_number']}
                                          
                                            />  
                                        </FacilityDepartmentUnitsContext.Provider>
                                        ))()
                                    ])

                                }} className='flex items-center space-x-1 bg-blue-700 p-1 '>

                                    <PlusIcon className='w-4 h-4 text-white' />
                                    <p className='text-medium font-semibold text-white'>Add</p>
                                </button>
                            </div>

                              {
                                  options?.data ?

                                      <div className='flex justify-end items-center w-full'>
                                          <button
                                              type='submit'
                                              disabled={submitting}
                                              className='flex items-center text-white justify-start space-x-2 bg-blue-700  p-1 px-2'>
                                               {
                                                    submitting ?
                                                        <div className='flex items-center gap-2'>
                                                            <span className='text-white'>Saving </span>
                                                            <Spinner />
                                                        </div>
                                                        :
                                                        'Save & Finish'

                                                }
                                          </button>
                                      </div>
                                      :

                                      <div className='flex justify-between items-center w-full'>
                                          <button onClick={handleRegulationPrevious}
                                              className='flex items-center justify-start space-x-2 p-1 group border border-gray-700 px-2'>
                                              <ChevronDoubleLeftIcon className='w-4 h-4 text-gray-900' />
                                              <span className='text-medium font-semibold text-gray-900'>Facility Contacts</span>
                                          </button>
                                          <button type="submit"  disabled={submitting} className={`${submitting ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center justify-start gap-2 text-white bg-blue-700  p-1 px-2`}>
                                                <span className='text-medium font-semibold text-white'>
                                                    {
                                                        submitting ?
                                                            <Spinner />
                                                            :
                                                            'Services'

                                                    }
                                                </span>
                                                {
                                                    submitting ?
                                                        <span className='text-white'>Saving </span>
                                                        :
                                                        <ChevronDoubleRightIcon className='w-4 h-4 text-white' />

                                                }
                                          </button>
                                      </div>
                              }
                        </Form>
                    </>
                   )

                }
            }
        </Formik>
 
    )
}