import { useState, useEffect, useContext } from 'react'
import MainLayout from '../../../components/MainLayout';
import FacilitySideMenu from '../../../components/FacilitySideMenu';
import { useRouter } from 'next/router';
import {
  validateRejectFacility,
  approveRejectFacilityUpdates,
  approveRejectFacility
} from "../../../controllers/facility/approveRejectFacility";

import {
  ChevronRightIcon,
  XCircleIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/solid";

import FacilityUpdatesTable from "../../../components/FacilityUpdatesTable";
import { checkToken } from "../../../controllers/auth/auth";
import Link from 'next/link'
import FacilityDetailsTabs from '../../../components/FacilityDetailsTabs';
import { Formik, Form, Field } from 'formik';
import { useAlert } from 'react-alert'
import { UserContext } from '../../../providers/user';


function ApproveReject(props) {
  const userCtx = useContext(UserContext);
  const [user, setUser] = useState(userCtx);
  // console.log({props})

  const alert = useAlert()
  const router = useRouter()
  const [isFacDetails, setIsFacDetails] = useState(true);



  const [khisSynched, setKhisSynched] = useState(false);
  const [facilityFeedBack, setFacilityFeedBack] = useState([])
  const [pathId, setPathId] = useState('')
  const [allFctsSelected, setAllFctsSelected] = useState(false);
  const [title, setTitle] = useState('')


  const facility = props["0"]?.data;
  const { facility_updated_json } = props["2"]?.updates ?? { facility_updated_json: null };
  const filters = []
  // const [reject, setReject] = useState(null)


  const [isClient, setIsClient] = useState(false)



  useEffect(() => {
    setUser(userCtx)
    if (user.id === 6) {
      router.push('/auth/login')
    }

    setIsClient(true)
  }, [])

  let reject

  if (isClient) {
    return (

      <MainLayout>


        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-3 my-4 place-content-center">


          {/* Breadcramps */}

          <div className="flex md:col-span-7 flex-row gap-2 text-sm md:text-base md:my-3">
            <Link className="text-blue-700" href="/">
              Home
            </Link>
            {"/"}
            <Link className="text-blue-700" href="/facilities">
              Facilities
            </Link>
            {"/"}
            <span className="text-gray-500">
              {facility?.official_name ?? ""} ( #
              <i className="text-black">{facility?.code || "NO_CODE"}</i> )
            </span>
          </div>

          {/* Header */}
          <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start gap-3">

            {/* Header Bunner  */}
            <div
              className={
                "col-span-5 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-transparent border border-blue-600 drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                (facility?.is_approved ? "border-blue-600" : "border-red-600")
              }
            >
              <div className="col-span-6 md:col-span-3">
                <span onClick={() => router.push(`/facilities/${facility?.id}`)} className="text-4xl hover:text-blue-600 cursor-pointer tracking-tight font-bold leading-tight">
                  {facility?.official_name}
                </span>
                <div className="flex gap-2 items-center w-full justify-between">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (facility?.code ? "text-blue-900" : "text-gray-400")
                    }
                  >
                    #{facility?.code || "NO_CODE"}
                  </span>

                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                  {facility?.operational || facility?.operation_status_name ? (
                    <span
                      className={
                        "leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default"
                      }
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Operational
                    </span>
                  ) : (
                    ""
                  )}
                  {facility?.approved ? (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Validated
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      Not Validated
                    </span>
                  )}
                  {facility?.has_edits && (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <InformationCircleIcon className="h-4 w-4" />
                      Has changes
                    </span>
                  )}
                  {facility?.is_complete ? (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Completed{" "}
                    </span>
                  ) : (
                    <span className="bg-yellow-200 text-yellow-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Incomplete{" "}
                    </span>
                  )}
                  {facility?.closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      Closed
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
            </div>
          </div>

          {/* Facility Side Menu Filters */}
          <div className="hidden md:col-span-1 md:flex md:mt-8">
            <FacilitySideMenu
              filters={filters}
              states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
              stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
          </div>

          <div className="col-span-1 md:col-span-6 md:w-full flex flex-col gap-3 md:mt-8 mx-3">
            <h3 className="text-2xl tracking-tight font-semibold leading-5">
              {
                facility?.is_approved ?
                  'Approve/Reject Facility' :
                  'Validate/Reject Facility'
              }

            </h3>


            {/* Facility details */}
            <div className="bg-blue-50 shadow-md w-full p-3  flex flex-col gap-3 mt-4">
              <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Functional Status
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.operation_status_name || " - "}
                </p>
              </div>

              <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                <label className="col-span-1 text-gray-600">Keph Level</label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.keph_level_name || " - "}
                </p>
              </div>

              <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                <label className="col-span-1 text-gray-600">Admission</label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.admission_status_name || " - "}
                </p>
              </div>
              <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                <label className="col-span-1 text-gray-600">
                  Facility Type
                </label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.facility_type_name || " - "}
                </p>
              </div>


              <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                <label className="col-span-1 text-gray-600">County</label>
                <p className="col-span-2 text-black font-medium text-base">
                  {facility?.county || " - "}
                </p>
              </div>


              {facility?.date_established && (
                <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                  <label className="col-span-1 text-gray-600">
                    Date established
                  </label>
                  <p className="col-span-2 text-black font-medium text-base">
                    {new Date(facility?.date_established).toLocaleDateString(
                      "en-GB",
                      { year: "numeric", month: "long", day: "numeric" }
                    ) || " - "}
                  </p>
                </div>
              )}
            </div>


            {/* Facility details hidden section */}

            <div className="col-start-1 col-span-1 ">
              <button
                className="bg-blue-600 font-semibold w-auto text-white flex text-left items-center p-2 h-auto -md"
                onClick={() => {
                  if (isFacDetails) {
                    setIsFacDetails(false);
                  } else {
                    setIsFacDetails(true);
                  }
                }}
              >
                View More Facility Details
                {isFacDetails ? (
                  <ChevronRightIcon className="text-white h-7 w-7 font-bold" />
                ) : (
                  <ChevronDownIcon className="text-white h-7 w-7 text-base font-bold" />
                )}
              </button>
            </div>


            {!isFacDetails &&

              <div className="pb-2">
                {/* {console.log({isFacDetails})} */}
                <FacilityDetailsTabs facility={facility} originalData={facility} />
              </div>
            }

            {/* Comments and Updates Section  */}

            <div className="bg-blue-50 shadow-md w-full p-3  flex flex-col gap-3 mt-6">
              <h3 className="text-gray-900 font-semibold leading-16 text-medium">
                {facility?.has_edits ? 'Approve Updates' : facility?.is_approved ? "Approval / Reject facility" : "Comment on the validation"}
              </h3>
              {facility?.is_approved}
              <Formik
                initialValues={{
                  comment: ''
                }}
                onSubmit={async ({ comment }) => {
                  // if facility is not validated and has no edits
                  if (!facility?.approved && !facility?.has_edits) {
                    validateRejectFacility(facility?.id, reject, comment, alert)
                  }
                  // if facility is validated and has edits
                  if (facility?.approved && facility?.has_edits) {
                    approveRejectFacilityUpdates(reject, alert, facility?.latest_update)
                  }
                  // if facility is not approved and is validated
                  if (!facility?.approved_national_level && facility?.approved) {
                    // console.log('FACILITY WILL BE APPROVED')
                    approveRejectFacility(facility?.id, comment, alert, reject)
                  }
                }
                }
              >
                <Form
                  className="space-y-3"
                >

                  {
                    !facility?.has_edits ?
                      <Field
                        as="textarea"
                        cols="130"
                        rows="auto"
                        name="comment"
                        className="flex col-span-2 bg-transparent border focus:ring-1 focus:ring-blue-900 border-blue-600 text-gray-600 font-normal text-medium p-2"
                        placeholder="Enter a comment"

                      ></Field>
                      :
                      // Facility Updates Table
                      <FacilityUpdatesTable facilityUpdatedJson={facility_updated_json} originalData={facility ?? { data: null }} />

                  }

                  <div className="flex justify-end items-center gap-4 mt-4">

                    <button
                      type="submit"
                      className="bg-blue-600  text-gray-100 -md p-2 font-semibold"
                      onClick={() => reject = facility?.has_edits ? true : facility?.is_approved ? true : false}

                    >
                      {facility?.has_edits ? 'Approve Updates' : facility?.is_approved ? facility?.approved_national_level ? "Reject Facility" : "Approve Facility" : "Validate Facility"}
                    </button>

                    {!facility?.approved_national_level &&
                      <button
                        type="submit"
                        className="bg-red-600  text-gray-100 -md p-2 font-semibold"
                        onClick={() => reject = facility?.has_edits ? false : facility?.is_approved ? false : true}

                      >
                        {facility?.has_edits ? 'Decline Updates' : facility?.approved_national_level ? '' : 'Reject Facility'}
                      </button>
                    }
                  </div>
                </Form>
              </Formik>
            </div>

          </div>
        </div>
      </MainLayout>
    )
  }
  else {
    return null
  }
}

ApproveReject.getInitialProps = async (ctx) => {
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
    .then((t) => {
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
        return fetch(url, {
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
            if (json) {
              try {
                const facilityUpdateData = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${json.latest_update}/`,
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
              catch (e) {
                console.error('Encountered error while fetching facility update data', e.message)
              }
            }

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

}
export default ApproveReject