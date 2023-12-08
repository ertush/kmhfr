import { Form, Formik, Field } from 'formik'
import MainLayout from '../MainLayout';
import CommunityUnitSideMenu from '../CommunityUnitSideMenu';
import Select from './formComponents/FromikSelect'
import Link from 'next/link';
import * as Tabs from "@radix-ui/react-tabs";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { useContext, cache, useState, useEffect } from 'react';
import { ChuOptionsContext } from '../../pages/community-units/edit/[id]';
import dynamic from 'next/dynamic';
// import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import {handleChulSubmit} from "../../controllers/chul/chulHandlers"
// import SelectSearch from './formComponents/FormikSelectSearch';




export function CommunityUnitEditForm({ cu: {
  code,
  name,
  facility_name,
  status_name,
  date_established,
  households_monitored,
  number_of_chvs,
  facility_county,
  facility_subcounty,
  facility_constituency,
  facility_ward,
  is_approved,
  is_closed,
  has_edits,
  deleted,
  active,
  date_operational,
  health_unit_workers,
  location,
  contacts,
  services,
  id
} }) {

  const DualListBox = dynamic(
    () => import("react-dual-listbox"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false, // This line is important. It's what prevents server-side render
    } 
    );

    function getCookie(name) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(name + '=')) {
              return cookie.substring(name.length + 1);
          }
      }
      return null;
    }

  const options = useContext(ChuOptionsContext)
  const access_token = getCookie(access_token) 
 

  const [facilityOptions, setFacilityOptions] = useState(options?.facilities?.map(({ id, name }) => ({ label: name, value: id })) ?? []) 
  const [operationStatusOptions, setOperationStatusOptions] = useState(options?.statuses?.map(({ id, name }) => ({ label: name, value: id })) ?? []) 
  const [serviceOptions, setServiceOptions] = useState(options?.services?.map(({ id, name }) => ({ label: name, value: id })) ?? []) 
  const [contactOptions, setContactOptions] = useState(options?.contact_types?.map(({ id, name }) => ({ label: name, value: id })) ?? []) 
  const [current_services, setCurrentServices] = useState(Array.from(services, s=>s?.service) || [])
  const [intialValuesBasicDetails, setBasicDetailValues] = useState({
    code,
    name,
    facility_name: options?.facilities?.find(({name}) => name == facility_name).id ?? '',
    status_name,
    date_established,
    households_monitored,
    number_of_chvs,
    facility_county,
    facility_subcounty,
    facility_constituency,
    date_operational,
    date_established,
    facility_ward,
    id
  })
  const initialValuesChews = {
    health_unit_workers,
    contacts,
  }

  function appendValueToBasicDetails(contacts) {
    let i = 0
    // for (let { contact_type, contact } of contacts) {
    //   let contact_type_data = {}
    //   contact_type_data[`contact_type_${i}`] = contact_type
    //   contact_type_data[`contact_${i}`] = contact
    //   setBasicDetailValues({
    //     ...intialValuesBasicDetails,
    //     ...contact_type_data

    //   })
    //   i += 1
    // }
    let c_ontacts = Array.from(contacts, (c,i)=>{
      let ct = {}
      ct[`contact_type_${i}`] = c?.contact_type;
      ct[`contact_${i}`] = c?.contact;
    }) ?? {}

    return c_ontacts;
  }
  let token;
  
  useEffect(() => {

    let accessTokenObject;
  
    console.log({ options });
    console.log('intialValuesBasicDetails', intialValuesBasicDetails);
  
    if (contacts) {
      setBasicDetailValues({
        ...intialValuesBasicDetails,
        ...appendValueToBasicDetails(contacts),
      });
    }
  
    try {
      accessTokenObject = JSON.parse(getCookie('access_token'));
    } catch (error) {
      console.error('Error parsing access token JSON:', error);
    }
  
 
    if (accessTokenObject) {
      const token = accessTokenObject.token;

    } else {
      console.error('accessTokenObject is not defined or invalid.');
    }
  }, []);
  
    
    
    // Constants

  


  //Add Contact and Contact Type Name to Basic details initial Values 




  

  const initalValuesServices = {

  }




  return (

    <MainLayout>
      <div className="w-full grid grid-cols-1 md:grid-cols-7 place-content-center md:grid gap-4 md:p-2 my-6">
        <div className="md:col-span-7 flex flex-col items-start justify-start gap-3">
          {/* Breadcrumb */}
          <div className="flex flex-row gap-2 text-sm md:text-base">
            <Link className="text-blue-700" href="/">
              Home
            </Link>
            {"  >  "}
            <Link className="text-blue-700" href="/community-units">
              Community units
            </Link>
            {"  >  "}
            <span className="text-gray-500">
              {name} ( #
              <i className="text-black">{code || "NO_CODE"}</i> )
            </span>
          </div>

          {/* Header snippet */}
          <div
            className={
              `md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full border ${active ? "border-blue-600" : "border-red-600"} bg-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                ${active ? "border-blue-600" : "border-yellow-700"}
              `}
          >
            <div className="col-span-6 md:col-span-3">
              <h1 className="text-4xl tracking-tight font-bold leading-tight">
                {name}
              </h1>
              <div className="flex gap-2 items-center w-full justify-between">
                <span
                  className={
                    "font-bold text-2xl " +
                    (code ? "text-blue-900" : "text-gray-500")
                  }
                >
                  #{code || "NO_CODE"}
                </span>

              </div>
            </div>

            {/* Info snippet */}
            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
              <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                {is_approved ? (
                  <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    CHU Approved
                  </span>
                ) : (
                  <span className="bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <XCircleIcon className="h-4 w-4" />
                    Not approved
                  </span>
                )}
                {is_closed && (
                  <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <LockClosedIcon className="h-4 w-4" />
                    CHU Closed
                  </span>
                )}
                {deleted && (
                  <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <XCircleIcon className="h-4 w-4" />
                    CHU Deleted
                  </span>
                )}
                {active && (
                  <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    CHU Active
                  </span>
                )}
                {has_edits && (
                  <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <InformationCircleIcon className="h-4 w-4" />
                    Has changes
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
              { }
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

        {/* Form */}
        <div className="col-span-1 md:col-span-6 flex flex-col md:gap-3 mt-8 border border-blue-600 pt-2">
          <Tabs.Root
            orientation="horizontal"
            className="w-full flex flex-col tab-root"
            defaultValue="basic_details"
          >
            {/* Tabs List */}
            <Tabs.List className="list-none  border-b border-blue-600 md:grid md:grid-cols-3 flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold">
              <Tabs.Tab
                value="basic_details"
                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
              >
                Basic Details
              </Tabs.Tab>
              <Tabs.Tab
                value="chews"
                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
              >
                CHPs
              </Tabs.Tab>
              <Tabs.Tab
                value="services"
                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
              >
                Services
              </Tabs.Tab>
            </Tabs.List>

            {/* Panel List */}

            {/* Basic Details Panel */}
            <Tabs.Panel
              value="basic_details"
              className="grow-1 p-3 mx-auto w-full tab-panel"
            >
              {/* <Formik initialValues={intialValuesBasicDetails} onSubmit={() => null}> */}
              <form
                  className="flex m-1 p-3 bg-blue-50 shadow-sm flex-col w-full items-start justify-start gap-3"
                  onSubmit={e => {
                    e.preventDefault();

                    const formData = new FormData(e.target)
                    const data = Object.fromEntries(formData)
                    console.log('submission data', data) 
                    const setter=[data,"basicDetails"]
                    // const {token} = await checkToken(req, res)

                    // if(token.error) throw Error('Unable to get token')
                   
                    console.log("details....",intialValuesBasicDetails?.id)
                    console.log("identification....",token)
                    handleChulSubmit(options?.token,setter,intialValuesBasicDetails?.id)
                  }}
                >
                  {/* CHU Name */}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <label
                      htmlFor="name"
                      className="text-gray-600 capitalize text-sm"
                    >
                      Community Health Unit Official Name
                      <span className="text-medium leading-12 font-semibold">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"

                      defaultValue={intialValuesBasicDetails?.name}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          name: e.target.value
                        })
                      }}
                      className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* CHU Linked Facility */}
                  {JSON.stringify({facilityOptions})}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <label
                      htmlFor="facility_name"
                      className="text-gray-600 capitalize text-sm"
                    >
                      Community Health Unit Linked Facility{" "}
                      <span className="text-medium leading-12 font-semibold">
                        {" "}
                        *
                      </span>
                    </label>
                    <Select

                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: 'transparent',
                          outLine: 'none',
                          border: 'none',
                          outLine: 'none',
                          textColor: 'transparent',
                          padding: 0,
                          height: '4px'
                        }),
                      }}

                      options={facilityOptions}
                      defaultValue={intialValuesBasicDetails?.facility_name}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          facility_name: e.target.value
                        })
                      }}
                      placeholder="Select Link facility ..."
                      name="facility_name"
                      className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'


                    />
                  </div>

                  {/* CHU Operational Status */}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <label
                      htmlFor="status_name"
                      className="text-gray-600 capitalize text-sm"
                    >
                      Operation Status
                      <span className="text-medium leading-12 font-semibold">
                        {" "}
                        *
                      </span>
                    </label>
                    <Select
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          backgroundColor: 'transparent',
                          outLine: 'none',
                          border: 'none',
                          outLine: 'none',
                          textColor: 'transparent',
                          padding: 0,
                          height: '4px'
                        }),
                      }}
                      options={operationStatusOptions}
                      defaultValue={intialValuesBasicDetails?.status_name}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          status_name: e.target.value
                        })
                      }}
                      name="status_name"
                      className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'

                    />
                  </div>

                  {/* CHU Dates - Established and Operational */}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <div className="grid grid-cols-2 place-content-start gap-3 w-full">
                      {/* Date Established  */}
                      <div className="col-start-1 col-span-1">
                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                          <label
                            htmlFor="date_established"
                            className="text-gray-600 capitalize text-sm"
                          >
                            Date Established
                            <span className="text-medium leading-12 font-semibold">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            name="date_established"

                            defaultValue={intialValuesBasicDetails?.date_established}
                            onChange={e=>{
                              setBasicDetailValues({
                                ...intialValuesBasicDetails,
                                date_established: e.target.value
                              })
                            }}
                            placeholder={'mm/dd/yyyy'}
                            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      </div>

                      {/* Date Operational  */}
                      <div className="col-span-1">
                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                          <label
                            htmlFor="date_operational"
                            className="text-gray-600 capitalize text-sm"
                          >
                            Date Operational
                            <span className="text-medium leading-12 font-semibold">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            name="date_operational"

                      defaultValue={intialValuesBasicDetails?.date_operational}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          date_operational: e.target.value
                        })
                      }}
                            placeholder={'mm/dd/yyyy'}
                            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CHU Number of Monitored Households */}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <label
                      htmlFor="households_monitored"
                      className="text-gray-600 capitalize text-sm"
                    >
                      Number of monitored households
                      <span className="text-medium leading-12 font-semibold">
                        {" "}
                        *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="households_monitored"

                      defaultValue={intialValuesBasicDetails?.households_monitored}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          households_monitored: e.target.value
                        })
                      }}
                      min={0}
                      className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* CHU Number of CHVs */}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <label
                      htmlFor="number_of_chvs"
                      className="text-gray-600 capitalize text-sm"
                    >
                      Number of CHVs
                      <span className="text-medium leading-12 font-semibold">
                        {" "}
                        *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="number_of_chvs"

                      defaultValue={intialValuesBasicDetails?.number_of_chvs}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          number_of_chvs: e.target.value
                        })
                      }}
                      min={0}
                      className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* CHU, Linked Facility Location */}
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    <div className="grid grid-cols-4 place-content-start gap-3 w-full">
                      {/* County  */}
                      <div className="col-start-1 col-span-1">
                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                          <label
                            htmlFor="facility_county"
                            className="text-gray-600 capitalize text-sm"
                          >
                            County
                            <span className="text-medium leading-12 font-semibold">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            readOnly

                      defaultValue={intialValuesBasicDetails?.facility_county}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          facility_county: e.target.value
                        })
                      }}
                            type="text"
                            name="facility_county"
                            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      </div>

                      {/* Sub-county */}
                      <div className="col-start-2 col-span-1">
                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                          <label
                            htmlFor="facility_subcounty"
                            className="text-gray-600 capitalize text-sm"
                          >
                            Sub-county
                            <span className="text-medium leading-12 font-semibold">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            readOnly

                      defaultValue={intialValuesBasicDetails?.facility_subcounty}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          facility_subcounty: e.target.value
                        })
                      }}
                            type="text"
                            name="facility_subcounty"
                            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      </div>

                      {/* Constituency */}
                      <div className="col-start-3 col-span-1">
                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                          <label
                            htmlFor="facility_constituency"
                            className="text-gray-600 capitalize text-sm"
                          >
                            Constituency
                            <span className="text-medium leading-12 font-semibold">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            readOnly

                      defaultValue={intialValuesBasicDetails?.facility_constituency}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          facility_constituency: e.target.value
                        })
                      }}
                            type="text"
                            name="facility_constituency"
                            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      </div>

                      {/* Ward */}
                      <div className="col-start-4 col-span-1">
                        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                          <label
                            htmlFor="facility_ward"
                            className="text-gray-600 capitalize text-sm"
                          >
                            Ward
                            <span className="text-medium leading-12 font-semibold">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            readOnly

                      defaultValue={intialValuesBasicDetails?.facility_ward}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          facility_ward: e.target.value
                        })
                      }}
                            type="text"
                            name="facility_ward"
                            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Area of Coverage */}
                    <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                      <label
                        htmlFor="location"
                        className="text-gray-600 capitalize text-sm"
                      >
                        Area of coverage
                      </label>
                      <input
                        required
                        type="number"
                        name="location"
                        id="location"
                        placeholder="Description of the area of coverage"

                      defaultValue={intialValuesBasicDetails?.location}
                      onChange={e=>{
                        setBasicDetailValues({
                          ...intialValuesBasicDetails,
                          location: e.target.value
                        })
                      }}
                        min={0}
                        className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                      />
                    </div>

                    <div className=" w-full flex flex-col items-start justify-start bg-transparent h-auto">
                      <h4 className="text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">
                        Community Health Unit Contacts
                      </h4>

                      {contacts?.map((_, i) => {
                        return (
                          <div
                            className="w-full flex flex-row items-center  gap-1 gap-x-3 mb-3"
                            key={i}
                          >
                            <div
                              className="w-full flex flex-col items-left   gap-1 gap-x-3 mb-3"
                              key={i}
                            >
                              <label
                                htmlFor="contact"
                                className="text-gray-600 capitalize text-sm"
                              >
                                Contact Type
                                <span className="text-medium leading-12 font-semibold">
                                  {" "}
                                  *
                                </span>
                              </label>
                              <Select
                                required
                                key={i}
                                id={`${i}`}
                                name={`contact_type_${i}`}
                                options={contactOptions}

                                defaultValue={intialValuesBasicDetails[`contact_type_${i}`]}
                                onChange={e=>{
                                  let val = {}
                                  val[`contact_type_${i}`] = e.target.value
                                  setBasicDetailValues({
                                    ...intialValuesBasicDetails,
                                    ...val
                                  })
                                }}
                                placeholder="Select Contact.."
                                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                              />

                            </div>
                            <div
                              className="w-full flex flex-col items-left  justify-  gap-1 gap-x-3 mb-3"
                              key={i}
                            >
                              <label
                                htmlFor="contact_text"
                                className="text-gray-600 capitalize text-sm"
                              >
                                Contact Details
                                <span className="text-medium leading-12 font-semibold">
                                  {" "}
                                  *
                                </span>
                              </label>
                              <input
                                required
                                type="text"
                                name={`contact_${i}`}

                                defaultValue={intialValuesBasicDetails[`contact_${i}`]}
                                onChange={e=>{
                                  let val = {}
                                  val[`contact_${i}`] = e.target.value
                                  setBasicDetailValues({
                                    ...intialValuesBasicDetails,
                                    ...val
                                  })
                                }}
                                id={i}
                                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="sticky top-0 right-10 w-full flex justify-end">
                      <button
                        className=" bg-blue-600 p-2 text-white flex text-md font-semibold mt-3"
                        onClick={e => e.preventDefault()}
                      >
                        {`Add Contact`}
                      </button>
                    </div>

                    {/* Cancel and Save Changes */}

                    <div className="flex justify-end items-center w-full mt-3">


                      <button
                        type="submit"
                        className="flex items-center justify-end space-x-2 bg-blue-600  p-1 px-2"
                      >
                        <span className="text-medium font-semibold text-white">
                          Save & Finish
                        </span>

                      </button>

                    </div>



                  </div>
                </form>
              {/* </Formik> */}
            </Tabs.Panel>

            {/* Chews Panel */}
            <Tabs.Panel value="chews" className="grow-1 p-3 mx-auto w-full tab-panel">
                <form
                  name="chews_form"
                  className="flex flex-col p-3 h-full bg-blue-50 shadow-sm  w-full items-start justify-start gap-3"
                      
                  onSubmit={e => {
                    e.preventDefault();

                    const formData = new FormData(e.target)
                    const data = Object.fromEntries(formData)
                    console.log('submission data', data) 
                    const setter=[data,"chps"]
                    // const {token} = await checkToken(req, res)

                    // if(token.error) throw Error('Unable to get token')
                   
                    console.log("details....",intialValuesBasicDetails?.id)
                    console.log("identification....",options?.facilities)
                    handleChulSubmit(options?.token,setter,intialValuesBasicDetails?.id)
                  }}



                >
                  <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                    {health_unit_workers && health_unit_workers.length > 0 ? (
                      health_unit_workers.map((contact, index) => {
                        return (
                          <div
                            className="flex flex-row items-center justify-between md:mx-1 gap-4 w-full"
                            key={`${contact}~${index}`}
                          >
                            {/* First Name */}
                            <div className="flex-col gap-2">
                              <label
                                htmlFor="first_name"
                                start
                                className="block text-sm font-medium text-gray-700"
                              >
                                First Name
                              </label>
                              <input
                                required
                                type="text"
                                id={index}
                                name="first_name"


                                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                              />
                            </div>
                            {/* Second Name */}
                            <div className="flex-col gap-2">
                              <label
                                htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Second Name
                              </label>
                              <input
                                required
                                type="text"
                                id={index}
                                name="last_name"


                                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                              />
                            </div>
                            {/* In charge */}
                            <div className="flex-col gap-2">
                              <label
                                htmlFor="is_incharge"
                                className="block text-sm font-medium text-gray-700"
                              >
                                In Charge
                              </label>
                              <input
                                name="is_incharge"
                                id={index}
                                type="checkbox"


                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                            </div>

                            {/* Delete CHEW */}

                            <div className="flex-col gap-2">
                              <div className="flex items-center">
                                {/* insert red button for deleting */}
                                <button
                                  type="button"
                                  name="delete"

                                  className="flex items-center justify-start space-x-2 bg-red-600  p-1 px-2"
                                >
                                  <span className="text-medium font-semibold text-white">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <>
                        <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                          <p>No HR data listed for this </p>
                        </li>
                      </>
                    )}

                    <div className="sticky top-0 right-10 w-full flex justify-end">
                      <button
                        className=" bg-blue-600 p-2 text-white flex text-md font-semibold "
                        onClick={() => null}
                      >
                        {`Add`}
                        {/* <PlusIcon className='text-white ml-2 h-5 w-5'/> */}
                      </button>
                    </div>
                  </div>

                  {/* Save Changes */}
                  <div className="flex justify-end items-center w-full">

                    <button
                      type="submit"
                      className="flex items-center justify-end space-x-2 bg-blue-600  p-1 px-2"
                    >
                      <span className="text-medium font-semibold text-white">
                        Save & Finish
                      </span>

                    </button>
                  </div>
                </form>
              
            </Tabs.Panel>

            {/* Services Panel */}
            <Tabs.Panel
              value="services"
              className="grow-1 p-3 mx-auto w-full tab-panel"
            >
              
                <form 
                  name="chu_services_form"
                  className="flex flex-col w-full items-center bg-blue-50 shadow-sm p-3 justify-start gap-3"
                  
                  onSubmit={e => {
                    e.preventDefault();

                    const formData = new FormData(e.target)
                    const data = Object.fromEntries(formData)
                    console.log('submission data', data) 
                    const setter=[data,"chulServices"]
                    // const {token} = await checkToken(req, res)

                    // if(token.error) throw Error('Unable to get token')
                   
                    console.log("details....",intialValuesBasicDetails?.id)
                    console.log("identification....",options?.facilities)
                    handleChulSubmit(options?.token,setter,intialValuesBasicDetails?.id)
                  }}
                >
                  {/* Transfer list Container */}
                  <span className="text-md w-full font-semibold flex flex-wrap justify-between items-center leading-tight tracking-tight">
                    Available Services
                  </span>
                  <div className="flex items-center w-full h-auto">
                    {/* <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: 'transparent',
                              outLine: 'none',
                              border: 'none',
                              outLine: 'none',
                              textColor: 'transparent',
                              padding: 0,
                              height: '4px'
                            }),

                          }}
                          placeholder="Select Service ..."
                          options={serviceOptions}
                          defaultValue={options?.data?.owner_type ?? ''}
                          id="chu_services"
                          onChange={handleSelectChangeChu}
                          name="services"
                          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'

                        /> */}
                    <DualListBox
                      canFilter
                      options={serviceOptions}
                      selected={current_services}
                      // selected={(services && services.length > 0) ? Array.from(services, s=>s.id) : []}
                      onChange={(selected) => {
                        console.log('selected', selected)
                        // handleSelectChangeChu(selected)
                        setCurrentServices(selected)
                      }}
                    />
                  </div>
                  <br />
                  {/* Service Category Table */}
                  {/*<span className="text-md w-full flex font-semibold flex-wrap justify-between items-center leading-tight tracking-tight">
                    Assigned Services
                  </span>{" "}
                   <table className="w-full  h-auto my-1">
                    <thead className="w-full">
                      <tr className="grid grid-cols-2 place-content-end border-b border-blue-600">
                        <td className="text-lg font-semibold text-blue-900 ">
                          Service
                        </td>
                        <td className="text-lg font-semibold text-blue-900 ml-12">
                          Action
                        </td>
                      </tr>
                    </thead>
                    <tbody className="gap-2">
                      {services && services?.length > 0 ? (
                        services?.map(({ id, name }) => (
                          <tr
                            key={id}
                            className="grid grid-cols-2 place-content-end border-b-2 border-gray-300"
                          >
                            <td>{name}</td>
                            <td className="ml-12 text-base my-2">
                              <button
                                type="button"

                                className="flex items-center justify-start space-x-2 bg-red-600  p-1 px-2"
                              >
                                <span className="text-medium font-semibold text-white">
                                  Remove
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                            <td>
                              <span>
                                {name} has not listed
                                the services it offers. Add some below.
                              </span>
                              <br />

                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table> */}
                  <div className="flex justify-end items-center w-full">
                    <button
                      type="submit"
                      className="flex items-center justify-end space-x-2 bg-blue-600  p-1 px-2"
                    >
                      <span className="text-medium font-semibold text-white">
                        Save & Finish
                      </span>
                    </button>
                  </div>
                </form>
             
            </Tabs.Panel>
          </Tabs.Root>
        </div>

      </div>
    </MainLayout>
  )
}