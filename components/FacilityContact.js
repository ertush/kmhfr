import { set } from 'nprogress'
import React,{useEffect, useRef} from 'react'
import Select from 'react-select'
// import { Field } from 'formik'

const FacilityContact = ({
  contactTypeOptions, 
  names, 
  id, 
  contactRef, 
  setContactDetail, 
  contact,
  inputContactRef

}) => {

  
  useEffect( () => {
    if(inputContactRef !== null){
       if(inputContactRef.current !== null) inputContactRef.current.value = contact
    }
  }, [])


  return (
  
        <>
            {/* Contact Type */}
            <Select 
            ref={contactRef}
            options={contactTypeOptions || []} 
            required
            placeholder="Select Contact Type"
            name={names[0]}
            id={id}
            className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
        
            {/* Contact Details */}

            <input type="text" ref={inputContactRef} onChange={ev => { if(typeof(setContactDetail) === 'function')setContactDetail(ev.target.value) }} name={names[1]} id={id} className="flex-none col-start-2 w-full bg-gray-50 rounded flex-grow border-2 placeholder-gray-500 border-gray-200 px-2 focus:shadow-none focus:bg-white focus:border-black outline-none" />

        </>
  )
}

export default FacilityContact