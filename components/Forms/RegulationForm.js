import { useState, useContext, useMemo, useEffect, useRef, useCallback } from 'react';
import { Formik, Field, Form } from 'formik'
import { FormContext } from './Form';
import { object, string } from "zod";
import { FormOptionsContext } from '../../pages/facilities/add';
import {useLocalStorageState} from './hooks/formHook';
import Select from './formComponents/FromikSelect';
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlusIcon, XCircleIcon } from '@heroicons/react/outline';
import FacilityDeptRegulationFactory from '../generateFacilityDeptRegulation';



export function RegulationForm() {

    // Constants
    const formFields = {
        regulatory_body:"",
        regulation_status:"",
        license_number:"",
        registration_number:"",
        license_document:"",
        facility_regulating_body_name:"",
        facility_license_number:"",
        facility_registration_number:""
    }

    // State
    const [formId, setFormId] = useContext(FormContext);
    const [initialValues, handleFormUpdate] = useLocalStorageState({
        key: 'regulation_form',
        value: formFields
      });
    const formValues =  initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields;
    const [facilityDeptUnits, setFacilityDeptUnits] = useState([
        (() => (
            <FacilityDeptRegulationFactory
            key={facilityDept.index}
            index={i}
            {...facilityDept}
        />
        ))()
    ]);

    const [isRegBodyChange, setIsRegBodyChange] = useState(false);

    // Context
    const options = useContext(FormOptionsContext);


    // Options

    // FormSchema
    const formSchema = useMemo(() => object({
        regulatory_body: string({required_error:""}),
        regulation_status:string({required_error:""}),
        license_number:string({required_error:""}),
        registration_number:string({required_error:""}),
        license_document:string({required_error:""}),
        facility_regulating_body_name:string({required_error:""}),
        facility_license_number:string({required_error:""}),
        facility_registration_number:string({required_error:""})
    }), [])

    // Ref
    const _regBodyRef = useRef(null)

    // Event Handlers
    const handleSubmit = useCallback((values) => {
        setFormId(`${parseInt(formId) + 1}`);
        console.log({ ...values })
      
    }, [])

    const handleDeleteField = useCallback((index) => {
		const values = facilityDepts;
		values.splice(index, 1);
		setFacilityDepts((draft) => ([...values]))
	}, []);

    const handleRegulationPrevious = useCallback((event) => {
        event.preventDefault();
        setFormId(`${formId - 1}`)
    }
, []);




    return (
        <Formik
            initialValues={formValues}
            onSubmit={handleSubmit}
            validationSchema={toFormikValidationSchema(formSchema)}
            enableReinitialize
        >

            {
                (formikState) => {
                    const errors = formikState.errors;

                    // Effects
                    // useEffect(() => {
                    //     setIsRegBodyChange(!isRegBodyChange);
                    // },[formikState.values.regulatory_body])

                    useEffect(() => {
                        handleFormUpdate(JSON.stringify(formikState.values))
                    }, [formikState.values])

                  return (
                   <>
                        <h4 className="text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Facility Regulation</h4>
                        <Form name="facility_regulation_form" className='flex flex-col w-full items-start bg-transparent border border-blue-600 p-4 justify-start gap-3' >

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

                                            if (_regBodyRef.current?.state?.value?.label == 'Ministry of Health') {
                                                filteredRegState = regStateOpts.filter(({ label }) => !(label.match(/.*Gazett.*/) !== null))
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
                                    <Field type="file" name="license_document" className="flex-none w-full   p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none" />
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
                                                <FacilityDeptRegulationFactory
                                                    key={facilityDept.index}
                                                    index={i}
                                                    {...facilityDept}
                                                />

                                                <button
                                                    id={`delete-btn-${i}`}
                                                    key={facilityDept.index}
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                        handleDeleteField(i);
                                                    }}><XCircleIcon className='w-7 h-7 text-red-400' /></button>
                                                    

                                            </div>

                                        ))
                                    }
                                </div>



                            </div>


                            {/* Add btn */}
                            <div className='w-full flex justify-end items-center mt-2'>

                                <button onClick={(e) => {
                                    e.preventDefault(); 
                                    setFacilityDepts(s => {
                                        return [
                                            ...s, 
                                            {
                                                index: facilityDepts.some((o) => o.index === s.length) ? s.length + 1 : s.length,
                                                isRegBodyChange: isRegBodyChange,
                                                setIsRegBodyChange: setIsRegBodyChange,
                                                setFacilityDepts: setFacilityDepts,
                                                facilityDeptRegBody: null,
                                                facilityDeptValue: null,
                                                regNo: null,
                                                licenseNo: null,
                                                facilityDeptOptions: options['12']?.facility_depts
                                            },
                                        ]
                                    })
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