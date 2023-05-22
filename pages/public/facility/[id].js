import Head from "next/head";
import { checkToken } from "../../../controllers/auth/public_auth";
import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../../components/MainLayout";
import Link from 'next/link'
import { useRouter } from 'next/router';
// import cookies from 'next-cookies';



import {
  CheckCircleIcon,
  LockClosedIcon,

} from "@heroicons/react/solid";


import dynamic from "next/dynamic";
// import router from "next/router";
import { UserContext } from "../../../providers/user";
import FacilityDetailsTabsPulic from "../../../components/FacilityDetailsTabsPublic";


// import Backdrop from '@mui/material/Backdrop';
// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
// import Fade from '@mui/material/Fade';
// import {Formik, Form, Field} from 'formik'
// import Typography from '@mui/material/Typography';
// import FacilitySideMenu from "../../../components/FacilitySideMenu";
// import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { PermissionContext } from "../../../providers/permissions";
// import { hasPermission } from "../../../utils/checkPermissions";
import { UserGroupContext } from "../../../providers/userGroup";
// import { belongsToUserGroup } from "../../../utils/checkUserGroup";
// import { useAlert } from "react-alert";


const FacilityDetails = (props) => {

  // const userPermissions = useContext(PermissionContext)
  // const userGroup = useContext(UserGroupContext)
  const userCtx = useContext(UserContext)


  const Map = dynamic(
    () => import("../../../components/Map"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false, // This line is important. It's what prevents server-side render
    } 
  );

  
  const facility = props["0"]?.data;
  const wardName = props["0"]?.data.ward_name;
  const center = props["1"]?.geoLocation.center;
  // const geoLocationData = props["1"]?.geoLocation;
  const qf = props["3"]?.qf ?? '';
  // const {facility_updated_json } = props["2"]?.updates;  
  // const filters = []


  const [user, setUser] = useState(null);

  // const [open, setOpen] = useState(true);
  // const [openCloseModal, setOpenCloseModal] = useState(true)
  const [isReasonRejected, setIsReasonRejected] = useState(false)
  // const handleClose = () => setOpen(false);
  // const handleCloseModal = () => {setOpenCloseModal(false); setIsClosingFacility(false)};


  // const [khisSynched, setKhisSynched] = useState(false);
  // const [facilityFeedBack, setFacilityFeedBack] = useState([])
  // const [pathId, setPathId] = useState('') 
  // const [allFctsSelected, setAllFctsSelected] = useState(false);
  // const [title, setTitle] = useState('') 

  const [isViewChangeLog, setIsViewChangeLog] = useState(false)
  // const [changeLogData, setChangeLogData] = useState(null)
  const [isClosingFacility, setIsClosingFacility] = useState(false)


  const _ = require('underscore')
  // const alert = useAlert()
  const router = useRouter()

  
  // let reject = ''

  useEffect(() => {
   
    if (userCtx) setUser(userCtx);
  
    return () => {
    };
  }, [isClosingFacility, isReasonRejected]);

  const handlePrint = (accessToken, id) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_detail_report/${id}/?format=pdf&access_token=${accessToken}`;
    router.push(url);
  };
  
  return (
    <>
      <Head>
        <title>KMHFL - {facility?.official_name ?? ""}</title>
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      
      <MainLayout>
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-3 my-4 place-content-center">
          {/* Header */}
          <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start gap-3">
            {/* Breadcramps */}
            <div className="flex flex-row gap-2 text-sm md:text-base md:my-3">
              <Link className="text-green-700" href="/public/facility/facilities">
                Home
              </Link>
              {"/"}
              <Link className="text-green-700" href="/public/facility/facilities">
                Facilities
              </Link>
              {"/"}
              <span className="text-gray-500">
                {facility?.official_name ?? ""} ( #
                <i className="text-black">{facility?.code || "NO_CODE"}</i> )
              </span>
              <div className="flex flex-row gap-2 items-center ml-auto">
                <button
                 onClick={()=>handlePrint(props['4'].token, facility.id)}
                  className="p-2 text-center rounded-md font-semibold text-base  text-white bg-indigo-500 justify-end mr-2"
                >
                 Print
                </button>
                </div>
            </div>
            {/* Header Bunner  */}
            <div
              className={
                "col-span-5 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                (facility?.is_approved ? "border-green-600" : "border-red-600")
              }  
            >
              <div className="col-span-6 md:col-span-3">
                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                  {facility?.official_name}
                </h1>
                <div className="flex gap-2 items-center w-full justify-between">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (facility?.code ? "text-green-900" : "text-gray-400")
                    }
                  >
                    #{facility?.code || "NO_CODE"}
                  </span>
                  <p className="text-gray-600 leading-tight">
                    {facility?.keph_level_name &&
                      "KEPH " + facility?.keph_level_name}
                  </p>
                </div>
                <p className="tracking-tight font-bold leading-tight">
                {/* Type : {facility?.facility_type_name ?? ""} */}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-end">
                  {facility?.operational || facility?.operation_status_name ? (
                    <span
                      className={
                        "leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-green-900 flex gap-x-1 items-center cursor-default"
                      }
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Operational
                    </span>
                  ) : (
                    ""
                  )}
                  {/* {facility?.is_approved ? (
                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Validated
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      Not validated
                    </span>
                  )} */}
                  {/* {facility?.is_complete ? (
                    <span className="bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Completed{" "}
                    </span>
                  ) : (
                    <span className="bg-yellow-200 text-yellow-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Incomplete{" "}
                    </span>
                  )} */}
                  {facility?.closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      Closed
                    </span>
                  )}
                </div>
                <div>
                  <b>Regulatory Body:</b> {facility.regulatory_body_name || ""}
                </div>
              </div>
              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
            </div>
          </div>      

          <div className={`col-span-1 md:col-span-4 md:w-full flex flex-col gap-3 mt-4`}>
            {/* Facility Details Tab Section */}
              <FacilityDetailsTabsPulic facility={facility}/>
          </div>

          {/* end facility approval */}
              
          <aside className={`flex flex-col col-span-1 md:col-span-3 gap-4 md:mt-7`}>
            <h3 className="text-2xl tracking-tight font-semibold leading-5">
              Map
            </h3>

            {facility?.lat_long && facility?.lat_long.length > 0 ? (
              <div className="w-full bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                <Map
                  ward_name={wardName}
                  operational={
                    facility?.operational ?? facility?.operation_status_name ?? ""
                  }
                  code={facility?.code || "NO_CODE"}
                  lat={facility?.lat_long[0]}
                  center={center}
                  // geoJSON={geoLocationData}
                  long={facility?.lat_long[1]}
                  name={facility?.official_name || facility?.name || ""}
                />
              </div>
            ) : (
              <div className="w-full bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                <div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                  <p>No location data found for this facility?.</p>
                </div>
              </div>
            )}
          </aside>

        </div>


      </MainLayout>
    </>
  );
};

FacilityDetails.getInitialProps = async (ctx) => {
  const allOptions = [];

  if (ctx.query.q) {
    const query = ctx.query.q;
    if (typeof window !== "undefined" && query.length > 2) {
      window.location.href = `/facilities?q=${query}`;
    } else {
      if (ctx.res) {
        ctx.res.writeHead(301, {
          Location: "/facilities?q=" + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }
  return checkToken(ctx.req, ctx.res)
    .then(async (t) => {
      if (t.error) {
        throw new Error("Error checking token");
      } else {
        let token = t.token;
        let _data;
        let url =
          process.env.NEXT_PUBLIC_API_URL +
          "/facilities/facilities/" +
          ctx.query.id +
          "/";
        return await fetch(url, {
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
            },
        })
          .then((r) => r.json())
          .then(async (json) => {
          allOptions.push({
            data: json,
            })


          // fetch ward boundaries
          if (json) {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/common/wards/${json.ward}/`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                  },
                }
              );

              _data = await response.json();

                const [lng, lat] =
                  _data?.ward_boundary.properties.center.coordinates;

              allOptions.push({
                geoLocation: JSON.parse(JSON.stringify(_data?.ward_boundary)),
                center: [lat, lng],
              });
            } catch (e) {
              console.error("Error in fetching ward boundaries", e.message);
            }
          }

          // fetch facility updates
            if(json){
              try{
                const facilityUpdateData = await (await fetch( `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${json.latest_update}/`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                  },
                }
              )).json()

              allOptions.push({
                updates: facilityUpdateData,
                })

            }
              catch(e){
                  console.error('Encountered error while fetching facility update data', e.message)
            }
          }

          allOptions.push({
            qf: ctx.query.qf
          })
          allOptions.push({
            token: token
          })
            return allOptions;
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
          window.location.href = "/facilities";
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

export default FacilityDetails;
