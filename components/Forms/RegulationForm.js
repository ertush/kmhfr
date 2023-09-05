import { useState, useContext, useMemo, useEffect, useRef, useCallback, createContext } from 'react';
import { Formik, Field, Form } from 'formik'
import { FormContext } from './Form';
import { object, string } from "zod";
import { FormOptionsContext } from '../../pages/facilities/add';
import {useLocalStorageState} from './hooks/formHook';
import Select from './formComponents/FromikSelect';
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlusIcon } from '@heroicons/react/outline';
import FacilityDepartmentUnits from './formComponents/FacilityDepartmentUnits'
import { FacilityIdContext } from './Form'
import { handleRegulationSubmit } from '../../controllers/facility/facilityHandlers';


export const FacilityDepartmentUnitsContext = createContext();

export function RegulationForm() {

    // Context
    const options = useContext(FormOptionsContext);
    const[facilityId, _] = useContext(FacilityIdContext);

    const [facilityDepts, setFacilityDepts] = useState([
        (() => (
            <FacilityDepartmentUnits
            index={0}
            setFacilityDepts={() => null}
            facilityDeptOptions={options['12']?.facility_depts}
            fieldNames={['facility_unit', 'facility_regulating_body_name', 'facility_license_number', 'facility_registration_number']}
            
        />  
        ))()
    ]);

    const formFields = useMemo(() => {
        const vals = {}
        for(let i = 0; i < facilityDepts.length; i++){
            vals[`facility_unit_${i}`] = "";
            vals[`facility_regulating_body_name_${i}`] = "";
            vals[`facility_license_number_${i}`] = "";
            vals[`facility_registration_number_${i}`] = ""; 
        }
        
        
        vals['regulatory_body'] = "";
        vals['regulation_status'] = "";
        vals['license_number'] = "";
        vals['registration_number'] = "";
        vals['license_document'] = "";
        

        return vals
    }, [facilityDepts])

    // State
    const [formId, setFormId] = useContext(FormContext);
    const [initialValues, handleFormUpdate] = useLocalStorageState({
        key: 'regulation_form',
        value: formFields
      }).actions.use();

    const formValues =  initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields;
    delete formValues['license_document'];



    // FormSchema
    const formSchema = useMemo(() => object({
        regulatory_body: string({required_error:""}),
        regulation_status:string({required_error:""}),
        license_number:string({required_error:""}),
        registration_number:string({required_error:""}),
        // facility_unit', 'facility_regulating_body_name', 'facility_license_number', 'facility_registration_number
        ...(() => {
            const schema = {}
            if(facilityDepts.length > 1){
                for(let i = 0; i < facilityDepts.length; i++){
                    schema[`facility_unit_${i}`] = string({ required_error: "Facility unit is required" }).min(1);
                    schema[`facility_regulating_body_name_${i}`] = string({ required_error: "Facility unit regulation body is required" }).min(1);
                    schema[`facility_license_number_${i}`] = string({ required_error: "Facility unit license number required" }).min(1);
                    schema[`facility_registration_number_${i}`] = string({ required_error: "Facility unit registration number is required" }).min(1);


                }
            }

          


            return schema
        })()


    }), [])

    // Ref
    const _regBodyRef = useRef(null)
    const fileRef = useRef(null)

    // Event Handlers
 
    const handleRegulationPrevious = useCallback((event) => {
        event.preventDefault();
        setFormId(`${formId - 1}`)
    }
, []);


    // Effects



    // Constants



// console.log({facilityBasicDetails})
    return (
        <Formik
            initialValues={formValues}
            onSubmit={(values) => handleRegulationSubmit(values, [formId, setFormId, facilityId], fileRef.current)}
            validationSchema={toFormikValidationSchema(formSchema)}
            enableReinitialize
        >

            {
                (formikState) => {
                    const errors = formikState.errors;

                    useEffect(() => {
                       
                        for(let i = 0; i < facilityDepts.length; i++){   
                            if(formikState.values[`facility_unit_${i}`]){
                                const reg_body = options['12']?.facility_depts.find(({value}) => value == formikState.values[`facility_unit_${i}`])?.reg_body_name;

                             
                                formikState.values[`facility_regulating_body_name_${i}`] = reg_body;
                            }
                         }   


                        handleFormUpdate(JSON.stringify(formikState.values))

                        
                    }, [formikState.values])

               

                              
                  return (
                   <>
                        <h4 className="text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Facility Regulation</h4>
                        <Form name="facility_regulation_form" className='flex flex-col w-full items-start bg-blue-50 shadow-md p-4 justify-start gap-3' >

                            {/* Regulatory Body */}
                            <div className="w-full flex flex-col background items-start justify-start gap-1 mb-3">
                                <label htmlFor="regulatory_body" className="text-gray-600 capitalize text-sm">Regulatory Body<span className='text-medium leading-12 font-semibold'> *</span> </label>
                                <Select
                                    options={((regOptions) => {

                                        return regOptions.filter(({ label }) => !(label === 'Other'))

                                    })(options['13']?.regulating_bodies || [])}
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
                                                filteredRegState = regStateOpts.filter(({ label }) => !(label.match(/.*[L|l]icense.*/) !== null))
                                            }
                                            else {
                                                filteredRegState = regStateOpts
                                            }
                                        }
                                        else {
                                            filteredRegState = regStateOpts
                                        }

                                        return filteredRegState

                                    })(options['14']?.regulation_status || [])}
                                    required
                                    placeholder="Select Regulation Status"
                                    name='regulation_status'
                                    />
                            </div>

                            {/* License Number */}
                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label htmlFor="license_number" className="text-gray-600 bg-transparent capitalize text-sm">License Number</label>
                                <Field type="text" name="license_number" className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none" />
                            </div>


                            {/* Registration Number */}
                            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label htmlFor="registration_number" className="text-gray-600 bg-transparent capitalize text-sm">Registration Number</label>
                                <Field type="text" name="registration_number" className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none" />
                            </div>

                            {/* check file upload */}
                            <div className=" w-full flex flex-col items-start justify-start py-3  h-auto">
                                <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                    <label htmlFor="license_document" className="text-gray-600 capitalize text-sm">Upload license document</label>
                                    <Field type="file" name="license_document" innerRef={fileRef} className="flex-none w-full   p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none" />
                                </div>
                            </div>

                            {/* Facility Departments Regulation  */}
                            <h5 className="text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Facility Departments Regulation</h5>
                            <div className='grid grid-cols-4 place-content-start gap-3 w-full border border-blue-600  p-3'>

                                {/* Contact Headers */}
                                <h3 className='text-medium font-semibold text-blue-900'>Name</h3>
                                <h3 className='text-medium font-semibold  text-blue-900'>Regulatory Body</h3>
                                <h3 className='text-medium font-semibold  text-blue-900'>License Number</h3>
                                <h3 className='text-medium font-semibold  text-blue-900'>Reg. Number</h3>

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
                                {/* { console.log({facilityDepts: options['12']?.facility_depts}) } */}
                                
                                <button onClick={(e) => {
                                    e.preventDefault(); 


                                    setFacilityDepts([
                                        ...facilityDepts,
                                        (() => (
                                         <FacilityDepartmentUnitsContext.Provider value={facilityDepts}>
                                            <FacilityDepartmentUnits
                                                setFacilityDepts={setFacilityDepts}
                                                facilityDeptOptions={options['12']?.facility_depts}
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


                            {/* Prev / Next */}
                            <div className='flex justify-between items-center w-full'>
                                <button onClick={handleRegulationPrevious}
                                    className='flex items-center justify-start space-x-2 p-1 group hover:bg-blue-700 border border-blue-700 px-2'>
                                    <ChevronDoubleLeftIcon className='w-4 h-4 group-hover:text-white text-blue-900' />
                                    <span className='text-medium font-semibold group-hover:text-white text-blue-900'>Facility Contacts</span>
                                </button>
                                <button type="submit" className='flex items-center justify-start space-x-2 bg-blue-700 group hover:bg-transparent border border-blue-700 p-1 px-2'>
                                    <span className='text-medium font-semibold group-hover:text-blue-900 text-white'> Services</span>
                                    <ChevronDoubleRightIcon className='w-4 h-4 group-hover:text-blue-900 text-white' />
                                </button>
                            </div>
                        </Form>
                    </>
                   )

                }
            }
        </Formik>
 
    )
}