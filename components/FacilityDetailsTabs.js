import React from 'react'
import * as Tabs from "@radix-ui/react-tabs";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

function FacilityDetailsTabs({ facility }) {
  return (
    <div className="col-span-5 md:col-span-3 flex bg-blue-50 shadow-md flex-col gap-3 mt-4">
      <Tabs.Root
        orientation="horizontal"
        className="w-full flex flex-col tab-root"
        defaultValue="overview"
      >
        <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-blue-600">
          <Tabs.Tab
            id={1}
            value="overview"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            id={2}
            value="services"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Services
          </Tabs.Tab>
          <Tabs.Tab
            id={3}
            value="infrastructure"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Infrastructure
          </Tabs.Tab>
          <Tabs.Tab
            id={4}
            value="hr_staffing"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            HR &amp; Staffing
          </Tabs.Tab>
          <Tabs.Tab
            id={5}
            value="community_units"
            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Facility Units
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value="overview"
          className="grow-1 py-1 px-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            {/* Status */}
            <div className="bg-blue-50 w-full grid grid-cols-2 gap-3 mt-4">
              <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">
                Status:
              </h3>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Facility closed
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.closed ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                      Closed on {new Date(facility?.closed_date).toLocaleDateString() || ""}
                    </span>
                  ) : (
                    <span className="bg-blue-200 text-blue-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      Not closed
                    </span>
                  )}
                </p>
              </div>
              {facility?.closed && (
                <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                  <label className=" text-gray-600">
                    Facility closure reason
                  </label>
                  <p className="text-black font-medium text-base">
                    
                    {facility?.closing_reason || ""}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  KHIS reporting
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.reporting_in_dhis ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  NHIF accreditation
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.nhif_accreditation ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Open 24 hours
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.open_normal_day ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Open weekends
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.open_weekends ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Open late night
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.open_late_night ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">
                  Facility classified
                </label>
                <p className="text-black font-medium text-base flex">
                  {facility?.is_classified ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                <label className=" text-gray-600">Published</label>
                <p className="text-black font-medium text-base flex">
                  {facility?.is_published ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
            </div>
            {/* Regulation */}
            <div className="bg-blue-50 w-full  flex flex-col gap-3 mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Regulation:
              </h3>
              {facility?.date_established && (
                <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                  <label className="col-span-1 text-gray-600">
                    Date established
                  </label>
                  <p className="col-span-2 text-black font-medium text-base">
                    {new Date(
                      facility?.date_established
                    ).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || " - "}
                  </p>
                </div>
              )}
              {facility?.date_requested && (
                <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                  <label className="col-span-1 text-gray-600">
                    Date requested
                  </label>
                  <p className="col-span-2 text-black font-medium text-base">
                    {new Date(
                      facility?.date_requested
                    ).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || " - "}
                  </p>
                </div>
              )}
              {facility?.date_approved && (
                <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                  <label className="col-span-1 text-gray-600">
                    Date approved
                  </label>
                  <p className="col-span-2 text-black font-medium text-base">
                    {new Date(
                      facility?.date_approved
                    ).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || " - "}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Regulated
                </label>
                <p className="col-span-2 text-black font-medium text-base flex">
                  {facility?.regulated ? (
                    <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                      <CheckCircleIcon className="h-4 w-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Regulation status
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.regulatory_status_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Regulating body
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.facility_units < 1
                    ? " - "
                    : facility?.facility_units !== undefined ? (facility?.facility_units[0].regulating_body_name || " - ") : ' - '}

                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Registration number
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.facility_units < 1
                    ? " - "
                    : facility?.facility_units !== undefined ? (facility?.facility_units[0].registration_number || " - ") : ' - '}

                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  License number
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.facility_units < 1
                    ? " - "
                    : facility?.facility_units !== undefined ? (facility?.facility_units[0].license_number || " - ") : ' - '}

                </p>
              </div>
            </div>
            {/* Ownership */}
            <div className="bg-blue-50 w-full  flex flex-col gap-3 mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Ownership:
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Category
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.owner_type_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Owner
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.owner_name || " - "}
                </p>
              </div>
            </div>
            {/* Location */}
            <div className="bg-blue-50 w-full  flex flex-col gap-3 mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Location:
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  County
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.county || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Sub County
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.sub_county_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Ward
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.ward_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Latitude
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.lat_long && facility?.lat_long.length > 0 ? facility?.lat_long[0] :  " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Longitude
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                { facility?.lat_long && facility?.lat_long.length > 0  ? facility?.lat_long[1] :  " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Town
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.town_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Description
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.location_desc || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Nearest landmark
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.nearest_landmark || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Plot number
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.plot_number || " - "}
                </p>
              </div>
            </div>
            {/* Bed Capacity */}
            <div className="bg-blue-50 w-full  flex flex-col gap-3 mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Bed capacity:
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Total In-patient beds 
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                   General In-patient beds
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_inpatient_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Cots
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_cots}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Maternity beds
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_maternity_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Emergency casualty beds
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_emergency_casualty_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Intensive Care Unit beds
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_icu_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  High Dependency Unit beds
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_hdu_beds}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Isolation beds
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_isolation_beds}
                </p>
              </div>
              
            </div>
            {/* Theaters */}
            <div className="bg-blue-50 w-full  flex flex-col gap-3 mt-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Surgical Theatres:
              </h3>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  General theatres
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_general_theatres}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Maternity theatres
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.number_of_maternity_theatres}
                </p>
              </div>
            </div>
            {/* Contacts */}
            <div className="bg-blue-50 w-full  flex flex-col gap-3 my-4">
              <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                Contacts:
              </h3>
              {facility?.facility_contacts &&
                facility?.facility_contacts.length > 0 &&
                facility?.facility_contacts.map((contact) => (
                  <div
                    key={contact.contact_id}
                    className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center"
                  >
                    <label className="col-span-1 text-gray-600 capitalize">
                      {contact.contact_type_name[0].toLocaleUpperCase() +
                        contact.contact_type_name
                          .slice(1)
                          .toLocaleLowerCase() || "Contact"}
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                      {contact.contact || " - "}
                    </p>
                  </div>
                ))}
              {facility?.officer_in_charge && (
                <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                  <label className="col-span-1 text-gray-600 capitalize">
                    {facility?.officer_in_charge.title_name ||
                      "Officer in charge"}
                  </label>
                  <p className="col-span-2 text-black font-medium text-base">
                    {facility?.officer_in_charge.name || " - "}
                  </p>
                </div>
              )}
              {facility?.officer_in_charge &&
                facility?.officer_in_charge.contacts.length > 0 &&
                facility?.officer_in_charge.contacts.map((contact) => (
                  <div
                    key={contact.contact_id}
                    className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center"
                  >
                    <label className="col-span-1 text-gray-600 capitalize">
                      In charge{" "}
                      {contact.contact_type_name[0].toLocaleUpperCase() +
                        contact.contact_type_name
                          .slice(1)
                          .toLocaleLowerCase() || "Contact"}
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                      {contact.contact || " - "}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="services"
          className="grow-1 py-1 px-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            <div className="bg-blue-50 w-full px-2 my-4">
              {/* <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight"> */}
                {/* <span className="font-semibold">Services</span> */}
                {/* {user && user?.id ? <a href={"/facility/edit/"+facility?.id+"#services"} className="text-base text-blue-700 font-medium hover:text-black focus:text-black active:text-black">Edit services</a> : ""} */}
              {/* </h3> */}
              <ul>
                {facility?.facility_services &&
                  facility?.facility_services.length > 0 ? (
                  facility?.facility_services.map((service) => (
                    <li
                      key={service.service_id}
                      className="w-full grid grid-cols-3 gap-3 place-content-end my-2 p-3 border-b border-gray-400"
                    >
                      <div>
                        <p className="text-gray-800 text-base">
                          {service.service_name}
                        </p>
                        <small className="text-xs text-gray-500">
                          {service.category_name || ""}
                        </small>
                      </div>


                      <div>
                        <p className="text-gray-800 text-base">
                          {service.average_rating || 0}/
                          {service.number_of_ratings || 0}
                        </p>
                        <small className="text-xs text-gray-500">
                          Rating
                        </small>
                      </div>
                      <label className="text-sm text-gray-600 flex gap-1 items-center">
                        <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                        <span>Active</span>
                      </label>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                    <p>No services listed for this facility?.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="infrastructure"
          className="grow-1 py-1 px-4 tab-panel"
        >
         
            <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            <div className="bg-blue-50 w-full px-2 my-4">
              <ul>
                {facility?.facility_infrastructure &&
                  facility?.facility_infrastructure.length > 0 ? (
                  facility?.facility_infrastructure.map((infra) => (
                    <li
                      key={infra.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-400"
                    >
                      <div>
                        <p className="text-gray-800 text-base">
                          {infra.infrastructure_name}
                        </p>
                        {/* <small className="text-xs text-gray-500">{infra.id || ''}</small> */}
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        {/* <CheckCircleIcon className="h-4 w-4 text-blue-500" /> */}
                        <label className="text-lg text-gray-800 font-semibold">
                          {infra.count || 0}
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                    <p>
                      No other infrastructure data listed for this
                      facility?.
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="hr_staffing"
          className="grow-1 py-1 px-4 tab-panel"
        >

              {/* </h3> */}
            <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            <div className="bg-blue-50 w-full px-2 my-4">
              <ul>
                {facility?.facility_specialists &&
                  facility?.facility_specialists.length > 0 ? (
                  facility?.facility_specialists.map((hr) => (
                    <li
                      key={hr.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-400"
                    >
                      <div>
                        <p className="text-gray-800 text-base">
                          {hr.speciality_name}
                        </p>
                        {/* <small className="text-xs text-gray-500">{hr.id || ''}</small> */}
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        {/* <CheckCircleIcon className="h-4 w-4 text-blue-500" /> */}
                        <label className="text-lg font-semibold text-gray-800">
                          {hr.count || 0}
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                    <p>No HR data listed for this facility?.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="community_units"
          className="grow-1 py-1 px-4 tab-panel"
        >

              {/* </h3> */}
          <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            <div className="bg-blue-50 w-full px-2 my-4">
              <ul>
                {facility?.facility_units &&
                  facility?.facility_units.length > 0 ? (
                  facility?.facility_units.map((unit) => (
                    <li
                      key={unit.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-400"
                    >
                      <div>
                        <p className="text-gray-800 text-base">
                          {unit.unit_name}
                        </p>
                        <small className="text-xs text-gray-500">
                          {unit.regulating_body_name || ""}
                        </small>
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                        <label className="text-sm text-gray-600">
                          Active
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                    <p>No units in this facility?.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}

export default FacilityDetailsTabs