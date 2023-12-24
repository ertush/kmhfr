import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

function FacilityUpdatesTable({ facilityUpdatedJson, originalData }) {




    return (
        <Table className="md:px-4">

            {/* Switch FacilityTableUpdates View */}
            <TableBody className='w-full flex flex-col gap-y-6'>

                {
                    (() => (
                        <>
                            {/* Facility Basic Details Updates */}
                            {
                            facilityUpdatedJson?.basic && facilityUpdatedJson?.basic.length > 0 &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold'>Facility Basic Details</h2></TableRow>
                                    <TableRow className='w-full'>
                                        <TableCell>
                                            <p className='text-base font-semibold'>Field</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Old Value</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>New Value</p>
                                        </TableCell>
                                    </TableRow>
                                </>

                            }
                            {

                                facilityUpdatedJson?.basic && facilityUpdatedJson?.basic.length > 0 &&
                                facilityUpdatedJson?.basic.map(({ human_field_name, display_value, field_name }, id) => (
                                    
                                    <TableRow className='w-full' key={id}>
                                        <TableCell>
                                            {human_field_name}
                                        </TableCell>
                                        {
                                            originalData ?
                                        <TableCell>
                                            {typeof (originalData[field_name]) === 'boolean' ? (Boolean(originalData[field_name]) ? 'Yes' : 'No') : originalData[field_name]}
                                        </TableCell>
                                        :
                                        <TableCell className='w-auto'>
                                            {
                                                null
                                            }
                                        </TableCell>

                                        }
                                        <TableCell>
                                            {display_value}
                                        </TableCell>
                                    </TableRow>
                                ))

                            }

                               {/* Facility Geolocation Updates */}
                               {
                                facilityUpdatedJson?.geo_codes && facilityUpdatedJson?.geo_codes?.coordinates?.coordinates.length > 0 &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold mt-6'>Facility Geolocation</h2></TableRow>
                                    <TableRow className='w-full'>
                                        <TableCell>
                                            <p className='text-base font-semibold'>Field</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Old Value</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>New Value</p>
                                        </TableCell>
                                    </TableRow>
                                </>

                            }
                            {

                                facilityUpdatedJson?.geo_codes && facilityUpdatedJson?.geo_codes?.coordinates?.coordinates.length > 0 &&
                                Object.keys(facilityUpdatedJson?.geo_codes).map((key, i) => {
                                    
                                    if(!key.includes('coordinates')) {
                                   
                                   return ( <TableRow className='w-full' key={i}>
                                        <TableCell>
                                            {key}
                                        </TableCell>
                                        <TableCell>
                                            {originalData?.lat_long[i]}
                                        </TableCell>
                                        <TableCell>
                                            {facilityUpdatedJson?.geo_codes[key]}
                                        </TableCell>
                                    </TableRow>
                                   )
                                }
                                })

                            }


                            {/* Facility Services Updates */}
                            {
                                facilityUpdatedJson?.services && facilityUpdatedJson?.services.length > 0 &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold mt-6'>Facility Services</h2></TableRow>
                                    <TableRow className='w-full'>
                                        <TableCell>
                                            <p className='text-base font-semibold'>Service Name</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Service Option</p>
                                        </TableCell>
                                    </TableRow>
                                </>
                            }

                            {
                                facilityUpdatedJson?.services && facilityUpdatedJson?.services.length > 0 &&
                                facilityUpdatedJson?.services.map(({ name }, id) => (

                                    <TableRow className='w-full' key={id}>
                                        <TableCell>
                                            {name}
                                        </TableCell>
                                        <TableCell>
                                            N/A
                                        </TableCell>
                                    </TableRow>

                                ))

                            }


                            {/* Facility Officer In Charge */}
                            {
                                facilityUpdatedJson?.officer_in_charge &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold mt-6'>Facility Officer In Charge</h2></TableRow>

                                    <div className='grid  grid-cols-2 md:grid-cols-3 place-content-start gap-2 '>

                                        <h3 className='font-semibold text-lg col-start-1'>Officer In-Charge</h3>
                                        <div className='col-start-1 grid grid-cols-2 place-content-start gap-1'>
                                            <p className='font-bold text-base col-start-1'>Name:</p>
                                            <p className='font-normal text-base col-start-2'>{facilityUpdatedJson?.officer_in_charge?.name}</p>

                                            <p className='font-bold text-base col-start-1'>Registration Number:</p>
                                            <p className='font-normal text-base col-start-2'>{facilityUpdatedJson?.officer_in_charge?.reg_no}</p>

                                            <p className='font-bold text-base col-start-1'>Job Title:</p>
                                            <p className='font-normal text-base col-start-2 col-span-2'>{facilityUpdatedJson?.officer_in_charge?.job_title_name}</p>

                                        </div>

                                        <h3 className='font-semibold row-start-1 text-lg col-start-2'>Officer In-Charge Contacts</h3>
                                        <div className='col-start-2  grid grid-cols-2 place-content-start gap-1'>
                                            <p className='font-bold text-base col-start-1 lowercase '>{facilityUpdatedJson?.officer_in_charge?.contacts[0]?.contact_type_name}{':'}</p>
                                            <p className='font-normal text-base col-start-2'>{facilityUpdatedJson?.officer_in_charge?.contacts[0]?.contact}</p>
                                        </div>


                                    </div>
                                </>

                            }


                            {/*  Facility HR Updates */}
                            {
                                facilityUpdatedJson?.humanReportsSideMenu  && facilityUpdatedJson?.humanReportsSideMenu .length > 0 &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold mt-6'>Facility HR</h2></TableRow>
                                    <TableRow className='w-full'>
                                        <TableCell>
                                            <p className='text-base font-semibold'>Speciality Name</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Present</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Number</p>
                                        </TableCell>
                                    </TableRow>
                                </>
                            }
                            {
                                facilityUpdatedJson?.humanReportsSideMenu  && facilityUpdatedJson?.humanReportsSideMenu .length > 0 &&
                                facilityUpdatedJson?.humanReportsSideMenu .map(({ name, count }, id) => (

                                    <TableRow className='w-full' key={id}>
                                        <TableCell>
                                            {name}
                                        </TableCell>
                                        <TableCell>
                                            Yes
                                        </TableCell>
                                        <TableCell>
                                            {count}
                                        </TableCell>
                                    </TableRow>

                                ))

                            }


                            {/* Facility Infrasructure Updates  */}
                            {
                                facilityUpdatedJson?.infrastructure && facilityUpdatedJson?.infrastructure.length > 0 &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold mt-6'>Facility Infrasructure</h2></TableRow>
                                    <TableRow className='w-full'>
                                        <TableCell>
                                            <p className='text-base font-semibold'>Name</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Present</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Number</p>
                                        </TableCell>
                                    </TableRow>
                                </>
                            }

                            {
                                facilityUpdatedJson?.infrastructure && facilityUpdatedJson?.infrastructure.length > 0 &&
                                facilityUpdatedJson?.infrastructure.map(({ name, count }, id) => (

                                    <TableRow className='w-full' key={id}>
                                        <TableCell>
                                            {name}
                                        </TableCell>
                                        <TableCell>
                                            Yes
                                        </TableCell>
                                        <TableCell>
                                            {count}
                                        </TableCell>
                                    </TableRow>

                                ))

                            }


                            {/* Facility Units Updates */}
                            {
                                facilityUpdatedJson?.units && facilityUpdatedJson?.units.length > 0 &&
                                <>
                                    <TableRow className='w-full'><h2 className='text-lg font-bold mt-6'>Facility Units</h2></TableRow>
                                    <TableRow className='w-full'>
                                        <TableCell>
                                            <p className='text-base font-semibold'>Department Name</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Regulating Body</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>License No.</p>
                                        </TableCell>
                                        <TableCell className='text-xl font-semibold'>
                                            <p className='text-base font-semibold'>Registration No.</p>
                                        </TableCell>
                                    </TableRow>
                                </>
                            }

                            {
                                facilityUpdatedJson?.units && facilityUpdatedJson?.units.length > 0 &&
                                facilityUpdatedJson?.units.map(({ department_name, regulating_body_name, license_number, registration_number }, id) => (

                                    <TableRow className='w-full' key={id}>
                                        <TableCell>
                                            {department_name}
                                        </TableCell>
                                        <TableCell>
                                            {regulating_body_name}
                                        </TableCell>
                                        <TableCell>
                                            {license_number}
                                        </TableCell>
                                        <TableCell>
                                            {registration_number}
                                        </TableCell>
                                    </TableRow>

                                ))

                            }

                        </>



                    ))()
                }


            </TableBody>


        </Table>
        
    )
}

export default FacilityUpdatesTable