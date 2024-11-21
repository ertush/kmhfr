
import { useRef,/* useContext, */ useEffect, useMemo, useState } from "react" // useContext 
import { XCircleIcon } from '@heroicons/react/outline'
// import { FacilityContactsContext } from "../../../components/Forms/FacilityContactsForm"
// import { EditFacilityContactsContext } from "../../../pages/facilities/edit/[id]"
// import { useAlert } from "react-alert"
import  Select  from './FormikSelect'
// import  {Select as CustomSelect} from '../formComponents/Select'
import { Field, useFormikContext } from 'formik'


function FacilityContact(
    {
    contactTypeOptions, 
    setFacilityContacts, 
    index, 
    fieldNames, 
    contacts
}) {

    // const contactTypes = useContext(FacilityContactsContext);
    // const alert = useAlert()

    const contactTypeRef = useRef(null)
    const contactDetailsRef = useRef(null)
    
    const [contact, contact_type_name, id] = contacts

    const [_contactType, setContactType] = useState(null)

    const {values, _} = useFormikContext()

    useEffect(() => {
        if(values) {
            setContactType(contactTypeOptions?.find(type => type?.value == values[`contact_type_${index}`])?.label)
        }
    }, [values[`contact_type_${index}`]])



    useEffect(() => {
        if(contactTypeRef.current && contact_type_name && id){
            
            if (contactTypeRef?.current){ 
                
                contactTypeRef.current.state.value = contactTypeOptions.filter(({label}) => label === contact_type_name).map(obj => {obj['id'] = id; return obj})
            }

        }

        if(contactDetailsRef.current ){
            contactDetailsRef.current.value = contact ?? null;
        }

     

    }, [])

    return (
        <div className="w-full grid grid-cols-2 grid-rows-auto gap-3 mt-3" id={`facility-dept-wrapper-${index}`}> 

            {/* Name */}
            <Select options={contactTypeOptions || []} 
                required
                id={`facility-contact-type-${index}`}
                placeholder="Select Contact Type"
                name={`${fieldNames[0]}_${index}`} 
                />

            <div className="w-full col-start-2 flex items-center gap-x-3 justify-between">
                    {/* Facility  Contact */}
           
                    
                    {
                        (_contactType == null || _contactType == "FAX" ) && 
                        <Field 
                        as="input"
                        required
                        id={`facility-contact-detail-${index}`} 
                        type="text"
                        name={`${fieldNames[1]}_${index}`} 
                        className="w-full flex-grow  rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                        />
    
                    }

                    {
                        ( _contactType == 'LANDLINE' || _contactType == 'MOBILE') && 
                        <div className=" flex flex-col w-full gap-1 relative max-h-min">
                        <Field 
                        as="input"
                        required
                        id={`facility-contact-detail-${index}`} 
                        type="tel"
                        placeholder={'07XXXXXXXX'} 
                        pattern={'[0-9]{10}'}
                        name={`${fieldNames[1]}_${index}`} 
                        className="w-full flex-grow rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                        />

                        <span className="tooltiptext">Invalid Input! Correct Format is 07XXXXXXXX</span>
                        

                        </div>

                    }

                    {
                        _contactType == 'EMAIL' && 
                        <div className=" flex flex-col w-full gap-1 relative max-h-min">
                        <Field 
                        as="input"
                        reuired
                        id={`facility-contact-detail-${index}`} 
                        type="email"
                        placeholder="user@email-domain"
                        pattern="[a-z0-9]+[.]*[\-]*[a-z0-9]+@[a-z0-9]+[\-]*[.]*[a-z0-9]+[.][a-z]{2,}"
                        name={`${fieldNames[1]}_${index}`} 
                        className="w-full flex-grow  rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                        />      
                        <span className="tooltiptext">Invalid Input! Correct Format is xxx@xxx.yy </span>

                        </div>

                    }

                    {
                        _contactType == 'POSTAL' && 
                        <div className=" flex flex-col w-full gap-1 relative max-h-min">

                        <Field 
                        as="input"
                        required
                        id={`facility-contact-detail-${index}`} 
                        type="text"
                        placeholder="Postal Address"
                        // pattern={'[P.O BOX]{7}[ ]{1}[0-9]{5,6}'} 
                        name={`${fieldNames[1]}_${index}`} 
                        className="w-full flex-grow  rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                        />

                        {/* <span className="tooltiptext">Invalid Input! Correct Format is P.O BOX ##### </span> */}


                        </div>
                    }


                    

                    
                        {/* Delete Btn */}
                    
                    <button 
                    id={`delete-btn-${index}`}
                    onClick={async ev => {
                        ev.preventDefault();
                 
                        if(!contacts.includes(undefined)){
                            setFacilityContacts(prev => {
                                
                                // delete prev[index]
                                return prev?.filter(({id}) => id !== index)
                            }); 


                        }else{
                            setFacilityContacts(prev => {
                                
                                // delete prev[index]
                                return prev?.filter(({id}) => id !== index)
                            }); 

                        }

                    }}
                    ><XCircleIcon className='w-7 h-7 text-red-400'/></button>
                
            </div>

           


        </div>
    )
}

function OfficerContactDetails (
    {
        contactTypeOptions, 
        setFacilityContacts,
        index, 
        fieldNames,
        contacts
    }) {


    // const contactTypes = useContext(FacilityContactsContext)

    // const alert = useAlert()


    const contactTypeRef = useRef(null)
    const contactDetailsRef = useRef(null)
    
    const [contact, contact_type_name, id] = contacts

    const [_contactType, setContactType] = useState(null)

    const {values, _} = useFormikContext()


    useEffect(() => {
        if(values) {
            setContactType(contactTypeOptions?.find(type => type?.value == values[`officer_details_contact_type_${index}`])?.label)
        }
    }, [values[`officer_details_contact_type_${index}`]])



    useEffect(() => {

        if(contactTypeRef.current && contact_type_name && id){
            
            if (contactTypeRef?.current){ 
                contactTypeRef.current.state.value = contactTypeOptions.filter(({label}) => label === contact_type_name).map(obj => {obj['id'] = id; return obj})
            }

        }

        if(contactDetailsRef.current ){
            contactDetailsRef.current.value = contact ?? null;
        }

     

    }, [])


    return (
        /** */

        (<div className="w-full grid grid-cols-2 grid-rows-1 gap-3 mt-3" id={`facility-dept-wrapper-${index}`}>
            {/* Name */}
            <Select options={contactTypeOptions || []} 
                required
                id={`officer-contact-type-${index}`}
                placeholder="Select Contact Type"
                
                name={`${fieldNames[0]}_${index}`} 
                 />
            <div className="w-full col-start-2 flex items-center gap-x-3 justify-between">
               {/* Facility  Contact */}

               
               {
                   (_contactType == null || _contactType == "FAX") && 



                   <Field 
                   as="input"
                   required
                   id={`officer-contact-detail-${index}`} 
                   type="text"
                   name={`${fieldNames[1]}_${index}`} 
                   className="w-full flex-grow  rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                   />



               }

               {
                   ( _contactType == 'LANDLINE' || _contactType == 'MOBILE') && 
                   
                   <div className=" flex flex-col w-full gap-1 relative max-h-min">
                   <Field 
                   as="input"
                   required
                   id={`officer-contact-detail-${index}`} 
                   type="tel"
                   placeholder={'07XXXXXXXX'} 
                   pattern={'[0-9]{10}'}
                   name={`${fieldNames[1]}_${index}`} 
                   className="w-full flex-grow rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                   />

                   <span className="tooltiptext">Invalid Input! Correct Format is 07XXXXXXXX</span>
                   

                   </div>

               }

               {
                   _contactType == 'EMAIL' && 
                   <div className=" flex flex-col w-full gap-1 relative max-h-min">

                   <Field 
                   as="input"
                   reuired
                   id={`officer-contact-detail-${index}`} 
                   type="email"
                   placeholder="user@email-domain"
                   pattern="[a-z0-9]+[.]*[\-]*[a-z0-9]+@[a-z0-9]+[\-]*[.]*[a-z0-9]+[.][a-z]{2,}"
                   name={`${fieldNames[1]}_${index}`} 
                   className="w-full flex-grow  rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                   />      
                   <span className="tooltiptext">Invalid Input! Correct Format is xxx@xxx.yy </span>

                   </div>

               }

               {
                   _contactType == 'POSTAL' && 
                   <div className=" flex flex-col w-full gap-1 relative max-h-min">

                   <Field 
                   as="input"
                   required
                   id={`officer-contact-detail-${index}`} 
                   type="text"
                   placeholder="Postal Address"
                   // pattern={'[P.O BOX]{7}[ ]{1}[0-9]{5,6}'} 
                   name={`${fieldNames[1]}_${index}`} 
                   className="w-full flex-grow  rounded flex-1 bg-transparent p-2 border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none" 
                   />

                   {/* <span className="tooltiptext">Invalid Input! Correct Format is P.O BOX ##### </span> */}


                   </div>
               }

               
               {/* Delete Btn */}
               <button 
               id={`delete-btn-${index}`}
               onClick={async (ev) => {
                   console.log('delete...');
                   ev.preventDefault();

                   if(!contacts.includes(undefined)){

                  
                   setFacilityContacts(prev => {
                       // delete prev[index]
                        return prev?.filter(({id}) => id !== index)

                   }); 

               } else {

                   setFacilityContacts(prev => {
                       // delete prev[index]
                        return prev?.filter(({id}) => id !== index)

                   }); 

               }

               }}
               ><XCircleIcon className='w-7 h-7 text-red-400'/></button>
           
           </div>
        </div>)
    );
}

export {
    FacilityContact,
    OfficerContactDetails
}