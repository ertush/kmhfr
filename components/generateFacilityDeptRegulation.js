import { useRef, useEffect } from "react"
import Select from 'react-select'

const FacilityDeptRegulationFactory = ({facilityDeptOptions, facilityDeptValue, facilityDeptRegBody, regNo, licenseNo, setFacilityDepts, setIsRegBodyChange, isRegBodyChange, index}) => {

    const regBodyRef = useRef(null)
    const facilityOptionsRef = useRef(null)
    const facilityDeptLicenseRef = useRef(null)
    const facilityDeptRegNoRef = useRef(null)

    useEffect(() => {

        if(facilityOptionsRef.current && facilityDeptValue){
            facilityOptionsRef.current.state.value = facilityDeptValue
        }

        if(regBodyRef.current && facilityDeptRegBody){
            regBodyRef.current.value = facilityDeptRegBody; 
        }

        if(facilityDeptLicenseRef.current && licenseNo){
            facilityDeptLicenseRef.current.value = licenseNo
        }

        if(facilityDeptRegNoRef.current && regNo){
            facilityDeptRegNoRef.current.value = regNo
        }

    }, [])

    return (
        <> 
             {/* { console.log("Add", {index, facilityDepts}) } */}
            {/* Name */}
            <Select options={facilityDeptOptions || []} 
                required
                ref={facilityOptionsRef}
                id={`facility-dept-name-${index}`}
                placeholder="Select Name"
                onChange={
                    e => {
                        if(regBodyRef.current){
                        
                            regBodyRef.current.value = facilityDeptOptions.filter(({label}) => label === e.label)[0].reg_body_name
                        }
                    }
                }
                name={`facility_unit`} 
                className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
            
            {/* Regulatory Body */}
            <input ref={regBodyRef} id={`facility-dept-reg-body-${index}`} type="text" readOnly={true}  name={`facility_regulating_body_name`} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* License No. */}
            <input ref={facilityDeptLicenseRef}  id={`facility-dept-license_no-${index}`} type="text" name={`facility_license_number`} className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />


            {/* Reg No. */}
            <input ref={facilityDeptRegNoRef}  id={`facility-dept-reg_no-${index}`} type="text" name={`facility_registration_number`} className="flex-none  bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
        
                
            
        </>
    )
}

export default FacilityDeptRegulationFactory