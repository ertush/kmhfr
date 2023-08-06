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
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'transparent',
                        outLine: 'none',
                        border: 'none',
                        outLine: 'none',
                        textColor: 'transparent',
                        padding: 0,
                        height: '4px'
                    }),

                }}
                className="flex-none col-start-1 w-full  flex-grow  placeholder-gray-500 border border-blue-600 outline-none" 
                onChange={
                    e => {
                        if(regBodyRef.current){
                        
                            regBodyRef.current.value = facilityDeptOptions.filter(({label}) => label === e.label)[0].reg_body_name
                        }
                    }
                }
                name={`facility_unit`} 
                />
            
            {/* Regulatory Body */}
            <input ref={regBodyRef} id={`facility-dept-reg-body-${index}`} type="text" readOnly={true}  name={`facility_regulating_body_name`} className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* License No. */}
            <input ref={facilityDeptLicenseRef}  id={`facility-dept-license_no-${index}`} type="text" name={`facility_license_number`} className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />


            {/* Reg No. */}
            <input ref={facilityDeptRegNoRef}  id={`facility-dept-reg_no-${index}`} type="text" name={`facility_registration_number`} className="flex-none  bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />
        
                
            
        </>
    )
}

export default FacilityDeptRegulationFactory