
"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import * as Tabs from "@radix-ui/react-tabs";

import { BasicDeatilsForm } from './BasicDetailsForm';
import { FacilityContactsForm } from './FacilityContactsForm';
import { InfrastructureForm } from './InfrastructureForm';
import { HumanResourceForm } from './HumanResourceForm';
import { RegulationForm } from './RegulationForm';
import { ServicesForm } from './ServicesForm';
import { GeolocationForm } from './GeolocationForm';
import { useLocalStorageState } from './hooks/formHook';
import { FormOptionsContext } from '../../pages/facilities/add';



export const EditFacilityContactsContext = createContext(null)
export const FacilityIdContext = createContext(null)

export const TabContext = createContext(null)



export function EditForm() {

  const options = useContext(FormOptionsContext);

 

  // State
  const [geoJSON, setGeoJSON] = useLocalStorageState({
    key: 'geo_json',
    value: options?.geolocation?.geoJSON
  }).actions.use();

  const [wardName, setWardName] = useLocalStorageState({
    key: 'ward_name',
    value: options?.data?.ward_name
  }).actions.use();

  const [geoCenter, setGeoCenter] = useLocalStorageState({
    key: 'geo_center',
    value: options?.geolocation?.centerCoordinates
  }).actions.use();

  const [facilityId, setFacilityId] = useLocalStorageState({
    key: 'facility_id',
    value: options?.data?.id
  }).actions.use();


  const [tabOpen, setTabOpen] = useState(null)


  // Update facility ID in the store

  useEffect(() => {
    // console.log({options})
    setFacilityId(options?.data?.id)

  }, [])
 


  return (
    <div className='bg-gray-50 col-span-1 md:col-span-4 shadow-md flex flex-col justify-start max-h-min items-center w-full'>
      {/* Stepper Header */}
      <Tabs.Root
        orientation="horizontal"
        className="w-full flex flex-wrap flex-col py-2 tab-root"
        defaultValue="basic_details"

      >
        <Tabs.List className="list-none md:flex border-b border-gray-600 md:justify-between grid grid-cols-2  gap-2  px-2  uppercase leading-none tab-list font-semibold">
          <Tabs.Tab
            value="basic_details"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Basic Details
          </Tabs.Tab>
          <Tabs.Tab
            value="geolocation"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
            onClick={e => {
              setTabOpen(e.target.innerHTML)
            }}
          >
            Geolocation
          </Tabs.Tab>
          <Tabs.Tab
            value="facility_contacts"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Facility contacts
          </Tabs.Tab>
          <Tabs.Tab
            value="regulation"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Regulation
          </Tabs.Tab>
          <Tabs.Tab
            value="services"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Services
          </Tabs.Tab>
          <Tabs.Tab
            value="infrastructure"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Infrastructure
          </Tabs.Tab>
          <Tabs.Tab
            value="human_resource"
            className="px-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Human Resource
          </Tabs.Tab>
        </Tabs.List>


        {/* Basic Details */}
        <FacilityIdContext.Provider value={[facilityId, setFacilityId]}>
          <Tabs.Panel
            value="basic_details"
            className="grow-1 py-1 px-4 tab-panel"
          >
            <BasicDeatilsForm editMode="edit"/>

          </Tabs.Panel>

          {/* Geolocation */}
          <Tabs.Panel
            value="geolocation"
            className="grow-1 py-1 px-4 tab-panel"
          >

            <TabContext.Provider value={tabOpen}>
              <GeolocationForm
                editMode="edit"
                useGeoJSON={() => [geoJSON, setGeoJSON]}
                useGeoData={(type) => {
                  switch (type) {
                    case 'ward_data':
                      return [wardName, setWardName];
                    case 'geo_data':
                      return [geoCenter, setGeoCenter];
                  }
                }
                }
              />
            </TabContext.Provider>


          </Tabs.Panel>

          {/* Facility contacts */}
          <Tabs.Panel
            value="facility_contacts"
            className="grow-1 py-1 px-4 tab-panel"
          >

            <FacilityContactsForm />


          </Tabs.Panel >

          {/*  Regulation  */}
          <Tabs.Panel
            value="regulation"
            className="grow-1 py-1 px-4 tab-panel"
          >

            <RegulationForm />


          </Tabs.Panel >

          {/* Services */}
          <Tabs.Panel
            value="services"
            className="grow-1 py-1 px-4 tab-panel"
          >

            <ServicesForm />
          </Tabs.Panel >

          {/* Infrastructure */}
          <Tabs.Panel
            value="infrastructure"
            className="grow-1 py-1 px-4 "
          >
            <InfrastructureForm />
          </Tabs.Panel >

          {/* Human resources */}
          <Tabs.Panel
            value="human_resource"
            className="grow-1 py-1 px-4 tab-panel"
          >
            <HumanResourceForm />
          </Tabs.Panel>
        </FacilityIdContext.Provider>

      </Tabs.Root>


    </div>
  )
}