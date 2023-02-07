
import { useRef, useEffect } from "react" // useContext 
import { XCircleIcon } from '@heroicons/react/outline'
import Select from 'react-select'
// import { ContactTypeCtx } from "../pages/facilities/add"


const FacilityOfficerFactory = ({contactTypeOptions, index}) => {


    // const contactTypes = useContext(ContactTypeCtx)

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
        <div className="w-full flex items-center justify-start gap-3 mt-3" id={`facility-dept-wrapper-${index}`}> 
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
                name={`contact_type`} 
                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
            
            {/* Regulatory Body */}
            <input ref={contactDetailsRef} id={`facility-contact-detail-${index}`} type="text" readOnly={true}  name={`contact`} className="flex-none w-5/6 bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />


         
              
        
            {/* Delete Btn */}
            <button 
            id={`delete-btn-${index}`}
            onClick={ev => {
                //     ev.preventDefault();
                // // const depts = facilityDepts;
                // console.log("Delete", {index, facilityDepts})
                // // facilityDepts.splice(index, 1);
                // delete facilityDepts[index]
                // setFacilityContacts(facilityDepts);
                // setIsRegBodyChange(!isRegBodyChange);


            }}><XCircleIcon className='w-7 h-7 text-red-400'/></button>
                
            
        </div>
    )
}

export default FacilityOfficerFactory