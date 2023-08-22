import { useRef, useEffect, useContext } from "react"
import Select from '../components/Forms/formComponents/FromikSelect';
import { Field } from 'formik'


const FacilityDeptRegulationFactory = ({facilityDeptOptions, facilityDeptValue, facilityDeptRegBody, regNo, licenseNo, setFacilityDepts, setIsRegBodyChange, isRegBodyChange, index}) => {

    // const regBodyRef = useRef(null)
    // const facilityOptionsRef = useRef(null)
    // const facilityDeptLicenseRef = useRef(null)
    // const facilityDeptRegNoRef = useRef(null)

    // useEffect(() => {

    //     if(facilityOptionsRef.current && facilityDeptValue){
    //         facilityOptionsRef.current.state.value = facilityDeptValue
    //     }

    //     if(regBodyRef.current && facilityDeptRegBody){
    //         regBodyRef.current.value = facilityDeptRegBody; 
    //     }

    //     if(facilityDeptLicenseRef.current && licenseNo){
    //         facilityDeptLicenseRef.current.value = licenseNo
    //     }

    //     if(facilityDeptRegNoRef.current && regNo){
    //         facilityDeptRegNoRef.current.value = regNo
    //     }

    // }, [])

    return (
        <> 
            {/* { console.log("Add", {index, facilityDepts}) } */}
            {/* Name */}
            <Select options={facilityDeptOptions || []} 
                required
                id={`facility-dept-name-${index}`}
                placeholder="Select Name"
                name={`facility_unit`} 
                />
            
            {/* Regulatory Body */}
            <Field id={`facility-dept-reg-body-${index}`} type="text" readOnly  name={`facility_regulating_body_name`} className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* License No. */}
            <Field id={`facility-dept-license_no-${index}`} type="text" name={`facility_license_number`} className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* Reg No. */}
            <Field id={`facility-dept-reg_no-${index}`} type="text" name={`facility_registration_number`} className="flex-none  bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />
        
                
            
        </>
    )
}

export default FacilityDeptRegulationFactory
