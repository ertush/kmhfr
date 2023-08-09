
"use client"

import {useState, createContext} from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { BasicDeatilsForm } from './BasicDetailsForm';
import { FacilityContactsForm } from './FacilityContactsForm';
import { InfrastructureForm } from './InfrastructureForm';
import { HumanresourcesForm } from './HumanResourceForm';
import { RegulationForm } from './RegulationForm';
import { ServicesForm } from './ServicesForm';
import { GeolocationForm } from './GeolocationForm';
import { useLocalStorageState } from './hooks/formHook';


export const FormContext  = createContext(() => null)
// export const FacilityDeptContext = createContext(null)
// export const FacilityContactsContext = createContext(null)
export const EditFacilityContactsContext = createContext(null)





export function Form () {




//   const [formId, setFormId] = useState(0); //

const [formId, setFormId] = useLocalStorageState({
    key: 'formId',
    value: 0
})
 

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
																setFormId(JSON.stringify(0))
																// window.sessionStorage.setItem('formId', 0)

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
                  <FormContext.Provider value={[formId, setFormId]}>
                      <div
                        className=' w-full flex flex-col items-start justify-start p-4 shadow-md bg-blue-50'
                        style={{ minHeight: '250px' }}>
                            { console.log({formId})}
                           {
                                formId == '0' && 
                                <BasicDeatilsForm />


                              }
                              {
                                  formId == '1' && 
                                  <GeolocationForm />
                                 
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
                                  <HumanresourcesForm />
                                
                              }
                             
                          
                        </div>
                    </FormContext.Provider>
                </div>

    </div>
    )
}