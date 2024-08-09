import React, { useState, useEffect, useContext } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import router from 'next/router'
import { hasPermission } from '../utils/checkPermissions';
import { PermissionContext } from '../providers/permissions';
import { useSearchParams } from 'next/navigation';

function FacilitySideMenu({ states, stateSetters, filters }) {

    const userPermissions = useContext(PermissionContext)

    const searchParams = useSearchParams()

    // const quickFilters = [
    //     {
    //         name: 'All',
    //         id: 'all',
    //         filters: Object.keys(filters),
    //     },
    //     {
    //         name: 'Approved',
    //         id: 'approved',
    //         filters: [
    //             { id: "approved", value: true },
    //             { id: "approved_national_level", value: true },
    //             { id: "rejected", value: false },
    //         ],
    //     },
    //     {
    //         name: 'New pending validation',
    //         id: 'new_pending_validation',
    //         filters: [
    //             { id: "pending_approval", value: true },
    //             { id: "has_edits", value: false },

    //         ],
    //     },
    //     {
    //         name: 'Updated pending validation',
    //         id: 'updated_pending_validation',
    //         filters: [
    //             { id: "has_edits", value: true },
    //             { id: "pending_approval", value: true },
    //         ],
    //     },
    //     {
    //         name: 'Facilities pending approval',
    //         id: 'to_publish',
    //         filters: [
    //             { id: "to_publish", value: true },
    //         ],
    //     },
    //     {
    //         name: 'DHIS Synced Facilities',
    //         id: 'dhis_synced_facilities',
    //         filters: [
    //             { id: "approved", value: true },
    //             { id: "approved_national_level", value: true },
    //             { id: "rejected", value: false },
    //             { id: "reporting_in_dhis", value: true },
    //         ]
    //     },
    //     {
    //         name: 'Failed Validation',
    //         id: 'failed_validation',
    //         filters: [
    //             { id: "rejected", value: true },
    //         ],
    //     },
    //     {
    //         name: 'Incomplete',
    //         id: 'incomplete',
    //         filters: [
    //             { id: "is_complete", value: false },
    //         ]
    //     },
    //     {
    //         name: 'Rejected',
    //         id: 'rejected',
    //         filters: [
    //             { id: "rejected_national", value: true },
    //         ]
    //     },
    //     {
    //         name: 'Closed',
    //         id: 'closed',
    //         filters: [
    //             { id: "closed", value: true },
    //         ]
    //     }
    // ]




    return (

        <div className='col-span-1 w-full flex flex-col gap-3 md:col-start-1 md:mb-12 pt-0 max-h-min rounded bg-gray-50 shadow-md'>
            <List
                className='p-0 m-0'
                component="nav"
                aria-labelledby="nested-list-subheader"
                style={{
                    paddingTop: "0px !important"
                }}

            >
                {/* All Facilities */}
              
                <ListItemButton 
                  sx={{  
                    backgroundColor: (searchParams.get('filter') == 'all_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'all_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 
                //   className=' hover:bg-gray-50 text-gray-900 bg-transparent focus:bg-blue-600 focus:text-white' 
                 name="rt"
                    onClick={(e) => {

                        e.preventDefault()

                        router.push({
                            pathname:'/facilities',
                            query: {
                                filter:'all_facilities'
                            }
                        })

                      
                    }}
                >
                    <ListItemText primary="All Facilities" />
                </ListItemButton>
                    

                {/* Approved Facilities */}
                {

                hasPermission(/^facilities.view_facility$/, userPermissions) &&
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'approved_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'approved_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                onClick={(ev) => {

                    ev.preventDefault()

                    router.push({
                        pathname:'/facilities',
                        query: {
                            filter:'approved_facilities',
                            approved: true,
                            approved_national_level: true,
                            rejected: false
                        }
                    })

                 
                    }}
                >
                    <ListItemText primary="Approved Facilities" />
                </ListItemButton>
                }

                {/* New Facilities Pending Validation */}

                {

                hasPermission(/^facilities.view_facilityapproval$/, userPermissions) &&
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'pending_validation_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'pending_validation_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                onClick={(e) => {

                    e.preventDefault()

                    router.push({
                        pathname:'/facilities',
                        query: {
                            filter:'pending_validation_facilities',
                            pending_approval: true,
                            has_edits: false
                        }
                    })
                 
                    }}
                >
                    <ListItemText primary="New Facilities Pending Validation" />
                </ListItemButton>
                }

                {/* Update Facilities Pending Validation */}
                {

                hasPermission(/^facilities.view_facilityapproval$/, userPermissions) &&
                <ListItemButton 

                  sx={{  
                    backgroundColor: (searchParams.get('filter') == 'updated_pending_validation_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'updated_pending_validation_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 
                    onClick={(e) => {

                        e.preventDefault()

                        router.push({
                            pathname:'/facilities',
                            query: {
                                filter:'updated_pending_validation_facilities',
                                have_updates: true
                            }
                        })
                 
                    }}
                >
                    <ListItemText primary="Updated Facilities Pending Validation" />
                </ListItemButton>
                }

                {/* Facilities Pending Approval  */}
                {

                 hasPermission(/^facilities.view_facilityapproval$/, userPermissions) && // confirm permission
                 
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'pending_approval_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'pending_approval_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                    onClick={(e) => {
                        e.preventDefault()

                        router.push({
                            pathname:'/facilities',
                            query: {
                                filter:'pending_approval_facilities',
                                to_publish: true
                            }
                        })
                      
                    }}
                >
                    <ListItemText primary="Facilities Pending Approval" />
                </ListItemButton>
                }

                {/* Approved DHIS Synced Facilities */}
                {
                    hasPermission(/^facilities.view_facilityapproval$/, userPermissions) && // confirm permission

                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'dhis_synched_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'dhis_synched_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                onClick={(e) => {

                    e.preventDefault()

                    router.push({
                        pathname:'/facilities',
                        query: {
                            filter:'dhis_synched_facilities',
                            approved: true,
                            approved_national_level: true,
                            rejected: false,
                            reporting_in_dhis: true
                        }
                    })
                
                    }}
                >
                    <ListItemText primary="Approved DHIS Synced Facilities" />
                </ListItemButton>
                }

                {/* Failed Validation Facilities */}
                {

                hasPermission(/^facilities.view_rejected_facilities$/, userPermissions) &&
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'failed_validation_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'failed_validation_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                onClick={(e) => {

                    e.preventDefault()

                    router.push({
                        pathname:'/facilities',
                        query: {
                            filter:'failed_validation_facilities',
                            rejected: true
                        }
                    })
                   
                    }}
                >
                    <ListItemText primary="Failed Validation Facilities" />
                </ListItemButton>
                }

                {/* Rejected Facilities */}
                {

                hasPermission(/^facilities.view_rejected_facilities$/, userPermissions) &&
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'rejected_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'rejected_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}}    
                onClick={(e) => {

                    e.preventDefault()

                    
                    router.push({
                        pathname:'/facilities',
                        query: {
                            filter:'rejected_facilities',
                            rejected_national_true: true
                        }
                    })
                  
                    }}
                >
                    <ListItemText primary="Rejected Facilities" />
                </ListItemButton>
                }

                {/* Closed Facilities  */}
                {

                hasPermission(/^facilities.view_closed_facilities$/, userPermissions) &&
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'closed_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'closed_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                    onClick={(e) => {

                        e.preventDefault()

                        router.push({
                            pathname:'/facilities',
                            query: {
                                filter:'closed_facilities',
                                closed: true 
                            }
                        })
                  
                    }}
                >
                
                    <ListItemText primary="Closed Facilities " />
                </ListItemButton>       
                }

                {/* Incomplete Facilities */}
                {

                hasPermission(/^facilities.view_facility$/, userPermissions) &&
                <ListItemButton
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'incomplete_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'incomplete_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 
                    onClick={(e) => {

                        e.preventDefault()

                        router.push({
                            pathname:'/facilities',
                            query: {
                                filter:'incomplete_facilities',
                                incomplete: true
                            }
                        })
                     
                    }}
                >
                    <ListItemText primary="Incomplete Facilities" />
                </ListItemButton>
                }

                {/* Synchronize Regulated Facilities */}
                {

              hasPermission(/^facilities.view_facility$/, userPermissions) &&
               <ListItemButton 
               sx={{  
                backgroundColor: (searchParams.get('filter') == 'synchronized_regulated_facilities') && '#1d4ed8',
                color: (searchParams.get('filter') == 'synchronized_regulated_facilities') && '#ffff',  
                borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 1)",
                    color: 'white'
              }}}  
                onClick={(e) => {

                    e.preventDefault()

                    router.push({
                        pathname:'/facilities',
                        query: {
                            filter:'synchronized_regulated_facilities',
                            mfl_code_null: true
                        }
                    })
                        
                        }}
                >
                    <ListItemText primary="Synchronize Regulated Facilities" />
                </ListItemButton>
                }

                {/* Feedback on Facilities */}
                {

                hasPermission(/^facilities.view_facilityservicerating$/, userPermissions) &&
                <ListItemButton 
                sx={{  
                    backgroundColor: (searchParams.get('filter') == 'feed_back_facilities') && '#1d4ed8',
                    color: (searchParams.get('filter') == 'feed_back_facilities') && '#ffff',  
                    borderBottom: 'solid 1px  rgba(156, 163, 175, 1)', 
                    "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 1)",
                        color: 'white'
                  }}} 

                    onClick={(e) => {

                        e.preventDefault()

                        router.push({
                            pathname:'/facilities',
                            query: {
                                filter:'feed_back_facilities',
                            }
                        })
                     
                    }}
                >

                    <ListItemText primary="Feedback on Facilities" />
                </ListItemButton>
                }
                

            </List>
        </div>
    )
}



export default FacilitySideMenu