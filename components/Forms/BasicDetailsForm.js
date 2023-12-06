// @refresh


import { useContext, useEffect, useState } from 'react';
import Select from './formComponents/FromikSelect';
import { FormOptionsContext } from '../../pages/facilities/add';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert';
// import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
// import { FacilityIdContext, FormContext } from './Form';


export function BasicDeatilsForm({ mode }) {

  const alert = useAlert();

  const options = useContext(FormOptionsContext);


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
  const [isClient, setIsClient] = useState(false)
  const [totalFunctionalBeds, setTotalFunctionalBeds] = useState(0)

  // Options

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
      else if (facilityTypeLabel.includes('STAND ALONE  ')) {
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

    // console.log({data})

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${options?.data?.id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${options?.token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status == 204 || res.status == 200) {
          alert.success('Facility Updated Successfully')
        } else {
          alert.error('Unable to update facility')
        }
      })



  }


  function handeBasicDetailsCreate(e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = Object.fromEntries(formData)

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${options?.token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status == 201 || res.status == 200) {
          alert.success('Facility Added Successfully')
        } else {
          alert.error('Unable to Add facility')
        }
      })


  }

  function handleInputChange(e) {

    // Total Funcational Input Beds validation
    
    if(e.target.value) {

      const number_of_inpatient_beds = Number(document.getElementsByName('number_of_inpatient_beds')[0]?.value) 
      const number_of_icu_beds = Number(document.getElementsByName('number_of_icu_beds')[0]?.value)
      const number_of_hdu_beds = Number(document.getElementsByName('number_of_hdu_beds')[0]?.value)
      const number_of_maternity_beds = Number(document.getElementsByName('number_of_maternity_beds')[0]?.value)
      const number_of_emergency_casualty_beds = Number(document.getElementsByName('number_of_emergency_casualty_beds')[0]?.value)
      
      const totalBeds = number_of_inpatient_beds + number_of_icu_beds + number_of_hdu_beds + number_of_maternity_beds + number_of_emergency_casualty_beds

      setTotalFunctionalBeds(totalBeds)
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])




  if (isClient) {
    return (
      <form name='basic_details_form'
        defaultValue={options?.data?.basic_details_form ?? ''}
        onSubmit={mode ? handleBasicDetailsUpdate : handeBasicDetailsCreate}
        className='flex flex-col w-full mt-4 items-start bg-blue-50 shadow-md p-3 justify-start gap-3'>

        {/* Facility Official Name */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='official_name'
            className='text-gray-600 capitalize text-sm'>
            Facility Official Name (Test)
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
            className='flex-none w-full bg-blue-50 p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.official_name && <span className='font-normal text-sm text-red-500 text-start'>{errors.official_name}</span>} */}
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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.name && <span className='font-normal text-sm text-red-500 text-start'>{errors.name}</span>} */}

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

          <Select
            options={options?.facility_types}
            defaultValue={(() => {
              return options?.facility_types?.find(({ label }) => {

                // console.log({label, facility_type_parent: options?.data?.facility_type_parent})
                return label == options?.data?.facility_type_parent
              })?.value ?? ''
            })() ?? ''}
            placeholder="Select a facility type..."
            required
            name='facility_type'
            onChange={handleSelectChange}

          />
          {/* {errors.facility_type && <span className='font-normal text-sm text-red-500 text-start'>{errors.facility_type}</span>} */}

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


          <Select

            options={facilityTypeDetailOptions ?? []}
            placeholder="Select facility type details..."
            onChange={handleSelectChange}
            defaultValue={options?.data?.facility_type}
            required
            name='facility_type_details'

          />
          {/* {errors.facility_type_details && <span className='font-normal text-sm text-red-500 text-start'>{errors.facility_type_details}</span>} */}


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
          <Select
            options={operationStatusOptions ?? options?.operation_status}
            placeholder="Select operation status..."
            required
            name='operation_status'
            defaultValue={options?.data?.operation_status ?? ''}

          />
      
          {/* {errors.operation_status && <span className='font-normal text-sm text-red-500 text-start'>{errors.operation_status}</span>} */}
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
            defaultValue={options?.data?.date_established ?? ''}
            className='flex-none w-full bg-transparent p-2 flex-grow placeholder-gray-500 border border-blue-600 focus:shadow-none  focus:border-black outline-none'

          />
          {/* {errors.date_established && <span className='font-normal text-sm text-red-500 text-start'>{errors.collection_date}</span>} */}
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
          {/* {errors.accredited_lab_iso_15189 && <span className='font-normal text-sm text-red-500 text-start'>{errors.accredited_lab_iso_15189}</span>} */}

        </div>
        {/* Owner Category */}
        {/* { console.log({owner_types: options?.owner_types})} */}
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
          <Select
            options={options?.owner_types}
            placeholder="Select owner category.."
            onChange={handleSelectChange}
            required
            name='owner_type'
            defaultValue={options?.data?.owner_type ?? ''}

          />
          {/* {errors.owner_type && <span className='font-normal text-sm text-red-500 text-start'>{errors.owner_type}</span>} */}
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
          <Select
            options={ownerTypeDetailsOptions ?? []}
            defaultChecked={options?.data?.owner ?? ''}
            placeholder="Select owner..."
            required
            name='owner'
            defaultValue={options?.data?.owner ?? ''}

          />
          {/* {errors.owner && <span className='font-normal text-sm text-red-500 text-start'>{errors.owner}</span>} */}
        </div>

        {/* KEPH Level */}
        <div className={`${options?.data ? "cursor-not-allowed" : "cursor-default"} w-full flex flex-col items-start justify-start gap-1 mb-3`}>
          <label
            htmlFor='keph_level'
            className='text-gray-600 capitalize text-sm'>
            KEPH Level
          </label>
          <Select
            options={options?.keph}
            placeholder="Select a KEPH Level.."
            name='keph_level'
            defaultValue={options?.data?.keph_level ?? ''}
            disabled={options?.data ? true : false}

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

            type='number'
            min={0}
            name='number_of_beds'
            defaultValue={totalFunctionalBeds ?? options?.data?.number_of_beds ?? 0}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_beds}</span>} */}


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
            onChange={handleInputChange}
            defaultValue={options?.data?.number_of_inpatient_beds ?? 0}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_inpatient_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_inpatient_beds}</span>} */}

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
            defaultValue={options?.data?.number_of_cots ?? 0}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_cots && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_cots}</span>} */}

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
            onChange={handleInputChange}
            defaultValue={options?.data?.number_of_emergency_casualty_beds ?? 0}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_emergency_casualty_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_emergency_casualty_beds}</span>} */}


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
            onChange={handleInputChange}
            defaultValue={options?.data?.number_of_icu_beds ?? 0}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_icu_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_icu_beds}</span>} */}


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
            onChange={handleInputChange}
            defaultValue={options?.data?.number_of_hdu_beds ?? 0}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_hdu_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_hdu_beds}</span>} */}


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
            onChange={handleInputChange}
            defaultValue={options?.data?.number_of_maternity_beds ?? 0}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_maternity_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_maternity_beds}</span>} */}


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
            defaultValue={options?.data?.number_of_isolation_beds ?? 0}

            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_isolation_beds && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_isolation_beds}</span>} */}


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
            defaultValue={options?.data?.number_of_general_theatres ?? 0}

            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_general_theatres && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_general_theatres}</span>} */}


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
            defaultValue={options?.data?.number_of_maternity_theatres ?? 0}
            className='flex-none w-full  bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
          {/* {errors.number_of_maternity_theatres && <span className='font-normal text-sm text-red-500 text-start'>{errors.number_of_maternity_theatres}</span>} */}

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
            defaultValue={options?.data?.facility_catchment_population ?? 0}
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
                defaultChecked={options?.data?.reporting_in_dhis == true}
                value={true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='reporting_in_dhis'
                defaultChecked={options?.data?.reporting_in_dhis == false}
                value={false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>
          {/* {errors.reporting_in_dhis && <span className='font-normal text-sm text-red-500 text-start'>{errors.reporting_in_dhis}</span>} */}

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

          <Select
            options={options?.facility_admission_status}
            required
            placeholder='Select an admission status..'
            name='admission_status'
            defaultValue={options?.data?.admission_status ?? ''}
          />
          {/* {errors.admission_status && <span className='font-normal text-sm text-red-500 text-start'>{errors.admission_status}</span>} */}

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
                defaultChecked={options?.data?.nhif_accreditation == true}
                value={true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='nhif_accreditation'
                defaultChecked={options?.data?.nhif_accreditation == false}
                value={false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>
          {/* {errors.nhif_accreditation && <span className='font-normal text-sm text-red-500 text-start'>{errors.nhif_accreditation}</span>} */}

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

                {/* {console.log({counties: sortOptions(options?.counties})} */}

                <label
                  htmlFor='county_id'
                  className='text-gray-600 capitalize text-sm'>
                  County
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Select
                  options={options?.counties} // 
                  required
                  placeholder="Select County ..."
                  defaultValue={options?.data?.county_id ?? ''}
                  onChange={handleSelectChange}
                  name='county_id'

                />
                {/* {errors.county_id && <span className='font-normal text-sm text-red-500 text-start'>{errors.county_id}</span>} */}

              </div>
            </div>

            {/* Sub-county */}
            <div className='col-start-2 col-span-1'>
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='sub_county_id'
                  className='text-gray-600 capitalize text-sm'>
                  Sub-county
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Select
                  options={subCountyOptions ?? []}
                  required
                  placeholder="Select Sub County..."
                  defaultValue={options?.data?.sub_county_id ?? ''}
                  onChange={handleSelectChange}
                  name='sub_county_id'


                />
                {/* {errors.sub_county_id && <span className='font-normal text-sm text-red-500 text-start'>{errors.sub_county_id}</span>} */}
              </div>
            </div>

            {/* Constituency */}
            <div className='col-start-3 col-span-1'>
              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                <label
                  htmlFor='c'
                  className='text-gray-600 capitalize text-sm'>
                  Constituency
                  <span className='text-medium leading-12 font-semibold'>
                    {' '}
                    *
                  </span>
                </label>
                <Select
                  options={constituencyOptions ?? []}
                  required
                  placeholder="Select Constituency..."
                  // onChange={handleSelectChange}
                  defaultValue={options?.data?.constituency_id ?? ''}
                  name='constituency_id'


                />
                {/* {errors.constituency_id && <span className='font-normal text-sm text-red-500 text-start'>{errors.constituency_id}</span>} */}

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
                {/* {JSON.stringify(wardOptions)} */}
                <Select
                  options={wardOptions ?? []}
                  required
                  placeholder="Select Ward ..."
                  defaultValue={options?.data?.ward ?? ''}
                  name='ward'

                />
                {/* {errors.ward && <span className='font-normal text-sm text-red-500 text-start'>{errors.ward}</span>} */}

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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:border-black outline-none'
          />
        </div>


        {/* check file upload */}
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-300/70 bg-transparent border-blue-600 h-auto'>
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

            {/* {errors.facility_checklist_document && <span className='font-normal text-sm text-red-500 text-start'>{errors.facility_checklist_document}</span>} */}

          </div>
        </div>


        {/* Cancel & Geolocation */}
        {
          mode ?

            <div className='flex justify-end items-center w-full'>
              <button
                type='submit'
                className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                <span className='text-medium font-semibold text-white'>
                  Save & Finish
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
                className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                <span className='text-medium font-semibold text-white'>
                  Geolocation
                </span>
                <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
              </button>
            </div>
        }

      </form>
    )
  } else {
    return null
  }



}