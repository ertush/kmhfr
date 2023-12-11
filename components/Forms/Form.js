
"use client"

import {createContext, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { BasicDeatilsForm } from './BasicDetailsForm';
import { FacilityContactsForm } from './FacilityContactsForm';
import { InfrastructureForm } from './InfrastructureForm';
import { HumanResourceForm } from './HumanResourceForm';
import { RegulationForm } from './RegulationForm';
import { ServicesForm } from './ServicesForm';
import { GeolocationForm } from './GeolocationForm';
// import { useLocalStorageState } from './hooks/formHook';


export const FormContext  = createContext(() => null)



export function Form () {


// State


const [formId, setFormId] = useState('0')



useEffect(() => {
  function setStateFromUrl() {

    const url = new URL(window.document.location.href)

    setFormId(url.searchParams.get('formId'))

  }

  setStateFromUrl()
}, [])




  const steps = [
    'Basic Details',
    'Geolocation',
    'Facility Contacts',
    'Regulation',
    'Services',
    'Infrastructure',
    'Human resources'
];

    return (
       <div className='border col-span-4 border-blue-600  p-3 pb-4 flex flex-col justify-center items-center w-full'>
      	{/* Stepper Header */}  
        <div className='flex flex-col justify-center items-center px-1 md:px-4 w-full m-6'>
								<Box sx={{ width: '100%' }}>
									<Stepper activeStep={parseInt(formId)} alternativeLabel>
										{steps.map((label, i) => (
											<Step key={label}>
												<StepLabel
                          StepIconComponent={() => (
													<span className="w-6 h-6 bg-blue-600 text-white text-sm rounded-full flex items-center justify-center">
														{(i + 1)}
													</span>
												)}
                                                >
													
													{
														label === "Basic Details" ?
														<span className='cursor-pointer hover:text-indigo-600' onClick={
															() => {
                                const url =  new URL(window.location.href)

                                url.searchParams.set('formId', '0')

                                window.location.href = url

														
															}
														} >{label}</span>
														:
														label
													}
													
													</StepLabel>
											</Step>
										))}
									</Stepper>
								</Box>
							</div>

              {/* Stepper Body */}
              <div className='flex flex-col justify-center items-start px-1 md:px-4 w-full '>
           
                        <div
                          className=' w-full flex flex-col items-start justify-start p-4 shadow-md bg-blue-50'
                          style={{ minHeight: '250px' }}>
                               {
                                  formId == '0' && 
                                  <BasicDeatilsForm  
                                  editMode={false}
                                  />

                                }
                                {
                                    formId == '1' && 
                                    <GeolocationForm 
                                      editMode={false}
                                    />
                                  
                                } 
                                {
                                    formId == '2' &&    
                                    <FacilityContactsForm />
                                  
                                } 
                                {
                                    formId == '3' &&    
                                    <RegulationForm />
                                  
                                }
                                {
                                    formId == '4' &&    
                                    <ServicesForm />
                                  
                                }
                                {
                                    formId == '5' &&    
                                    <InfrastructureForm />
                                  
                                }
                                {
                                    formId == '6' &&    
                                    <HumanResourceForm />
                                  
                                }
                              
                            
                        </div>
                 
                </div>

    </div>
    )
}