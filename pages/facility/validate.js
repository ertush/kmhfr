
import React, { useState, useEffect, useRef } from 'react'
// import * as React from 'react'
import MainLayout from '../../components/MainLayout'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Select from 'react-select'
import { checkToken } from '../../controllers/auth/auth'
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon, PlusIcon } from '@heroicons/react/solid';
import reactDom from 'react-dom';
// import reactDom from 'react-dom';



function AddFacility(props) {


    let facility = props.data
    const steps = [
        'Basic Details',
      ];

    const [formId, setFormId] = useState(0)
    const facilityContactRef = useRef(null)
   

    useEffect(() => {

        const formIdState = window.sessionStorage.getItem('formId');

        // console.log({formIdState})

        if(formIdState == undefined || formIdState == null || formIdState == '') {
            window.sessionStorage.setItem('formId', 2); //0
        }
        
        setFormId(window.sessionStorage.getItem('formId'));

        return () => {
            if(window.sessionStorage.getItem('formId') == '7'){
                window.sessionStorage.setItem('formId', 0)
            }
            
        }
    }, [formId])
      

  return (
    <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
        <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                <a className="text-indigo-700" href="/">Home</a> {'>'}
                                <a className="text-indigo-700" href="/facilities">Facilities</a> {'>'}
                                <span className="text-gray-500">Add Facility</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-evenly gap-x-3 gap-y-2 text-sm md:text-base py-3">
                            
                            </div>
                        </div>
                  
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col items-center border rounded pt-8 pb-4 gap-4 mt-2 order-last md:order-none">
                        {/* Stepper Header */}
                        <div className="flex flex-col justify-center items-center px-1 md:px-4 w-full ">
                            
                        <label className="text-lg">Facility rejection reason</label>
                        <textarea  name="rejection_reason" defaultValue={""}
                            onChange={ev => {
                                alert("Changing!!!")
                            }}
                        className="rounded border border-gray-300 focus:ring-1 ring-green-500 outline-none bg-white p-2" />
                        <div className='flex justify-between items-center w-full'>
                                <button className='flex items-center justify-start space-x-2 p-1 border-2 bg-green-500 rounded px-2'>
                                    <ChevronDoubleLeftIcon className='w-4 h-4 text-black'/>
                                    <span className='text-medium font-semibold text-black'>Approve</span>
                                </button>
                                <button type="submit" className='flex items-center justify-start space-x-2 bg-red-500 rounded p-1 px-2'>
                                    <span className='text-medium font-semibold text-white'>Reject</span>
                                    <ChevronDoubleRightIcon className='w-4 h-4 text-white'/>
                                </button>
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

    return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            let url = process.env.NEXT_PUBLIC_API_URL + '/facilities/facilities/' + ctx.query.id + '/'
            return fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            }).then(r => r.json())
                .then(json => {
                    return {
                        data: json
                    }
                }).catch(err => {
                    console.log('Error fetching facilities: ', err)
                    return {
                        error: true,
                        err: err,
                        data: [],
                    }
                })
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/facilities'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
            }
        }, 1000);
    })

}

export default AddFacility