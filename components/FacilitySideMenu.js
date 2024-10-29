import React, { useState, useEffect, useContext } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import router from 'next/router'
import { hasPermission } from '../utils/checkPermissions';
import { PermissionContext } from '../providers/permissions';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '../providers/user';

function FacilitySideMenu(/*{ states, stateSetters, filters }*/) {

    const userPermissions = useContext(PermissionContext)


    const searchParams = useSearchParams()

    const userCtx = useContext(UserContext)

    const userGroup = userCtx?.groups[0]?.id

    const userCounty = userCtx?.user_counties[0]?.county

    const userSubCounty = userCtx?.user_sub_counties[0]?.sub_county



    function userOrgUnit() {

        
        if(userCtx?.user_sub_counties.length == 2 && userGroup === 2) {
            return {sub_county: `${userCtx?.user_sub_counties[0]?.sub_county},${userCtx?.user_sub_counties[1]?.sub_county}`}
        }
        else 
        {
        if(userGroup === 1) { // CHRIO
            return {county: userCounty}
        } else if (userGroup === 2) {
            return {sub_county: userSubCounty}
        } else {
            return {}
        }
     }
    }

    return (
        (<div className='col-span-1 w-full flex flex-col gap-3 md:col-start-1 md:mb-12 pt-0 max-h-min rounded bg-gray-50 shadow-md'>
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
                                filter:'all_facilities',
                            ...userOrgUnit()

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
                            rejected: false,
                            closed: false,
                            ...userOrgUnit()
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
                            has_edits: false,
                            ...userOrgUnit()

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
                                have_updates: true,
                                closed: false,
                                ...userOrgUnit()

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
                                to_publish: true,
                                closed: false,
                                ...userOrgUnit()

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
                            reporting_in_dhis: true,
                            closed: false,
                            ...userOrgUnit()

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
                            rejected: true,
                            closed: false,
                            ...userOrgUnit()

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
                            rejected_national: true,
                            closed: false,
                            ...userOrgUnit()

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
                                closed: true,
                                ...userOrgUnit()

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
                                incomplete: true,
                                closed: false,
                            ...userOrgUnit()

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
                            mfl_code_null: true,
                            close: false,
                            ...userOrgUnit()

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
                            ...userOrgUnit()

                            }
                        })
                     
                    }}
                >

                    <ListItemText primary="Feedback on Facilities" />
                </ListItemButton>
                }
                

            </List>
        </div>)
    );
}



export default FacilitySideMenu