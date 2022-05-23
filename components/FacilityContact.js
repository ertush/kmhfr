import React from 'react'
import Select from 'react-select'

function FacilityContact() {
  return (
  
        <>
            {/* Contact Type */}
            <Select options={
                [
                    {
                        value:'Select Contact Type',
                        label: 'Select Contact Type'
                    },
                    {
                        value:'POSTAL',
                        label: 'POSTAL'
                    },
                    {
                        value:'FAX',
                        label: 'FAX'
                    },
                    {
                        value:'LANDLINE',
                        label: 'LANDLINE'
                    },
                    {
                        value:'MOBILE',
                        label: 'MOBILE'
                    },
                    {
                        value:'EMAIL',
                        label: 'EMAIL'
                    }
                ]
            } 
            required
            placeholder="Select Contact Type"
            onChange={
                () => console.log('changed')
            }
            name="contact_type" 
            className="flex-none col-start-1 w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
        
            {/* Contact Details */}
            <input required type="text" name="contact_details" className="flex-none col-start-2 w-full bg-gray-50 rounded flex-grow border-2 placeholder-gray-500 border-gray-200 px-2 focus:shadow-none focus:bg-white focus:border-black outline-none" />
        </>
  )
}

export default FacilityContact