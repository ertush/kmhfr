import Head from "next/head";
import * as Tabs from "@radix-ui/react-tabs";
import { checkToken } from "../../controllers/auth/auth";
import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayout";
import { approveRejectCHU, rejectCHU } from "../../controllers/reject";
import { ChevronDownIcon } from "@heroicons/react/solid";
import router from "next/router";

import {
  CheckCircleIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  LocationMarkerIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { ArrowsExpandIcon } from "@heroicons/react/outline";
import dynamic from "next/dynamic";

const CommUnit = (props) => {
  const Map = dynamic(
    () => import("../../components/Map"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false,
    } // This line is important. It's what prevents server-side render
  );
  let cu = props.data;

  const [user, setUser] = useState(null);
  const [isCHUDetails, setIsCHUDetails] = useState(true);
  const [isApproveReject, setIsApproveReject] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let usr = window.sessionStorage.getItem("user");
      if (usr && usr.length > 0) {
        setUser(JSON.parse(usr));
      }
    }
    return () => {
      setIsCHUDetails(true);
      setIsApproveReject(false);
    };
  }, []);
  return (
    <>
      <Head>
        <title>KMHFL - {cu?.name || cu?.official_name}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/assets/css/leaflet.css" />
      </Head>

      <MainLayout>
        <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
          <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3">
            <div className="flex flex-row gap-2 text-sm md:text-base">
              <a className="text-green-700" href="/">
                Home
              </a>{" "}
              {">"}
              <a className="text-green-700" href="/community-units">
                Community units
              </a>{" "}
              {">"}
              <span className="text-gray-500">
                {cu.name} ( #
                <i className="text-black">{cu.code || "NO_CODE"}</i> )
              </span>
            </div>
            <div
              className={
                "col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                (cu.active ? "border-green-600" : "border-red-600")
              }
            >
              <div className="col-span-6 md:col-span-3">
                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                  {cu.name}
                </h1>
                <div className="flex gap-2 items-center w-full justify-between">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (cu.code ? "text-green-900" : "text-gray-400")
                    }
                  >
                    #{cu.code || "NO_CODE"}
                  </span>
                  <p className="text-gray-600 leading-tight">
                    {cu.keph_level_name && "KEPH " + cu.keph_level_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                  {cu.is_approved ? (
                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Approved
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      Not approved
                    </span>
                  )}
                  {cu.is_closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      CHU Closed
                    </span>
                  )}
                  {cu.deleted && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      CHU Deleted
                    </span>
                  )}
                  {cu.active && (
                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Active
                    </span>
                  )}
                  {cu.has_fffedits && (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <InformationCircleIcon className="h-4 w-4" />
                      Has changes
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
            </div>
          </div>

          {/* Left side */}
            <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4">
              {/* Approve/Reject, Edit Buttons */}
              <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                <div className="flex flex-row justify-start items-center space-x-3 p-3">
                  <button
                    onClick={() => router.push("/community-units/approve/" + cu.id)
                      //approveRejectCHU(cu.is_approved,setIsApproveReject,props.data.id)
                    }
                    className={
                      cu.is_approved || cu.is_rejected
                        ? ''
                        : "p-2 text-center rounded-md font-semibold text-base text-white bg-green-500"
                    }
                  >
                  {/* Dynamic Button Rendering */}
                  {cu.is_approved || cu.is_rejected
                  ? "" 
                  : "Approve/Reject"}
                  </button>
                  <button
                    onClick={() => console.log(cu.name)}
                    className="p-2 text-center rounded-md font-semibold text-base text-white bg-indigo-500"
                  >
                    Print
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        "/community-units/edit_community_unit/" + cu.id
                      )
                    }
                    className="p-2 text-center rounded-md font-semibold text-base  text-white bg-indigo-500"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <Tabs.Root
                orientation="horizontal"
                className="w-full flex flex-col tab-root"
                defaultValue="overview"
              >
                <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                  <Tabs.Tab
                    id={1}
                    value="overview"
                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                  >
                    Overview
                  </Tabs.Tab>
                  <Tabs.Tab
                    id={2}
                    value="services"
                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                  >
                    Services
                  </Tabs.Tab>
                  <Tabs.Tab
                    id={3}
                    value="hr_staffing"
                    className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                  >
                    HR &amp; Staffing
                  </Tabs.Tab>
                </Tabs.List>
                {/*End of the vertical tabs  */}

                <Tabs.Panel
                  value="overview"
                  className="grow-1 py-1 px-4 tab-panel"
                >
                  <div className="col-span-4 md:col-span-4 flex flex-col gap-y-2 group items-center justify-start text-left">
                    <div className="bg-white border border-gray-100 w-full p-3 rounded grid grid-cols-2 gap-3 shadow-sm mt-4">
                      <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">
                        Status:
                      </h3>
                      <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                        <label className=" text-gray-600">
                          Functionality status
                        </label>
                        <p className="text-black font-medium text-base flex">
                          {cu.status_name
                            ?.toLocaleLowerCase()
                            .includes("fully-") ? (
                            <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                              <CheckCircleIcon className="h-4 w-4" />
                              {cu?.status_name || "Yes"}
                            </span>
                          ) : cu.status_name
                              ?.toLocaleLowerCase()
                              .includes("semi") ? (
                            <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                              <CheckCircleIcon className="h-4 w-4" />
                              {cu?.status_name || "Yes"}
                            </span>
                          ) : (
                            <span className="bg-red-200 text-gray-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                              <XCircleIcon className="h-4 w-4" />
                              {cu?.status_name || "No"}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                        <label className=" text-gray-600">CHU approved</label>
                        <p className="text-black font-medium text-base flex">
                          {cu.is_approved ? (
                            <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                              <CheckCircleIcon className="h-4 w-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                              <XCircleIcon className="h-4 w-4" />
                              No
                            </span>
                          )}
                        </p>
                      </div>
                      {true && (
                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                          <label className=" text-gray-600">CHU deleted</label>
                          <p className="text-black font-medium text-base flex">
                            {cu.deleted ? (
                              <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                                Deleted
                              </span>
                            ) : (
                              <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                                Not Deleted
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      {true && (
                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                          <label className=" text-gray-600">CHU closed</label>
                          <p className="text-black font-medium text-base flex">
                            {cu.is_closed ? (
                              <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                                CHU Closed {cu.closed_date || ""}
                              </span>
                            ) : (
                              <span className="bg-green-200 text-green-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                Not closed
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      {cu.closing_reason && (
                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                          <label className=" text-gray-600">
                            Closure reason
                          </label>
                          <p className="text-black font-medium text-base">
                            {cu.closed_date && <>{cu.closed_date}. </>}{" "}
                            {cu.closing_reason || ""}
                          </p>
                        </div>
                      )}
                      {true && (
                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                          <label className=" text-gray-600">Has edits</label>
                          <p className="text-black font-medium text-base flex">
                            {cu.has_edits ? (
                              <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default">
                                Yes
                              </span>
                            ) : (
                              <span className="bg-green-200 text-green-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                No edits
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      {true && (
                        <div className="grid grid-cols-2 w-full md:w-11/12 md:px-3 col-span-2 md:col-span-1 mx-auto leading-none items-center">
                          <label className=" text-gray-600">Rejected</label>
                          <p className="text-black font-medium text-base flex">
                            {cu.is_rejected ? (
                              <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-red-200 text-red-900 flex gap-x-1 items-center cursor-default">
                                CHU rejected {cu.closed_date || ""}
                              </span>
                            ) : (
                              <span className="bg-green-200 text-green-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                                Not rejected
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                        Coverage:
                      </h3>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Households monitored
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.households_monitored || " - "}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Number of CHVs
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.number_of_chvs || " - "}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                        Location:
                      </h3>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Linked facility
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.facility_name || " - "}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">Ward</label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.facility_ward || " - "}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Constituency
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.facility_constituency || " - "}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Sub-county
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.facility_subcounty || " - "}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          County
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.facility_county || " - "}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                        Regulation:
                      </h3>
                      {cu.date_established && (
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            Date established
                          </label>
                          <p className="col-span-2 text-black font-medium text-base">
                            {new Date(cu.date_established).toLocaleDateString(
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
                      {cu.date_operational && (
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            Date operational
                          </label>
                          <p className="col-span-2 text-black font-medium text-base">
                            {new Date(cu.date_operational).toLocaleDateString(
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
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Regulated
                        </label>
                        <p className="col-span-2 text-black font-medium text-base flex">
                          {cu.regulated ? (
                            <span className="leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default">
                              <CheckCircleIcon className="h-4 w-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="bg-red-200 text-red-900 p-1 px-2 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                              <XCircleIcon className="h-4 w-4" />
                              No
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                        Contacts:
                      </h3>
                      {cu.contacts &&
                        cu.contacts.length > 0 &&
                        cu.contacts.map((contact, i) => (
                          <div
                            key={i}
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
                      {cu.officer_in_charge && (
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600 capitalize">
                            {cu.officer_in_charge.title_name ||
                              "Officer in charge"}
                          </label>
                          <p className="col-span-2 text-black font-medium text-base">
                            {cu.officer_in_charge.name || " - "}
                          </p>
                        </div>
                      )}
                      {cu.officer_in_charge &&
                        cu.officer_in_charge.contacts.length > 0 &&
                        cu.officer_in_charge.contacts.map((contact, i) => (
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
                    <details className="bg-gray-100 w-full py-2 px-4 text-gray-400 cursor-default rounded">
                      <summary>All data</summary>
                      <pre
                        className="language-json leading-normal text-sm whitespace-pre-wrap text-gray-800 overflow-y-auto"
                        style={{ maxHeight: "70vh" }}
                      >
                        {JSON.stringify({ ...cu }, null, 2)}
                      </pre>
                    </details>
                  </div>
                </Tabs.Panel>
                <Tabs.Panel
                  value="services"
                  className="grow-1 py-1 px-4 tab-panel"
                >
                  <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                    <div className="bg-white w-full p-4 rounded">
                      <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                        <span className="font-semibold">Services</span>
                        <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
                      </h3>
                      <ul>
                        {cu?.services && cu?.services.length > 0 ? (
                          cu?.services.map((service, i) => (
                            <li
                              key={i}
                              className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
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
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                <span>Active</span>
                              </label>
                            </li>
                          ))
                        ) : (
                          <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                            <p>No services listed for this cu.</p>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                        Service rating:
                      </h3>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Average rating
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.avg_rating || 0}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Number of ratings
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.number_of_ratings || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel
                  value="hr_staffing"
                  className="grow-1 py-1 px-4 tab-panel"
                >
                  <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                    <div className="bg-white w-full p-4 rounded">
                      <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                        <span className="font-semibold">
                          Health Unit workers
                        </span>
                      </h3>
                      <ul>
                        {cu?.health_unit_workers &&
                        cu?.health_unit_workers.length > 0 ? (
                          cu?.health_unit_workers.map((hr, i) => (
                            <li
                              key={i}
                              className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
                            >
                              <div>
                                <p className="text-gray-800 text-base">
                                  {hr.name}
                                </p>
                                {hr.is_incharge ? (
                                  <small className="text-xs text-gray-500">
                                    In charge
                                  </small>
                                ) : (
                                  ""
                                )}
                              </div>
                              {hr.active ? (
                                <div className="flex flex-row gap-1 items-center">
                                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                  <label className="text-sm text-gray-600">
                                    Active
                                  </label>
                                </div>
                              ) : (
                                <div className="flex flex-row gap-1 items-center">
                                  <XCircleIcon className="h-6 w-5 text-red-600" />
                                  <label className="text-sm text-gray-600">
                                    Active
                                  </label>
                                </div>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                            <p>No HR data listed for this cu.</p>
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                      <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                          Number of CHVs
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                          {cu.number_of_chvs || " - "}
                        </p>
                      </div>
                    </div>
                  </div>
                </Tabs.Panel>
              </Tabs.Root>
            </div>
          {/* End of approval or reject validation */}

          {/* Aside / Right Side  */}
          <aside className="flex flex-col col-span-5 md:col-span-2 gap-4 mt-5">
            <h3 className="text-2xl tracking-tight font-semibold leading-5">
              Map
            </h3>

            {cu?.lat_long && cu?.lat_long.length > 0 ? (
              <div className="w-full bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                <Map
                  operational={cu.status_name}
                  code={cu?.code || "NO_CODE"}
                  lat={cu?.lat_long[0]}
                  long={cu?.lat_long[1]}
                  name={cu.official_name || cu.name || ""}
                  constituency={cu?.constituency}
                />
              </div>
            ) : (
              <div className="w-full bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                <div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                  <p>No location data found for this cu.</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-3">
              <h4 className="text-2xl text-gray-800">Recent activity</h4>
              <ol className="list-decimal list-outside ml-4 flex flex-row gap-3">
                <li className="bg-gray-50 w-full rounded-sm p-2">
                  {cu?.latest_approval_or_rejection?.comment && (
                    <p>{cu?.latest_approval_or_rejection?.comment}</p>
                  )}
                  {/* <small className="text-gray-500">{cu?.latest_approval_or_rejection?.id}</small> */}
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </MainLayout>
    </>
  );
};

CommUnit.getInitialProps = async (ctx) => {
  if (ctx.query.q) {
    const query = ctx.query.q;

    if (typeof window !== "undefined" && query.length > 2) {
      window.location.href = `/community-units?q=${query}`;
    } else {
      if (ctx.res) {
        ctx.res.writeHead(301, {
          Location: "/community-units?q=" + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }
  return checkToken(ctx.req, ctx.res)
    .then((t) => {
      if (t.error) {
        throw new Error("Error checking token");
      } else {
        let token = t.token;
        let url =
          process.env.NEXT_PUBLIC_API_URL + "/chul/units/" + ctx.query.id + "/";

        return fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        })
          .then((r) => r.json())
          .then((json) => {
            return {
              data: json,
            };
          })
          .catch((err) => {
            console.log("Error fetching facilities: ", err);
            return {
              error: true,
              err: err,
              data: [],
            };
          });
      }
    })
    .catch((err) => {
      console.log("Error checking token: ", err);
      if (typeof window !== "undefined" && window) {
        if (ctx?.asPath) {
          window.location.href = ctx?.asPath;
        } else {
          let token = t.token;
          let url =
            process.env.NEXT_PUBLIC_API_URL +
            "/chul/units/" +
            ctx.query.id +
            "/";
          return fetch(url, {
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
            },
          })
            .then((r) => r.json())
            .then((json) => {
              console.log(json);
              return {
                data: json,
              };
            })
            .catch((err) => {
              console.log("Error fetching facilities: ", err);
              return {
                error: true,
                err: err,
                data: [],
              };
            });
        }
      }
      console.log("My Error:" + err);

      return {
        error: true,
        err: err,
        data: [],
      };
    });
};

export default CommUnit;
