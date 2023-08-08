import {useState, useContext} from 'react';
import {Formik, Field, Form} from 'formik'
import { FormContext } from './Form';

export function RegulationForm() {

    const [formId, setFormId] = useContext(FormContext);
    


    return (
        <div className='flex justify-between items-center w-full'>
        <button
                onClick={() => {
                    setFormId(`${formId - 1}`);
                }}
                className='flex items-center justify-start space-x-2 p-1 group hover:bg-blue-700 border border-blue-700 px-2'>
                {" << "}
                <span className='text-medium font-semibold group-hover:text-white text-blue-900 '>
                    Facility contacts
                </span>
            </button>
            <button
                type='submit'
                className='flex items-center justify-start space-x-2 bg-blue-700 group hover:bg-transparent border border-blue-700 p-1 px-2'>
           
                <span className='text-medium font-semibold group-hover:text-blue-900 text-white'>
                Services
                {" >> "}
                </span>
                
            </button>

        </div>
    )
}