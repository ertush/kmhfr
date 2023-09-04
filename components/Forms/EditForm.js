
"use client"

import {useState, createContext} from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { BasicDeatilsForm } from './BasicDetailsForm';
import { FacilityContactsForm } from './FacilityContactsForm';
import { InfrastructureForm } from './InfrastructureForm';
import { HumanResourceForm } from './HumanResourceForm';
import { RegulationForm } from './RegulationForm';
import { ServicesForm } from './ServicesForm';
import { GeolocationForm } from './GeolocationForm';
import { useLocalStorageState } from './hooks/formHook';


export const FormContext  = createContext(() => null)
export const FacilityIdContext = createContext(null)
export const EditFacilityContactsContext = createContext(null)





export function EditForm () {


// State

const [geoJSON, setGeoJSON]  = useLocalStorageState({
    key:'geo_json',
    value: 'null'
    }).actions.use();

const [wardName, setWardName] =  useLocalStorageState({
    key:'ward_name',
    value: 'null'
    }).actions.use();
    
const [geoCenter, setGeoCenter] =  useLocalStorageState({
    key:'geo_center',
    value: 'null'
    }).actions.use();

const [facilityId, setFacilityId] = useLocalStorageState({
key:'facility_id',
value: 'null'
}).actions.use();


//   const [formId, setFormId] = useState(0); //

const [formId, setFormId] = useLocalStorageState({
    key: 'formId',
    value: 0
}).actions.use();
 

  const steps = [
    'Basic Details',
    'Geolocation',
    'Facility Contacts',
    'Regulation',
    'Services',
    'Infrastructure',
    'Human resources'
];

    return (
       <div className='border col-span-4 border-blue-600  p-3 pb-4 flex flex-col justify-center items-center w-full'>
      	      {/* Stepper Header */}
                <Tabs.Root
                  orientation="horizontal"
                  className="w-full flex flex-col py-2 tab-root border border-green-600"
                  defaultValue="geolocation"
                  
                >
                  <Tabs.List className="list-none md:grid border-b border-green-600 md:grid-cols-7 grid grid-cols-2 gap-2  px-2 md:gap-3  uppercase leading-none tab-list font-semibold">
                    <Tabs.Tab
                      value="basic_details"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Basic Details
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="geolocation"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Geolocation
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="facility_contacts"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Facility contacts
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="regulation"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Regulation
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="services"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Services
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="infrastructure"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Infrastructure
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="human_resource"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Human Resource 
                    </Tabs.Tab>
                    </Tabs.List>

                  </Tabs.Root>  

                {/* Basic Details */}
                <Tabs.Panel
                    value="basic_details"
                    className="grow-1 py-1 px-4 tab-panel"
                  >
                    
                    {
                    formId == '0' && 
                    <BasicDeatilsForm 
                    useGeoJSON={() => []}  
                    useGeoData={(type) => { 
                            return null
                        }}
                    />

                    }
                </Tabs.Panel>

                {/* Geolocation */}
                <Tabs.Panel
                value="geolocation"
                className="grow-1 py-1 px-4 tab-panel"
                > 
                {
                    formId == '1' && 
                    <GeolocationForm 
                    useGeoJSON={() => []}
                    useGeoData={(type) => { 
                        return null
                    }
                    }
                    />
                    
                } 
                </Tabs.Panel>

                 {/* Facility contacts */}
                 <Tabs.Panel
                    value="facility_contacts"
                    className="grow-1 py-1 px-4 tab-panel"
                  >
                      {
                            formId == '2' &&    
                            <FacilityContactsForm />
                        
                        } 
                </Tabs.Panel >

                 {/*  Regulation  */}
                 <Tabs.Panel
                    value="facility_contacts"
                    className="grow-1 py-1 px-4 tab-panel"
                  >
                     {
                        formId == '3' &&    
                            <RegulationForm />
                        
                        }
                </Tabs.Panel >

                 {/* Services */}
                 <Tabs.Panel
                    value="facility_contacts"
                    className="grow-1 py-1 px-4 tab-panel"
                  >
                    {
                                  formId == '4' &&    
                                  <ServicesForm />
                                
                              }
                </Tabs.Panel >

                 {/* Infrastructure */}
                 <Tabs.Panel
                    value="facility_contacts"
                    className="grow-1 py-1 px-4 tab-panel"
                  >
                    {
                                  formId == '5' &&    
                                  <InfrastructureForm />
                                
                              }
                </Tabs.Panel >

                {/* Human resources */}
                <Tabs.Panel
                    value="facility_contacts"
                    className="grow-1 py-1 px-4 tab-panel"
                  >
                     {
                                  formId == '6' &&    
                                  <HumanResourceForm />
                                
                              }
                </Tabs.Panel >



       

              {/* Stepper Body */}
              {/* <div className='flex flex-col justify-center items-start px-1 md:px-4 w-full '>
                  <FormContext.Provider value={[formId, setFormId]}>
                    <FacilityIdContext.Provider value={[facilityId, setFacilityId]}>
                      <div
                        className=' w-full flex flex-col items-start justify-start p-4 shadow-md bg-blue-50'
                        style={{ minHeight: '250px' }}>
                          
                           {
                                formId == '0' && 
                                <BasicDeatilsForm 
                                useGeoJSON={() => [geoJSON, setGeoJSON]}  
                                useGeoData={(type) => { 
                                    switch(type){
                                        case 'ward_data':
                                        return [wardName, setWardName];
                                        case 'geo_data':
                                        return [geoCenter, setGeoCenter];
                                    }}
                                    }
                                />


                              }
                              {
                                  formId == '1' && 
                                  <GeolocationForm 
                                  useGeoJSON={() => [geoJSON, setGeoJSON]}
                                  useGeoData={(type) => { 
                                    switch(type){
                                        case 'ward_data':
                                        return [wardName, setWardName];
                                        case 'geo_data':
                                        return [geoCenter, setGeoCenter];
                                    }}
                                    }
                                  />
                                 
                              } 
                              {
                                  formId == '2' &&    
                                  <FacilityContactsForm />
                                
                              } 
                              {
                                  formId == '3' &&    
                                  <RegulationForm />
                                
                              }
                              {
                                  formId == '4' &&    
                                  <ServicesForm />
                                
                              }
                               {
                                  formId == '5' &&    
                                  <InfrastructureForm />
                                
                              }
                               {
                                  formId == '6' &&    
                                  <HumanResourceForm />
                                
                              }
                             
                          
                        </div>
                        </FacilityIdContext.Provider>
                    </FormContext.Provider>
              </div> */}

    </div>
    )
}