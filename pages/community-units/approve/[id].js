// React imports
import React, { useState, useEffect } from 'react';

// Next imports
import Head from 'next/head';

// Components imports
import MainLayout from '../../../components/MainLayout';

// Controller imports
import { checkToken } from '../../../controllers/auth/auth';

// Heroicons imports

// Package imports
import { ChevronDownIcon } from '@heroicons/react/solid';
import
{
  CheckCircleIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import dynamic from "next/dynamic";

const CommUnit = (props) => {

  const Map = dynamic(
    () => import("../../../components/Map"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <div className="text-gray-800 text-lg rounded bg-white py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false,
    } // This line is important. It's what prevents server-side render
  );

  const facilities = props.facility_data.results;

  let cu = props.data;
  let _id
  _id = cu.id;

  // Changing the value of the linked facility and its locality


  // Services states
  const [services, setServices] = useState([])
	const [refreshForm, setRefreshForm] = useState(false)

 	// Reference hooks for the services section


  const [user, setUser] = useState(null);
  const [isCHULDetails, setIsCHULDetails] = useState(true);
  const [isCHUDetails, setIsCHUDetails] = useState(true);
  const [isApproveReject, setIsApproveReject] = useState(false);

  useEffect(() =>
  {
    if (typeof window !== 'undefined')
    {
      let usr = window.sessionStorage.getItem('user');
      if (usr && usr.length > 0)
      {
        setUser(JSON.parse(usr));
      }
    }
    return () =>{};
    
  }, [facilities]);
 
  // Define serviceCategories

  return (
    <>
      <Head>
        <title>KMHFL - {cu?.name || cu?.official_name}</title>
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='/assets/css/leaflet.css' />
      </Head>

      <MainLayout>
        <div className='w-full grid grid-cols-5 gap-4 p-2 my-6'>
          <div className='col-span-5 flex flex-col items-start px-4 justify-start gap-3'>

            {/* Breadcrumb */}
            <div className='flex flex-row gap-2 text-sm md:text-base'>
              <a className='text-green-700' href='/'>
                Home
              </a>{' '}
              {'>'}
              <a className='text-green-700' href='/community-units'>
                Community units
              </a>{' '}
              {'>'}
              <span className='text-gray-500'>
                {cu.name} ( #
                <i className='text-black'>{cu.code || 'NO_CODE'}</i> )
              </span>
            </div>

            {/* Header snippet */}
            <div
              className={
                'col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 ' +
                (cu.active ? 'border-green-600' : 'border-red-600')
              }
            >
              <div className='col-span-6 md:col-span-3'>
                <h1 className='text-4xl tracking-tight font-bold leading-tight'>
                  {cu.name}
                </h1>
                <div className='flex gap-2 items-center w-full justify-between'>
                  <span
                    className={
                      'font-bold text-2xl ' +
                      (cu.code ? 'text-green-900' : 'text-gray-400')
                    }
                  >
                    #{cu.code || 'NO_CODE'}
                  </span>
                  <p className='text-gray-600 leading-tight'>
                    {cu.keph_level_name && 'KEPH ' + cu.keph_level_name}
                  </p>
                </div>
              </div>

              {/* Info snippet */}
              <div className='flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2'>
                <div className='flex flex-wrap gap-3 w-full items-center justify-start md:justify-center'>
                  {cu.is_approved ? (
                    <span className='bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <CheckCircleIcon className='h-4 w-4' />
                      CHU Approved
                    </span>
                  ) : (
                    <span className='bg-red-200 text-red-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <XCircleIcon className='h-4 w-4' />
                      Not approved
                    </span>
                  )}
                  {cu.is_closed &&  (
                    <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <LockClosedIcon className='h-4 w-4' />
                      CHU Closed
                    </span>
                  )}
                  {cu.deleted && (
                    <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <XCircleIcon className='h-4 w-4' />
                      CHU Deleted
                    </span>
                  )}
                  {cu.active && (
                    <span className='bg-green-200 text-green-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <CheckCircleIcon className='h-4 w-4' />
                      CHU Active
                    </span>
                  )}
                  {cu.has_fffedits && (
                    <span className='bg-blue-200 text-blue-900 p-1 leading-none text-sm rounded whitespace-nowrap cursor-default flex items-center gap-x-1'>
                      <InformationCircleIcon className='h-4 w-4' />
                      Has changes
                    </span>
                  )}
                </div>
              </div>
              <div className='col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2'>
              </div>
            </div>
          </div>
            
        {isApproveReject}

        <div className="col-span-5 md:col-span-3 flex flex-col gap-3 mt-4 mx-3">
            <h3 className="text-2xl tracking-tight font-semibold leading-5">
                Approve/Reject Community Unit
            </h3>

            {/* CHU details */}
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-4">
                

                <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                        Functional Status
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                        {cu.status_name || " - "}
                    </p>
                </div>

                <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                        CHU Code
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                        {cu.code || " - "}
                    </p>
                </div>

                <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                        Number of CHVs 
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                        {cu.number_of_chvs || " - "}
                    </p>
                </div>
                <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                        Linked Facility
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                        {cu.facility_name || " - "}
                    </p>
                </div>

                <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                        County
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                        {cu.facility_county || " - "}
                    </p>
                </div>

                {cu.date_established && (
                    <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                            Date established
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                            {new Date(cu.date_established).toLocaleDateString(
                                "en-GB",
                                { year: "numeric", month: "long", day: "numeric" }
                            ) || " - "}
                        </p>
                    </div>
                )}

            </div>


            {/* CHU details hidden section */}
            <div className="grid grid-cols-2 w-full md:w-11/12 h-8 leading-none items-center">
                <button className="flex bg-green-500 font-semibold text-white flex-row justify-between text-left items-center p-3 h-auto rounded-md" onClick={() => {
                    if (isCHULDetails) {
                        setIsCHULDetails(false)
                    } else {
                        setIsCHULDetails(true)
                    }
                }}>
                    View More Community Unit Details
                    {
                        isCHULDetails ? (
                            <ChevronRightIcon className="text-white h-7 w-7 font-bold" />
                        ) : (
                            <ChevronDownIcon className="text-white h-7 w-7 text-base font-bold" />
                        )
                    }
                </button>
            </div>


            {
                !isCHULDetails && (
                    <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-6">

                        <div className="grid grid-cols-3 w-full md:w-11/12  leading-none items-center">
                            <label className="col-span-1 text-gray-600">Sub County</label>
                            <p className="col-span-2 text-black font-medium text-base">
                                {cu.facility_subcounty || " - "}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12  leading-none items-center">
                            <label className="col-span-1 text-gray-600">
                                Constituency
                            </label>
                            <p className="col-span-2 text-black font-medium text-base">
                                {cu.facility_constituency || " - "}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12  leading-none items-center">
                            <label className="col-span-1 text-gray-600">
                                Ward
                            </label>
                            <p className="col-span-2 text-black font-medium text-base">
                                {cu.facility_ward || " - "}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 w-full md:w-11/12  leading-none items-center">
                            <label className="col-span-1 text-gray-600">
                                Households Monitored
                            </label>
                            <p className="col-span-2 text-black font-medium text-base">
                                {cu.households_monitored || " - "}
                            </p>
                        </div>
                    </div>
                )
            }


            {/* CHU Approval Comment */}
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-6">
                <label
                htmlFor="approval-comment"
                className="col-span-1 text-gray-900 font-semibold leading-16 text-medium"
                >
                {" "}
                Approval comment:{" "}
                </label>
                <p
                className="text-gray-400 text-medium text-left leading-16"
                name="approval-comment"
                >
                some approval comments
                </p>
            </div>


            {/* CHU Rejection Commment */}
            <div className="bg-white border border-gray-100 w-full p-3 rounded flex flex-col gap-3 shadow-sm mt-6">
                <h3 className="text-gray-900 font-semibold leading-16 text-medium">
                    Reject this Facility
                </h3>
                <form className="space-y-3"
                    onSubmit={(e) =>
                        rejectFacility(e, cu, cu.isApproveReject, e.target.value)
                    }
                    >
                    <label htmlFor="comment-text-area"></label>
                    <textarea
                        cols="70"
                        rows="auto"
                        className="flex col-span-2 border border-gray-200 rounded-md text-gray-600 font-normal text-medium p-2"
                        placeholder="Enter a comment for rejecting community health unit"
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-red-600  text-gray-100 rounded-md p-2 font-semibold"
                    >
                        Reject Facility
                    </button>
                </form>
            </div>
          <div/> 
        </div>            
        {/* end facility approval */}

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
      </MainLayout >
    </>
  );
};

CommUnit.getInitialProps = async (ctx) => {
  if (ctx.query.q)
  {
    const query = ctx.query.q;

    if (typeof window !== 'undefined' && query.length > 2)
    {
      window.location.href = `/community-units?q=${ query }`;
    } else
    {
      if (ctx.res)
      {
        ctx.res.writeHead(301, {
          Location: '/community-units?q=' + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }

  return checkToken(ctx.req, ctx.res)
    .then(async (t) =>{
      if (t.error){
        throw new Error('Error checking token');
      }
      else{
        // Fetching the required token
        let token = t.token;

        // Prefetch the facility data details
				let facility_url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=500`;
				
				const response = await fetch(facility_url, {
					headers: {
						Authorization: 'Bearer ' + token,
						Accept: 'application/json',
					},
				})

				let facility_data = await response.json();
				if (facility_data.error) {
					throw new Error('Error fetching facility data');
					window.location.reload();
				}

        // Fetch the service options
				let service_url = `${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`;

				const service_response = await fetch(service_url,
					{
						headers: {
							Authorization: 'Bearer ' + token,
							Accept: 'application/json',
						},
					})

				let service_categories = await service_response.json();
				console.log('Service Categories', service_categories)

				if (service_categories.error){
					throw new Error('Error fetching the service categories');
				}

        // Fetching the details of the quieried chu
        let url = process.env.NEXT_PUBLIC_API_URL + '/chul/units/' + ctx.query.id + '/';

        return fetch(url, {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
          },
        })
          .then((r) => r.json())
          .then((json) =>
          {
            return {
              token: token,
              service_categories: service_categories,
              facility_data: facility_data,
              data: json,
            };
          })
          .catch((err) => {
            console.log('Error fetching facilities: ', err);
            return {
              error: true,
              err: err,
              data: [],
            };
          });
      }
    })
    .catch((err) =>
    {
      console.log('Error checking token: ', err);
      if (typeof window !== 'undefined' && window)
      {
        if (ctx?.asPath){
          window.location.href = ctx?.asPath;
        } 
        else{
          let token = t.token;
          let url = process.env.NEXT_PUBLIC_API_URL +  '/chul/units/' + ctx.query.id + '/';
          return fetch(url, {
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
            },
          })
            .then((r) => r.json())
            .then((json) =>
            {
              console.log(json);
              return {
                data: json,
              };
            })
            .catch((err) =>
            {
              console.log('Error fetching facilities: ', err);
              return {
                error: true,
                err: err,
                data: [],
              };
            });
        }
      }
      console.log('My Error:' + err);

      return {
        error: true,
        err: err,
        data: [],
      };
    });
};

export default CommUnit;
