
import MainLayout from '../MainLayout';
import CommunityUnitSideMenu from '../CommunityUnitSideMenu';
import { Select as CustomSelect } from './formComponents/Select'
import Link from 'next/link';
import * as Tabs from "@radix-ui/react-tabs";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { useContext, useState, useEffect } from 'react';
import { ChuOptionsContext } from '../../pages/community-units/edit/[id]';
import Select from 'react-select'

import 'react-dual-listbox/lib/react-dual-listbox.css';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useAlert } from 'react-alert'
import Alert from '@mui/material/Alert';
import Spinner from '../../components/Spinner'

function EditCommunityUnitsBasicDeatilsForm(props) {


  const options = useContext(ChuOptionsContext)
  const [touchedFields, setTouchedFields] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [validationError, setValidationError] = useState(null)

  const alert = useAlert()


  function handleFieldChange(event) {

    if (!typeof event == 'object') event.preventDefault()


    setTouchedFields(prev => {
      prev.add(event?.target?.name ?? 'facility_name')
      return prev
    })
  }

  function handleDateChange(event) {

    event.preventDefault()

    handleFieldChange(event)

    if (event.target.name == "date_established") {
      setValidationError(prev => ({ ...prev, date_established: null }))
    } else {
      setValidationError(prev => ({ ...prev, date_operational: null }))
    }

    const today = new Date()

    const setDate = event.target.valueAsDate

    if (setDate > today) {
      if (event.target.name == "date_established") {
        setValidationError({ date_established: 'Date Established Cannot be in the future' })
      } else {
        setValidationError({ date_operational: 'Date Operational Cannot be in the future' })
      }

      event.target.value = ''

    }


    const dateEstablished = event.target.value !== '' && event.target.name.includes('date_established') ? event.target.valueAsDate : document.querySelector('input[name="date_established"]').valueAsDate

    const dateOperational = event.target.value !== '' && event.target.name.includes('date_operational') ? event.target.valueAsDate : document.querySelector('input[name="date_operational"]').valueAsDate


    if (dateEstablished && dateOperational) {
      if (dateEstablished > dateOperational) {
        if (event.target.name == "date_operational") {
          setValidationError({ date_operational: 'Date Established Cannot be recent than date operational ' })
          event.target.value = ''

        }
      }


    }
  }

  function handleFormSubmit(event) {

    event.preventDefault()

    setSubmitting(true)

    const payload = {}
    const formData = new FormData(event.target)
    const formDataObject = Object.fromEntries(formData)

    // console.log([...touchedFields.values()])

    if (Array(touchedFields.values()).length >= 1) {
      for (let field of [...touchedFields.values()]) {
        if (props[field] !== formDataObject[field]) {
          if (/contact_type_\d/.test(field)) {
            payload['contact_type'] = formDataObject[field]
          } else if (/contact_\d/.test(field)) {
            payload['contact'] = formDataObject[field]
          }
          else {
            payload[field] = formDataObject[field]

          }
        }
      }
    }

    payload['basic'] = {}

    payload['basic']['contact'] && delete payload['basic']['contact']
    payload['basic']['contact_type'] && delete payload['basic']['contact_type']

    console.log(payload)

    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.id}/`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${props?.token}`
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })

        .then(async resp => {
          if (resp.status == 200 || resp.status == 204) {

            setSubmitting(false)

            alert.success(`${props?.name} Basic Details Updated successfully`, {
              containerStyle: {
                backgroundColor: "green",
                color: "#fff"
              }
            })

          } else {
            // const detail = await resp.json()

            setSubmitting(false)
            // setFormError(Array.isArray(Object.values(detail)) && Object.values(detail).length == 1 && typeof Object.values(detail)[0] == 'string' && detail[0][0])
            alert.error('Unable to save Community Units Basic details')
          }
        })
    }

    catch (e) {
      alert.error('Error Occured: ' + e.message)
    }



  }

  return (
    <form
      className="flex m-1 p-3 bg-blue-50 flex-col w-full items-start justify-start gap-3"
      onSubmit={handleFormSubmit}
    >

      {formError && <Alert severity="danger" sx={{ width: '100%', marginY: '15px' }}>{formError}</Alert>}

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
          onChange={handleFieldChange}
          id="name"
          defaultValue={props?.name}
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
        />
      </div>

      {/* CHU Linked Facility */}

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

          options={options?.facilities}
          defaultValue={options?.facilities?.find(({ value }) => value == props?.facility)}

          placeholder="Select Link facility ..."
          name="facility_name"
          onChange={handleFieldChange}
          id="facility_name"
          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'


        />
      </div>

      {/* CHU Operational Status */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <label
          htmlFor="status"
          className="text-gray-600 capitalize text-sm"
        >
          Operation Status
          <span className="text-medium leading-12 font-semibold">
            {" "}
            *
          </span>
        </label>
        <CustomSelect
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
          options={options?.statuses}
          defaultValue={props?.status}
          name="status"
          onChange={handleFieldChange}
          id="status"
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
                onChange={handleDateChange}
                id="date_established"
                defaultValue={props?.date_established}
                placeholder={'mm/dd/yyyy'}
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
              />

              {validationError?.date_established && <span className='text-red-500 text-sm'>{validationError?.date_established}</span>}

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
                onChange={handleDateChange}
                id="date_operational"

                defaultValue={props?.date_operational}

                placeholder={'mm/dd/yyyy'}
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
              />

              {validationError?.date_operational && <span className='text-red-500 text-sm'>{validationError?.date_operational}</span>}

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
          onChange={handleFieldChange}
          id="households_monitored"

          defaultValue={props?.households_monitored}

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
          onChange={handleFieldChange}
          id="number_of_chvs"
          defaultValue={props?.number_of_chvs}

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

                defaultValue={props?.facility_county}

                type="text"
                name="facility_county"
                onChange={handleFieldChange}
                id="facility_county"
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

                defaultValue={props?.facility_subcounty}

                type="text"
                name="facility_subcounty"
                onChange={handleFieldChange}
                id="facility_subcounty"
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
                defaultValue={props?.facility_constituency}
                type="text"
                name="facility_constituency"
                onChange={handleFieldChange}
                id="facility_constituency"
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
                defaultValue={props?.facility_ward}
                type="text"
                name="facility_ward"
                onChange={handleFieldChange}
                id="facility_ward"
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
            onChange={handleFieldChange}
            id="location"
            placeholder="Description of the area of coverage"
            defaultValue={props?.location}
            min={0}
            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
          />
        </div>

        <div className=" w-full flex flex-col items-start justify-start bg-transparent h-auto">
          <h4 className="text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">
            Community Health Unit Contacts
          </h4>

          {props?.contacts?.map(({ contact, contact_type_name }, i) => {
            return (
              <div
                className="w-full flex flex-row items-center  gap-1 gap-x-3 mb-3"
                key={i}
              >
                <div
                  className="w-full flex flex-col items-left   gap-1 gap-x-3 mb-3"
                >
                  <label
                    htmlFor={`contact_type_${i}`}
                    className="text-gray-600 capitalize text-sm"
                  >
                    Contact Type
                    <span className="text-medium leading-12 font-semibold">
                      {" "}
                      *
                    </span>
                  </label>

                  <CustomSelect
                    required
                    name={`contact_type_${i}`}
                    onChange={handleFieldChange}
                    id={`contact_type_${i}`}
                    options={options?.contactTypes}
                    defaultValue={options?.contactTypes?.find(({ label }) => label == contact_type_name)?.value}
                    placeholder="Select Contact.."
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />

                </div>
                <div
                  className="w-full flex flex-col items-left  justify-  gap-1 gap-x-3 mb-3"

                >
                  <label
                    htmlFor={`contact_${i}`}
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
                    onChange={handleFieldChange}
                    id={`contact_${i}`}
                    defaultValue={contact}
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
              {
                submitting ?
                  <Spinner />
                  :
                  'Save and Finish'

              }
            </span>
            {
              submitting &&
              <span className='text-white'>Saving </span>
            }

          </button>

        </div>



      </div>
    </form>

  )
}

function EditCommunityUnitsCHEWSForm(props) {

  // const current_services = Array.from(props?.services, s => s?.service) || []

  const [submitting, setSubmitting] = useState(false)
  const [healthUnitWorkers, setHealthUnitWorkers] = useState(props?.health_unit_workers)
  const alert = useAlert()

  function handleFormSubmit(event) {
      event.preventDefault()

      const formData = new FormData(event.target)
      const formDataObject = Object.fromEntries(formData)

      console.log({
        formDataObject
      })
  }
  return (
    <form
      name="chews_form"
      className="flex flex-col p-3 h-full bg-blue-50 w-full items-start justify-start gap-3"
      onSubmit={handleFormSubmit}
    >
      
      <div className="w-full flex flex-col items-start justify-start gap-y-7 mb-3">
        {Array.isArray(healthUnitWorkers) && healthUnitWorkers.length > 0 ? (
          healthUnitWorkers?.map(({ first_name, last_name, is_incharge }, index) => {
            return (
              <div
                className="flex flex-row items-center justify-between md:mx-1 gap-4 w-full"
                key={index}
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
                    id='first_name'
                    name="first_name"
                    defaultValue={first_name}
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
                    id='last_name'
                    name="last_name"
                    defaultValue={last_name}
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
                    id='is_incharge'
                    type="checkbox"
                    defaultChecked={is_incharge}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                </div>

                {/* Delete CHEW */}

                <div className="flex-col gap-2">
                  <div className="flex items-center">
                    {/* insert red button for deleting */}
                    <button
                      name="delete"
                      onClick={e => {
                        e.preventDefault();

                        setHealthUnitWorkers(prev => {
                          prev.splice(index, 1)

                          return [...prev]
                        })
                      }}
                      className="flex items-center justify-start space-x-2 bg-red-600  p-1 px-2"
                    >
                      <span className="text-medium font-semibold text-white">
                        Delete
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
            onClick={(e) => {
              e.preventDefault()
              setHealthUnitWorkers(prev => [...prev, {first_name: "", last_name:"", is_incharge:""}])
            }}
          >
            {`Add +`}
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
            {
              submitting ?
                <Spinner />
                :
                'Save and Finish'
            }
          </span>
          {
            submitting &&
            <span className='text-white'>Saving </span>


          }

        </button>
      </div>
    </form>

  )

}


function EditCommunityUnitsServicesForm(props) {

  return (
    <form
      name="chu_services_form"
      className="flex flex-col w-full items-center bg-blue-50 p-3 justify-start gap-3"

    >
      {/* Transfer list Container */}
      <span className="text-md w-full font-semibold flex flex-wrap justify-between items-center leading-tight tracking-tight">
        Available Services
      </span>
      <div className="flex items-center w-full h-auto">
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
          placeholder="Select Service ..."
          options={serviceOptions}

          name="services"
          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none'

        />
      </div>
      <br />
      {/* Service Category Table */}
      <span className="text-md w-full flex font-semibold flex-wrap justify-between items-center leading-tight tracking-tight">
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
      </table>
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
  )
}


export function CommunityUnitEditForm(props) {


  // const DualListBox = dynamic(
  //   () => import("react-dual-listbox"), // replace '@components/map' with your component's location
  //   {
  //     loading: () => (
  //       <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">
  //         Loading&hellip;
  //       </div>
  //     ),
  //     ssr: false, // This line is important. It's what prevents server-side render
  //   }
  // );



  // function appendValueToBasicDetails(contacts) {
  //   let i = 0

  //   let c_ontacts = Array.from(contacts, (c, i) => {
  //     let ct = {}
  //     ct[`contact_type_${i}`] = c?.contact_type;
  //     ct[`contact_${i}`] = c?.contact;
  //   }) ?? {}

  //   return c_ontacts;
  // }

  const [isClient, setIsClient] = useState(false)


  useEffect(() => {

    setIsClient(true)
    // console.log({props})

    // let accessTokenObject;

    // console.log({ options });
    // // console.log('intialValuesBasicDetails', intialValuesBasicDetails);

    // if (contacts) {
    //   setBasicDetailValues({
    //     ...intialValuesBasicDetails,
    //     ...appendValueToBasicDetails(contacts),
    //   });
    // }

    // try {
    //   accessTokenObject = JSON.parse(getCookie('access_token'));
    // } catch (error) {
    //   console.error('Error parsing access token JSON:', error);
    // }


    // if (accessTokenObject) {
    //   setToken(accessTokenObject.token)



    // } else {
    //   console.error('accessTokenObject is not defined or invalid.');
    // }
  }, []);


  if (isClient) {
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
                {props?.name} ( #
                <i className="text-black">{props?.code || "NO_CODE"}</i> )
              </span>
            </div>

            {/* Header snippet */}
            <div
              className={
                `md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full border ${props?.active ? "border-blue-600" : "border-red-600"} bg-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
              ${props?.active ? "border-blue-600" : "border-yellow-700"}
            `}
            >
              <div className="col-span-6 md:col-span-3">
                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                  {props?.name}
                </h1>
                <div className="flex gap-2 items-center w-full justify-between">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (props?.code ? "text-blue-900" : "text-gray-500")
                    }
                  >
                    #{props?.code || "NO_CODE"}
                  </span>

                </div>
              </div>

              {/* Info snippet */}
              <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
                <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                  {props?.is_approved ? (
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
                  {props?.is_closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      CHU Closed
                    </span>
                  )}
                  {props?.deleted && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <XCircleIcon className="h-4 w-4" />
                      CHU Deleted
                    </span>
                  )}
                  {props?.active && (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Active
                    </span>
                  )}
                  {props?.has_edits && (
                    <span className="bg-blue-200 text-blue-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <InformationCircleIcon className="h-4 w-4" />
                      Has changes
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
                {''}
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
          <div className="col-span-1 md:col-span-6 flex flex-col md:gap-3 mt-8 bg-blue-50 shadow-md pt-2">
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
                <EditCommunityUnitsBasicDeatilsForm {...props?.props} />
              </Tabs.Panel>

              {/* Chews Panel */}
              <Tabs.Panel value="chews" className="grow-1 p-3 mx-auto w-full tab-panel">
                <EditCommunityUnitsCHEWSForm {...props?.props} />
              </Tabs.Panel>

              {/* Services Panel */}
              <Tabs.Panel
                value="services"
                className="grow-1 p-3 mx-auto w-full tab-panel"
              >

              </Tabs.Panel>

            </Tabs.Root>
          </div>

        </div>
      </MainLayout>
    )
  } else {
    return null
  }

}