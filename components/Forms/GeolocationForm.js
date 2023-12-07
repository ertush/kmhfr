import { useContext, useCallback, useState, memo, Suspense } from 'react';
import { FacilityIdContext, FormContext } from './Form';
import { Alert } from '@mui/lab';
import dynamic from 'next/dynamic';
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon
  } from '@heroicons/react/solid';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import { useAlert } from 'react-alert';


const WardMap = dynamic(
	() => import('../../components/WardGISMap'), // replace '@components/map' with your component's location
	{
		loading: () => <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
		ssr: false // This line is important. It's what prevents server-side render
	}
)
// import { handleGeolocationSubmit, handleGeolocationUpdates } from '../../controllers/facility/facilityHandlers';


const Map = memo(WardMap)
const _ = require('underscore');


export function GeolocationForm({useGeoJSON, useGeoData, mode}) {

    const options = useContext(FormOptionsContext);
     
    //  // Constants
     const formFields = {
        collection_date: "",
        latitude: "",
        longitude: ""
    }



    // handle Edit staff

  const facilityGeolocationData = {}

  if(options?.data?.lat_long){
  facilityGeolocationData['latitude'] = options?.data?.lat_long[0] ?? null
  facilityGeolocationData['longitude'] =  options?.data?.lat_long[1] ?? null
  }else{
    facilityGeolocationData['longitude'] = []
    facilityGeolocationData['latitude'] = []
  }

  const coordinates_id = options?.data?.coordinates;




    //Context
    const[facilityId, ____] = useContext(FacilityIdContext)

    
    // State
    const [formId, setFormId] = useContext(FormContext);
    const [geoJSON, __] = useGeoJSON();
    const [wardName, ___] = useGeoData('ward_data');
    const [geoCenter, _____] = useGeoData('geo_data');

    const alert = useAlert();


    // Form Schema

    const handleGeolocationPrevious = useCallback(() => {
        setFormId(`${parseInt(formId) - 1}`);
       
    }, [])


    // console.log({options})

    return (
        
            <form

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
                    <input
                        required
                        type='date'
                        name='collection_date'
                        defaultValue={options.collection_date?.split('T')[0] ?? ''}
                        className='flex-none w-full  p-2 flex-grow border placeholder-gray-500 bg-transparent border-blue-600 focus:shadow-none focus:border-black outline-none'
                    />
                {/* {errors.collection_date && <span className='font-normal text-sm text-red-500 text-start'>{errors.collection_date}</span>} */}

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
                        <input
                            required
                            type='decimal'
                            name='longitude'
                            defaultValue={options?.data?.lat_long[0] ?? ''}
                            onChange={
                              e => {
                                console.log({name: e.target.name})
                              }
                            }
                            className='flex-none w-full  p-2 flex-grow border bg-transparent placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                        />
                {/* {errors.longitude && <span className='font-normal text-sm text-red-500 text-start'>{errors.longitude}</span>} */}

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
                        <input
                            required
                            type='decimal'
                            name='latitude'
                            defaultValue={options?.data?.lat_long[1] ?? ''}
                            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
                        />
                {/* {errors.latitude && <span className='font-normal text-sm text-red-500 text-start'>{errors.latitude}</span>} */}

                    </div>
                    {/* <>{coordinatesError && <Alert severity="error" sx={{ width: '100%' }}> Please enter the right coordinates</Alert>}</> */}
                </div>

                {/* Ward Geo Map */}
                <div className='w-full h-auto'>
                    <div className='w-full bg-gray-200   flex flex-col items-start justify-center text-left relative'>
                        {/* { console.log({geoCenter, wardName, geoJSON})} */}
                        {/* {
                            (geoJSON?.properties && geoCenter && wardName &&
                            Object.keys(geoJSON).length > 2 && geoCenter.length > 1  && wardName.length > 1 ) 
                            ?
                            
                            // JSON.stringify(geoJSON)
                            :
                            <Alert severity="error" sx={{ width: '100%' }}>No Geolocation data</Alert>
                      
                        } */}
                        <Suspense fallback={<Alert severity='info' className='w-full p-1'>Loading ...</Alert>}>
                              {/* {
                                JSON.stringify(geoJSON)
                              } */}
                             <Map  markerCoordinates={[options?.data?.lat_long[0], options?.data?.lat_long[1]]} geoJSON={geoJSON} ward={wardName} center={geoCenter} />
                        </Suspense>
                    </div>
                </div>

             {/* Finish | Cancel & Geolocation */}
              {
                mode  ? 

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

            </form>
          
          )
   
}