// @refresh

"use client"

import { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
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


export function BasicDeatilsForm({ editMode }) {

  // Context
  const setFormId = useContext(UpdateFormIdContext)

  // Constants
  const alert = useAlert();
  const router = useRouter()

  // State
  const [isClient, setIsClient] = useState(false)
  const [totalFunctionalBeds, setTotalFunctionalBeds] = useState(0)
  const [isFieldValidationError, setIsFieldValdiationError] = useState(false)
  const [dateValidationError, setDateValidationError] = useState({date_established: null})
  

  const submitType = useRef(null)

  const [__, setFacilityId] = useMemo(() => {
    
    let id = ''

    function setId(_id) {
        id = _id
    }

    if(window) {
        setId(new URL(window.location.href).searchParams.get('facilityId') ?? '')
    }


    return [id, setId]
}, [])

  const [submitting, setSubmitting] = useState(false);
  const [_, setTouchedFields] = useState([]);
  const [formError, setFormError] = useState(null);


  // Options
  const formContext = useContext(FormOptionsContext);
  const [options, setOptions] = useState(formContext)
  const [facilityTypeDetailOptions, setFacilityTypeDetailOptions] = useState(options?.facility_type_details)
  const [countyId, setCountyId] = useState(options?.data?.county_id)
  const [ownerTypeDetailsOptions, setOwnerTypeDetailsOptions] = useState(Array.from(options?.owners ?? [], o => {
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

  const facilityTypeValue = options?.facility_types?.find(({label}) => label?.toLowerCase().trim() == options?.data?.facility_type_parent?.toLowerCase().trim())?.value
  
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

  async function setFilteredOptions(countyId, selectName) {
    if(countyId === options?.data?.county_id) {
      try {
      const sub_counties = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/sub_counties/?county=${countyId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${options?.token}`
        }
      })

      const constituencies = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/constituencies/?county=${countyId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${options?.token}`
        }
      })


      const wards = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/wards/?county=${countyId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${options?.token}`
        }
      })

          const _sub_counties = (await sub_counties.json())?.results

          if (!_sub_counties) throw Error('Unable to Fetch sub counties')


      
          const _constitutencies = (await constituencies.json())?.results

          if (!constituencies) throw Error('Unable to Fetch sub counties')


          const _wards = (await wards.json())?.results

          if (!_wards) throw Error('Unable to Fetch sub counties')



        if(selectName === "sub_county_id") setSubCountyOptions(() => _sub_counties?.map(({id, name}) => ({value:id, label:name})))

        if(selectName === "constituency_id") setConstituencyOptions(() => _constitutencies?.map(({id, name}) => ({value:id, label:name})))

        if(selectName === "ward") setWardOptions(() => _wards?.map(({id, name}) => ({value:id, label:name})))


      } catch(e) {
          if(e instanceof TypeError){
            console.error(`Error: ${e.message}`)
          } else if(typeof e === 'string') {
            console.error(e)
          } else {
            console.error(e)
          }
      }
   }
  
  }

  // Event handlers
  const handleFocus = useCallback((e) => {

    if(editMode){
      setFilteredOptions(countyId, e.currentTarget.name)
    } 
    
    if(!editMode) {
      if(e.currentTarget.name === 'sub_county_id' && !countyId) setSubCountyOptions([])
      if(e.currentTarget.name === 'constituency_id' && !countyId) setConstituencyOptions([])
      if(e.currentTarget.name === 'ward' && !countyId) setWardOptions([])
    }

    setTouchedFields(touchedFields => {
      return [...touchedFields, e.target.name]
    })
  })

  // const handleDateChange = useCallback((e) => {

  //   e.preventDefault()

  //   if (e.currentTarget.name == "date_established") {
  //     setDateValidationError(prev => ({ ...prev, date_established: null }))
  //   } 
  //   const today = new Date()

  //   const setDate = e.currentTarget.valueAsDate

  //   if (setDate > today) {
  //     if (e.currentTarget.name == "date_established") {
  //       setDateValidationError(prev => ({ ...prev, date_established: 'Date Established cannot be in the future' }))
  //     } 

  //     e.currentTarget.value = ''

  //   }
  // })


  const handleSelectChange = useCallback(async (e) => {

    const keph = document.getElementsByName('keph_level');
    const kephDisplay = document.getElementsByName('keph_level_display');


    if(e.currentTarget.name === 'county_id') {
      setCountyId(e.currentTarget.value)
      // Filter sub county, constituency and ward Options in edit mode
    }



    // Handle facility Type Change
    if (e.target.name == 'facility_type_parent') {

      // Keph form validation
      const facilityTypeLabel = e.target.selectedOptions[0].innerText

      if (facilityTypeLabel.includes('DISPENSARY')) {

        console.log(keph[0]?.textContent)
        kephDisplay[0]['value'] = 'Level 2'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 2')?.value;

      } else if (facilityTypeLabel.includes('MEDICAL CENTER')) {
        kephDisplay[0]['value'] = 'Level 3'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 3')?.value;

      }
      else if (facilityTypeLabel.includes('HEALTH CENTRE')) {
        kephDisplay[0]['value'] = 'Level 3'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 3')?.value;

      }
      else if (facilityTypeLabel.includes('MEDICAL CLINIC')) {
        kephDisplay[0]['value'] = 'Level 2'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 2')?.value;

      }
      else if (facilityTypeLabel.includes('NURSING HOME')) {
        kephDisplay[0]['value'] = 'Level 3'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 3')?.value;

      }
      else if (facilityTypeLabel.includes('STAND ALONE')) {
        kephDisplay[0]['value'] = 'Level 2'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 2')?.value;

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


    } else if (e.target.name == 'facility_type') {



      const facilityTypeLabel = e.target.selectedOptions[0].innerText

      if (facilityTypeLabel.trim().toLowerCase() == 'Comprehensive Teaching & Tertiary Referral Hospital'.trim().toLowerCase()) {
        kephDisplay[0]['value'] = 'Level 6'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 6')?.value;

      } else if (facilityTypeLabel.trim().toLowerCase() == 'Specialized & Tertiary Referral hospitals'.trim().toLowerCase()) {
        kephDisplay[0]['value'] = 'Level 6'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 6')?.value;

      } else if (facilityTypeLabel.trim().toLowerCase() == 'Secondary care hospitals'.trim().toLowerCase()) {
        kephDisplay[0]['value'] = 'Level 5'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 5')?.value;

      }
      else if (facilityTypeLabel.trim().toLowerCase() == 'Primary care hospitals'.trim().toLowerCase()) {
        kephDisplay[0]['value'] = 'Level 4'
        keph[0]['value'] = options?.keph.find(({ label }) => label == 'Level 4')?.value;

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
  })


  const handleBasicDetailsUpdate = useCallback((e) => {

    e.preventDefault()

    const formData = new FormData(e.target)

    const data = Object.fromEntries(formData)


    setSubmitting(true)

    // // console.log({data})

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${options?.data?.id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${options?.token}`
      },
      body: JSON.stringify(data/*payload*/)
    })
      .then(res => {
        if (res.ok) {
          alert.success('Facility Updated Successfully')
          setSubmitting(false)

          if(submitType.current == null){
            router.push({
              pathname: '/facilities/facility_changes/[facility_id]/',
              query: {
                facility_id: options?.data?.id
              }
            })
          } 

        } else {
          alert.error('Unable to update facility')
          setSubmitting(false)
          res.json()
            .then(resp => {
              const formResponse = []
              setFormError(() => {
                if (typeof resp == 'object') {
                  const respEntry = Object.entries(resp)

                  for (let [k, v] of respEntry) {
                    formResponse.push(`${k}:${v}`)
                  }

                  return `Error: ${formResponse.join("; ")}`
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



  })


  const handeBasicDetailsCreate = useCallback((e) => {

    e.preventDefault()

    const formData = new FormData(e.target)

    let data = Object.fromEntries(formData)

    data['facility_catchment_population'] = data?.facility_catchment_population === '' ? null : data?.facility_catchment_population

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

        if (res.ok) {
          setSubmitting(false)
          alert.success('Facility Added Successfully')

          if(window) {
            const base64BasicDetilsFormData = Buffer.from(JSON.stringify(data)).toString('base64')
            window.localStorage.setItem('basic_details', base64BasicDetilsFormData)
          }

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

        setFacilityId(facilityId ?? null)

        if (facilityData) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/wards/${facilityData?.ward}`,
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

                

                
                // params.push(`wardData=${base64EncWardData}`)
                
                if(window) {
                  window.localStorage.setItem('ward_data', base64EncWardData  )
                }

                // const base64EncParams = Buffer.from(params.join('&')).toString('base64')


                router.push({
                  pathname: `${window.location.origin}/facilities/add`,

                  query: {
                    wardData: base64EncWardData,
                    formId: 1,
                    facilityId,
                    from: 'submission'
                  }

                })
                  .then((navigated) => {
                    if (navigated) setFormId(1)
                  })

              }



            })
        }


      })
      .catch(e => {
        setSubmitting(false)

        setFormError(`Error: ${e.message}`)
        console.error(e.message)
      })



  })

  const handleNumberInputChange = useCallback((e) => {

    // Total Funcational Input Beds validation

    

    const number_of_inpatient_beds = Number(document.getElementsByName('number_of_inpatient_beds')[0]?.value)
    const number_of_icu_beds = Number(document.getElementsByName('number_of_icu_beds')[0]?.value)
    const number_of_hdu_beds = Number(document.getElementsByName('number_of_hdu_beds')[0]?.value)
    const number_of_maternity_beds = Number(document.getElementsByName('number_of_maternity_beds')[0]?.value)
    const number_of_isolation_beds = Number(document.getElementsByName('number_of_isolation_beds')[0]?.value)
    // const number_of_emergency_casualty_beds = Number(document.getElementsByName('number_of_emergency_casualty_beds')[0]?.value)

    const totalBeds = number_of_inpatient_beds + number_of_icu_beds + number_of_hdu_beds + number_of_maternity_beds + number_of_isolation_beds


    setTotalFunctionalBeds(totalBeds)

  })


  // Effects
  useEffect(() => {

    // console.log({facility: options?.data})
     async function updateFacilityTypeDetailOptions(e) {
      try {
        const facilityTypeDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types_details/?is_parent=false`, {
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
        console.error(e?.message)
      }
    }

     updateFacilityTypeDetailOptions()

    function getFacilityTypeDetailsParent(facilityTypeId, token) {

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types_details/?id=${facilityTypeId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(resp => resp?.results)
        .catch(console.error)

    }

    
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
    /**
     * 
     * @param {string} countyId
     */

 

    if (window && !editMode) {
      const path = new URL(window.document.location.href)

      if (path.searchParams.get('from') == 'previous') {

        
        const previousFormData = window.localStorage.getItem('basic_details')
    
        if (previousFormData !== null) {
    
          const formData = Buffer.from(previousFormData ?? 'e30=', 'base64').toString()

          const data = JSON.parse(formData)


        
        delete formData?.facility_checklist_document

        const newOptions = {}

        Object.assign(newOptions, options)

        newOptions['data'] = data // ?? _formData

        for (let [k, v] of Object.entries(newOptions?.data)) {

          if (v == 'on') newOptions.data[k] = true;
          if (v == 'false') newOptions.data[k] = false;
          if (v == 'true') newOptions.data[k] = true;
          if (k.match(/^number_.+/) !== null) newOptions.data[k] = Number(v)

        }

        setOptions(newOptions)

        let parent = "";
      
      getFacilityTypeDetailsParent(options?.data?.facility_type, options?.token)
        .then(facilityTypeDetails => {

          parent=facilityTypeDetails[0]?.parent; 
          if(parent)
          {
            document.getElementsByName('facility_type_parent')[0].value = parent.toString();
           }
         })

        getFacilityTypeDetails(parent, options?.token)
        .then(facilityTypeDetails => {

           const _options = facilityTypeDetails?.map(({ id: value, name: label }) => ({ label, value }))

          setFacilityTypeDetailOptions(_options)
        })

      }

      }


    }
    else if (editMode) {

      let parent = "";

    
      
      getFacilityTypeDetailsParent(options?.data?.facility_type, options?.token)
        .then(facilityTypeDetails => {

          if(facilityTypeDetails) {

          parent=facilityTypeDetails[0]?.parent; 
          if(parent)
          {
            const facilityTypeParent = document.getElementsByName('facility_type_parent')
            if(facilityTypeParent) facilityTypeParent["value"] = parent;
            // console.log({typeParent: facilityTypeParent["value"]})

          }
         }
        }
        )

        getFacilityTypeDetails(parent, options?.token)
        .then(facilityTypeDetails => {
          if(facilityTypeDetails) {

           const _options = facilityTypeDetails?.map(({ id: value, name: label }) => ({ label, value }))

          setFacilityTypeDetailOptions(_options)
        }
      }
      )


   
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
            className='flex-none w-full bg-gray-50 p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
          {
          isFieldValidationError &&
          <span className="tooltiptext">Facility Unique Name cannot be more than 50 characters</span>
          }

          <input
            required
            type='text'
            name='name'
            pattern={'^.{0,50}$'}
            onChange={e => e.currentTarget.value.match(e.currentTarget.pattern) !== null ? setIsFieldValdiationError(false) : setIsFieldValdiationError(true)}
            defaultValue={options?.data?.name ?? ''}
            onFocus={handleFocus}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />



        </div>

        {/* Facility Type */}
        <div className={`w-full flex flex-col items-start justify-start gap-1 mb-3`}>
         
          <label
            htmlFor='facility_type_parent' // facility_type
            className='text-gray-600 capitalize text-sm'>
            Facility Type{' '}
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <CustomSelect
            options={options?.facility_types}
            defaultValue={facilityTypeValue ?? ''}
            placeholder="Select a facility type..."
            required
            name='facility_type_parent' // facility_type
            onChange={handleSelectChange}
            onFocus={handleFocus}
            

          />

        </div>

        {/* Facility Type Details */}
        <div className={`w-full flex flex-col items-start justify-start gap-1 mb-3`}>
          <label
            htmlFor='facility_type' // facility_type_details
            className='text-gray-600 capitalize text-sm'>
            Facility Type Details
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>


          <CustomSelect
            options={facilityTypeDetailOptions}
            placeholder="Select facility type details..."
            onChange={handleSelectChange}
            onFocus={handleFocus}
            defaultValue={options?.data?.facility_type ?? '' /*options?.facility_type_details?.find(({ label }) => label == options?.data?.facility_type_name)?.value*/}
            required
            name='facility_type' // facility_type_details

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
            onChange={handleNumberInputChange}
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
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.date_established ?? ''}
            className='flex-none w-full bg-transparent p-2 flex-grow placeholder-gray-500 border border-gray-400 rounded focus:shadow-none  focus:border-black outline-none'

          />
          <p className='text-red-500 text-sm'>{dateValidationError.date_established ?? ''}</p>
        </div>

         {/* Out reach services */}
         <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='out_reach_services'
              className='text-gray-700 capitalize text-sm flex-grow'>
              Does the Facility have Out-reach services (mobile){' '}
            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='out_reach_services'
                className='w-4 aspect-square'
                value={true}
                defaultChecked={options?.data?.out_reach_services === true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='out_reach_services'
                className='w-4 aspect-square'
                value={false}
                defaultChecked={options?.data?.out_reach_services === false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>

        </div>

        {/* Is Facility accredited */}
        <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='accredited_lab_iso_15189'
              className='text-gray-700 capitalize text-sm flex-grow'>
              *Is the facility accredited Lab ISO 15189?{' '}
            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='accredited_lab_iso_15189'
                className='w-4 aspect-square'
                value={true}
                defaultChecked={options?.data?.accredited_lab_iso_15189 === true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='accredited_lab_iso_15189'
                className='w-4 aspect-square'
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
            onFocus={handleFocus}
            onChange={handleNumberInputChange}
            placeholder="Select owner..."
            required
            name='owner'
            defaultValue={options?.data?.owner ?? ''}

          />
        </div>

        {/* KEPH Level */}
        <div className={`${options?.data ? "cursor-not-allowed" : "cursor-default"} w-full flex flex-col items-start justify-start gap-1 mb-3`}>
          <label
            htmlFor='keph_level_display'
            className='text-gray-600 capitalize text-sm'>
            KEPH Level
          </label>

          <input
            required
            type='text'
            name='keph_level_display'
            readOnly
            placeholder='Level #'
            defaultValue={options?.data?.keph_level_name ?? ''}     
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />
          
          <CustomSelect
            options={options?.keph}
            name='keph_level'
            defaultValue={options?.data?.keph_level}
            hidden={true}
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
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            onFocus={handleFocus}
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.number_of_inpatient_beds ?? 0}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            onFocus={handleFocus}
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.number_of_emergency_casualty_beds ?? ''}
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            onFocus={handleFocus}
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.number_of_icu_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            onFocus={handleFocus}
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.number_of_hdu_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            onFocus={handleFocus}
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.number_of_maternity_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            onChange={handleNumberInputChange}
            defaultValue={options?.data?.number_of_isolation_beds ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            className='flex-none w-full  bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />

        </div>

         {/* No. of Minor Theatres */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_minor_theatres'
            className='text-gray-600 capitalize text-sm'>
            Number of Minor Theatres
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <input
            required
            type='number'
            min={0}
            name='number_of_minor_theatres'
            onFocus={handleFocus}
            defaultValue={options?.data?.number_of_minor_theatres ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />


        </div>

          {/* No. of Eye Theatres */}
          <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='number_of_eye_theatres'
            className='text-gray-600 capitalize text-sm'>
            Number of Eye Theatres
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>

          <input
            required
            type='number'
            min={0}
            name='number_of_eye_theatres'
            onFocus={handleFocus}
            defaultValue={options?.data?.number_of_eye_theatres ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />


        </div>

          {/* New Born Unit */}
          <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='new_born_unit'
              className='text-gray-700 capitalize text-sm flex-grow'>
              New Born Unit{' '}
            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='new_born_unit'
                onFocus={handleFocus}
                className='w-4 aspect-square'
                defaultChecked={options?.data?.new_born_unit == true}
                value={true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='new_born_unit'
                className='w-4 aspect-square'
                onFocus={handleFocus}
                defaultChecked={options?.data?.new_born_unit == false}
                value={false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>

        </div>


        {/* Facility Catchment Population */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='facility_catchment_population'
            className='text-gray-600 capitalize text-sm'>
            Facility Catchment Population (Calculated Estimates)
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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />

        </div>

        {/* Is Reportsing DHIS2 */}
        <div className='flex flex-col w-full items-start'>
          <div className='w-full flex flex-row items-center justify-start gap-1 gap-x-3 mb-3'>
            <label
              htmlFor='reporting_in_dhis'
              className='text-gray-700 capitalize text-sm flex-grow'>
              *Is this facililty reporting in KHIS?{' '}

            </label>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='reporting_in_dhis'
                className='w-4 aspect-square'
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
                className='w-4 aspect-square'
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
          <div className='w-full flex flex-row items-center justify-start gap-1 gap-x-3 mb-3'>
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
                className='w-4 aspect-square'
                defaultChecked={options?.data?.nhif_accreditation == true}
                value={true}

              />
              <small className='text-gray-700'>Yes</small>
            </span>
            <span className='flex items-center gap-x-1'>
              <input
                type='radio'
                name='nhif_accreditation'
                className='w-4 aspect-square'
                onFocus={handleFocus}
                defaultChecked={options?.data?.nhif_accreditation == false}
                value={false}

              />
              <small className='text-gray-700'>No</small>
            </span>

          </div>

        </div>

        {/* Armed Forces Facilities */}
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-400 rounded bg-transaprent h-auto'>
          <h4 className='text-lg uppercase pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900'>
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
              className='w-4 aspect-square'
              onFocus={handleFocus}
              defaultChecked={options?.data?.is_classified ?? false}
            />
          </div>

        </div>

        {/* Hours/Days of Operation */}
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-400 rounded bg-transaprent h-auto'>
          <h4 className='text-lg uppercase pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900'>
            Hours/Days of Operation
          </h4>
          <div className='w-full flex flex-row items-center px-2 gap-1 gap-x-3 mb-3'>

            <input
              type='checkbox'
              name='open_whole_day'
              className='w-4 aspect-square'
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
              className='w-4 aspect-square'
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
              className='w-4 aspect-square'
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
              className='w-4 aspect-square'
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
              className='w-4 aspect-square'
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
        <div className=' w-full flex flex-col items-start justify-start p-3  border border-gray-400 rounded bg-transaprent h-auto'>
          <h4 className='text-lg uppercase pb-2 border-b border-gray-400 w-full mb-4 font-semibold text-gray-900'>
            Location Details
          </h4>
          <div className='grid md:grid-cols-4 grid-cols-1 place-content-start gap-3 w-full'>
            {/* County  */}
            <div className='md:col-start-1 col-span-1 '>
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
            <div className='md:col-start-2 col-span-1 '>
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
            <div className='md:col-start-3 col-span-1 '>
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
            <div className='md:col-start-4 col-span-1'>
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
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
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
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />
        </div>


        {/* check file upload */}
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
          <label
            htmlFor='facility_checklist_document'
            className='text-gray-600 capitalize text-sm'>
            checklist file upload

          </label>

          {

          editMode ?

          <div className='w-full flex flex-col gap-3 p-2 border border-gray-400 rounded'>

          {
            options?.data?.facility_checklist_document?.url !== (null || undefined) &&
            <span className='w-full flex flex-col border border-blue-400 rounded p-3 bg-blue-100'>
              <p>Uploaded File:</p>
              <a href={`${process.env.NEXT_PUBLIC_API_URL.substring(0, process.env.NEXT_PUBLIC_API_URL.length - 3)}media/${options?.data?.facility_checklist_document?.url}`} className="text-blue-900 hover:underline">
                {/* {options?.data?.official_name} Facility Checklist File */}
                {options?.data?.facility_checklist_document?.url}
              </a>
            </span>
          }

          <input
            type='file'
            readOnly
            // disabled={options?.data?.facility_checklist_document?.url !== (null || undefined)}
            name='facility_checklist_document'
            className='flex-none w-full bg-transparent border-none outline-none flex-grow placeholder-gray-500 '
          />

         
          </div>
          :
          
          <input
            type='file'
            required
            name='facility_checklist_document'
            className='flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />


      }          


        </div>


        {/* Cancel & Geolocation */}
        {
          editMode ?

            <div className='flex justify-end gap-3 items-center w-full'>
              <button
                type='submit'
                onClick={() => {submitType.current = "continue"}}
                disabled={submitting && submitType.current == "continue"}
                className={`flex items-center ${submitting ? 'justify-center' : 'justify-start'} space-x-2 bg-blue-700  p-1 px-2`}>
                <span className='text-medium font-semibold text-white'>
                  {
                    submitting && submitType.current == "continue" ?
                      <div className='flex items-center gap-2'>
                        <span className='text-white'>Saving.. </span>
                        <Spinner />
                      </div>
                      :
                      'Save and Continue'

                  }
                </span>
                {/* <ChevronDoubleRightIcon className='w-4 h-4 text-white' /> */}
              </button>
              <button
                type='submit'
                disabled={submitting && submitType.current == null}
                className={`flex items-center ${submitting ? 'justify-center' : 'justify-start'} space-x-2 bg-blue-700  p-1 px-2`}>
                <span className='text-medium font-semibold text-white'>
                  {
                    submitting && submitType.current == null ?
                      <div className='flex items-center gap-2'>
                        <span className='text-white'>Saving.. </span>
                        <Spinner />
                      </div>
                      :
                      'Save and Finish'

                  }
                </span>
                {/* <ChevronDoubleRightIcon className='w-4 h-4 text-white' /> */}
              </button>
            </div>

            :

            <div className='flex justify-between items-center w-full'>
              <button className='flex items-center justify-start space-x-2 p-1 border border-gray-900  px-2'>
                <ChevronDoubleLeftIcon className='w-4 h-4 text-gray-900' />
                <span className='text-medium font-semibold text-gray-900 '>
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