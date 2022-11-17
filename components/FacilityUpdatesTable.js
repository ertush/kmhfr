import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function FacilityUpdatesTable({facilityUpdatedJson, originalData}) {
  return (
    <Table className="md:px-4">
        <TableHead className='text-xl font-semibold'>
            <h2>Facility Updates</h2>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>
                <p className='text-base font-semibold'>Field</p>
                </TableCell>
                <TableCell  className='text-xl font-semibold'>
                <p className='text-base font-semibold'>Old Value</p>
                </TableCell>
                <TableCell className='text-xl font-semibold'>
                <p className='text-base font-semibold'>New Value</p>
                </TableCell>
            </TableRow>
        

            {/* Basic details updates  */}
            {
            
                facilityUpdatedJson && 
                Object.values(facilityUpdatedJson).map(item => {
                    
                        return  item.length !== undefined ?
                        item.map(({human_field_name, display_value, field_name}, id) => (
                            
                                <TableRow key={id}>
                                    {/* debug {console.log({item})} */}
                                    <TableCell>
                                        {human_field_name}
                                    </TableCell>
                                    <TableCell>
                                        {typeof(originalData?.data[field_name]) === 'boolean' ? (Boolean(originalData?.data[field_name]) ? 'Yes' : 'No') : originalData?.data[field_name]}
                                    </TableCell>
                                    <TableCell>
                                        {display_value}
                                    </TableCell>
                                </TableRow>

                        ))
                        :''
                        }
                    )
                
            }

            {/* Officer in charge updates */}

            <TableRow>
                {
                    facilityUpdatedJson.officer_in_charge && 
                    <div className='flex-col gap-2 items-start mt-4'>
                        <h3 className='text-lg font-semibold'>Officer In-Charge</h3>
                        <div className='grid md:grid-cols-5 grid-cols-2 justify-start gapx-x-2 gap-y-3'>
                            {/* {console.log({facilityUpdatedJson})} */}
                            {/* Key Value */}
                            <p className='text-base font-semibold col-start-1'>Name{' :'}</p>
                            <p className='text-base font-normal col-start-2'>{facilityUpdatedJson.officer_in_charge.name}</p>
                            <p className='text-base font-semibold col-start-1'>Registration Number{' :'}</p>
                            <p className='text-base font-normal col-start-2'>{facilityUpdatedJson.officer_in_charge.reg_no}</p>
                            <p className='text-base font-semibold col-start-1'>Job Title{' :'}</p>
                            <p className='text-base font-normal col-start-2 text-wrap' title={facilityUpdatedJson.officer_in_charge.job_title_name}>{facilityUpdatedJson.officer_in_charge.job_title_name}</p>
                        </div>
                    </div>
                
                }
            </TableRow>

            {/* Service updates */}

            <TableRow>
                {
                    facilityUpdatedJson?.services && 
                    <div className='flex-col gap-2 items-start mt-4'>
                        <h3 className='text-lg font-semibold'>Services</h3>
                        <div className='grid md:grid-cols-5 grid-cols-2 justify-start gapx-x-2 gap-y-3'>
                            {/* {console.log({facilityUpdatedJson})} */}
                            {/* Key Value */}
                            <p className='text-base font-semibold col-start-1'>Name{' :'}</p>
                            <p className='text-base font-normal col-start-2'>{facilityUpdatedJson.service.name}</p>

                        </div>
                    </div>
                
                }
            </TableRow>
            {/* Infrastructure updates */}
            {/* Human resources updates */}
            </TableBody>
            

    </Table>
  )
}

export default FacilityUpdatesTable