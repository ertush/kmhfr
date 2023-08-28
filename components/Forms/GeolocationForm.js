import { useContext, useState, useEffect, useCallback, memo } from 'react';
import { Formik, Field, Form } from 'formik'
import { useLocalStorageState } from './hooks/formHook';
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FormContext } from './Form';
import { object, string } from "zod";
import dynamic from 'next/dynamic';
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon
  } from '@heroicons/react/solid';
  
  const WardMap = dynamic(
	() => import('../../components/WardGISMap'), // replace '@components/map' with your component's location
	{
		loading: () => <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
		ssr: false // This line is important. It's what prevents server-side render
	}
)

const Map = memo(WardMap)


export function GeolocationForm() {
    // Constants

    const formFields = {
        collection_date: "",
        latitude: "",
        longitude: ""
    }

    // State
    const [formId, setFormId] = useContext(FormContext);
    const [geoJSON, setGeoJSON] = useState([]);

    const [initialValues, handleFormUpdate] = useLocalStorageState({
        key: 'geolocation_form',
        value: formFields
    }).actions.use();

    const formValues = initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields;

    // Effects

    // Form Schema
    const formSchema = object({

        collection_date: string({ required_error: "Facility Official Name is required" }),
        latitude: string({ required_error: "Latitude is required" }),
        longitude: string({ required_error: "Longitude is required" }),

    })

    // Event handlers

    const handleSubmit = useCallback((values) => {

        setFormId(`${parseInt(formId) + 1}`);

        console.log({ ...values })

    }, [])

    const handleGeolocationPrevious = useCallback(() => {
        setFormId(`${parseInt(formId) - 1}`);
       
    }, [])

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

          //Effects
          useEffect(() => {
            handleFormUpdate(JSON.stringify(formikState.values))
          }, [formikState.values])

          return(
            <Form

                name='geolocation_form'
                className='flex flex-col w-full items-start bg-blue-50 p-4 border border-blue-600 justify-start gap-3'
            >
                {/* Collection Date */}
                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                    <label
                        htmlFor='collection_date'
                        className='text-gray-600 capitalize text-sm'>
                        Collection date:
                        <span className='text-medium leading-12 font-semibold'>
                            {' '}
                            *
                        </span>
                    </label>
                    <Field
                        required
                        type='date'
                        name='collection_date'
                        className='flex-none w-full  p-2 flex-grow border placeholder-gray-500 bg-transparent border-blue-600 focus:shadow-none focus:border-black outline-none'
                    />
                {errors.collection_date && <span className='font-normal text-sm text-red-500 text-start'>{errors.collection_date}</span>}

                </div>

                {/* Lon/Lat */}
                <div className='grid grid-cols-2 gap-4 place-content-start w-full'>
                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-1'>
                        <label
                            htmlFor='longitude'
                            className='text-gray-600 capitalize text-sm'>
                            Longitude
                            <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                            </span>
                        </label>
                        <Field
                            required
                            type='decimal'
                            name='longitude'
                            className='flex-none w-full  p-2 flex-grow border bg-transparent placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                        />
                {errors.longitude && <span className='font-normal text-sm text-red-500 text-start'>{errors.longitude}</span>}

                    </div>

                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-2'>
                        <label
                            htmlFor='latitude'
                            className='text-gray-600 capitalize text-sm'>
                            Latitude
                            <span className='text-medium leading-12 font-semibold'>
                                {' '}
                                *
                            </span>
                        </label>
                        <Field
                            required
                            type='decimal'
                            name='latitude'
                            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                        />
                {errors.latitude && <span className='font-normal text-sm text-red-500 text-start'>{errors.latitude}</span>}

                    </div>
                    {/* <>{coordinatesError && <Alert severity="error" sx={{ width: '100%' }}> Please enter the right coordinates</Alert>}</> */}
                </div>

                {/* Ward Geo Map */}
                <div className='w-full h-auto'>
                    <div className='w-full bg-gray-200   flex flex-col items-start justify-center text-left relative'>
                        {/* {
                            geoJSON &&

                            <Map markerCoordinates={[formikState.values?.latitude.length < 4 ? '0.000000' : formikState.values?.latitude, formikState.values?.longitude.length < 4 ? '0.000000' : formikState.values?.longitude]} geoJSON={geoJSON} ward={''} center={''} />

                        } */}
                    </div>
                </div>

                {/* Next/Previous Form  */}
                <div className='flex justify-between items-center w-full'>
                    <button
                        onClick={handleGeolocationPrevious}
                        className='flex items-center justify-start space-x-2 p-1 group hover:bg-blue-700 border border-blue-700 px-2'>
                        <ChevronDoubleLeftIcon className='w-4 h-4 group-hover:text-white text-blue-900' />
                        <span className='text-medium font-semibold group-hover:text-white text-blue-900 '>
                            Basic Details
                        </span>
                    </button>
                    <button
                        type='submit'
                        className='flex items-center justify-start space-x-2 bg-blue-700 group hover:bg-transparent border border-blue-700 p-1 px-2'>
                        <span className='text-medium font-semibold group-hover:text-blue-900 text-white'>
                            Facility Contacts
                        </span>
                        <ChevronDoubleRightIcon className='w-4 h-4 group-hover:text-blue-900 text-white' />
                    </button>
                </div>

            </Form>
          )
        }
        }
        </Formik>
    )
}