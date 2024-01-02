import { useState, useCallback, useEffect, Fragment, createContext, useContext, useMemo } from 'react';
import { Formik, Form, Field } from 'formik'
import { FacilityContact, OfficerContactDetails } from './formComponents/FacilityContacts';
import Select from './formComponents/FormikSelect';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlusIcon } from '@heroicons/react/solid'
import { FormOptionsContext } from '../../pages/facilities/add';
// import { FormContext } from './Form';
// import { useLocalStorageState } from './hooks/formHook';

// import { object, string } from "zod";
// import { toFormikValidationSchema } from "zod-formik-adapter";

import {
    handleFacilityContactsSubmit,
    handleFacilityContactsUpdates
} from '../../controllers/facility/facilityHandlers';
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
// import { FacilityIdContext } from './EditForm'
import { defer } from 'underscore';
// import { Alert } from "@mui/lab";
import { useAlert } from 'react-alert';
import Spinner from '../Spinner'
import { useRouter } from 'next/router';


export const FacilityDeptContext = createContext(null)
export const FacilityContactsContext = createContext(null)


export function FacilityContactsForm() {

    // Constants
    const router = useRouter()
    const options = useContext(FormOptionsContext);
    const contactTypeOptions = options.contact_types;
    const jobTitleOptions = options.job_titles;

    const facilityContactsData = {}

    facilityContactsData['officer_name'] = options?.data?.officer_in_charge?.name;
    facilityContactsData['officer_reg_no'] = options?.data?.officer_in_charge?.reg_no;
    facilityContactsData['officer_title'] = options?.data?.officer_in_charge?.title;


    options?.data?.facility_contacts?.forEach((contact, i) => {
        facilityContactsData[`contact_${i}`] = contact.contact
        facilityContactsData[`contact_type_${i}`] = options.contact_types?.find(({ label }) => label == contact?.contact_type_name)?.value;
    })


    options?.data?.officer_in_charge?.contacts?.forEach((contact, i) => {
        facilityContactsData[`officer_details_contact_${i}`] = contact?.contact
        facilityContactsData[`officer_details_contact_type_${i}`] = options.contact_types?.find(({ label }) => label == contact?.contact_type_name)?.value;
    })


    // console.log({facilityContactsData})
    // State
    // const [formId, setFormId] = useState('');
    const [facilityId, setFacilityId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [geolocationUrl, setGeolocationUrl] = useState('')
    // const [responseError, setResponseError] = useState(null);


    const alert = useAlert()


    const { updatedSavedChanges, updateFacilityUpdateData } = options?.data ? useContext(FacilityUpdatesContext) : { updatedSavedChanges: null, updateFacilityUpdateData: null }


    const [facilityContacts, setFacilityContacts] = useState([
        (() => (
            <FacilityContact
                contactTypeOptions={contactTypeOptions}
                fieldNames={['contact_type', 'contact']}
                setFacilityContacts={() => null}
                contacts={[null, null, null]}
                erros={null}
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

        let vals = {}

        if (window && !options?.data) {

        const current_url =  new URL(window.location.href)

        setFacilityId(current_url.searchParams.get('facilityId'))            

        if(current_url.searchParams.get('from') == 'submission') setGeolocationUrl(window.location.href)

        if(current_url.searchParams.get('from') == 'previous') {

        // Extract form data from current url

        const formDataBase64Enc = current_url.searchParams.get('formData')
        const formData = JSON.parse(Buffer.from(formDataBase64Enc, 'base64').toString() ?? '{}')

    

         vals = formData
            
        } 
    } else {
    
        for (let i = 0; i < facilityContacts.length; i++) {
            vals[`contact_type_${i}`] = "";
            vals[`contact_${i}`] = "";
        }

        vals['officer_in_charge'] = "";
        vals['officer_reg_no'] = "";
        }

        return vals
    }, [facilityContacts])


   

    const [initialValues, handleFormUpdate] = useState(options?.data ? facilityContactsData : formFields)

    

    const [formValues, setFormValues] = useState(options?.data ? facilityContactsData : initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields)
    
    // Effects

    useEffect(() => {
        const contacts = [];
        const officerContacts = [];


        const initialValueObj = options?.data ? facilityContactsData : typeof initialValues == 'string' ? JSON.parse(initialValues) : {}

        const contactCount = Object.keys(initialValueObj).filter(x => /^contact_\d/.test(x)).length;
        const officerContactCount = Object.keys(initialValueObj).filter(x => x.match(/^officer_details_contact_[0-9]/)).length;


  
        if (contactCount > 1) {
            for (let i = 0; i < contactCount; i++) {
                contacts.push((() => (
                    <FacilityContactsContext.Provider value={facilityContacts} key={(facilityContacts.length + 1) - 1}>
                        <FacilityContact
                            contactTypeOptions={contactTypeOptions}
                            fieldNames={['contact_type', 'contact']}
                            setFacilityContacts={setFacilityContacts}
                            contacts={[null, null, null]}
                            index={i}

                        />
                    </FacilityContactsContext.Provider>
                ))())
            }

            setFacilityContacts([
                ...contacts
            ])
        }

        if (officerContactCount > 1) {
            for (let i = 0; i < officerContactCount; i++) {
                officerContacts.push(
                    (() => (
                        <FacilityContactsContext.Provider value={officerContactDetails} key={(facilityContacts.length + 1) - 1}>
                            <OfficerContactDetails
                                contactTypeOptions={contactTypeOptions}
                                fieldNames={['officer_details_contact_type', 'officer_details_contact']}
                                contacts={[null, null, null]}
                                setFacilityContacts={setOfficerContactDetails}
                                index={i}

                            />
                        </FacilityContactsContext.Provider>
                    ))()
                )
            }

            setOfficerContactDetails(
                [
                    ...officerContacts
                ]
            )
        }
    }, [])

    

    // Event handlers

    const handleGeolocationPrevious = useCallback((event) => {
        // setFormId(`${parseInt(formId) - 1}`);

        event.preventDefault()

        const previous_url =  new URL(geolocationUrl)

        previous_url.searchParams.set('formId', '1')

        previous_url.searchParams.set('from', 'previous')

        window.location.url = previous_url

    }, [])



    return (
        <Formik
            initialValues={formValues}
            onSubmit={(values) => {

                setSubmitting(true)

                options?.data ?
                    handleFacilityContactsUpdates(options.token, values, options?.data?.id)
                        .then((resp) => {
                            defer(() => updatedSavedChanges(true));
                            if (resp.status == 200 || resp.status == 204) {
                                alert.success("Updated facility contacts successfully")

                                router.push({
                                    pathname: '/facilities/facility_changes/[facility_id]',
                                    query:{
                                        facility_id: options?.data?.id
                                    }
                                })
                            }

                            else {
                                alert.error("Unable to update facility contacts")
                            }
                        })
                        .catch((e) =>
                            console.error(
                                "unable to fetch facility data. Error:",
                                e.message
                            )
                        )
                    :
                    handleFacilityContactsSubmit(options.token, values,  facilityId)
                        .then(resp => {
                            if (resp.status == 204) {

                                setSubmitting(false)

                                alert.success('Facility Contacts Saved successfully', {
                                    containerStyle: {
                                        backgroundColor: "green",
                                        color: "#fff"
                                    }
                                })

                                alert.success('Officer Incharge Contacts Saved successfully')

                                const formDataBase64Enc = Buffer.from(JSON.stringify(values)).toString('base64')

                                const url = new URL(`${window.location.origin}/facilities/add?formData=${formDataBase64Enc}`)

                                url.searchParams.set('formId', '3')

                                url.searchParams.set('facilityId', facilityId)

                                url.searchParams.set('from', 'submission')


                                window.location.href = url

                            }
                            else {
                                setSubmitting(false)
                                alert.error('Unable to save Facility Contacts')
                                alert.error('Unable to save Officer Incharge Contacts')
                            }
                        })

            }}

            // validationSchema={toFormikValidationSchema(formSchema)}
            enableReinitialize
        >

            {
                (formikState) => {
                    const errors = formikState.errors;

                    // Effects
                    useEffect(() => {
                        handleFormUpdate(JSON.stringify(formikState.values))
                    }, [formikState.values])


                    return (
                        <>
                           
                            <h4 className='text-lg uppercase pb-2 mt-4 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
                                Facility Contact
                            </h4>
                            <Form
                                className='flex flex-col w-full items-start justify-start gap-3'
                                name='facility_contacts_form'

                            >
                                {/* Contacts */}

                                <div
                                    className='grid grid-cols-2 bg-blue-50 border border-blue-600 p-3 place-content-start gap-3 w-full bg-light-grey '
                                >
                                    {/* Contact Headers */}
                                    <h3 className='text-medium font-semibold text-blue-900'>
                                        Contact Type {" *"}
                                    </h3>
                                    <h3 className='text-medium font-semibold text-blue-900'>
                                        Contact Details {" *"}
                                    </h3>
                                    <hr className='col-span-2 border-xs border-blue-600' />

                                    {/* Contact Type / Contact Details */}

                                    {/* add other fields */}
                                    <div className='col-span-2 flex-col w-full items-start justify-start gap-y-3 '>



                                        {
                                            facilityContacts.map((facilityContact, i) => (

                                                <Fragment key={i}>

                                                    {facilityContact}
                                                    <div className='grid grid-cols-2 w-full'>
                                                        {errors[`contact_type_${i}`] && <span className='font-normal text-sm text-red-500 text-start'>{errors[`contact_type_${i}`]}</span>}
                                                        {errors[`contact_${i}`] && <span className='font-normal col-start-2 text-sm text-red-500 text-start'>{errors[`contact_${i}`]}</span>}
                                                    </div>
                                                </Fragment>

                                            ))
                                        }
                                    </div>

                                </div>

                                <div className='w-full flex justify-end items-center'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();

                                            // console.log({initialValues});


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
                                <div className='flex flex-col items-start bg-light-grey bg-blue-50 p-3 justify-start gap-1 w-full  h-auto'>
                                    {/*  Name  */}
                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                        <label
                                            htmlFor='officer_name'
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
                                            htmlFor='officer_reg_no'
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
                                            htmlFor='officer_title'
                                            className='text-gray-600 capitalize text-sm'>
                                            Job Title
                                            <span className='text-medium leading-12 font-semibold'>
                                                {' '}
                                                *
                                            </span>{' '}
                                        </label>
                                        <Select

                                            options={jobTitleOptions || []}
                                            required
                                            placeholder="Select Job Title"
                                            name="officer_title"

                                        />
                                    </div>

                                    {/* Facility Officer Contact Type / Contact Details */}

                                    <div
                                        className='grid grid-cols-2 place-content-start gap-3 w-full border border-blue-600 p-3'
                                    >
                                        {/* Contact Headers */}
                                        <h3 className='text-medium font-semibold text-blue-900'>
                                            Contact Type {" *"}
                                        </h3>
                                        <h3 className='text-medium font-semibold text-blue-900'>
                                            Contact Details {" *"}
                                        </h3>
                                        <hr className='col-span-2 border-xs border-blue-600' />

                                        {/* Contact Type / Contact Details */}



                                        <div className='col-span-2 flex-col w-full items-start justify-start gap-y-3 '>
                                            {
                                                officerContactDetails.map((officerDetailContact, i) => (

                                                    <Fragment key={i}>

                                                        {
                                                            officerDetailContact
                                                        }
                                                        <div className='w-full grid grid-cols-2'>
                                                            {errors[`officer_details_contact_${i}`] && <span className='font-normal text-sm text-red-500 text-start'>{errors[`officer_details_contact_${i}`]}</span>}
                                                            {errors[`officer_details_contact_type_${i}`] && <span className='font-normal col-start-2 text-sm text-red-500 text-start'>{errors[`officer_details_contact_type_${i}`]}</span>}
                                                        </div>
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

                                {
                                    options?.data ?

                                        <div className='flex justify-end items-center w-full'>
                                            <button
                                                type='submit'
                                                disabled={submitting}
                                                className='flex items-center justify-start text-white space-x-2 bg-blue-700  p-1 px-2'>
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
                                                disabled={submitting}
                                                className='flex items-center justify-start gap-2 text-white bg-blue-700  p-1 px-2'>
                                                <span className='text-medium font-semibold text-white'>
                                                    {
                                                        submitting ?
                                                            <Spinner />
                                                            :
                                                            ' Regulation'

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