import { useContext, useEffect, useCallback, useState, memo } from 'react';
import { Formik, Field, Form } from 'formik'
import { useLocalStorageState } from './hooks/formHook';
// import { toFormikValidationSchema } from "zod-formik-adapter";
import { FacilityIdContext, FormContext } from './Form';
// import { object, string } from "zod";
import { Alert } from '@mui/lab';
import dynamic from 'next/dynamic';
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon
  } from '@heroicons/react/solid';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import { defer } from "underscore";
import { useAlert } from 'react-alert';


const WardMap = dynamic(
	() => import('../../components/WardGISMap'), // replace '@components/map' with your component's location
	{
		loading: () => <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
		ssr: false // This line is important. It's what prevents server-side render
	}
)


import { handleGeolocationSubmit, handleGeolocationUpdates } from '../../controllers/facility/facilityHandlers';


const Map = memo(WardMap)
const _ = require('underscore');


export function GeolocationForm({useGeoJSON, useGeoData}) {

    const options = useContext(FormOptionsContext);
     
     // Constants
     const formFields = {
        collection_date: "",
        latitude: "",
        longitude: ""
    }


  const { updatedSavedChanges, updateFacilityUpdateData } = options['19']?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }


    // handle Edit staff

  const facilityGeolocationData = {}

  if(options['19']?.data?.lat_long){
  facilityGeolocationData['latitude'] = options['19']?.data?.lat_long[0] ?? null
  facilityGeolocationData['longitude'] =  options['19']?.data?.lat_long[1] ?? null
  }else{
    facilityGeolocationData['longitude'] = []
    facilityGeolocationData['latitude'] = []
  }

  const coordinates_id = options['19']?.data?.coordinates;
  const [responseError, setResponseError] = useState(null);
  

//   console.log({options})

  facilityGeolocationData['collection_date'] = options['18']?.collection_date?.split('T')[0]



    //Context
    const[facilityId, ____] = useContext(FacilityIdContext)


    
    // State
    const [formId, setFormId] = useContext(FormContext);
    const [geoJSON, __] = useGeoJSON();
    const [wardName, ___] = useGeoData('ward_data');
    const [geoCenter, _____] = useGeoData('geo_data');

    const alert = useAlert();


    // console.log({facilityGeolocationData})


    const [initialValues, handleFormUpdate] = useLocalStorageState({
        key: options['19']?.data ? 'geolocation_edit_form' : 'geolocation_form',
        value: options['19']?.data ? facilityGeolocationData : formFields 
    }).actions.use();

    const formValues = options['19']?.data ? facilityGeolocationData : initialValues && initialValues.length > 1 ? JSON.parse(initialValues) : formFields;

	

    // Form Schema
    // const formSchema = object({

    //     collection_date: string({ invalid_type_error: "Collection must be a date" }),
    //     latitude: string({ invalid_type_error: "Latitude must be a float number", }),
    //     longitude: string({ invalid_type_error: "Longitude must be a float number" }),

    // })

 
    const handleGeolocationPrevious = useCallback(() => {
        setFormId(`${parseInt(formId) - 1}`);
       
    }, [])

    // console.log({options})

    return (
        <Formik
            initialValues={formValues}
            onSubmit={(values) => { options['19']?.data ? ((values, coordinates_id, facilityId) => {

                const payload = {
                    collection_date: (new Date(values.collection_date)).toISOString(),
                    facility: facilityId,
                    coordinates: {
                      coordinates: [parseFloat(values.longitude), parseFloat(values.latitude)],
                      type: "point",
                    },
                  }

    
                handleGeolocationUpdates(options['18']?.token, payload, coordinates_id) 
                  .then(({ statusText }) => {
                    defer(() => updatedSavedChanges(true));
                  
                    if (statusText == "OK") {
                        console.log({statusText})

                      fetch(
                        `/api/facility/get_facility/?path=facilities&id=${facilityId}`
                      )
                        .then(async (resp) => {
                          const results = await resp.json();
                        
                          
                           
                          if (results?.latest_update) {

                            try {
                              const _facilityUpdateData = await (
                                await fetch(
                                  `/api/facility/get_facility/?path=facility_updates&id=${results?.latest_update}`
                                )
                              ).json();
                              updateFacilityUpdateData(_facilityUpdateData);
                            } catch (e) {
                              console.error(
                                "Encountered error while fetching facility update data",
                                e.message
                              );
                            }
                          }else{
                            if(coordinates_id == null) {
                              

                             setResponseError(`Facility coordinates id is null`)

                            }
                            else{
                             setResponseError('No updates found for this facility')

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
                  );

            })(values, coordinates_id, facilityId) 
               :
                handleGeolocationSubmit(options['18']?.token, values, [formId, setFormId, facilityId])
                .then(resp => {
                  if(resp.status == 201){
                    alert.success('Geolocation details saved successfull')
                  } else {
                    alert.error('Unable to save geolocation details')
                  }
                })
              }}
            // validationSchema={toFormikValidationSchema(formSchema)}
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
            <>
            {
                responseError && 
            <Alert severity="error" sx={{ width: '100%', marginTop:'16px' }}>{responseError}</Alert>
            }
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Geolocation</h4>
            <Form

                name='geolocation_form'
                className='flex flex-col w-full mt-4 items-start bg-blue-50 shadow-md p-3 justify-start gap-3'
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
                        {/* { console.log({geoCenter, wardName, geoJSON})} */}
                        {
                            (geoJSON?.properties && geoCenter && wardName &&
                            Object.keys(geoJSON).length > 2 && geoCenter.length > 1  && wardName.length > 1 ) 
                            ?
                            <Map markerCoordinates={[formikState.values?.latitude.length < 4 ? '0.000000' : formikState.values?.latitude, formikState.values?.longitude.length < 4 ? '0.000000' : formikState.values?.longitude]} geoJSON={geoJSON} ward={wardName} center={geoCenter} />
                            :

                            <Alert severity="error" sx={{ width: '100%' }}>No Geolocation data</Alert>
                      
                        }
                    </div>
                </div>

             {/* Finish | Cancel & Geolocation */}
              {
                options['19']?.data  ? 

                <div className='flex justify-end items-center w-full'>
                  <button
                    type='submit'
                    className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                    <span className='text-medium font-semibold text-white'>
                      Save & Finish
                    </span>
                  </button>
              </div>
                :
                
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
                 }  

            </Form>
            </>
          )
        }
        }
        </Formik>
    )
}