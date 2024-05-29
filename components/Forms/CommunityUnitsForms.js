
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
  TrashIcon
} from "@heroicons/react/solid";
import { useContext, useState, useEffect } from 'react';
import { ChuOptionsContext } from '../../pages/community-units/edit/[id]';
import Select from 'react-select'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useAlert } from 'react-alert'
import Alert from '@mui/material/Alert';
import Spinner from '../../components/Spinner'
import EditListItem from '../../components/Forms/formComponents/EditListItem'
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
  


function EditCommunityUnitsBasicDeatilsForm(props) {

  const options = useContext(ChuOptionsContext)
  const [touchedFields, setTouchedFields] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [contacts, setContacts] = useState(props?.contacts ?? [{contact: '', contact_type_name: ''}]);


  useEffect(() => {console.log({submitting})}, submitting)


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
    setSubmitting(true)

    event.preventDefault()


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

    console.log({submitting})

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
          if (resp.ok) {


            alert.success(`${props?.name} Basic Details Updated successfully`, {
              containerStyle: {
                backgroundColor: "green",
                color: "#fff"
              }
            })

          } else {
            const detail = await resp.json()
  
            const error = Array.isArray(Object.values(detail)) && Object.values(detail).length == 1 ? detail[Object.keys(detail)[0]][0] : ''

            setFormError(error)

            alert.error('Unable to save Community Units Basic details')
          }
        })
    }

    catch (e) {
      alert.error('Error Occured: ' + e.message)
    }
    finally {
      setSubmitting(false)

    }



  }

  function handleAddContact(event) {
    event.preventDefault()

    setContacts(prev => {
      return [...prev, {contact: '', contact_type_name: ''}]
    })
  }

  return (
    <form
      className="flex m-1 p-3 bg-gray-50 flex-col w-full items-start justify-start gap-3"
      onSubmit={handleFormSubmit}
    >

     

      {formError && <Alert severity="error" sx={{ width: '100%', marginY: '15px' }}>{formError}</Alert>}

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
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-400 rounded outline-none'


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
          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-400 rounded outline-none'

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
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
        />
      </div>

      {/* CHU, Linked Facility Location */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <div className="flex flex-col md:grid md:grid-cols-4 place-content-start gap-3 w-full">
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
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
          />
        </div>

        {/* Community Health Unit Workforce */}
				<div className='grid grid-cols-3 grid-rows-5 gap-3 mb-3 w-full'>
					<h4 className='col-span-3 self-end row-start-1 text-lg uppercase  border-b border-gray-600 w-full font-semibold text-gray-900'>
					Community Health Unit Workforce
					</h4>
					<label className='col-start-2 row-start-2 text-gray-600 self-end'>Number Present</label>
					<label className='col-start-3 row-start-2 text-gray-600 self-end'>Number Trained</label>

					{/* <div className='row-span-3'> */}
					<label className='col-start-1 row-start-3 self-end'>Community Health Promoters (CHPs)*</label>
					<label className='col-start-1 row-start-4 self-end'>Community Health Assistants (CHAs)*</label>
					<label className='col-start-1 row-start-5 self-end'>Community Health Commitee Members (CHC)*</label>

					{/* </div> */}
				
					<input
						defaultValue={props?.chps_present}
						type='number'
						name='chps_present'
						className='col-start-2 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={props?.chps_trained}
						type='number'
						name='chps_trained'
						className='rounded col-start-3 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>
					
					<input
						defaultValue={props?.chas_present}
						type='number'
						name='chas_present'
						className='rounded col-start-2 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={props?.chas_trained}
						type='number'
						name='chas_trained'
						className='rounded col-start-3 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={props?.chcs_present}
						type='number'
						name='chcs_present'
						className='rounded col-start-2 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>

					<input
						defaultValue={props?.chcs_trained}
						type='number'
						name='chcs_trained'
						className='rounded col-start-3 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
					/>



				</div>

        <div className=" w-full flex flex-col items-start justify-start bg-transparent h-auto">
          <h4 className="text-lg uppercase  border-b border-gray-600 w-full my-4 font-semibold text-gray-900">
            Community Health Unit Contacts
          </h4>

          {contacts?.map(({ contact, contact_type_name }, i) => {
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
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
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
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky top-0 right-10 w-full flex justify-end">
          <button
            className="bg-gray-500 rounded p-2 text-white flex text-md font-semibold mt-3"
            onClick={handleAddContact}
          >
            {`Add Contact`}
          </button>
        </div>

        {/* Cancel and Save Changes */}
        <div className="flex justify-end items-center w-full mt-3">


          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-end space-x-2 bg-gray-500 rounded  p-1 px-2"
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
              <span className='text-white'>Saving.. </span>
            }

          </button>

        </div>



      </div>
    </form>

  )
}

function EditCommunityUnitsCHEWSForm(props) {


  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState(null)

  const [healthUnitWorkers, setHealthUnitWorkers] = useState(props?.health_unit_workers)
  const alert = useAlert()
  const [deleteButton, setDeleteButton] = useState(props?.health_unit_workers.map((_, i) => ({[i]: false})))

  console.log({deleteButton})
  
  function handleFormSubmit(event) {
      event.preventDefault()

      setSubmitting(true)

      
      const formData = new FormData(event.target)
      const formDataObject = Object.fromEntries(formData)

      for(let [k,v] of formData) {
        if(v == "on") {
          formDataObject[k] = true
        } else {
            formDataObject[`is_incharge_${k.split('_').at(-1)}`] = false
            formDataObject[k] = v
          }
        }
      
        let payload = Object.keys(formDataObject)?.filter(k => /first_name_\d/.test(k)).map(() => ({}))
   
        const formDataEntries = Object.entries(formDataObject)

        formDataEntries.forEach((entry) => {
          if (/^first_name_[0-9]{1}/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['first_name'] = entry[1];
          if (/^last_name_[0-9]{1}/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['last_name'] = entry[1];
          if (/^is_incharge_[0-9]{1}/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['is_incharge'] = entry[1];

        })

        payload = payload.filter(({first_name}, i) => first_name !== props?.health_unit_workers[i]?.first_name)


      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.id}/`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${props?.token}`
          },
          method: 'PATCH',
          body: JSON.stringify({health_unit_workers: payload})
        })
  
          .then(async resp => {
            if (resp.status == 200) {
  
              setSubmitting(false)
  
              alert.success(`${props?.name} Community Health Workers Updated successfully`, {
                containerStyle: {
                  backgroundColor: "green",
                  color: "#fff"
                }
              })
  
            } else {
              // const detail = await resp.json()
  
              setSubmitting(false)
              // setFormError(Array.isArray(Object.values(detail)) && Object.values(detail).length == 1 && typeof Object.values(detail)[0] == 'string' && detail[0][0])
              alert.error('Unable to update Community Units health workers')
            }
          })
      }
  
      catch (e) {
        alert.error('Error Occured: ' + e.message)
      }
  }



  function handleDelete(event, index, id) {
    event.preventDefault();

    const itemId = event.target.parentNode.dataset.id

    setDeleting(true)
   
    setDeleteButton(prev => {
      // prev[index][index] = true
      // return prev
      return prev.map((slot) => {
        slot[index] = true;
        return slot
      })
    })

  

    // const index = parseInt(event.target.name.split('_').at(-1))
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/workers/${id}/`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${props?.token}`
      },
      method: 'DELETE',
    })
    
    .then(resp => {
      if(resp.status == 204) {

        setDeleting(false)


        setHealthUnitWorkers(prev => {
          setDeleteButton(prev => {
            return prev.filter(obj => obj[index] !== true)
          })
          return prev.filter(({id}) => id !== itemId)
  
  
         })

        // setDeleteButton(props?.health_unit_workers.map((_, i) => ({[i]: false})))


        alert.success(`${props?.health_unit_workers[index]?.name} has been deleted successfully`)
      } else {
          resp.json().then(({detail}) => {
          alert.error('Unable to delete health worker', {timeout: 10000})
            setDeleting(false)
            setFormError(detail)

          })
          // console.log({error})

      }
    })
    .catch(e => {
      console.error(e.message)
    })
    
    
  }


  function handleAddCHEW(e){
      e.preventDefault()
      setHealthUnitWorkers(prev => [...prev, {first_name: "", last_name:"", is_incharge:""}])
  }

   return (
    <form
      name="chews_form"
      className="flex flex-col p-3 h-full bg-gray-50 w-full items-start justify-start gap-1"
      onSubmit={handleFormSubmit}
    >
      {formError && <Alert severity='error' className={'w-full'}>Error when deleting: {formError}</Alert>}
      
      <div className='w-full flex flex-col items-between justify-start gap-1 my-2'>
					
				<div className="flex items-start justify-between">

					<div className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-x-5 flex-1 mb-2'>

						<label
							htmlFor='last_name'
							className='block text-sm font-medium text-gray-700'>
							First Name
						</label>

						<label
							htmlFor='last_name'
							className='block text-sm font-medium text-gray-700'>
							Second Name
						</label>

						<label
							htmlFor='mobile_no'
							className='block text-sm font-medium text-gray-700'>
							Mobile Phone Number*
						</label>

						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>

						<label
								htmlFor='last_name'
								className='block text-sm font-medium text-gray-700'>
								Delete
							</label>

							

			
					</div>
					
					<div className='flex flex-row justify-between gap-2'>
							
							<button className=' w-auto  bg-blue-600 p-2 text-white flex text-md font-semibold '
								onClick={handleAddCHEW}
							>
								{`Add +`}

							</button>
						</div> 


				</div>

        {Array.isArray(healthUnitWorkers) && healthUnitWorkers.length > 0 ? (
          healthUnitWorkers?.map(({ first_name, last_name, mobile_no, email, id }, index) => {
            return (
              <div key={id} className="flex items-start justify-between">
						
              <div className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-x-4'>
                {/* First Name */}

                <input
                    required
                    type="text"
                    id={`first_name_${index}`}
                    name={`first_name_${index}`}
                    defaultValue={first_name}
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />

                  {/* Second Name */}
                  <input
                    required
                    type="text"
                    id={`last_name_${index}`}
                    name={`last_name_${index}`}
                    defaultValue={last_name}
                   
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />

                  {/* Phone Number */}
                  <input
								required
								type='tel'
								pattern={'[+]{1}[254]{3}[ ]{1}[0-9]{9}'}
								placeholder={'+254 #########'}
								name={`mobile_no_${index}`}
								defaultValue={mobile_no}

								className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>

              {/* Email */}

              <input
								required
								type='email'
								name={`email_${index}`}
								defaultValue={email}
								placeholder="user@email-domain"
								pattern="[a-z0-9]+[.]*[\-]*[a-z0-9]+@[a-z0-9]+[\-]*[.]*[a-z0-9]+[.][a-z]{2,}"
								className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
							/>

              {/* Delete Button */}

              {/* Delete CHEW */}
							<div className='flex'>
								<div className='flex items-center'>
									{/* insert red button for deleting */}
									<button
										name='delete'
										type='button'
										className='bg-transparent group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 hover:border-transparent '
										onClick={(e) => handleDelete(e, index, id)}
                    data-id={props?.health_unit_workers[index]?.id}
                    >
										<TrashIcon className="w-4 h-4 text-red-500 group-hover:text-white" />
									</button>
								</div>
							</div>
    

              </div>

<div className='flex flex-row justify-between gap-x-2'>
  
  <span disabled={true} className=' w-auto bg-transparent p-1 text-white flex text-md font-semibold '
  >
    {`Add +`}

  </span>
</div> 

</div>
              // <div
              // className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-y-1 gap-x-5'  
              // key={id}
              // >
              //   {/* First Name */}
              //   <div className="flex-col gap-2">
              //     <label
              //       htmlFor={`first_name_${index}`}
              //       start
              //       className="block text-sm font-medium text-gray-700"
              //     >
              //       First Name
              //     </label>
              //     <input
              //       required
              //       type="text"
              //       id={`first_name_${index}`}
              //       name={`first_name_${index}`}
              //       defaultValue={first_name}
              //       className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              //     />
              //   </div>
              //   {/* Second Name */}
              //   <div className="flex-col gap-2">
              //     <label
              //       htmlFor={`last_name_${index}`}
              //       className="block text-sm font-medium text-gray-700"
              //     >
              //       Second Name
              //     </label>
              //     <input
              //       required
              //       type="text"
              //       id={`last_name_${index}`}
              //       name={`last_name_${index}`}
              //       defaultValue={last_name}
                   
              //       className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              //     />
              //   </div>

                
              //   {/* In charge */}
              //   <div className="flex-col gap-2">
              //     <label
              //       htmlFor={`is_incharge_${index}`}
              //       className="block text-sm font-medium text-gray-700"
              //     >
              //       In Charge
              //     </label>
                  
              //     <input
              //       name={`is_incharge_${index}`}
              //       id={`is_incharge_${index}`}
              //       type="checkbox"
              //       defaultChecked={is_incharge}
              //       className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              //     />
              //   </div>

              //   {/* Delete CHEW */}

              //   <div className="flex-col gap-2">
              //     <div className="flex items-center">
              //       {/* insert red button for deleting */}
              //       <button
              //         onClick={(e) => handleDelete(e, index, id)}
              //         className="flex items-center justify-start space-x-2 bg-red-600 rounded  p-1 px-2"
              //         data-id={props?.health_unit_workers[index]?.id}

              //       >
              //         <span className="text-medium font-semibold text-white">
              //           {
              //             deleting && deleteButton[index][index] ? 
              //             <span className='flex place-content-center gap-2'>
              //               <Spinner/>
              //               <span>Deleting...</span>
              //             </span>
              //             :
              //             'Delete'

              //           }
                        
              //         </span>
              //       </button>
              //     </div>
              //   </div>
              // </div>
            )
          })
        ) : (
          <>
            <li className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
              <p>No HR data listed for this </p>
            </li>
          </>
        )}

        {/* <div className="sticky top-0 right-10 w-full flex justify-end">
          <button
            className=" bg-gray-500 rounded p-2 text-white flex text-md font-semibold "
            onClick={(e) => {
              e.preventDefault()
              setHealthUnitWorkers(prev => [...prev, {first_name: "", last_name:"", is_incharge:""}])
            }}
          >
            {`Add +`}
          </button>
        </div> */}
      </div>

      {/* Save Changes */}
      <div className="flex justify-end items-center w-full">

        <button
          type="submit"
          className="flex items-center justify-end space-x-2 bg-gray-500 rounded  p-1 px-2"
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

    const currentServices = props?.services?.map(({name: label, service: value}) => ({label, value})) ?? []

    const options = useContext(ChuOptionsContext)

    const [submitting, setSubmitting] = useState(false)
  
    // const serviceCtg = props?.service_category ?? []
  
    const serviceOptions = ((_services) => {
  
      const _serviceOptions = []
      let _values = []
      let _subCtgs = []
  
      if (_services.length > 0) {
        _services.forEach(({ category_name: ctg }) => {
          let allOccurences = _services.filter(({ category_name }) => category_name === ctg)
  
          allOccurences.forEach(({ id, name }) => {
            _subCtgs.push(name)
            _values.push(id)
          })
  
          if (_serviceOptions.map(({ name }) => name).indexOf(ctg) === -1) {
            _serviceOptions.push({
              name: ctg,
              subCategories: _subCtgs,
              value: _values
            })
          }
  
          _values = []
          _subCtgs = []
  
        })
      }
  
  
  
  
      return _serviceOptions.map(({ name, subCategories, value }) => ({
        label: name,
        options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
      }))
  
    })(options?.services ?? [])
  
  
  function handleSubmit (selectedServices, chulId) {
      // console.log({stateSetters, chulId})
    const _payload = selectedServices.map(({value}) => ({ service: value }))

		_payload.forEach(obj => obj['health_unit'] = chulId)

    
  
      if(_payload) {
      try {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.id}/`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${props?.token}`
          },
          method: 'POST',
          body: JSON.stringify({services: _payload})
        })

    
 
      }
      catch (e) {
        console.error(e.message)
      }
      }
  
  };


  function handleCHUServiceUpdate (selectedServices, chulId) {

    const _payload = selectedServices.map(({value}) => ({ service: value }))

		_payload.forEach(obj => obj['health_unit'] = chulId)

    try {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${chulId}/`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${props?.token}`
        },
        method: 'PATCH',
        body: JSON.stringify({services: _payload})
      })

      }
    catch (e) {
      console.error(e.message)
    }
  }
  
 


    return (
      <>
        <h4 className='text-lg uppercase pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900'>
          Services Offered
        </h4>
  
        
  
        <div
          name='chu_services_form'
          className='flex flex-col w-full items-start justify-start gap-3'
        >
          <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>
  
            {/* Edit list Item Container */}
            <div className='flex items-center w-full h-auto min-h-[300px]'>
  
              
              <EditListItem
                itemData={currentServices}
                categoryItems={serviceOptions[0]?.options} //serviceOptions
                itemId={props?.id} //chulId
                token={props?.token}
                handleItemsSubmit={handleSubmit} //handleCHUServiceSubmit
                handleItemsUpdate={handleCHUServiceUpdate} //handleServiceUpdates
                setSubmitting={setSubmitting}
                submitting={submitting}
                options={serviceOptions[0]?.options}
                itemName={'chul_services'}
                handleItemPrevious={() => null} 
                setFormId={() => null}
                editMode
              />
  
            </div>
          </div>
        </div>
      </>
    );
  
  
  
}
  


export function CommunityUnitEditForm(props) {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
      <MainLayout>
        <div className="w-full md:w-[85%] px-4 grid grid-cols-1 md:grid-cols-7 place-content-center md:grid gap-4 md:p-2 my-6">
          <div className="md:col-span-7 flex flex-col items-start justify-start gap-3">
           
            {/* Breadcrumb */}
            <div className="flex flex-row gap-2 text-sm md:text-base">
              <Link className="text-gray-700" href="/">
                Home
              </Link>
              {"  >  "}
              <Link className="text-gray-700" href="/community-units">
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
                `md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full border ${props?.active ? "border-gray-400 rounded" : "border-red-600"} bg-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
              ${props?.active ? "border-gray-400 rounded" : "border-yellow-700"}
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
                      (props?.code ? "text-gray-900" : "text-gray-500")
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
                    <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      CHU Active
                    </span>
                  )}
                  {props?.has_edits && (
                    <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
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

          <button className='md:hidden relative p-2 border border-gray-800 rounded w-full self-start my-4' onClick={() => setIsMenuOpen(!isMenuOpen)}>
          Community Health Unit Menu
          {
            !isMenuOpen &&
            <KeyboardArrowRight className='w-8 aspect-square text-gray-800' />
          }

          {
            isMenuOpen &&
            <KeyboardArrowDown className='w-8 aspect-square text-gray-800' />
          }

          {
            isMenuOpen &&
            <CommunityUnitSideMenu
              qf={'all'}
              filters={[]}
              _pathId={''}

            />
          }
          </button>
          
           



          {/* Form */}
          <div className="col-span-1 md:col-span-6 flex flex-col md:gap-3 mt-2 md:mt-8 bg-gray-50 rounded shadow-md pt-2">
            <Tabs.Root
              orientation="horizontal"
              className="w-full flex flex-col tab-root"
              defaultValue="basic_details"
            >
              {/* Tabs List */}
              <Tabs.List className="list-none w-full flex justify-between md:justify-start border-b border-gray-400  md:grid md:grid-cols-3  flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold">
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
                <EditCommunityUnitsServicesForm {...props?.props} />

              </Tabs.Panel>

            </Tabs.Root>
          </div>

        </div>
      </MainLayout>
    )
  
}