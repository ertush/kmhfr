import React from 'react'
import Select from 'react-select'

const FacilityContact = ({
  contactTypeOptions, 
  names, 
  id, 
  contactRef, 
  contactDetail, 
  setContactDetail
}) => {

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

            <input type="text" value={contactDetail} onChange={ev => setContactDetail(ev.target.value)} name={names[1]} id={id} className="flex-none col-start-2 w-full bg-gray-50 rounded flex-grow border-2 placeholder-gray-500 border-gray-200 px-2 focus:shadow-none focus:bg-white focus:border-black outline-none" />

        </>
  )
}

export default FacilityContact