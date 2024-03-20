import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import MainLayout from '../../../components/MainLayout';
import { checkToken } from '../../../controllers/auth/auth';
import { approveCHU, approveCHUUpdates} from '../../../controllers/chul/rejectApprove';
import { ChevronDownIcon } from '@heroicons/react/solid';
import {CheckCircleIcon,ChevronRightIcon,InformationCircleIcon,LockClosedIcon,XCircleIcon} from '@heroicons/react/solid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router'
import { UserContext } from '../../../providers/user';
import CommunityUnitSideMenu from '../../../components/CommunityUnitSideMenu';




function ApproveCommunityUnit (props) {

  const router = useRouter();
  const userCtx = useContext(UserContext);
  let cu = props.data;
  
 	// Reference hooks for the services section
  const [user, setUser] = useState(userCtx);
  const [isCHULDetails, setIsCHULDetails] = useState(true);
  const [appRejReason, setAppRejReason] = useState('')
  const [isApproveReject, setIsApproveReject] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const columns = [
    {  label: 'Field', minWidth: 100 },
    {  label: 'Old Value', minWidth: 100},
    {  label: 'New Value',minWidth: 100, }
  ];

 const CHULDetails =[
  { value: `${cu.facility_subcounty}`, label: 'Sub County ' },
  { value: `${cu.facility_constituency}`, label: 'Constituency'},
  { value: `${cu.facility_constituency}`, label: 'Constituency'},
  { value: `${cu.facility_ward}`, label: 'Ward'},
  {value: `${cu.households_monitored}`, label: 'Households Monitored'},
 ];

 const CHU_MainDetails =[
  { value: `${cu.status_name}`, label: 'Functional Status' },
  { value: `${cu.code}`, label: 'CHU Code'},
  { value: `${cu.number_of_chvs}`, label: 'Number of CHVs'},
  { value: `${cu.facility_name}`, label: 'Linked Facility'},
  {value: `${cu.facility_county}`, label: 'County'},
 ]


  let reject = ''

  useEffect(() =>
  {
   if (userCtx) setUser(userCtx);
      
    return () => {};
    
  }, [cu, reject]);


  useEffect(() => {
    setUser(userCtx);
    if(user.id === 6){
        router.push('/auth/login')
    }

    setIsClient(true)
  },[])

 
  if(isClient){
    return (
      <>
        <Head>
          <title>KMHFR | {cu?.name || cu?.official_name}</title>
          <link rel='icon' href='/favicon.ico' />
          {/* <link rel='stylesheet' href='/assets/css/leaflet.css' /> */}
        </Head>

        <MainLayout>
          <div className='w-full md:w-[85%] grid md:grid-cols-7 gap-4 p-2 my-6'>
            <div className='col-span-5 flex flex-col md:col-span-7 items-start justify-start gap-3'>

              {/* Breadcrumb */}
              <div className='flex flex-row gap-2 text-sm md:text-base'>
                <a className='text-gray-700' href='/'>
                  Home
                </a>
                {'/'}
                <a className='text-gray-700' href='/community-units'>
                  Community units
                </a>
                {'/'}
                <span className='text-gray-500'>
                  {cu.name} ( #
                  <i className='text-black'>{cu.code || 'NO_CODE'}</i> )
                </span>
              </div>

              {/* Header snippet */}
              <div
                className={`col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full border ${cu.active ? 'border-gray-600' : 'border-yellow-600'} bg-transparent drop-shadow text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 ${cu.active ? 'border-gray-600' : 'border-yellow-600'}`}   
              >
                <div className='col-span-6 md:col-span-3'>
                  <h1 className='text-4xl tracking-tight font-bold leading-tight'> {cu.name} </h1>
                  <div className='flex gap-2 items-center w-full justify-between'>
                    <span className={'font-bold text-2xl ' + (cu.code ? 'text-gray-900' : 'text-gray-400')}> #{cu.code || 'NO_CODE'} </span>
                    <p className='text-gray-600 leading-tight'>
                      {cu.keph_level_name && 'KEPH ' + cu.keph_level_name}
                    </p>
                  </div>
                </div>

                {/* Info snippet */}
                <div className='flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2'>
                  <div className='flex flex-wrap gap-3 w-full items-center justify-start md:justify-center'>
                    {cu.is_approved && (
                      <span className={'p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1' +' '+ (cu.is_approved ? 'bg-blue-200 text-gray-900' : 'bg-red-200 text-red-900')}>
                        {cu.is_approved ? <>  <CheckCircleIcon className='h-4 w-4' />CHU Approved</>: <><XCircleIcon className='h-4 w-4' />Not approved </>}
                      </span>
                    )}
                    {cu.is_closed &&  (
                      <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <LockClosedIcon className='h-4 w-4' />
                        CHU Closed
                      </span>
                    )}
                    {cu.deleted && (
                      <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <XCircleIcon className='h-4 w-4' />
                        CHU Deleted
                      </span>
                    )}
                    {cu.active && (
                      <span className='bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <CheckCircleIcon className='h-4 w-4' />
                        CHU Active
                      </span>
                    )}
                    {cu.has_fffedits && (
                      <span className='bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
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

            {/* Community Unit Side Menu */}
            <div className="hidden md:col-span-1 md:flex md:mt-8">
              <CommunityUnitSideMenu
                  qf={'all'}
                  filters={[]}
                  _pathId={''}
              />
            </div>      

              
            <div className="col-span-5 md:col-span-6 flex flex-col gap-3 mt-8 mx-3">
                <h3 className="text-2xl tracking-tight font-semibold leading-5">
                    Approve/Reject Community Unit
                </h3>

                {/* CHU details */}
                <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-4">
                  {CHU_MainDetails.map((dt)=>(

                    <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                        <label className="col-span-1 text-gray-600">
                            {dt.label}
                        </label>
                        <p className="col-span-2 text-black font-medium text-base">
                            {dt.value || " - "}
                        </p>
                    </div>
                  ))}

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
                <div className="flex w-full leading-none mt-4 items-center">
                    <button className="flex bg-blue-700 font-semibold text-white flex-row justify-between text-left items-center p-3 h-auto -md" onClick={() => {
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

                {!isCHULDetails && (
                    <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-6">
                        {CHULDetails.map((dt)=>(
                            <div className="grid grid-cols-3 w-full md:w-11/12  leading-none items-center">
                                <label className="col-span-1 text-gray-600">{dt.label}</label>
                                <p className="col-span-2 text-black font-medium text-base">
                                    {dt.value || " - "}
                                </p>
                            </div>
                        ))}
                    </div>
                  )
                }

                {/* Pending updates approval */}
                {cu.pending_updates && Object.keys(cu.pending_updates).length > 0 && (
                <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-6">
                  <h3 className="text-gray-900 font-semibold leading-16 text-medium">
                    Pending Updates
                  </h3>
                  <form
                    className="space-y-3"
                  >
                      <div className='col-span-4 w-full h-auto'>
                                    {
                                      Object.keys(cu.pending_updates).reverse().map((key, index) => {
                                        if(key == 'basic'){
                                          return ( 
                                            <React.Fragment key={index}>
                                            
                                            <h5 className='col-span-1 text-gray-900 pb-2 font-semibold leading-16 text-medium mt-5'>{'Basic :'}</h5>
                                            <TableContainer sx={{ maxHeight: 440 }}>
                                            <Table stickyHeader aria-label="sticky table" className='bg-transparent'>
                                            <TableHead > 
                                                <TableRow >
                                                {columns.map((column,i) => (
                                                    <TableCell
                                                    key={i}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth, fontWeight:600 }}
                                                    >
                                                    {column.label}
                                                    </TableCell>
                                                ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{paddingX: 4}}>
                                                  {/* basic name */}
                                                  { cu.pending_updates?.basic.name !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Name'}</TableCell>
                                                            <TableCell align="left">{cu.name}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.name}</TableCell>

                                                          </TableRow>
                                                        )}
                                                    {/* basic status */}
                                                    {  cu.pending_updates?.basic.status !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Status'}</TableCell>
                                                            <TableCell align="left">{cu.status_name}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.status.status_name}</TableCell>

                                                          </TableRow>
                                                        )
                                                    }
                                                    {/* facility name */}
                                                    {  cu.pending_updates?.basic.facility !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Facility'}</TableCell>
                                                            <TableCell align="left">{cu.facility_name}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.facility.facility_name}</TableCell>

                                                          </TableRow>
                                                        )
                                                    } 
                                                    {/* Households monitored */}
                                                    {  cu.pending_updates?.basic.households_monitored !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Households Monitored'}</TableCell>
                                                            <TableCell align="left">{cu.households_monitored}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.households_monitored}</TableCell>

                                                          </TableRow>
                                                        )
                                                    }
                                                    {/* CHVs */}
                                                    {  cu.pending_updates?.basic.number_of_chvs !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Number of CHVs '}</TableCell>
                                                            <TableCell align="left">{cu.number_of_chvs}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.number_of_chvs}</TableCell>

                                                          </TableRow>
                                                        )
                                                    }
                                                    {/* Location */}
                                                    {  cu.pending_updates?.basic.location !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Location'}</TableCell>
                                                            <TableCell align="left">{cu.location}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.location}</TableCell>

                                                          </TableRow>
                                                        )
                                                    }
                                                    {/* Date established */} 
                                                    {  cu.pending_updates?.basic.date_etablished !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Date Established'}</TableCell>
                                                            <TableCell align="left">{cu.date_etablished}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.date_etablished}</TableCell>

                                                          </TableRow>
                                                        )
                                                    }
                                                    {/* date_operational */} 
                                                    {  cu.pending_updates?.basic.date_operational !== undefined &&
                                                        (

                                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                                            <TableCell align="left">{'Date Operational'}</TableCell>
                                                            <TableCell align="left">{cu.date_operational}</TableCell>
                                                            <TableCell align="left">{cu.pending_updates.basic.date_operational}</TableCell>

                                                          </TableRow>
                                                        )
                                                    }
                                          
                                                
                                            </TableBody>
                                            </Table>
                                            </TableContainer> 
                                            </React.Fragment>
                                          )
                                        }
                                        if(key == 'services'){
                                  
                                          const services = cu.pending_updates['services'].map((item, i)=> {
                                          return <div className='col-span-4 w-full h-auto ml-7 mt-2' key={i} >
                                            <div className='grid grid-cols-2 w-full'>
                                            <p className='col-span-2 text-gray-600 font-medium text-base'>{item.name}</p>
                                            </div>
                                            </div>
                                          })
                                          return <><h5 className='col-span-1 text-gray-900 italic font-semibold leading-16 text-medium mt-5'>{'Services :'}</h5><hr/>{services}</>
                                            
                                        }
                                        if(key == 'workers'){
                                          const workers = cu.pending_updates['workers'].map((item, i)=> {
                                            return <div className='col-span-4 w-full h-auto ml-7 mt-2' key={i}>
                                              <div className='grid grid-cols-2 w-full'>
                                              <p className='col-span-2 text-gray-600 font-medium text-base'>{item.first_name} {' '} {item.last_name} {'(In Charge)'}</p>
                                              </div>
                                              </div>
                                            })
                                            return <><h5 className='col-span-1 text-gray-900 italic font-semibold leading-16 text-medium mt-5'>{'Workers :'}</h5><hr/>{workers}</>
                                        }

                                          
                                        })
                                      
                                      }
                      </div>
                    {/* submit buttons */}
                    <div className="flex flex-row justify-start items-center space-x-3 p-3">
                        <button
                          type="submit"
                          className={"p-2 text-center -md font-semibold text-base text-white bg-blue-700"}
                          onClick={(e) => approveCHUUpdates(e,cu.latest_update,true, router, props?.token) }
                        >
                          {"Approve CHU Updates"}
                        </button>
                        <button
                          type="submit"
                          className={"p-2 text-center -md font-semibold text-base text-white bg-black" }
                          onClick={(e) => approveCHUUpdates(e,cu.latest_update,false, router, props?.token) }
                        >
                          {"Reject CHU Updates"}
                        </button>
                    </div>
                  </form>
                </div>
                )}
            
                {/* CHU Rejection Commment */}
                {cu.pending_updates && Object.keys(cu.pending_updates).length == 0 && (

                  <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-6">
                    <h3 className="text-gray-900 font-semibold leading-16 text-medium">Approval comment: </h3>
                    {cu.is_approved}
                    <form
                      className="space-y-3"
                      onSubmit = { (e) => approveCHU(e,cu.id, appRejReason, isApproveReject, router, props?.token) }
                    >
                      <label htmlFor="comment-text-area"></label>
                      <textarea
                        cols="70"
                        rows="auto"
                        className="flex bg-transparent col-span-2 border border-gray-400 -md text-gray-600 font-normal text-medium p-2"
                        placeholder="Enter a comment"
                        onChange={(e) => setAppRejReason(e.target.value)}
                      ></textarea>

                      {/* <div className="flex flex-row"> */}
                      <div className="flex flex-row justify-start gap-3 items-center ">
                      <button
                        type="submit"
                        className={ cu.is_approved ? ''  : "p-2 text-center  font-semibold text-base text-white bg-blue-700"}
                        onClick={(e) => setIsApproveReject(true)}
                      >
                        {cu.is_approved ? "": "Approve Community Health Unit"}
                      </button>
                      <button
                        type="submit"
                        className={  cu.is_rejected ? '' : "p-2 text-center font-semibold text-base text-white bg-red-500"}
                        onClick={(e) => setIsApproveReject(false) }
                      >
                        {cu.is_rejected ? "" : "Reject Community Health Unit"}
                      </button>
                      </div>
                    </form>
                  </div>
                )}

            </div>
          </div>
        </MainLayout >
      </>
    );
  }
  else{
    return null;
  }
};


ApproveCommunityUnit.getInitialProps = async (ctx) => {
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
      // console.log('Error checking token: ', err);
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
                token,
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

export default ApproveCommunityUnit;
