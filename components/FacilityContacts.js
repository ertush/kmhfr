
import { useRef, useContext, useEffect } from "react" // useContext 
import { XCircleIcon } from '@heroicons/react/outline'
import Select from 'react-select'
import { FacilityContactsContext } from "../pages/facilities/add"


const FacilityContact = ({contactTypeOptions, setFacilityContacts, index, fieldNames}) => {


    const contactTypes = useContext(FacilityContactsContext)

    const contactTypeRef = useRef(null)
    const contactDetailsRef = useRef(null)
    

    useEffect(() => {

        if(contactTypeRef.current ){
            contactTypeRef.current.state.value = null
        }

        if(contactDetailsRef.current ){
            contactDetailsRef.current.value = null
        }

     

    }, [])

    return (
        <div className="w-full grid grid-cols-2 grid-rows-1 gap-3 mt-3" id={`facility-dept-wrapper-${index}`}> 
             {/* { console.log("Add", {index, facilityDepts}) } */}
            {/* Name */}
            <Select options={contactTypeOptions || []} 
                required
                ref={contactTypeRef}
                id={`facility-contact-type-${index}`}
                placeholder="Select Name"
                onChange={
                    e => {
                        if(contactTypeRef.current){
                        
                            contactTypeRef.current.value = contactTypeOptions.find(({label}) => label === e.label).contact //id
                        }
                    }
                }
                name={fieldNames[0]} 
                className="col-start-1  w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
            
            <div className="w-full col-start-2 flex items-center gap-x-3 justify-between">
                    {/* Regulatory Body */}
                    <input ref={contactDetailsRef} id={`facility-contact-detail-${index}`} 
                    type="text" 
              
                    name={fieldNames[1]} 
                    className="w-full flex-grow  flex-1 bg-gray-50 rounded p-2 border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

                    
                
                    {/* Delete Btn */}
                    <button 
                    id={`delete-btn-${index}`}
                    onClick={ev => {
                        ev.preventDefault();
                        const depts = contactTypes;
                        // console.log("Delete", {index, facilityDepts})
                        contactTypes.splice(index, 1);
                        delete contactTypes[index]
                        setFacilityContacts(contactTypes);
                        // setIsRegBodyChange(!isRegBodyChange);


                    }}><XCircleIcon className='w-7 h-7 text-red-400'/></button>
                
                </div>
        </div>
    )
}

const OfficerContactDetails = ({contactTypeOptions, setFacilityContacts, index, fieldNames}) => {


    const contactTypes = useContext(FacilityContactsContext)

    const contactTypeRef = useRef(null)
    const contactDetailsRef = useRef(null)
    

    useEffect(() => {

        if(contactTypeRef.current ){
            contactTypeRef.current.state.value = null
        }

        if(contactDetailsRef.current ){
            contactDetailsRef.current.value = null
        }

     

    }, [])

    return (
        <div className="w-full grid grid-cols-2 grid-rows-1 gap-3 mt-3" id={`facility-dept-wrapper-${index}`}> 
             {/* { console.log("Add", {index, facilityDepts}) } */}
            {/* Name */}
            <Select options={contactTypeOptions || []} 
                required
                ref={contactTypeRef}
                id={`officer-contact-type-${index}`}
                placeholder="Select Name"
                onChange={
                    e => {
                        if(contactTypeRef.current){
                        
                            contactTypeRef.current.value = contactTypeOptions.find(({label}) => label === e.label).contact //id
                        }
                    }
                }
                name={fieldNames[0]} 
                className="col-start-1  w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
            
            <div className="w-full col-start-2 flex items-center gap-x-3 justify-between">
                    {/* Regulatory Body */}
                    <input ref={contactDetailsRef} id={`officer-contact-detail-${index}`} 
                    type="text" 
                     
                    name={fieldNames[1]} 
                    className="w-full flex-grow  flex-1 bg-gray-50 rounded p-2 border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

                    
                
                    {/* Delete Btn */}
                    <button 
                    id={`delete-btn-${index}`}
                    onClick={ev => {
                        ev.preventDefault();
                        contactTypes.splice(index, 1);
                        delete contactTypes[index]
                        setFacilityContacts(contactTypes);
                      


                    }}><XCircleIcon className='w-7 h-7 text-red-400'/></button>
                
                </div>
        </div>
    )
}

export {
    FacilityContact,
    OfficerContactDetails
}