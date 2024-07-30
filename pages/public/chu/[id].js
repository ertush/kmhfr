import Head from "next/head";
import * as Tabs from "@radix-ui/react-tabs";
import { checkToken } from '../../../controllers/auth/public_auth';
import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/MainLayout";
import {
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import Link from 'next/link';
import StarRatingComponent from 'react-star-rating-component';
import {z} from 'zod'

function CommunityUnit(props) {
  const Map = dynamic(
    () => import("../../../components/Map"),
    {
      loading: () => (
        <div className="text-gray-800 text-lg  py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false,
    } // This line is important. It's what prevents server-side render
  );
  let cu = props?.data;

  const center = props?.center

  useEffect(() => {
    if (typeof window !== 'undefined') { //auth.add_group
      if(window.localStorage?.getItem(cu?.id) !== null){
        setRating(JSON.parse(window.localStorage?.getItem(cu?.id))[0])
      }
    }
  }, [])
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('')
  const url = `${process.env.NEXT_PUBLIC_API_URL}/chul/units_detail_report/${cu.id}/?access_token=${props?.access_token}&format=pdf`

  const handleRating = async (event) => {

    event.preventDefault();

    let rate = {
        chu: cu.id,
        rating: rating,
        comment: comment
    }

    let url = `/api/common/submit_form_data/?path=rate_chu`
    try {
        await fetch(url, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            method:'POST',
            body: JSON.stringify(rate).replace(',"":""','')

        })
        .then(res => res.json())
        .then(data => {
          let rating_val = []
          rating_val[0]= data.rating
          rating_val[1]= data.comment
          window.localStorage.setItem(cu.id, JSON.stringify(rating_val))
          console.log(data)
        })
        .catch(err => {console.log(err)})
    } catch (error) {
        console.log(error)
    }
  }


  return (
    <>
      <Head>
        <title> KMHFR | {cu?.name || cu?.official_name}</title>
        <link rel="icon" href="/favicon.ico" />
  
      </Head>

      <MainLayout>
      
        <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-7 gap-3 my-4 place-content-center">
         
         {/* Headings matters*/}
          <div className="md:col-span-7 col-span-1 flex flex-col items-start px-4 md:px-0 justify-start gap-3">

            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
              <Link className="text-gray-700" href="/">
                Home
              </Link>
              {"/"}
              <Link className="text-gray-700" href="/public/chu/community_units">
                Community units
              </Link>
              {"/"}
              <span className="text-gray-500">
                {cu.name} ( #
                <i className="text-black">{cu.code || "NO_CODE"}</i> )
              </span>
            </div>


            <div
              className={
                "md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full rounded bg-gray-50 drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 shadow-sm items-center border-l-8 " +
                (cu.active ? "border-gray-600" : "border-red-600")
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
                      (cu.code ? "text-gray-900" : "text-gray-400")
                    }
                  >
                    #{cu.code || "NO_CODE"}
                  </span>
                  <p className="text-gray-600 leading-tight">
                    {cu.keph_level_name && "KEPH " + cu.keph_level_name}
                  </p>
                </div>
              </div>

               
            </div>

          </div>
         

          {/* Main Body */}
          <div className="col-span-1 md:col-span-7 flex rounded flex-col md:flex-row gap-3 mt-4 px-4 md:px-0">

              {/* CHU Details Tab section */}
              <div className="bg-gray-50 shadow-sm flex flex-col gap-3 md:w-2/3 w-full ">
                {/* Approve/Reject, Edit Buttons */}
              

                <Tabs.Root
                  orientation="horizontal"
                  className="w-full flex flex-col tab-root"
                  defaultValue="overview"
                >
                  <Tabs.List className="list-none flex justify-around border-b border-gray-600 flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold">
                    <Tabs.Tab
                      id={1}
                      value="overview"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                      Overview
                    </Tabs.Tab>
                   
                    <Tabs.Tab
                      id={3}
                      value="chu_ratings"
                      className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                    >
                    Chu Ratings
                    </Tabs.Tab>
                    </Tabs.List>
                  {/*End of the vertical tabs  */}

                  <Tabs.Panel
                    value="overview"
                    className="grow-1 p-4 tab-panel"
                  >
                    <div className="flex flex-col gap-y-2 group items-center justify-start text-left">
                      
                      <div className=" w-full p-3 grid grid-cols-3  gap-3  ">
                        <h3 className="text-lg leading-tight underline col-span-2 text-gray-700 font-medium">
                          Status:
                        </h3>
                        <div className="grid grid-cols-3 w-full md:w-11/12 col-span-3  md:px-3 mx-auto leading-none items-center">
                          <label className=" text-gray-600">
                            Functionality status
                          </label>
                          <p className="text-black font-medium text-base col-start-3 flex">
                            {cu.status_name
                              ?.toLocaleLowerCase()
                              .includes("fully-") ? (
                              <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                                <CheckCircleIcon className="h-4 w-4" />
                                {cu?.status_name || "Yes"}
                              </span>
                            ) : cu.status_name
                              ?.toLocaleLowerCase()
                              .includes("semi") ? (
                              <span className="leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default">
                                <CheckCircleIcon className="h-4 w-4" />
                                {cu?.status_name || "Yes"}
                              </span>
                            ) : (
                              <span className="bg-red-200 text-gray-900 p-1 px-2 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                                <XCircleIcon className="h-4 w-4" />
                                {cu?.status_name || "No"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className=" w-full p-3  flex flex-col gap-3  mt-4">
                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                          Coverage:
                        </h3>
                        <div className="grid grid-cols-3  w-full  md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            Households monitored
                          </label>
                          <p className="col-start-3 col-span-1 text-black font-medium text-base">
                            {cu.households_monitored || " - "}
                          </p>
                        </div>
                      </div>

                      <div className=" w-full p-3  flex flex-col gap-3  mt-4">
                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                          Location:
                        </h3>
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            Linked facility
                          </label>
                          
                          <Link  className="col-start-3" href={`/public/facility/`+ cu.facility}>
                            <span className="text-gray-700 col-start-3 underline underline-offset-1">{cu.facility_name || " - "}</span>
                          </Link>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">Ward</label>
                          <p className="col-start-3 text-black font-medium text-base">
                            {cu.facility_ward || " - "}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            Constituency
                          </label>
                          <p className="col-start-3 text-black font-medium text-base">
                            {cu.facility_constituency || " - "}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            Sub-county
                          </label>
                          <p className="col-start-3 text-black font-medium text-base">
                            {cu.facility_subcounty || " - "}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                          <label className="col-span-1 text-gray-600">
                            County
                          </label>
                          <p className="col-start-3 text-black font-medium text-base">
                            {cu.facility_county || " - "}
                          </p>
                        </div>
                      </div>

                      <div className=" w-full p-3  flex flex-col gap-3  mt-4">
                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                          Regulation:
                        </h3>
                        {cu.date_established && (
                          <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                            <label className="col-span-1 text-gray-600">
                              Date established
                            </label>
                            <p className="col-start-3 text-black font-medium text-base">
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
                      </div>

                      {/* <div className=" w-full p-3  flex flex-col gap-3  mt-4">
                        <h3 className="text-lg leading-tight underline text-gray-700 font-medium">
                          Contacts:
                        </h3>
                        {cu.contacts && cu.contacts.length > 0 ?
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
                              <p className="col-start-3 text-black font-medium text-base">
                                {contact.contact || " - "}
                              </p>
                            </div>
                          )) :
                          <p className="col-start-3 text-black font-medium text-base">
                                Use the linked facility's contacts. 
                              </p>
                          }
                        
                        {cu.officer_in_charge && (
                          <div className="grid grid-cols-3 w-full md:w-11/12 mx-auto leading-none items-center">
                            <label className="col-span-1 text-gray-600 capitalize">
                              {cu.officer_in_charge.title_name ||
                                "Officer in charge"}
                            </label>
                            <p className="col-start-3 text-black font-medium text-base">
                              {cu.officer_in_charge.name || " - "}
                            </p>
                          </div>
                        )}
                        
                      </div> */}
                      {/* <div> */}

                      {/* </div> */}
                      
                    </div>
                  </Tabs.Panel>

                  {/* <Tabs.Panel
                    value="services"
                    className="grow-1 p-4 tab-panel"
                  >
                    <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                      <div className="w-full p-4 ">
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
                  </Tabs.Panel> */}

                  {/* <Tabs.Panel
                    value="hr_staffing"
                    className="grow-1 p-4 tab-panel"
                  >
                    <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                      <div className="w-full p-4 ">
                        <h3 className="text-2xl w-full flex flex-wrap justify-between items-center leading-tight tracking-tight">
                          <span className="font-semibold">
                            Health Unit workers
                          </span>
                        </h3>
                        <ul>
                          {cu?.health_unit_workers && cu?.health_unit_workers.length > 0 ? (
                            cu?.health_unit_workers.map((hr, i) => (
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
                  </Tabs.Panel> */}

                  {/* chu ratings */}

                  <Tabs.Panel
                    value="chu_ratings"
                    className="grow-1 p-4 tab-panel"
                  >
                    <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                      <div className="w-full p-4 ">
                        <h4 className="text-xl w-full  flex-wrap justify-between items-center leading-tight tracking-tight">
                        
                          CHUL Average Rating: &nbsp;  <span className="text-2xl font-bold">{cu?.avg_rating && Number((cu?.avg_rating).toFixed(1))}
                          </span>
                        </h4>
                        <StarRatingComponent 
                            className="text-2xl"
                            name="rate1" 
                            editing={false}
                            starCount={5}
                            value={cu?.avg_rating || 0}
                            onStarClick={(e)=>setRating(e)}
                          />
                          <br/>
                          <span className="text-xl">{cu?.number_of_ratings} Ratings</span>
                      </div>
                      <div className="w-full p-4 ">                  
                      <form onSubmit={handleRating}>
                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                            <h4>Rate Community Health Unit </h4>
                                <label
                                    htmlFor='chu-rating'
                                    className='text-gray-600 capitalize text-sm'>
                                    Stars represent level of satisfaction: 5 (Very Good), 4 (Good), 3 (Average), 2 (Poor), 1 (Very Poor)
                                </label>
                                <input
                                    type='text'
                                    name='chu-rating'
                                    id='chu-rating'
                                    onChange={(e)=>setComment(e.target.value)}
                                    placeholder="Leave a comment"
                                    className='flex-none w-1/2 bg-gray-50  p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:focus:border-black outline-none'
                                />
                                  <StarRatingComponent 
                                    className="text-2xl"
                                    name="rate1" 
                                    starCount={5}
                                    value={rating}
                                    onStarClick={(e)=>setRating(e)}
                                    />
                                <button
                                    type='submit'
                                    className='flex items-center justify-start space-x-2 bg-gray-500  p-1 px-2'>
                                    <span className='text-medium font-semibold text-white'>
                                        Submit Rating
                                    </span>
                                </button>
                            </div>
                        </form>
                      </div>

                    </div>
                  </Tabs.Panel>
                </Tabs.Root>
              </div>
              
              {/* Map Section */}
              <div className="flex flex-col gap-3 mt-4 md:w-1/3 w-full rounded">
                <h2 className="text-xl font-semibold" >{cu?.facility_ward} Ward</h2>
                {cu?.lat_long && cu?.lat_long.length > 0 ? (
                    <div className="w-full flex flex-col">
                      <Map
                        ward_name={cu?.facility_ward}
                        operational={
                          cu?.operational ?? cu?.operation_status_name ?? ""
                        }
                        code={cu?.code || "NO_CODE"}
                        lat={cu?.lat_long[0]}
                        center={center}
                        long={cu?.lat_long[1]}
                        name={cu?.official_name || cu?.name || ""}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center relative">
                      <div className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                        <p>No location data found for this facility?.</p>
                      </div>
                    </div>
                  )}       

              </div>
          </div>
          {/* End of approval or reject validation */}

        </div>
      </MainLayout>
    </>
  );
};

CommunityUnit.getInitialProps = async (ctx) => {

  const alldata = {}
  let _data;

  const zSchema = z.object({
    id: z.string('Should be a uuid string').optional(),
  })


  const queryId = zSchema.parse(ctx.query).id

  if (ctx.query.q) {
    const query = ctx.query.q;

    if (typeof window !== "undefined" && query.length > 2) {
      window.location.href = `/community_units?q=${query}`;
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
        let url = process.env.NEXT_PUBLIC_API_URL + "/chul/units/" + queryId + "/";

        return fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        })
          .then((r) => r.json())
          .then( async(json) => {
            alldata['data'] = json
            if (json) {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/gis/drilldown/ward/${json.ward_code}/`,
                  {
                    headers: {
                      Authorization: "Bearer " + token,
                      Accept: "application/json",
                    },
                  }
                  );
                  
                  _data = await response.json();
                  console.log(_data)
  
                  const [lng, lat] =
                    _data?.properties.center.coordinates;
  
                alldata["center"] = [lat, lng];
               

                alldata["access_token"] = token;
                
              } catch (e) {
                console.error("Error in fetching ward boundaries", e.message);
              }
            }
            return alldata
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
          window.location.href = "/public/chu/community_units";
        }
      }
      setTimeout(() => {
        return {
          error: true,
          err: err,
          data: [],
        };
      }, 1000);
    });
};

export default CommunityUnit;
