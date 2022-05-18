
import { useState } from 'react'
import MainLayout from '../components/MainLayout'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Select from 'react-select'


function AddFacility(props) {

    const steps = [
        'Basic Details',
        'Geolocation',
        'Facility Contacts',
        'Regulation',
        'Services',
        'Infrastructure',
        'Human resources'
      ];

    const [formId, setFormId] = useState(0)
      


  return (
    <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
        <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                <a className="text-green-700" href="/">Home</a> {'>'}
                                <a className="text-green-700" href="/facilities">Facilities</a> {'>'}
                                <span className="text-gray-500">Add Facility</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3">
                            
                            </div>
                        </div>
                  
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none">
                        {/* Stepper Header */}
                        <div className="flex flex-col justify-center items-center px-1 md:px-4 w-full ">
                            <Box sx={{ width: '100%' }}>
                                <Stepper activeStep={0} alternativeLabel>
                                    {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        </div>

                        {/* Stepper Body */}
                        <div className="flex flex-col justify-center items-start px-1 md:px-4 w-full ">
                            <div className=" w-full flex flex-col items-start justify-start p-3 rounded border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Basic Details</h4>
                                {
                                    (() => {
                                    switch(formId){
                                        case 0:
                                            // Basic Details form
                                            return (
                                                <form className='flex flex-col w-full items-start justify-start gap-3'>
                                                    {/* Facility Official Name */}
                                                     <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Official Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="text" name="facility_official_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>
                                                    {/* Facility Unique Name  */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Unique Name<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="text" name="facility_unique_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>
                                                    {/* Facility Type */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Facility Type <span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value:'type-1',
                                                                    label: 'type-1'
                                                                },
                                                                {
                                                                    value:'type-2',
                                                                    label: 'type-2'
                                                                }
                                                            ]
                                                        } 
                                                        placeholder="Select a facility type..."
                                                        
                                                        onChange={
                                                            () => console.log('changed type')
                                                        }
                                                        name="facility_official_name" 
                                                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>

                                                    {/* Facility Type Details */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_official_name" className="text-gray-600 capitalize text-sm">Facility Type Details<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="text" placeholder="Select a facility type details..."  name="facility_unique_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    {/* Operation Status */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_type" className="text-gray-600 capitalize text-sm">Operation Status <span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value:'op-status-1',
                                                                    label: 'op-status-1'
                                                                },
                                                                {
                                                                    value:'op-status-2',
                                                                    label: 'op-status-2'
                                                                }
                                                            ]
                                                        } 
                                                       placeholder="Select an operation status..."
                                                        onChange={
                                                            () => console.log('changed')
                                                        }
                                                        name="facility_official_name" 
                                                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>

                                                    {/* Date Established */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_unique_name" className="text-gray-600 capitalize text-sm">Date Established<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="date" name="facility_unique_name" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    {/* Is Facility accredited */}
                                                    <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                        <label htmlFor="facility_accredited" className="text-gray-700 capitalize text-sm flex-grow">*Is the facility accredited Lab ISO 15189? </label>
                                                        <span className="flex items-center gap-x-1">
                                                            <input type="radio" value={true} defaultChecked={true} name="facility_accredited" id="has_edits" onChange={ev => {
                                                               console.log({ev})
                                                            }} />
                                                            <small className="text-gray-700">Yes</small>
                                                        </span>
                                                        <span className="flex items-center gap-x-1">
                                                            <input type="radio" value={false} defaultChecked={false} name="has_edits" id="has_edits" onChange={ev => {
                                                                console.log({ev})
                                                            }} />
                                                            <small className="text-gray-700">No</small>
                                                        </span>
                                                    </div>

                                                    {/* Owner Category */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="owner_category" className="text-gray-600 capitalize text-sm">Owner Category<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value:'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value:'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value:'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value:'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        } 
                                                        placeholder="Select owner"
                                                        onChange={
                                                            () => console.log('changed')
                                                        }
                                                        name="owner_category" 
                                                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>

                                                    {/* Owner Details */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="owner_details" className="text-gray-600 capitalize text-sm">Owner Details<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value:'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value:'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value:'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value:'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        } 
                                                        placeholder="Select owner"
                                                        onChange={
                                                            () => console.log('changed')
                                                        }
                                                        name="owner_details" 
                                                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>

                                                    {/* KEPH Level */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="keph_level" className="text-gray-600 capitalize text-sm">KEPH Level</label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value:'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value:'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value:'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value:'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        } 
                                                        placeholder="Select owner"
                                                        onChange={
                                                            () => console.log('changed')
                                                        }
                                                        name="keph_level" 
                                                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>

                                                    {/* No. Functional general Beds */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_general_beds" className="text-gray-600 capitalize text-sm">Number of functional general beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_general_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                     {/* No. Functional cots */}
                                                     <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_cots" className="text-gray-600 capitalize text-sm">Number of functional cots<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_cots" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                     {/* No. Emergency Casulty Beds */}
                                                     <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_emergency_beds" className="text-gray-600 capitalize text-sm">Number of Emergency Casulty Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_emergency_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                     {/* No. Intensive Care Unit Beds */}
                                                     <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_icu_beds" className="text-gray-600 capitalize text-sm">Number of Intensive Care Unit (ICU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_icu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                     </div>

                                                      {/* No. High Dependency Unit HDU */}
                                                      <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_hdu_beds" className="text-gray-600 capitalize text-sm">Number of High Dependency Unit (HDU) Beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_hdu_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                     </div>

                                                     {/* No. of maternity beds */}
                                                     <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_maternity_beds" className="text-gray-600 capitalize text-sm">Number of maternity beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_maternity_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                     </div>

                                                    {/* No. of isolation beds */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_isolation_beds" className="text-gray-600 capitalize text-sm">Number of isolation beds<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_isolation_beds" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    {/* No. of General Theatres */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_general_theatres" className="text-gray-600 capitalize text-sm">Number of General Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_general_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    {/* No. of Maternity Theatres */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="no_maternity_theatres" className="text-gray-600 capitalize text-sm">Number of Maternity Theatres<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="no_maternity_theatres" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    {/* Facility Catchment Population */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_catchment_population" className="text-gray-600 capitalize text-sm">Facility Catchment Population<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <input type="number" name="facility_catchment_population" className="flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                                    </div>

                                                    {/* Is Reporting DHIS2 */}
                                                    <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                        <label htmlFor="reporting_dhis" className="text-gray-700 capitalize text-sm flex-grow">*Should this facility have reporting in DHIS2?  </label>
                                                        <span className="flex items-center gap-x-1">
                                                            <input type="radio" value={true} defaultChecked={true} name="facility_accredited" id="has_edits" onChange={ev => {
                                                                console.log({ev})
                                                            }} />
                                                            <small className="text-gray-700">Yes</small>
                                                        </span>
                                                        <span className="flex items-center gap-x-1">
                                                            <input type="radio" value={false} defaultChecked={false} name="has_edits" id="has_edits" onChange={ev => {
                                                                console.log({ev})
                                                            }} />
                                                            <small className="text-gray-700">No</small>
                                                        </span>
                                                    </div>

                                                    {/* KEPH Level */}
                                                    <div  className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor="facility_admission" className="text-gray-600 capitalize text-sm">Facility admissions<span className='text-medium leading-12 font-semibold'> *</span></label>
                                                        <Select options={
                                                            [
                                                                {
                                                                    value:'Private Practice',
                                                                    label: 'Private Practice'
                                                                },
                                                                {
                                                                    value:'Non-Governmental Organizations',
                                                                    label: 'Non-Governmental Organizations'
                                                                },
                                                                {
                                                                    value:'Ministry of Health',
                                                                    label: 'Ministry of Health'
                                                                },
                                                                {
                                                                    value:'Faith Based Organization',
                                                                    label: 'Faith Based Organization'
                                                                }
                                                            ]
                                                        } 
                                                        placeholder="Select owner"
                                                        onChange={
                                                            () => console.log('changed')
                                                        }
                                                        name="facility_admission" 
                                                        className="flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none" />
                                                    </div>

                                                     {/* Is NHIF accredited */}
                                                     <div className="w-full flex flex-row items-center px-2 justify-  gap-1 gap-x-3 mb-3">
                                                        <label htmlFor="nhif_accedited" className="text-gray-700 capitalize text-sm flex-grow"> *Does this facility have NHIF accreditation?   </label>
                                                        <span className="flex items-center gap-x-1">
                                                            <input type="radio" value={true} defaultChecked={true} name="facility_accredited" id="has_edits" onChange={ev => {
                                                                console.log({ev})
                                                            }} />
                                                            <small className="text-gray-700">Yes</small>
                                                        </span>
                                                        <span className="flex items-center gap-x-1">
                                                            <input type="radio" value={false} defaultChecked={false} name="has_edits" id="has_edits" onChange={ev => {
                                                                console.log({ev})
                                                            }} />
                                                            <small className="text-gray-700">No</small>
                                                        </span>
                                                    </div>


                                                </form>
                                            );
                                        case 1:
                                            // Geolocation form
                                            return (
                                                <form>

                                                </form>
                                            );
                                        case 2:
                                            // Facility COntacts
                                            return (
                                                 <form>
                                                    
                                                </form>
                                            );
                                        case 3:
                                            // Regulation form
                                            return (
                                                <form>
                                                    
                                                </form>
                                            );
                                        case 4:
                                            // Services form
                                            return (
                                                <form>
                                                    
                                                </form>
                                            )
                                        case 5:
                                            // Infrastructure form
                                            return (
                                                <form>
                                                    
                                                </form>
                                            )
                                        case 6:
                                            // Human resources form
                                            return (
                                                <form>
                                                    
                                                </form>
                                            )
                                        default:
                                            // 
                                            return (
                                                <form>
                                                    
                                                </form>
                                            )
                                    
                                    
                                    }
                                  })()
                                }

                            
                                
                                
                             
                            </div>
                        </div>
                        

                    </div>
                    
                    <aside className="flex flex-col col-span-5 md:col-span-1 p-1 md:h-full">
                        <details className="rounded bg-transparent py-2 text-basez flex flex-col w-full md:stickyz md:top-2z" open>
                          
                        </details>
                    </aside>
                    {/* (((((( Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 100 results.
                        </p>
                    </div>
                    {/* ))))))) */}
                </div>
    </MainLayout>
  )
}

AddFacility.getInitialProps = async (ctx) => {

    return new Promise ((resolve, reject) => {
        
        return ctx ? resolve({query:{
            searchTerm: ''
        }}) : reject({err:'Unable to parse ctx'})
    })

}

export default AddFacility