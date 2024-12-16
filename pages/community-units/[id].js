import Head from "next/head";
import * as Tabs from "@radix-ui/react-tabs";
import { checkToken } from "../../controllers/auth/auth";
import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../components/MainLayout";
import router from "next/router";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Link from 'next/link';
import CommunityUnitSideMenu from "../../components/CommunityUnitSideMenu";
import { UserContext } from "../../providers/user";
import { Avatar} from "@mui/material";
import {z} from 'zod';
import withAuth from "../../components/ProtectedRoute";

function EditCommunityUnit(props){



  const userCtx = useContext(UserContext)

  const groupID = userCtx?.groups[0]?.id

  const [activityLog, setActivityLog] = useState(null);


  const [isClient, setIsClient] = useState(false);
  const [isViewActivityLog, setIsViewActivityLog] = useState(true);


  useEffect(() => {
    // console.log(props?.activityLog)
    setActivityLog(props?.activity_log)
  }, [])

  async function fetchChangeLogs() {

    setIsViewActivityLog(!isViewActivityLog);

                    if(!isViewActivityLog && !activityLog){
                      try{
                          const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.cu?.id}/?fields=__rev__&include_audit=true`, {
                            headers: {
                              'Accept': 'application/json',
                              'Authorization': `Bearer ${props?.token}`
                            }
                          })
                        
                          setActivityLog((await resp.json()).revisions[0])
      
                      }
                      catch(e){
                        console.error('Error when fetching Activity Log', e.message)
                      }
                    }

   }

  

 
	useEffect(() => {
	  setIsClient(true)
	}, [])


 

  if(isClient) {



  return (
    <>
      <Head>
        <title>KMHFR | {props?.cu?.name || props?.cu?.official_name}</title>
        <link rel="icon" href="/favicon.ico" />
  
      </Head>

      <MainLayout>
        <div className="w-full md:w-[85%] grid grid-cols-1 px-4 md:grid-cols-7 my-4 md:gap-3 place-content-center">
         
          <div className="md:col-span-7 col-span-1 flex flex-col items-start justify-start gap-3">

            {/* Header */}
            <div className="flex text-start items-start md:items-center md:w-full  md:justify-start justify-between gap-2 text-sm md:text-base py-3">
             
              <Link className="text-gray-500" href="/community-units">
                Community units
              </Link>
              {"/"}
              <span className="text-gray-900">
                {props?.props?.cu?.name} ( #
                <i className="text-black">{props?.cu.code || "NO_CODE"}</i> )
              </span>
            </div>


            <div
              className={
                `md:col-span-7 col-span-1 flex justify-between items-start  gap-5  w-full border ${props?.cu.active ? "border-gray-600" : "border-yellow-700"} bgcenter-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 border-l-8 
                ${props?.cu.active ? "border-gray-600" : "border-yellow-700"}
              `}
            >
              <div className="col-span-1 md:col-span-3">
                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                  {props?.cu.name}
                </h1>
                <div className="flex gap-2 items-center w-full justify-between">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (props?.cu.code ? "text-gray-900" : "text-gray-500")
                    }
                  >
                    #{props?.cu.code || "NO_CODE"}
                  </span>
                  <p className="text-gray-600 leading-tight">
                    {props?.cu.keph_level_name && "KEPH " + props?.cu.keph_level_name}
                  </p>
                </div>
              </div>

              <div className="col span-1 md:col-span-3 self-end ">
                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                  {props?.cu.is_approved ? (
                    <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Approved
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      Not approved
                    </span>
                  )}
                  {props?.cu.is_closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      CHU Closed
                    </span>
                  )}
                  {props?.cu.deleted && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      CHU Deleted
                    </span>
                  )}
                  {props?.cu.active && (
                    <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Active
                    </span>
                  )}
                  {props?.cu.has_edits && (
                    <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <InformationCircleIcon className="h-4 w-4" />
                      Has changes
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
            </div>

          </div>

          {/* Community Unit Side Menu */}
          <div className="hidden rounded md:col-span-1 md:flex md:mt-8">
            <CommunityUnitSideMenu
              qf={'all'}
              filters={[]}
              _pathId={''}
            />
          </div>

          {/* Left side */}
          <div className="col-span-5 md:col-span-6 flex flex-col gap-3 mt-4">
            {/* Approve/Reject, Edit Buttons */}
            <div className="bg-gray-50 shadow-sm rounded w-full p-3  flex flex-col gap-3 mt-4">

        
           <div className="flex flex-row justify-start items-center space-x-3 p-3">
                { 
                 (groupID == 7 || 
                  groupID == 5 ||
                  groupID == 11 ||
                  groupID == 1) &&
                  (
                  (props?.cu?.is_approved === null || props?.cu?.is_approved === false) ||
                  props?.cu?.has_edits 
                ) &&
                <button
                  onClick={() => {
                    router.push(`/community-units/approve/${props?.cu.id}`)
                   
                  }}
                  className={"p-2 text-center -md font-semibold rounded text-base text-white bg-gray-400"}
                >
                  {/* Dynamic Button Rendering */}
                  {
                    (props?.cu?.is_approved === null || props?.cu?.is_approved === false) && props?.cu?.has_edits == false &&
                    "Approve Or Reject CHU"
                  }
                  {
                   props?.cu?.has_edits &&
                   "Approve Or Reject CHU Updates"

                  }
                </button>}
                <button
                  onClick={() => null}
                  className="p-2 text-center -md font-semibold rounded text-base text-white bg-black"
                >
                  Print
                </button>
                <button
                  onClick={() =>
                    router.push(
                      {
                      pathname: `/community-units/edit/${props?.cu?.id}`,
                      query: {
                        county: userCtx?.county,
                        sub_county: userCtx?.user_sub_counties.length > 1 ? userCtx?.user_sub_counties?.map(({sub_county}) => sub_county)?.join(',') : userCtx?.user_sub_counties[0]?.sub_county,
                        group: userCtx?.groups[0]?.id
                      }
                      }
                    )
                  }
                  className="p-2 text-center -md font-semibold rounded text-base  text-white bg-black"
                >
                  Edit
                </button>
              </div>
            </div>

            <Tabs.Root
              orientation="horizontal"
              className="w-full flex flex-col bg-gray-50 rounded shadow tab-root"
              defaultValue="overview"
            >
              <Tabs.List className="list-none border-b border-gray-600 flex justify-evenly flex-wrap md:flex-nowrap gap-2 md:gap-3 uppercase leading-none tab-list font-semibold ">
                <Tabs.Tab
                  id={1}
                  value="overview"
                  className="p-2 flex-1 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                >
                  Overview
                </Tabs.Tab>
                <Tabs.Tab
                  id={2}
                  value="services"
                  className="p-2  flex-1 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                >
                  Services
                </Tabs.Tab>
                <Tabs.Tab
                  id={3}
                  value="hr_staffing"
                  className="p-2 flex-1 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                >
                  Community Health Unit Workforce
                </Tabs.Tab>
              </Tabs.List>
              {/*End of the vertical tabs  */}

              <Tabs.Panel
                value="overview"
                className="grow-1 p-3 tab-panel"
              >
                <div className="col-span-4 md:col-span-4 flex flex-col md:p-4 gap-y-3 group items-center justify-start text-left">
                <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg leading-tight font-semibold col-span-2 text-gray-700">
                      Status
                    </h3>

                    <div className="flex justify-between gap-1">
                      <label className=" text-gray-600">
                        Functionality status
                      </label>
                      <p className="text-black font-medium text-base flex">
                        {props?.cu?.status_name
                          ?.toLocaleLowerCase()
                          .includes("fully-") ? (
                          <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                            <CheckCircleIcon className="h-4 w-4" />
                            {props?.cu?.status_name || "Fully functional"}
                          </span>
                        ) : props?.cu.status_name
                          ?.toLocaleLowerCase()
                          .includes("semi") ? (
                          <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                            <CheckCircleIcon className="h-4 w-4" />
                            {props?.cu?.status_name || "Semi Functional"}
                          </span>
                        ) : (
                          <span className="bg-red-200 text-gray-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                            {/* <XCircleIcon className="h-4 w-4" /> */}
                            {props?.cu?.status_name || "Non Functional"}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex justify-between gap-1">
                      <label className=" text-gray-600">CHU approved</label>
                      <p className="text-black font-medium text-base flex">
                        {props?.cu.is_approved ? (
                          <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
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

                    {true && (
                      <div className="flex justify-between gap-1">
                        <label className=" text-gray-600">CHU deleted</label>
                        <p className="text-black font-medium text-base flex">
                          {props?.cu.deleted ? (
                            <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                              Deleted
                            </span>
                          ) : (
                            <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                              Not Deleted
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {true && (
                      <div className="flex justify-between gap-1">
                        <label className=" text-gray-600">CHU closed</label>
                        <p className="text-black font-medium text-base flex">
                          {props?.cu.is_closed ? (
                            <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                              CHU Closed {props?.cu.closed_date || ""}
                            </span>
                          ) : (
                            <span className="bg-blue-200 text-gray-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                              Not closed
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {props?.cu.closing_reason && (
                      <div className="flex justify-between gap-1">
                        <label className=" text-gray-600">
                          Closure reason
                        </label>
                        <p className="text-black font-medium text-base">
                          {props?.cu.closed_date && <>{props?.cu.closed_date}. </>}{" "}
                          {props?.cu.closing_reason || ""}
                        </p>
                      </div>
                    )}
                    {true && (
                      <div className="flex justify-between gap-1">
                        <label className=" text-gray-600">Has edits</label>
                        <p className="text-black font-medium text-base flex">
                          {props?.cu.has_edits ? (
                            <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                              Yes
                            </span>
                          ) : (
                            <span className="bg-blue-200 text-gray-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                              No edits
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    {true && (
                      <div className="flex justify-between gap-1">
                        <label className=" text-gray-600">Rejected</label>
                        <p className="text-black font-medium text-base flex">
                          {props?.cu.is_rejected ? (
                            <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                              CHU rejected {props?.cu.closed_date || ""}
                            </span>
                          ) : (
                            <span className="bg-blue-200 text-gray-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                              Not rejected
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg leading-tight text-gray-700 font-semibold">
                      Coverage
                    </h3>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        Households monitored
                      </label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.households_monitored || " - "}
                      </p>
                    </div>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        Number of CHVs
                      </label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.number_of_chvs || " - "}
                      </p>
                    </div>
                  </div>
                </div>


                <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg leading-tight text-gray-700 font-semibold">
                      Location
                    </h3>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        Linked facility
                      </label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.facility_name || " - "}
                      </p>
                    </div>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">Ward</label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.facility_ward || " - "}
                      </p>
                    </div>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        Constituency
                      </label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.facility_constituency || " - "}
                      </p>
                    </div>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        Sub-county
                      </label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.facility_subcounty || " - "}
                      </p>
                    </div>
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        County
                      </label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {props?.cu.facility_county || " - "}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg leading-tight text-gray-700 font-semibold">
                      Regulation:
                    </h3>
                    {props?.cu.date_established && (
                      <div className="flex justify-between gap-1">
                        <label className="col-span-1 text-gray-600">
                          Date established
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {new Date(props?.cu.date_established).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          ) || " - "}
                        </p>
                      </div>
                    )}
                    {props?.cu.date_operational && (
                      <div className="flex justify-between gap-1">
                        <label className="col-span-1 text-gray-600">
                          Date operational
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {new Date(props?.cu.date_operational).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          ) || " - "}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between gap-1">
                      <label className="col-span-1 text-gray-600">
                        Regulated
                      </label>
                      <p className="col-span-2 text-black font-medium text-base flex">
                        {props?.cu.regulated ? (
                          <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
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
                </div>
                {
                  props?.cu?.contacts && props?.cu?.contacts.length > 0 &&
                <div className="rounded border p-4 border-blue-500 bg-blue-100/60 w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-24">
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg leading-tight text-gray-700 font-semibold">
                      Contacts
                    </h3>
                    {props?.cu.contacts && props?.cu.contacts.length > 0 &&
                      props?.cu.contacts.map((contact, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-1"
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
                    {props?.cu.officer_in_charge && (
                      <div className="flex justify-between gap-1">
                        <label className="col-span-1 text-gray-600 capitalize">
                          {props?.cu.officer_in_charge.title_name ||
                            "Officer in charge"}
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {props?.cu.officer_in_charge.name || " - "}
                        </p>
                      </div>
                    )}
                    {props?.cu.officer_in_charge && props?.cu.officer_in_charge.contacts.length > 0 &&
                      props?.cu.officer_in_charge.contacts.map((contact, i) => (
                        <div
                          key={i}
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
                }
                  {/* <div> */}

                  {/* </div> */}
                  <div className='flex justify-between items-center w-full mt-5'>
                    <button className='flex items-center justify-start space-x-2 p-1 border-2 border-black  px-2'
                      onClick={() => {
                        setIsViewActivityLog(!isViewActivityLog);
                        fetchChangeLogs()
                      }}
                    >
                      <span className='text-medium font-semibold text-black '>
                        {!isViewActivityLog ? 'View Changelog' : 'Hide Changelog'}
                      </span>
                    </button>
                  </div>
                  {
                  isViewActivityLog && 
                  <ol className="relative border-l-4 mt-4 border-gray-200 w-full dark:border-gray-300">  
                  {    
                        activityLog &&
                        activityLog?.map(({updated_on, updated_by, updates}, i) => (      
                      <li className="mb-10 ms-8" key={i}>            
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ">
                              <Avatar  className="w-7 bg-gray-400 aspect-square mt-4">{updated_by[0].toUpperCase()}</Avatar>
                          </span>
                          <div className="items-start justify-between p-4 bg-blue-100 border border-blue-600 rounded-lg shadow-sm sm:flex">
                              <time className="mb-1 text-xs font-normal text-blue-900 sm:order-last sm:mb-0">{new Date(updated_on).toLocaleString(
                                'en-gb',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  timeZone: 'utc'
                                }
                              )}</time>
                              
                              <div className="text-sm font-normal text-blue-800 gap-y-2">
                                <span className="bg-blue-400 text-gray-50 text-xs font-semibold me-1 px-2.5 py-0.5 rounded">{updated_by}</span>made the following changes: 
                                {
                                updates && updates.length > 0 &&
                                updates?.map(({old, new:_new, name}, i) => (
                                  <div key={i} className="flex gap-1 mt-1 gap-y-1 flex-wrap">
                                {"Changed "}
                                <span className="font-semibold text-gray-500">
                                { (name !== "id" || 
                                    name !== "created" || 
                                    name !== "updated" || 
                                    name !== "created_by" || 
                                    name !== "updated_by") && name} 
                                </span>
                                {/* <span  className="font-semibold text-gray-500"> { old } </span>  */}
                                to
                                  <span className="font-semibold text-gray-500 min-w-max">{ _new ?? '-'} </span>
                                </div>
                                ))
                              }
                              </div>
                              
                            
                          </div>
                      </li>
                    ))
    
                  }
    
                      
                      
                  </ol>
                
                  }


                
                </div>
              </Tabs.Panel>
              <Tabs.Panel
                value="services"
                className="grow-1 py-1  px-4 tab-panel"
              >
                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                  <div className="bg-gray-50 w-full m-3 ">
                    <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                      <span className="font-semibold">Services</span>
                      <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
                    </h3>
                    <ul>
                      {props?.cu?.services && props?.cu?.services.length > 0 ? (
                        props?.cu?.services.map((service, i) => (
                          <li
                            key={i}
                            className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
                          >
                            <div>
                              <p className="text-gray-800 text-base">
                                {service.name}
                              </p>
                            </div>

                          </li>
                        ))
                      ) : (
                        <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                          <p>No services listed for this cu.</p>
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
                <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                  <div className="bg-gray-50 w-full m-3 ">
                    <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                      <span className="font-semibold">
                        Health Unit workers
                      </span>
                    </h3>
                    <ul>
                      {props?.cu?.health_unit_workers && props?.cu?.health_unit_workers.length > 0 ? (
                        props?.cu?.health_unit_workers.map((hr, i) => (
                          <li
                            key={i}
                            className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
                          >
                            <div>
                              <p className="text-gray-800 text-base">
                                {hr.name} {hr.is_incharge ? <span className="font-bold" >(In charge)</span> : null}
                              </p>
                            </div>

                          </li>
                        ))
                      ) : (
                        <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                          <p>No HR data listed for this cu.</p>
                        </li>
                      )}
                    </ul>
                  </div>

                </div>
              </Tabs.Panel>
            </Tabs.Root>
          </div>
          {/* End of approval or reject validation */}

        </div>
      </MainLayout>
    </>
  );
  }
  else 
  {
    return null;
  }
}

export async function getServerSideProps (ctx) {

  const token = (await checkToken(ctx?.req, ctx?.res))?.token


  const zSchema = z.object({
    id: z.string('Should be a uuid string').optional(),
  })

  const queryId = zSchema.parse(ctx.query).id

  const props = {
    cu: [],
    activity_log: []
  }

  let response = {}

  response = (() => fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${queryId}/`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(async (res) => {
    if(res.ok) {

      props['cu'] = await res.json()

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${queryId}/?fields=__rev__&include_audit=true`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(async res => {
        props["activity_log"] = (await res.json())?.revisions ?? null
        
        return props;

      })
   
      .catch(e => {
        console.error('Error when fetching activity log: ', e.message)
      })
    }
  })
  .catch(e => {
    console.error('Error when fetching props?.cu details for: ', queryId, e.message)
  }))()


  return {
    props: response
  }


  
}

export default withAuth(EditCommunityUnit)
