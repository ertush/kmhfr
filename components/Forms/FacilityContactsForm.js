import {useState, useCallback, useEffect, Fragment, createContext, useContext, useRef, useMemo} from 'react';
import {Formik, Form, Field} from 'formik'
import { FacilityContact, OfficerContactDetails } from './formComponents/FacilityContacts';
import Select from './formComponents/FromikSelect';
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlusIcon} from '@heroicons/react/solid'
import { FormOptionsContext } from '../../pages/facilities/add';
import { FormContext } from './Form';
import {useLocalStorageState} from './hooks/formHook';



export const FacilityDeptContext = createContext(null)
export const FacilityContactsContext = createContext(null)



export function FacilityContactsForm() {

    // Constants

    const options = useContext(FormOptionsContext);
    const contactTypeOptions = options['11']?.contact_types;
    const jobTitleOptions = options['10']?.job_titles;

    // State
    const [formId, setFormId] = useContext(FormContext);
    const [facilityContacts, setFacilityContacts] = useState([
        (() => (
			<FacilityContact
				contactTypeOptions={contactTypeOptions}
				fieldNames={['contact_type', 'contact']}
				setFacilityContacts={() => null}
				contacts={[null, null, null]}
				index={0}
			/>
		))()
    ])

   

    const [officerContactDetails, setOfficerContactDetails] = useState([
        (() => (
			<OfficerContactDetails
				contactTypeOptions={contactTypeOptions}
				fieldNames={['officer_details_contact_type', 'officer_details_contact']}
				contacts={[null, null, null]}
				setFacilityContacts={() => null}
				index={0}
			/>
		))()
    ])

    const formFields = useMemo(() => {
        const vals = {}
        for(let i = 0; i < facilityContacts.length; i++){
            vals[`contact_type_${i}`] = "";
            vals[`contact_${i}`] = "";
        }
        
        vals['officer_in_charge'] = "";
        vals['officer_reg_no'] = "";
        // vals['contact_type'] = "";
        // vals['contact'] = "";

        return vals
    }, [facilityContacts])

    // console.log({formFields})
    const [initialValues, handleFormUpdate] = useLocalStorageState({
        key: 'facility_contacts_form',
        value: formFields
      })

  const formValues =  initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields;

    // Effects

    useEffect(() => {
        const contacts = [];

        const contactCount = initialValues.split(',').filter(x => x.match(/^"contact_[0-9]/)).length

        if(contactCount > 1) {
            for(let i = 0; i < contactCount; i++) {
                contacts.push((() => (
                    <FacilityContact
                        contactTypeOptions={contactTypeOptions}
                        fieldNames={['contact_type', 'contact']}
                        setFacilityContacts={() => null}
                        contacts={[null, null, null]}
                        index={i}
                    />
                ))())
            }
            
            setFacilityContacts([
                ...contacts
            ])
        }
    }, [])

    // Event handlers
    const handleSubmit = useCallback((values) => {
        setFormId(`${parseInt(formId) + 1}`);
        handleFormUpdate(JSON.stringify({...values}))
        console.log({ ...values })
}, [])

    const handleGeolocationPrevious = useCallback(() => {
        setFormId(`${parseInt(formId) - 1}`);

    }, [])

    // Refs
    const facilityContactsFormRef = useRef(null)


    return (
        <Formik
        initialValues={formValues}
        onSubmit={handleSubmit}
        >

         {
            (formikState) => {
            const errors = formikState.errors;
               return ( 
               <>
                <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
                    Facility Contact
                </h4>
                <Form
                    // ref={facilityContactsFormRef}
                    className='flex flex-col w-full items-start justify-start gap-3'
                    name='facility_contacts_form'
                    // onSubmit={ev => handleFacilityContactsSubmit(ev, [setFormId, facilityId, facilityContactsFormRef])}
                    >
                    {/* Contacts */}


                    <div
                        className='grid grid-cols-2 place-content-start gap-3 w-full bg-light-grey shadow-md p-3'
                    >
                        {/* Contact Headers */}
                        <h3 className='text-medium font-semibold text-blue-900'>
                            Contact Type
                        </h3>
                        <h3 className='text-medium font-semibold text-blue-900'>
                            Contact Details
                        </h3>
                        <hr className='col-span-2' />

                        {/* Contact Type / Contact Details */}


                        {/* add other fields */}
                        <div className='col-span-2 flex-col w-full items-start justify-start gap-y-3 '>
                            {
                                facilityContacts.map((facilityContact, i) => (
                                    <Fragment key={i}>
                                        {facilityContact}
                                    </Fragment>

                                ))
                            }
                        </div>

                    </div>

                    <div className='w-full flex justify-end items-center'>
                        <button
                            onClick={(e) => {
                                e.preventDefault();

                                console.log({initialValues});


                                setFacilityContacts([
                                    ...facilityContacts,
                                    (() => (
                                        <FacilityContactsContext.Provider value={facilityContacts} key={(facilityContacts.length + 1) - 1}>
                                            <FacilityContact
                                                contactTypeOptions={contactTypeOptions}
                                                setFacilityContacts={setFacilityContacts}
                                                contacts={[null, null, null]}
                                                fieldNames={['contact_type', 'contact']}
                                                index={(facilityContacts.length + 1) - 1}

                                            />
                                        </FacilityContactsContext.Provider>
                                    ))()


                                ])
                            }}
                            className='flex items-center space-x-1 bg-blue-700 p-1 '>
                            <PlusIcon className='w-4 h-4 text-white' />
                            <p className='text-medium font-semibold text-white'>
                                Add
                            </p>
                        </button>
                    </div>

                    {/* Facility Officer In-charge Details */}

                    <h5 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
                        Facility Officer In-Charge Details
                    </h5>
                    <div className='flex flex-col items-start bg-light-grey p-3 shadow-md justify-start gap-1 w-full  h-auto'>
                        {/*  Name  */}
                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                                htmlFor='name'
                                className='text-gray-600 capitalize text-sm'>
                                Name
                                <span className='text-medium leading-12 font-semibold'>
                                    {' '}
                                    *
                                </span>
                            </label>
                            <Field
                                required
                                type='text'
                                name='officer_name'
                                className='flex-none w-full  bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                            />
                        </div>

                        {/*  Registration Number */}
                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                                htmlFor='reg_no'
                                className='text-gray-600 capitalize text-sm'>
                                Registration Number/License Number{' '}
                            </label>
                            <Field
                                type='text'
                                name='officer_reg_no'
                                className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                            />
                        </div>

                        {/* Job Title */}
                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <label
                                htmlFor='title'
                                className='text-gray-600 capitalize text-sm'>
                                Job Title
                                <span className='text-medium leading-12 font-semibold'>
                                    {' '}
                                    *
                                </span>{' '}
                            </label>
                            <Select
                                
                                // styles={{
                                //     control: (baseStyles) => ({
                                //         ...baseStyles,
                                //         backgroundColor: 'transparent',
                                //         outLine: 'none',
                                //         border: 'none',
                                //         outLine: 'none',
                                //         textColor: 'transparent',
                                //         padding: 0,
                                //         height: '4px'
                                //     }),

                                // }} 
                                options={jobTitleOptions || []}
                                required
                                placeholder="Select Job Title"
                                name="officer_title"
                                // className="flex-none col-start-1 w-full   flex-grow  placeholder-gray-500 border border-blue-600 outline-none" 
                                />
                        </div>

                        {/* Facility Officer Contact Type / Contact Details */}

                        <div
                            className='grid grid-cols-2 place-content-start gap-3 w-full border border-blue-600  p-3'
                        >
                            {/* Contact Headers */}
                            <h3 className='text-medium font-semibold text-blue-900'>
                                Contact Type
                            </h3>
                            <h3 className='text-medium font-semibold text-blue-900'>
                                Contact Details
                            </h3>
                            <hr className='col-span-2' />

                            {/* Contact Type / Contact Details */}



                            <div className='col-span-2 flex-col w-full items-start justify-start gap-y-3 '>
                                {
                                    officerContactDetails.map((officerDetailContact, i) => (

                                        <Fragment key={i}>
                                            {
                                                officerDetailContact

                                            }
                                        </Fragment>

                                    ))
                                }
                            </div>

                        </div>

                        <div className='w-full flex justify-end items-center mt-2'>
                            <button
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setOfficerContactDetails([
                                            ...officerContactDetails,
                                            (() => (
                                                <FacilityContactsContext.Provider 
                                                value={officerContactDetails} 
                                                key={(officerContactDetails.length + 1) - 1}>
                                                    <OfficerContactDetails
                                                        contactTypeOptions={contactTypeOptions}
                                                        setFacilityContacts={setOfficerContactDetails}
                                                        contacts={[null, null, null]}
                                                        fieldNames={['officer_details_contact_type', 'officer_details_contact']}
                                                        index={(officerContactDetails.length + 1) - 1}

                                                    />
                                                </FacilityContactsContext.Provider>
                                            ))()

                                            /*(facilityDepts[facilityDepts.length - 1] + facilityDepts.length)*/
                                        ])
                                    }}
                                className='flex items-center space-x-1 bg-blue-700 p-1 '>
                                <PlusIcon className='w-4 h-4 text-white' />
                                <p className='text-medium font-semibold text-white'>
                                    Add
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className='flex justify-between items-center w-full'>
                    <button
                            onClick={handleGeolocationPrevious}
                            className='flex items-center justify-start space-x-2 p-1 group hover:bg-blue-700 border border-blue-700 px-2'>
                            <ChevronDoubleLeftIcon className='w-4 h-4 group-hover:text-white text-blue-900' />
                            <span className='text-medium font-semibold group-hover:text-white text-blue-900 '>
                                Geolocation
                            </span>
                        </button>
                        <button
                            type='submit'
                            className='flex items-center justify-start space-x-2 bg-blue-700 group hover:bg-transparent border border-blue-700 p-1 px-2'>
                            <span className='text-medium font-semibold group-hover:text-blue-900 text-white'>
                            Regulation
                            </span>
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