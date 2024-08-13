import React, { useContext, useEffect, useState } from 'react'
import * as Tabs from "@radix-ui/react-tabs";
import { UserContext } from '../providers/user';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import StarRatingComponent from "react-star-rating-component";
import { useAlert } from "react-alert";
import Link from 'next/link'

function FacilityDetailsTabsPulic({ facility }) {

  const [user, setUser] = useState(null);

  //rating
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userCtx = useContext(UserContext);

  //alert
  const alert = useAlert();


  // const [isFormVisible, setIsFormVisible] = useState(false); 
  const [formVisibility, setFormVisibility] = useState(Array(facility.facility_services.length).fill(false) || []);

  useEffect(() => {
    let user_id
    if (userCtx) {
      let s_r = userCtx
      user_id = s_r.id
      setUser(s_r)
    }
  }, [userCtx])


  const handleServiceRating = async (event, serviceId) => {
    event.preventDefault();
    const commentString = Array.isArray(comment) ? comment.join(" ") : comment;
    const ratingInteger = Array.isArray(rating) ? rating[0] : rating;

    if (ratingInteger > 0) {
      const data = {
        rating: ratingInteger,
        comment: commentString,
        facility_service: serviceId,
      };

      const url = `/api/common/submit_form_data/?path=facility_service_ratings`;

      try {
        await fetch(url, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            let rating_val = [];
            rating_val[0] = data.rating;
            rating_val[1] = data.comment;
            alert.success("Review submitted successfully");
            window.localStorage.setItem("rating", JSON.stringify(rating_val));

            //clear
            setRating(0)
            setComment("")

            //clear the comment section and start rating
            const inputElement = document.querySelector('input[name="comment"]');
            if (inputElement) {
              inputElement.value = '';
            }

          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert.error("Rating value must be greater than zero");
    }
  };

  return (
    <div className="col-span-5 rounded md:col-span-3 flex bg-gray-50 shadow-md flex-col gap-3 mt-4">
     
      <Tabs.Root
        orientation="horizontal"
        className="w-full flex flex-col flex-wrap"
        defaultValue="overview"
      >
        <Tabs.List className="list-none flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-gray-600">
          <Tabs.Tab
            id={1}
            value="overview"
            className="p-2 whitespace-nowrap focus:outline:none flex flex-1 items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            id={2}
            value="services"
            className="p-2 whitespace-nowrap focus:outline:none flex flex-1 items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Services
          </Tabs.Tab>
          <Tabs.Tab
            id={5}
            value="community_units"
            className="p-2 whitespace-nowrap focus:outline:none flex flex-1 items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
          >
            Facility Units
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
                  Community Units
                </h3>

                {facility?.cu &&
                  facility?.cu.length > 0 ?
                
                  facility?.cu.map(({name, id}) => (
                    <div
                      key={id}
                      className="flex justify-between gap-1"
                    >
                      <label className="col-span-1 text-gray-600 capitalize">
                        Name
                      </label>
                      <Link href={`/public/chu/${id}`} className="hover:underline text-black font-medium text-base">
                        {name}
                      </Link>
                    </div>
                  ))
                  :

                  <div
                      className="flex justify-between gap-1"
                    >
                      <label className="col-span-1 text-gray-600 capitalize">
                        Name
                      </label>
                      <label className="text-black font-medium text-base">
                        -
                      </label>
                    </div>

                
                }
                {/* {facility?.officer_in_charge && (
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
                  ))} */}
              </div>
            </div>


           
          </div>

        </Tabs.Panel>
        <Tabs.Panel
          value="services"
          className="grow-1 p-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
            <div className="w-full p-4 ">
              <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                <span className="font-semibold">Services</span>
              </h3>
              <ul>
                {facility?.facility_services &&
                  facility?.facility_services.length > 0 ? (
                  facility?.facility_services.map((service, index) => (
                    <li
                      key={service.service_id}
                      className="w-full grid grid-cols-1 gap-3 place-content-end my-2 p-3 border-b border-gray-300"
                    >
                      <div>

                        <p className="text-gray-800 text-base">
                          {
                            index + 1 + "."
                          }
                          {service.service_name}
                        </p>
                        <small className="text-xs text-gray-500">
                          <span><b>Category: </b></span>{service.category_name || ""}
                        </small>
                        <label className="text-sm text-gray-600 flex gap-1 items-center">
                          <CheckCircleIcon className="h-6 w-6 text-gray-500" />
                          <span>Active</span>
                        </label>
                        <div className="flex justify-between">
                          <p className="text-left">
                            <span className="text-sm text-gray-600">
                              <b>Average Rating:</b> {service.average_rating.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-left">
                            <span className="text-sm text-gray-600">
                              <b>Number of Rating:</b> {service.number_of_ratings}
                            </span>
                          </p>
                        </div>
                        <div>
                        </div>
                        <button
                          type="button"
                          className="bg-gray-200  p-1 h-8 px-4"
                          onClick={() => {
                            const newFormVisibility = [...formVisibility];
                            newFormVisibility[index] = !newFormVisibility[index];
                            setFormVisibility(newFormVisibility);
                          }}
                        >
                          {formVisibility[index] ? "Hide Rating" : "Rate Service"}
                        </button>
                        {formVisibility[index] && (
                          <div className="flex flex-col gap-2">
                            <form
                              onSubmit={(e) =>
                                handleServiceRating(e, service.id)
                              }
                            >
                              <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                <label className="text-sm text-gray-600">
                                  Rate facility service (You may leave your contacts in the comment)
                                </label>
                                <input
                                  type="text"
                                  name="comment"
                                  className="border border-gray-300  p-2"
                                  value={comment[index]}
                                  placeholder="Leave a comement"
                                  onChange={(e) =>
                                    setComment((prev) => {
                                      let newComment = [...prev];
                                      newComment[index] = e.target.value;
                                      return newComment;
                                    })
                                  }
                                />
                                <p className='text-sm text-gray-600'>Stars Represent Level Of Satisfaction: 5 (Very Good), 4 (Good), 3 (Average), 2 (Poor), 1 (Very Poor)</p>
                                <StarRatingComponent
                                  className="text-2xl"
                                  name="rate1"
                                  starCount={5}
                                  value={rating[index]}
                                  onStarClick={(e) =>
                                    setRating((prev) => {
                                      let newRating = Array.isArray(prev) ? [...prev] : [];
                                      newRating[index] = e;
                                      return Array.isArray(newRating) ? newRating : [];
                                    })
                                  }
                                />

                              </div>
                              <div>
                                <button
                                  type="submit"
                                  className="bg-gray-500 text-white  p-1  h-8 px-4"
                                >
                                  Submit
                                </button>
                              </div>
                            </form>

                          </div>
                        )}
                      </div>
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
          value="community_units"
          className="grow-1 p-4 tab-panel"
        >
          <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
            <div className="w-full p-4 ">
              <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                <span className="font-semibold">Facility units</span>
                {/* {user && user?.id ? <a href={"/facility/edit/"+facility?.id+"#units"} className="text-base text-gray-700 font-medium hover:text-black focus:text-black active:text-black">Edit facility units</a> : ""} */}
              </h3>
              <ul>
                {facility?.facility_units &&
                  facility?.facility_units.length > 0 ? (
                  facility?.facility_units.map((unit) => (
                    <li
                      key={unit.id}
                      className="w-full flex flex-row justify-between gap-2 my-2 p-3 border-b border-gray-300"
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
                        <CheckCircleIcon className="h-6 w-6 text-gray-500" />
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

export default FacilityDetailsTabsPulic