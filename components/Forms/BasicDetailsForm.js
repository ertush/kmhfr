// @refresh

"use client"

import { useContext, useEffect, useState } from 'react';
import { Select as CustomSelect } from './formComponents/Select';
import { FormOptionsContext } from '../../pages/facilities/add';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert';
import Spinner from '../Spinner'
import { useRouter } from 'next/router';
import { Alert } from '@mui/lab';
import { UpdateFormIdContext } from './Form';

// import { FacilityIdContext, FacilityWardDataContext } from './Form';


export function BasicDeatilsForm({ editMode }) {

  // Context
  const setFormId = useContext(UpdateFormIdContext)

  // Constants
  const alert = useAlert();
  const router = useRouter()

  // State
  const [isClient, setIsClient] = useState(false)
  const [totalFunctionalBeds, setTotalFunctionalBeds] = useState(0)
  const [facilityId, setFacilityId] = useState('')
  const [submitting, setSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState([]);
  const [formError, setFormError] = useState(null);


  // Options
  const formContext = useContext(FormOptionsContext);
  const [options, setOptions] = useState(formContext)
  const [facilityTypeDetailOptions, setFacilityTypeDetailOptions] = useState(options?.facility_type_details)
  const [ownerTypeDetailsOptions, setOwnerTypeDetailsOptions] = useState(Array.from(options?.owners, o => {
    if (o?.owner_type_name || o?.created_by || o?.updated_by) {
      return {
        label: o?.name,
        value: o?.id
      }
    } else {
      return o
    }
  }))

  const [subCountyOptions, setSubCountyOptions] = useState(options?.sub_counties)
  const [constituencyOptions, setConstituencyOptions] = useState(options?.constituencies)
  const [wardOptions, setWardOptions] = useState(options?.wards)
  const operationStatusOptions = [
    {
      value: '190f470f-9678-47c3-a771-de7ceebfc53c',
      label: 'Non-Operational',
    },
    {
      value: 'ae75777e-5ce3-4ac9-a17e-63823c34b55e',
      label: 'Operational',
    },
  ];


  // Event handlers
  function handleFocus(e) {
    setTouchedFields(touchedFields => {
      return [...touchedFields, e.target.name]
    })
  }

  async function handleSelectChange(e) {

    const keph = document.getElementsByName('keph_level');

    // Handle facility Type Change
    if (e.target.name == 'facility_type') {

      // Keph form validation



      const facilityTypeLabel = e.target.selectedOptions[0].innerText

      if (facilityTypeLabel.includes('DISPENSARY')) {

        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 2')?.value;

      } else if (facilityTypeLabel.includes('MEDICAL CENTER')) {
        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 3')?.value;

      }
      else if (facilityTypeLabel.includes('HEALTH CENTRE')) {

        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 3')?.value;

      }
      else if (facilityTypeLabel.includes('MEDICAL CLINIC')) {

        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 2')?.value;

      }
      else if (facilityTypeLabel.includes('NURSING HOME')) {
        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 3')?.value;

      }
      else if (facilityTypeLabel.includes('STAND ALONE')) {
        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 2')?.value;

      }



      if (e?.target?.value) {
        try {
          const facilityTypeDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types_details/?is_parent=false&parent=${e.target.value}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${options?.token}`
            }
          })

          const filteredFacilityType = (await facilityTypeDetails.json())?.results

          if (!filteredFacilityType) throw Error('Unable to Fetch Facility Type Details')


          const facilityType = Array.from(filteredFacilityType, ({ id, name }) => {
            return {
              label: name,
              value: id
            }
          })


          setFacilityTypeDetailOptions(facilityType ?? options?.facility_type_details)

        }
        catch (e) {
          console.error(e.message)
        }
      }


    } else if (e.target.name == 'facility_type_details') {



      const facilityTypeLabel = e.target.selectedOptions[0].innerText

      if (facilityTypeLabel.trim().toLowerCase() == 'Comprehensive Teaching & Tertiary Referral Hospital'.trim().toLowerCase()) {

        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 6')?.value;

      } else if (facilityTypeLabel.trim().toLowerCase() == 'Specialized & Tertiary Referral hospitals'.trim().toLowerCase()) {
        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 6')?.value;

      } else if (facilityTypeLabel.trim().toLowerCase() == 'Secondary care hospitals'.trim().toLowerCase()) {
        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 5')?.value;

      }
      else if (facilityTypeLabel.trim().toLowerCase() == 'Primary care hospitals'.trim().toLowerCase()) {
        keph[0]?.value = options?.keph.find(({ label }) => label == 'Level 4')?.value;

      }


    } else if (e.target.name == 'owner_type') {

      if (e?.target?.value) {

        try {
          const owners = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/owners/?owner_type=${e.target.value}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${options?.token}`
            }
          })

          const filteredOwners = (await owners.json())?.results

          if (!filteredOwners) throw Error('Unable to Fetch Owner Type Details')


          const facilityOwnerOptions = Array.from(filteredOwners, ({ id, name }) => {
            return {
              label: name,
              value: id
            }
          })




          setOwnerTypeDetailsOptions(facilityOwnerOptions ?? options?.owner_types)

        }
        catch (e) {
          console.error(e.message)
        }


      }

    } else if (e.target.name == 'county_id') {

      if (e.target?.value) {
        try {
          const sub_counties = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/sub_counties/?county=${e.target.value}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${options?.token}`
            }
          })

          const constituencies = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/constituencies/?county=${e.target.value}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${options?.token}`
            }
          })

          const _sub_counties = (await sub_counties.json())?.results

          if (!_sub_counties) throw Error('Unable to Fetch sub counties')


          const filteredSubCounties = Array.from(_sub_counties, ({ id, name }) => {
            return {
              label: name,
              value: id
            }
          })


          const _constitutencies = (await constituencies.json())?.results

          if (!constituencies) throw Error('Unable to Fetch sub counties')



          const filteredConstituencies = Array.from(_constitutencies, ({ id, name }) => {
            return {
              label: name,
              value: id
            }
          })

          setSubCountyOptions(filteredSubCounties ?? options?.sub_counties)
          setConstituencyOptions(filteredConstituencies ?? options?.constituencies)



        }
        catch (e) {
          console.error(e.message)
        }
      }
    } else if (e.target.name == 'sub_county_id') {

      if (e.target?.value) {

        try {
          const _wards = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/wards/?sub_county=${e.target.value}`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${options?.token}`
            }
          })

          const wards = (await _wards.json())?.results

          if (!_wards) throw Error('Unable to Fetch sub counties')


          const filteredWards = Array.from(wards, ({ id, name }) => {
            return {
              label: name,
              value: id
            }
          })

          // console.log({ filteredWards, wards })

          setWardOptions(filteredWards ?? options?.sub_counties)

        }
        catch (e) {
          console.error(e.message)
        }
      }
    }
  }


  function handleBasicDetailsUpdate(e) {

    e.preventDefault()

    const formData = new FormData(e.target)

    const data = Object.fromEntries(formData)

    const payload = {}

    for (let field of touchedFields) {
      payload[field] = data[field] == undefined ? false : data[field] == "on" || data[field] == "true" ? true : data[field] == "false" ? false : (Number(data[field]) ?? data[field])
    }

    // console.log({payload})

    setSubmitting(true)

    // // console.log({data})

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${options?.data?.id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${options?.token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.status == 204 || res.status == 200) {
          alert.success('Facility Updated Successfully')
          setSubmitting(false)

          router.push({
            pathname: '/facilities/facility_changes/[facility_id]/',
            query: {
              facility_id: options?.data?.id
            }
          })

        } else {
          alert.error('Unable to update facility')
          setSubmitting(false)
          res.json()
            .then(resp => {
              const formResponse = []
              setFormError(() => {
                if (typeof resp == 'object') {
                  const respEntry = Object.entries(resp)

                  for (let [_, v] of respEntry) {
                    formResponse.push(v)
                  }

                  return `Error: ${formResponse.join(" ")}`
                }
              })
            })

        }

      }
      )
      .catch(e => {
        setSubmitting(false)

        setFormError(`Error: ${e.message}`)
        console.error(e.message)
      })



  }

  function handeBasicDetailsCreate(e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = Object.fromEntries(formData)

    setSubmitting(true)

    // Persist Data

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${options?.token}`
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => {

        if (res.status == 201 || res.status == 200) {
          setSubmitting(false)
          alert.success('Facility Added Successfully')
        } else {
          setSubmitting(false)
          alert.error('Unable to Add facility')
          res.json()
            .then(resp => {
              const formResponse = []
              setFormError(() => {
                if (typeof resp == 'object') {
                  const respEntry = Object.entries(resp)

                  for (let [_, v] of respEntry) {
                    formResponse.push(v)
                  }

                  return `Error: ${formResponse.join(" ")}`
                }
              })
            })
        }

        setSubmitting(false)

        const facilityData = await res.json()

        const facilityId = facilityData?.id

        setFacilityId(facilityId)

        if (facilityData) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/wards/${facilityData?.ward}/`,
            {
              headers: {
                Authorization: 'Bearer ' + options?.token,
                Accept: 'application/json',
              }
            }
          )
            .then(resp => resp.json())
            .then(async wardData => {
              // console.log(JSON.stringify(data))
              if (wardData) {

                const [lng, lat] = await wardData?.ward_boundary.properties.center.coordinates;

                // console.log([lng, lat])

                const wardGeoData = {
                  geoJSON: JSON.parse(JSON.stringify(wardData?.ward_boundary)),
                  centerCoordinates: JSON.parse(
                    JSON.stringify([lat, lng])
                  )
                }

                // Base64 encode ward data

                const base64EncWardData = Buffer.from(JSON.stringify(wardGeoData)).toString('base64')

                const params = [];

                for (let [k, v] of formData) {
                  if (k == 'facility_checklist_document') {
                    params.push(`${k}=${JSON.stringify(v)}`)
                  }
                  else {

                    params.push(`${k}=${v}`)

                  }
                }

                params.push(`wardData=${base64EncWardData}`)

                const base64EncParams = Buffer.from(params.join('&')).toString('base64')


                router.push({
                  pathname: `${window.location.origin}/facilities/add`,

                  query: {
                    formData: base64EncParams,
                    formId: 1,
                    facilityId: facilityId,
                    from: 'submission'
                  }

                })
                  .then((navigated) => {
                    if (navigated) setFormId(1)
                  })

                // const url = new URL(`${window.location.origin}/facilities/add?formData=${base64EncParams}`)

                // url.searchParams.set('formId', '1')

                // url.searchParams.set('facilityId', `${facilityId}`)

                // url.searchParams.set('from', 'submission')


                // window.location.href = url


              }



            })
        }


      })
      .catch(e => {
        setSubmitting(false)

        setFormError(`Error: ${e.message}`)
        console.error(e.message)
      })



  }

  function handleNumberInputChange(e) {

    // Total Funcational Input Beds validation

    handleFocus(e)


    const number_of_inpatient_beds = Number(document.getElementsByName('number_of_inpatient_beds')[0]?.value)
    const number_of_icu_beds = Number(document.getElementsByName('number_of_icu_beds')[0]?.value)
    const number_of_hdu_beds = Number(document.getElementsByName('number_of_hdu_beds')[0]?.value)
    const number_of_maternity_beds = Number(document.getElementsByName('number_of_maternity_beds')[0]?.value)
    const number_of_emergency_casualty_beds = Number(document.getElementsByName('number_of_emergency_casualty_beds')[0]?.value)

    const totalBeds = number_of_inpatient_beds + number_of_icu_beds + number_of_hdu_beds + number_of_maternity_beds + number_of_emergency_casualty_beds


    setTotalFunctionalBeds(totalBeds)

  }


  // Effects
  useEffect(() => {

    // console.log({facility: options?.data})
    async function updateFacilityTypeDetailOptions() {
      try {
        const facilityTypeDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types_details/?is_parent=false&parent=${e.target.value}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${options?.token}`
          }
        })

        const filteredFacilityType = (await facilityTypeDetails.json())?.results

        if (!filteredFacilityType) throw Error('Unable to Fetch Facility Type Details')


        const facilityType = Array.from(filteredFacilityType, ({ id, name }) => {
          return {
            label: name,
            value: id
          }
        })


        setFacilityTypeDetailOptions(facilityType ?? options?.facility_type_details)

      }
      catch (e) {
        console.error(e.message)
      }
    }

    updateFacilityTypeDetailOptions()

    function getFacilityTypeDetails(facilityTypeId, token) {

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types_details/?is_parent=false&parent=${facilityTypeId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(resp => resp?.results)
        .catch(console.error)

    }

    if (window && !editMode) {
      const path = new URL(window.location.href)

      if (path.searchParams.get('from') == 'previous') {

        const strFormData = Buffer.from(path.searchParams?.get('formData') ?? 'J3t9Jw==', 'base64').toString() ?? "{}"
        const params = new URL(`${window.location.origin}/facilities/add?${strFormData}`).searchParams
        const paramEntries = params.entries()
        const formData = Object.fromEntries(paramEntries)

        // console.log(formData)

        if (facilityId == '') setFacilityId(params?.facilityId)

        delete formData?.facility_checklist_document

        const newOptions = {}

        Object.assign(newOptions, options)

        newOptions['data'] = formData

        for (let [k, v] of Object.entries(newOptions?.data)) {

          if (v == 'on') newOptions.data[k] = true;
          if (v == 'false') newOptions.data[k] = false;
          if (v == 'true') newOptions.data[k] = true;
          if (k.match(/^number_.+/) !== null) newOptions.data[k] = Number(v)

        }

        setOptions(newOptions)
      }

    }
    else if (editMode) {
      getFacilityTypeDetails(options?.data?.facility_type, options?.token)
        .then(facilityTypeDetails => {

          console.log({ facilityTypeDetails })

          const _options = facilityTypeDetails?.map(({ id: value, name: label }) => ({ label, value }))
          setFacilityTypeDetailOptions(_options)
        })
    }

    setIsClient(true)

  }, [])


  if (isClient) {

    return (
      <form name='basic_details_form'
        onSubmit={editMode ? handleBasicDetailsUpdate : handeBasicDetailsCreate}
        className='flex flex-col w-full mt-4 items-start bg-gray-50 p-3 justify-start gap-3'>


        {
          formError && <Alert severity='error' className='w-full border-2 border-red-500 rounded-none'>{formError}</Alert>
        }

        {/* Facility Official Name */}

        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='official_name'
            className='text-gray-600 capitalize text-sm'>
            Facility Official Name
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='text'
            name='official_name'
            defaultValue={options?.data?.official_name ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-gray-50 p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
        </div>

        {/* Facility Unique Name  */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-2'>
          <label
            htmlFor='name'
            className='text-gray-600 capitalize text-sm'>
            Facility Unique Name
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='text'
            name='name'
            defaultValue={options?.data?.name ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />

        </div>

        {/* Facility Type */}
        <div className={`w-full flex flex-col items-start justify-start gap-1 mb-3`}>
          <label
            htmlFor='facility_type'
            className='text-gray-600 capitalize text-sm'>
            Facility Type{' '}
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <CustomSelect
            options={options?.facility_types}
            defaultValue={options?.facility_types?.map(({ value }) => value).includes(options?.data?.facility_type) ? options?.data?.facility_type : (() => {
              return options?.facility_types?.find(({ label }) => label == options?.data?.facility_type_parent)?.value
            })()}
            placeholder="Select a facility type..."
            required
            name='facility_type'
            onChange={handleSelectChange}
            onFocus={handleFocus}

          />

        </div>

        {/* Facility Type Details */}
        <div className={`w-full flex flex-col items-start justify-start gap-1 mb-3`}>
          <label
            htmlFor='facility_type_details'
            className='text-gray-600 capitalize text-sm'>
            Facility Type Details
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>


          <CustomSelect
            options={facilityTypeDetailOptions.length > 0 ? facilityTypeDetailOptions : options?.facility_type_details}
            placeholder="Select facility type details..."
            onChange={handleSelectChange}
            onFocus={handleFocus}
            defaultValue={options?.facility_type_details?.find(({ label }) => label == options?.data?.facility_type_name)?.value}
            required
            name='facility_type_details'

          />


        </div>

        {/* Operation Status*/}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='operation_status'
            className='text-gray-600 capitalize text-sm'>
            Operation Status
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <CustomSelect
            options={options?.operation_status ?? operationStatusOptions}
            placeholder="Select operation status..."
            required
            name='operation_status'
            onFocus={handleFocus}
            defaultValue={options?.data?.operation_status ?? ''}

          />

        </div>

        {/* Date Established */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='date_established'
            className='text-gray-600 capitalize text-sm'>
            Date Established
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            type="date"
            required
            name="date_established"
            onFocus={handleFocus}
            defaultValue={options?.data?.date_established ?? ''}
            className='flex-none w-full bg-transparent p-2 flex-grow placeholder-gray-500 border border-blue-600 focus:shadow-none  focus:border-black outline-none'

          />
        </div>

        {/* Is Facility accredited */}
        <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='accredited_lab_iso_15189'
              className='text-gray-700 capitalize text-sm flex-grow'>
              *Is the facility accredited Lab ISO 15189?{' '}
            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='accredited_lab_iso_15189'
                value={true}
                defaultChecked={options?.data?.accredited_lab_iso_15189 === true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='accredited_lab_iso_15189'
                value={false}
                defaultChecked={options?.data?.accredited_lab_iso_15189 === false}


              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>

        </div>

        {/* Owner Category */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='owner_type'
            className='text-gray-600 capitalize text-sm'>
            Owner Category
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <CustomSelect
            options={options?.owner_types}
            placeholder="Select owner category.."
            onChange={handleSelectChange}
            onFocus={handleFocus}
            required
            name='owner_type'
            defaultValue={options?.data?.owner_type ?? ''}

          />
        </div>

        {/* Owner Details */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='owner'
            className='text-gray-600 capitalize text-sm'>
            Owner Details
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <CustomSelect
            options={ownerTypeDetailsOptions ?? []}
            defaultChecked={options?.data?.owner ?? ''}
            onFocus={handleFocus}
            placeholder="Select owner..."
            required
            name='owner'
            defaultValue={options?.data?.owner ?? ''}

          />
        </div>

        {/* KEPH Level */}
        <div className={`${options?.data ? "cursor-not-allowed" : "cursor-default"} w-full flex flex-col items-start justify-start gap-1 mb-3`}>
          <label
            htmlFor='keph_level'
            className='text-gray-600 capitalize text-sm'>
            KEPH Level
          </label>
          <CustomSelect
            options={options?.keph}
            placeholder="Select a KEPH Level.."
            name='keph_level'
            defaultValue={options?.data?.keph_level ?? ''}
            onFocus={handleFocus}
            disabled={true}
          />
        </div>

        {/* Total Functional In-patient Beds */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_beds'
            className='text-gray-600 capitalize text-sm'>
            Total Functional In-patient Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            readOnly
            type='number'
            min={0}
            name='number_of_beds'
            value={totalFunctionalBeds}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No of General In-patient Beds */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_inpatient_beds'
            className='text-gray-600 capitalize text-sm'>
            Number of General In-patient Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <input
            required
            type='number'
            min={0}
            name='number_of_inpatient_beds'
            onFocus={handleNumberInputChange}
            defaultValue={options?.data?.number_of_inpatient_beds ?? 0}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />

        </div>

        {/* No. Functional cots */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_cots'
            className='text-gray-600 capitalize text-sm'>
            Number of Functional Cots
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_cots'
            onFocus={handleFocus}
            defaultValue={options?.data?.number_of_cots ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />

        </div>

        {/* No. Emergency Casulty Beds */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_emergency_casualty_beds'
            className='text-gray-600 capitalize text-sm'>
            Number of Emergency Casulty Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_emergency_casualty_beds'
            onFocus={handleNumberInputChange}
            defaultValue={options?.data?.number_of_emergency_casualty_beds ?? ''}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No. Intensive Care Unit Beds */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_icu_beds'
            className='text-gray-600 capitalize text-sm'>
            Number of Intensive Care Unit (ICU) Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_icu_beds'
            onFocus={handleNumberInputChange}
            defaultValue={options?.data?.number_of_icu_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No. High Dependency Unit HDU */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_hdu_beds'
            className='text-gray-600 capitalize text-sm'>
            Number of High Dependency Unit (HDU) Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_hdu_beds'
            onFocus={handleNumberInputChange}
            defaultValue={options?.data?.number_of_hdu_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No. of maternity beds */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_maternity_beds'
            className='text-gray-600 capitalize text-sm'>
            Number of Maternity Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_maternity_beds'
            onFocus={handleNumberInputChange}
            defaultValue={options?.data?.number_of_maternity_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No. of Isolation Beds */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_isolation_beds'
            className='text-gray-600 capitalize text-sm'>
            Number of Isolation Beds
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_isolation_beds'
            onFocus={handleFocus}
            defaultValue={options?.data?.number_of_isolation_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No. of General Theatres */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_general_theatres'
            className='text-gray-600 capitalize text-sm'>
            Number of General Theatres
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <input
            required
            type='number'
            min={0}
            name='number_of_general_theatres'
            onFocus={handleFocus}
            defaultValue={options?.data?.number_of_general_theatres ?? ''}

            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />


        </div>

        {/* No. of Maternity Theatres */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_maternity_theatres'
            className='text-gray-600 capitalize text-sm'>
            Number of Maternity Theatres
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='number'
            min={0}
            name='number_of_maternity_theatres'
            onFocus={handleFocus}
            defaultValue={options?.data?.number_of_maternity_theatres ?? ''}
            className='flex-none w-full  bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />

        </div>

        {/* Facility Catchment Population */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='facility_catchment_population'
            className='text-gray-600 capitalize text-sm'>
            Facility Catchment Population
            <span className='text-medium leading-12 font-semibold'>
              {' '}

            </span>
          </label>
          <input
            type='number'
            min={0}
            name='facility_catchment_population'
            onFocus={handleFocus}
            defaultValue={options?.data?.facility_catchment_population ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />

        </div>

        {/* Is Reportsing DHIS2 */}
        <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='reporting_in_dhis'
              className='text-gray-700 capitalize text-sm flex-grow'>
              *Should this facility have reporting in DHIS2?{' '}

            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='reporting_in_dhis'
                onFocus={handleFocus}
                defaultChecked={options?.data?.reporting_in_dhis == true}
                value={true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='reporting_in_dhis'
                onFocus={handleFocus}
                defaultChecked={options?.data?.reporting_in_dhis == false}
                value={false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>

        </div>

        {/* Facility Admissions */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='admission_status'
            className='text-gray-600 capitalize text-sm'>
            Facility admissions
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <CustomSelect
            options={options?.facility_admission_status}
            required
            placeholder='Select an admission status..'
            name='admission_status'
            onFocus={handleFocus}
            defaultValue={options?.data?.admission_status ?? ''}
          />

        </div>

        {/* Is NHIF accredited */}
        <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='nhif_accreditation'
              className='text-gray-700 capitalize text-sm flex-grow'>
              *Does this facility have NHIF accreditation?{' '}


            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='nhif_accreditation'
                onFocus={handleFocus}
                defaultChecked={options?.data?.nhif_accreditation == true}
                value={true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='nhif_accreditation'
                onFocus={handleFocus}
                defaultChecked={options?.data?.nhif_accreditation == false}
                value={false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>

        </div>

        {/* Armed Forces Facilities */}
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transaprent h-auto'>
          <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
            Armed Forces Facilities
          </h4>
          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='is_classified'
              className='text-gray-700 capitalize text-sm flex-grow'>
              {' '}
              Is this an Armed Force facility?{' '}
            </label>
            <input
              type="checkbox"
              name='is_classified'
              onFocus={handleFocus}
              defaultChecked={options?.data?.is_classified ?? false}
            />
          </div>

        </div>

        {/* Hours/Days of Operation */}
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transaprent h-auto'>
          <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
            Hours/Days of Operation
          </h4>
          <div className='w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3'>

            <input
              type='checkbox'
              name='open_whole_day'
              onFocus={handleFocus}
              defaultChecked={options?.data?.open_whole_day ?? false}

            />
            <label
              htmlFor='open_24hrs'
              className='text-gray-700 capitalize text-sm flex-grow'>
              {' '}
              Open 24 hours
            </label>
          </div>

          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <input
              type='checkbox'
              name='open_late_night'
              onFocus={handleFocus}
              defaultChecked={options?.data?.open_late_night ?? false}

            />
            <label
              htmlFor='open_late_night'
              className='text-gray-700 capitalize text-sm flex-grow'>
              {' '}
              Open Late Night
            </label>
          </div>

          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <input
              type='checkbox'
              name='open_public_holidays'
              onFocus={handleFocus}
              defaultChecked={options?.data?.open_public_holidays ?? false}

            />
            <label
              htmlFor='open_public_holidays'
              className='text-gray-700 capitalize text-sm flex-grow'>
              {' '}
              Open on public holidays
            </label>
          </div>

          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <input
              type='checkbox'
              name='open_weekends'
              onFocus={handleFocus}
              defaultChecked={options?.data?.open_weekends ?? false}

            />
            <label
              htmlFor='open_weekends'
              className='text-gray-700 capitalize text-sm flex-grow'>
              {' '}
              Open during weekends
            </label>
          </div>

          <div className='w-full flex flex-row items-center px-2 justify-start gap-1 gap-x-3 mb-3'>
            <input
              type='checkbox'
              name='open_normal_day'
              onFocus={handleFocus}
              defaultChecked={options?.data?.open_normal_day ?? false}

            />
            <label
              htmlFor='open_normal_day'
              className='text-gray-700 capitalize text-sm flex-grow'>
              {' '}
              Open from 8am to 5pm
            </label>
          </div>
        </div>


        {/* Location Details */}
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-blue-600 bg-transaprent h-auto'>
          <h4 className='text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900'>
            Location Details
          </h4>
          <div className='grid grid-cols-4 place-content-start gap-3 w-full'>
            {/* County  */}
            <div className='col-start-1 col-span-1'>
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>



                <label
                  htmlFor='county_id'
                  className='text-gray-600 capitalize text-sm'>
                  County
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <CustomSelect
                  options={options?.counties} // 
                  required
                  placeholder="Select County ..."
                  defaultValue={options?.data?.county_id ?? ''}
                  onChange={handleSelectChange}
                  onFocus={handleFocus}
                  name='county_id'

                />


              </div>
            </div>

            {/* Sub-county */}
            <div className='col-start-2 col-span-1'>
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='sub_county_id'
                  className='text-gray-600 capitalize text-sm'
                >
                  Sub-county
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <CustomSelect
                  options={subCountyOptions ?? []}
                  required
                  placeholder="Select Sub County..."
                  defaultValue={options?.data?.sub_county_id ?? ''}
                  onChange={handleSelectChange}
                  onFocus={handleFocus}
                  name='sub_county_id'


                />

              </div>
            </div>

            {/* Constituency */}
            <div className='col-start-3 col-span-1'>
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='constituency_id'
                  className='text-gray-600 capitalize text-sm'>
                  Constituency
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <CustomSelect
                  options={constituencyOptions ?? []}
                  required
                  placeholder="Select Constituency..."
                  // onChange={handleSelectChange}
                  onFocus={handleFocus}
                  defaultValue={options?.data?.constituency_id ?? ''}
                  name='constituency_id'


                />


              </div>
            </div>

            {/* Ward */}
            <div className='col-start-4 col-span-1'>
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='ward'
                  className='text-gray-600 capitalize text-sm'>
                  Ward
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>

                <CustomSelect
                  options={wardOptions ?? []}
                  required
                  placeholder="Select Ward ..."
                  defaultValue={options?.data?.ward ?? ''}
                  onFocus={handleFocus}
                  name='ward'

                />


              </div>
            </div>



          </div>


        </div>

        {/* Nearest Town/Shopping Centre */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='town_name'
            className='text-gray-600 capitalize text-sm'>
            Nearest Town/Shopping Centre
            <span className='text-medium leading-12 font-semibold'>
              {' '}

            </span>
          </label>
          <input

            type='text'
            name='town_name'
            defaultValue={options?.data?.town_name ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
        </div>

        {/* Plot Number */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='plot_number'
            className='text-gray-600 capitalize text-sm'>
            Plot number
            <span className='text-medium leading-12 font-semibold'>
              {' '}

            </span>
          </label>
          <input

            type='text'
            name='plot_number'
            defaultValue={options?.data?.plot_number ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
        </div>

        {/* Nearest landmark */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='nearest_landmark'
            className='text-gray-600 capitalize text-sm'>
            Nearest landmark
            <span className='text-medium leading-12 font-semibold'>
              {' '}

            </span>
          </label>
          <input

            type='text'
            name='nearest_landmark'
            defaultValue={options?.data?.nearest_landmark ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
        </div>

        {/* Location Description */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='location_desc'
            className='text-gray-600 capitalize text-sm'>
            location description
            <span className='text-medium leading-12 font-semibold'>
              {' '}

            </span>
          </label>
          <input

            type='text'
            name='location_desc'
            defaultValue={options?.data?.location_desc ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
        </div>


        {/* check file upload */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='facility_checklist_document'
            className='text-gray-600 capitalize text-sm'>
            checklist file upload

          </label>

          <input
            type='file'
            name='facility_checklist_document'
            defaultValue={options?.data?.facility_checklist_document ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />



        </div>


        {/* Cancel & Geolocation */}
        {
          editMode ?

            <div className='flex justify-end items-center w-full'>
              <button
                type='submit'
                disabled={submitting}
                className={`flex items-center ${submitting ? 'justify-center' : 'justify-start'} space-x-2 bg-blue-700  p-1 px-2`}>
                <span className='text-medium font-semibold text-white'>
                  {
                    submitting ?
                      <div className='flex items-center gap-2'>
                        <span className='text-white'>Saving.. </span>
                        <Spinner />
                      </div>
                      :
                      'Save & Finish'

                  }
                </span>
                {/* <ChevronDoubleRightIcon className='w-4 h-4 text-white' /> */}
              </button>
            </div>

            :

            <div className='flex justify-between items-center w-full'>
              <button className='flex items-center justify-start space-x-2 p-1 border border-blue-900  px-2'>
                <ChevronDoubleLeftIcon className='w-4 h-4 text-blue-900' />
                <span className='text-medium font-semibold text-blue-900 '>
                  Cancel
                </span>
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='flex items-center justify-start gap-2 text-white bg-blue-700  p-1 px-2'>
                <span className='text-medium font-semibold text-white'>
                  {
                    submitting ?
                      <Spinner />
                      :
                      'Geolocation'

                  }
                </span>
                {
                  submitting ?
                    <span className='text-white'>Saving </span>
                    :
                    <ChevronDoubleRightIcon className='w-4 h-4 text-white' />

                }
              </button>
            </div>
        }

      </form>

    )
  } else {
    return null
  }



}