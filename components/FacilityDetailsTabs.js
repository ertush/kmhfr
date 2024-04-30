import React from 'react'
import * as Tabs from "@radix-ui/react-tabs";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

function FacilityDetailsTabs({ facility, token }) {

  const [cus, setCUs] = React.useState(null)


  React.useEffect(() => {


    async function fetchCHUs() {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/?facility=${facility?.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(cu => {
          setCUs(cu?.results)
        })
    }

    fetchCHUs()

  }, [])

  return (
    <div className="col-span-5 rounded md:col-span-3 flex bg-gray-50 shadow-md flex-col gap-3 mt-4">

      <Tabs.Root
        orientation="horizontal"
        className="w-full flex flex-col flex-wrap tab-root"
        defaultValue="overview"
      >
        <Tabs.List className="list-none flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-gray-600">
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
            Community Health Units
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          value="overview"
          className="grow-1 p-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col gap-y-4 group items-center justify-start text-left">

            <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
              {/* Basic Details */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Basic Details
                </h3>

                <div className="flex justify-between gap-1">

                  <label className=" text-gray-600">
                    Facility Type
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.facility_type_name}
                  </label>

                </div>

                <div className="flex justify-between gap-1">
                  <label className=" text-gray-600">
                    Keph Level
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.keph_level_name ?? '-'}
                  </label>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Status
                </h3>
                {facility?.closed &&

                  <div className="flex justify-between gap-1">

                    <label className=" text-gray-600">
                      Facility closed
                    </label>
                    <label className="text-black font-medium text-base flex">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                        Closed on {new Date(facility?.closed_date).toLocaleDateString() || ""}
                      </span>
                    </label>

                  </div>
                }
                {facility?.closed && (
                  <div className="flex justify-between gap-1">
                    <label className=" text-gray-600">
                      Facility closure reason
                    </label>
                    <label className="text-black font-medium text-base">

                      {facility?.closing_reason || ""}
                    </label>
                  </div>
                )}
                <div className="flex justify-between gap-1">
                  {facility?.reporting_in_dhis && (
                    <>
                      <label className=" text-gray-600">
                        KHIS reporting
                      </label>
                      <label className="text-black font-medium text-base">

                        <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                          <CheckCircleIcon className="h-4 w-4" />
                          Yes
                        </span>
                      </label>

                    </>
                  )}

                </div>
                {facility?.nhif_accreditation && (

                  <div className="flex justify-between gap-1">
                    <label className=" text-gray-600">
                      NHIF accreditation
                    </label>
                    <label className="text-black font-medium text-base">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>
                    </label>
                  </div>
                )}

                {facility?.open_normal_day && (

                  <div className="flex justify-between gap-1">

                    <label className=" text-gray-600">
                      Open 24 hours
                    </label>
                    <label className="text-black font-medium text-base">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>

                    </label>
                  </div>

                )}

                {facility?.open_weekends && (


                  <div className="flex justify-between gap-1">
                    <label className=" text-gray-600">
                      Open weekends
                    </label>
                    <label className="text-black font-medium text-base">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>
                    </label>

                  </div>
                )}

                {facility?.open_late_night && (

                  <div className="flex justify-between gap-1">
                    <label className=" text-gray-600">
                      Open late night
                    </label>
                    <label className="text-black font-medium text-base">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>
                    </label>

                  </div>
                )}

                {facility?.is_classified && (

                  <div className="flex justify-between gap-1">
                    <label className=" text-gray-600">
                      Facility classified
                    </label>
                    <label className="text-black font-medium text-base">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>
                    </label>

                  </div>
                )}

                {facility?.is_published && (

                  <div className="flex justify-between gap-1">
                    <label className=" text-gray-600">Published</label>
                    <label className="text-black font-medium text-base">
                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>
                    </label>

                  </div>
                )}
              </div>
            </div>


            <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
              {/* Regulation */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Regulation
                </h3>
                {facility?.date_established && (
                  <div className="flex justify-between gap-1">
                    <label className="col-span-1 text-gray-600">
                      Date established
                    </label>
                    <label className="text-black font-medium text-base">
                      {new Date(
                        facility?.date_established
                      ).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || " - "}
                    </label>
                  </div>
                )}
                {facility?.date_requested && (
                  <div className="flex justify-between gap-1">
                    <label className="col-span-1 text-gray-600">
                      Date requested
                    </label>
                    <label className="text-black font-medium text-base">
                      {new Date(
                        facility?.date_requested
                      ).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || " - "}
                    </label>
                  </div>
                )}
                {facility?.date_approved && (
                  <div className="flex justify-between gap-1">
                    <label className="col-span-1 text-gray-600">
                      Date approved
                    </label>
                    <label className="text-black font-medium text-base">
                      {new Date(
                        facility?.date_approved
                      ).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || " - "}
                    </label>
                  </div>
                )}

                {facility?.regulated && (
                  <div className="flex justify-between gap-1">

                    <label className="col-span-1 text-gray-600">
                      Regulated
                    </label>
                    <label className="text-black font-medium text-base">

                      <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                        <CheckCircleIcon className="h-4 w-4" />
                        Yes
                      </span>
                    </label>
                  </div>

                )}
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Regulation status
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.regulatory_status_name || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Regulating body
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.facility_units < 1
                      ? " - "
                      : facility?.facility_units !== undefined ? (facility?.facility_units[0].regulating_body_name || " - ") : ' - '}

                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Registration number
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.facility_units < 1
                      ? " - "
                      : facility?.facility_units !== undefined ? (facility?.facility_units[0].registration_number || " - ") : ' - '}

                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    License number
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.facility_units < 1
                      ? " - "
                      : facility?.facility_units !== undefined ? (facility?.facility_units[0].license_number || " - ") : ' - '}

                  </label>
                </div>
              </div>

              {/* Ownership */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Ownership
                </h3>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Category
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.owner_type_name || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Owner
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.owner_name || " - "}
                  </label>
                </div>
              </div>
            </div>



            <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
              {/* Location */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Location
                </h3>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    County
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.county || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Sub County
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.sub_county_name || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Ward
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.ward_name || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Latitude
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.lat_long && facility?.lat_long.length > 0 ? facility?.lat_long[0] : " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Longitude
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.lat_long && facility?.lat_long.length > 0 ? facility?.lat_long[1] : " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Town
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.town_name || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Description
                  </label>
                  <label className="text-black text-wrap font-medium text-base">
                    {facility?.location_desc || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Nearest landmark
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.nearest_landmark || " - "}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Plot number
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.plot_number || " - "}
                  </label>
                </div>
              </div>

              {/* Bed Capacity */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Bed capacity
                </h3>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Total In-patient beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_beds}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    General In-patient beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_inpatient_beds}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Cots
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_cots}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Maternity beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_maternity_beds}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Emergency casualty beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_emergency_casualty_beds}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Intensive Care Unit beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_icu_beds}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    High Dependency Unit beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_hdu_beds}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Isolation beds
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_isolation_beds}
                  </label>
                </div>

              </div>
            </div>


            <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
              {/* Theaters */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Surgical Theatres
                </h3>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    General theatres
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_general_theatres}
                  </label>
                </div>
                <div className="flex justify-between gap-1">
                  <label className="col-span-1 text-gray-600">
                    Maternity theatres
                  </label>
                  <label className="text-black font-medium text-base">
                    {facility?.number_of_maternity_theatres}
                  </label>
                </div>
              </div>

              {/* Contacts */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg leading-tight font-semibold text-gray-700 ">
                  Contacts
                </h3>

                {facility?.facility_contacts &&
                  facility?.facility_contacts.length > 0 &&
                  facility?.facility_contacts.map((contact) => (
                    <div
                      key={contact.contact_id}
                      className="flex justify-between gap-1"
                    >
                      <label className="col-span-1 text-gray-600 capitalize">
                        {contact.contact_type_name[0].toLocaleUpperCase() +
                          contact.contact_type_name
                            .slice(1)
                            .toLocaleLowerCase() || "Contact"}
                      </label>
                      <label className="text-black font-medium text-base">
                        {contact.contact || " - "}
                      </label>
                    </div>
                  ))}
                {facility?.officer_in_charge && (
                  <div className="flex justify-between gap-1">
                    <label className="col-span-1 text-gray-600 capitalize">
                      {facility?.officer_in_charge.title_name ||
                        "Officer in charge"}
                    </label>
                    <label className="text-black font-medium text-base">
                      {facility?.officer_in_charge.name || " - "}
                    </label>
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
                      <label className="text-black font-medium text-base">
                        {contact.contact || " - "}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel
          value="services"
          className="grow-1 py-1 px-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
            <div className="bg-gray-50 w-full px-2 my-4">

              <ul>
                {facility?.facility_services &&
                  facility?.facility_services.length > 0 ? (
                  facility?.facility_services.map((service) => (
                    <li
                      key={service.service_id}
                      className="w-full flex justify-between my-2 p-3 border-b border-gray-400"
                    >
                      <div className="flex items-center gap-1">
                        <label className="text-black font-medium text-base">
                          {service.service_name}
                        </label>
                        <small className="text-xs text-gray-500">
                          {service.category_name || ""}
                        </small>
                      </div>


                      <div className="flex items-center gap-1">
                        <label className="text-black font-medium text-base">
                          {service.average_rating || 0}/
                          {service.number_of_ratings || 0}
                        </label>
                        <small className="text-xs text-gray-500">
                          Rating
                        </small>
                      </div>


                      <label className="text-sm text-gray-600 flex gap-1 items-center">
                        <CheckCircleIcon className="h-6 w-6 text-gray-500" />
                        <span>Active</span>
                      </label>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                    <label>No services listed for this facility?.</label>
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
            <div className="bg-gray-50 w-full px-2 my-4">
              <ul>
                {facility?.facility_infrastructure &&
                  facility?.facility_infrastructure.length > 0 ? (
                  facility?.facility_infrastructure.map((infra) => (
                    <li
                      key={infra.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-400"
                    >
                      <div className="flex items-center gap-1">
                        <label className="text-black font-medium text-base">
                          {infra.infrastructure_name}
                        </label>
                        {/* <small className="text-xs text-gray-500">{infra.id || ''}</small> */}
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        {/* <CheckCircleIcon className="h-4 w-4 text-gray-500" /> */}
                        <label className="text-lg text-gray-800 font-semibold">
                          {infra.count || 0}
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                    <label>
                      No other infrastructure data listed for this
                      facility?.
                    </label>
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
            <div className="bg-gray-50 w-full px-2 my-4">
              <ul>
                {facility?.facility_specialists &&
                  facility?.facility_specialists.length > 0 ? (
                  facility?.facility_specialists.map((hr) => (
                    <li
                      key={hr.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-400"
                    >
                      <div className="flex items-center gap-1">
                        <label className="text-black font-medium text-base">
                          {hr.speciality_name}
                        </label>
                        {/* <small className="text-xs text-gray-500">{hr.id || ''}</small> */}
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        {/* <CheckCircleIcon className="h-4 w-4 text-gray-500" /> */}
                        <label className="text-lg font-semibold text-gray-800">
                          {hr.count || 0}
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                    <label>No HR data listed for this facility?.</label>
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
            <div className="bg-gray-50 w-full px-2 my-4">
              <ul>
                {
                  cus?.length > 0 ? (
                    cus?.map((cu) => (
                      <li
                        key={cu?.id}
                        className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-400"
                      >
                        <div className="flex items-center gap-1">
                          <label className="text-black font-medium text-base">
                            {cu?.name}
                          </label>
                          <small className="text-xs text-gray-500">
                            {cu?.code || "-"}
                          </small>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                          <CheckCircleIcon className="h-6 w-6 text-gray-500" />
                          <label className="text-sm text-gray-600">
                            {
                              cu?.status_name
                            }
                          </label>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                      <label>No units in this facility?.</label>
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