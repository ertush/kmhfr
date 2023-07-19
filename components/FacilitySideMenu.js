import React, { useState, useEffect, useContext } from 'react'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import router from 'next/router'
import { hasPermission } from '../utils/checkPermissions';
import { PermissionContext } from '../providers/permissions';

function FacilitySideMenu({ states, stateSetters, filters }) {

    const userPermissions = useContext(PermissionContext)



    const quickFilters = [
        {
            name: 'All',
            id: 'all',
            filters: Object.keys(filters),
        },
        {
            name: 'Approved',
            id: 'approved',
            filters: [
                { id: "approved", value: true },
                { id: "approved_national_level", value: true },
                { id: "rejected", value: false },
            ],
        },
        {
            name: 'New pending validation',
            id: 'new_pending_validation',
            filters: [
                { id: "pending_approval", value: true },
                { id: "has_edits", value: false },

            ],
        },
        {
            name: 'Updated pending validation',
            id: 'updated_pending_validation',
            filters: [
                { id: "has_edits", value: true },
                { id: "pending_approval", value: true },
            ],
        },
        {
            name: 'Facilities pending approval',
            id: 'to_publish',
            filters: [
                { id: "to_publish", value: true },
            ],
        },
        {
            name: 'DHIS Synced Facilities',
            id: 'dhis_synced_facilities',
            filters: [
                { id: "approved", value: true },
                { id: "approved_national_level", value: true },
                { id: "rejected", value: false },
                { id: "reporting_in_dhis", value: true },
            ]
        },
        {
            name: 'Failed Validation',
            id: 'failed_validation',
            filters: [
                { id: "rejected", value: true },
            ],
        },
        {
            name: 'Incomplete',
            id: 'incomplete',
            filters: [
                { id: "is_complete", value: false },
            ]
        },
        {
            name: 'Rejected',
            id: 'rejected',
            filters: [
                { id: "rejected_national", value: true },
            ]
        },
        {
            name: 'Closed',
            id: 'closed',
            filters: [
                { id: "closed", value: true },
            ]
        }
    ]

    const [
        khisSynched,
        facilityFeedBack,
        pathId,
        allFctsSelected,
        title
    ] = states

    const [
        setKhisSynched,
        setFacilityFeedBack,
        setPathId,
        setAllFctsSelected,
        setTitle
    ] = stateSetters

    const [approvedFctsSelected, setApprovedFctsSelected] = useState(false);
    const [newFtsSelected, setNewFctsSelected] = useState(false);
    const [updatedFctsSelected, setUpdatedFctsSelected] = useState(false);
    const [failedValidationFctsSelected, setFailedValidationFctsSelected] = useState(false);
    const [rejectedFctsSelected, setRejectedFctsSelected] = useState(false);
    const [closedFctsSelected, setClosedFctsSelected] = useState(false);
    const [syncRegulatedFctsSelected, setSyncRegulatedFctsSelected] = useState(false);
    const [incompleteFctsSelected, setIncompleteFctsSelected] = useState(false);
    const [feedBackFctsSelected, setFeedBackFctsSelected] = useState(false);
    const [facilitiesPendingApproval, setFacilitiesPendingApproval] = useState(false);
    const [DHISSyncedFacilities, setDHISSyncedFacilities] = useState(false);



    if (allFctsSelected && pathId.length > 0) {
        setAllFctsSelected(false)
    }

    const handleQuickFiltersClick = async (filter_id) => {

        let filter = {}
        if (filter_id !== 'khis_synched' && filter_id !== 'feedback') {

            const qfilter = quickFilters.filter(({ id }) => id === filter_id).map(f => f.filters.map(({ id, value }) => ({ id, value })))

            qfilter[0].forEach(({ id, value }) => { filter[id] = value })

            if (filter_id === 'new_pending_validation') filter['is_complete'] = true;

        }


        switch (filter_id) {
            case 'all':
                setFacilityFeedBack([])
                setKhisSynched(false)
                router.push({ pathname: '/facilities', query: { qf: filter_id } })
                break;
            case 'khis_synched':
                setFacilityFeedBack([])
                setKhisSynched(true)
                break;
            case 'feedback':
                setKhisSynched(false)
                try {
                    const feedback = await fetch('/api/facility/facility_filters/?path=facility_service_ratings&fields=county,sub_county,constituency,ward,comment,facility_id,facility_name,service_name,created,rating&id=feedback')
                    const feedbackFacilities = (await feedback.json()).results

                    setFacilityFeedBack(feedbackFacilities)

                }
                catch (err) {
                    console.error(err.message);
                }

                break;
            default:
                setFacilityFeedBack([])
                setKhisSynched(false)


                router.push({ pathname: '/facilities', query: { qf: filter_id, ...filter } })
                break;
        }


    }



    useEffect(() => {
        const url = window.history.state.as
        if (url.includes('qf=all')) { setPathId('all'); setAllFctsSelected(true) }
        if (url.includes('qf=approved')) { setPathId('approved'); setApprovedFctsSelected(true) }
        if (url.includes('qf=new_pending_validation')) { setPathId('new_pending_validation'); setNewFctsSelected(true) }
        if (url.includes('qf=updated_pending_validation')) { setPathId('updated_pending_validation'); setUpdatedFctsSelected(true) }
        if (url.includes('qf=to_publish')) { setPathId('to_publish'); setFacilitiesPendingApproval(true) }
        if (url.includes('qf=dhis_synced_facilities')) { setPathId(' dhis_synced_facilities'); setKhisSynched(true) }
        if (url.includes('qf=failed_validation')) { setPathId('failed_validation'); setFailedValidationFctsSelected(true) }
        if (url.includes('qf=rejected')) { setPathId('rejected'); setRejectedFctsSelected(true) }
        if (url.includes('qf=closed')) { setPathId('closed'); setClosedFctsSelected(true) }
        if (url.includes('qf=incomplete')) { setPathId('incomplete'); setIncompleteFctsSelected }
        if (url.includes('qf=khis_synched')) { setPathId('khis_synched'); setKhisSynched(true) }
        if (url.includes('qf=feedback')) { setPathId('feedback'); setFeedBackFctsSelected(true) }

    }, [])

    return (

        <div className='col-span-1 flex flex-col gap-3 md:col-start-1 border bg-django-green md:mb-12 py-0 h-auto border-green-600'>
            <List
                className='p-0 m-0'
                component="nav"
                aria-labelledby="nested-list-subheader"

            >
                {/* All Facilities */}
              
                <ListItemButton 
                  sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                  className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                 name="rt"
                    onClick={(ev) => {
                        
                        handleQuickFiltersClick('all')

                    }}
                >
                    <ListItemText primary="All Facilities" />
                </ListItemButton>
                    

                {/* Approved Facilities */}
                {

                hasPermission(/^facilities.view_facility$/, userPermissions) &&
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                onClick={(ev) => {
                       
                        handleQuickFiltersClick('approved')


                    }}
                >
                    <ListItemText primary="Approved Facilities" />
                </ListItemButton>
                }

                {/* New Facilities Pending Validation */}

                {

                hasPermission(/^facilities.view_facilityapproval$/, userPermissions) &&
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                onClick={() => {
                        

                        handleQuickFiltersClick('new_pending_validation')

                    }}
                >
                    <ListItemText primary="New Facilities Pending Validation" />
                </ListItemButton>
                }

                {/* Update Facilities Pending Validation */}
                {

                hasPermission(/^facilities.view_facilityapproval$/, userPermissions) &&
                <ListItemButton 

                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                    onClick={() => {
                      
                        handleQuickFiltersClick('updated_pending_validation')

                    }}
                >
                    <ListItemText primary="Updated Facilities Pending Validation" />
                </ListItemButton>
                }

                {/* Facilities Pending Approval  */}
                {

                 hasPermission(/^facilities.view_facilityapproval$/, userPermissions) && // confirm permission
                 
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                    onClick={() => {
                     

                        handleQuickFiltersClick('to_publish')

                    }}
                >
                    <ListItemText primary="Facilities Pending Approval" />
                </ListItemButton>
                }

                {/* Approved DHIS Synced Facilities */}
                {
                    hasPermission(/^facilities.view_facilityapproval$/, userPermissions) && // confirm permission

                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                onClick={() => {
    
                        handleQuickFiltersClick('dhis_synced_facilities')

                    }}
                >
                    <ListItemText primary="Approved DHIS Synced Facilities" />
                </ListItemButton>
                }

                {/* Failed Validation Facilities */}
                {

                hasPermission(/^facilities.view_rejected_facilities$/, userPermissions) &&
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
               className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                onClick={() => {
                      

                        handleQuickFiltersClick('failed_validation')
                    }}
                >
                    <ListItemText primary="Failed Validation Facilities" />
                </ListItemButton>
                }

                {/* Rejected Facilities */}
                {

                hasPermission(/^facilities.view_rejected_facilities$/, userPermissions) &&
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white'     
                onClick={() => {
                      
                        handleQuickFiltersClick('rejected')

                    }}
                >
                    <ListItemText primary="Rejected Facilities" />
                </ListItemButton>
                }

                {/* Closed Facilities */}
                {

                hasPermission(/^facilities.view_closed_facilities$/, userPermissions) &&
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
               className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white'  
                    onClick={() => {
                       
                        handleQuickFiltersClick('closed')

                    }}
                >
                
                    <ListItemText primary="Closed Facilities " />
                </ListItemButton>       
                }

                {/* Incomplete Facilities */}
                {

                hasPermission(/^facilities.view_facility$/, userPermissions) &&
                <ListItemButton
                    sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                    className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                    onClick={() => {
                   

                        handleQuickFiltersClick('incomplete')

                    }}
                >
                    <ListItemText primary="Incomplete Facilities" />
                </ListItemButton>
                }

                {/* Synchronize Regulated Facilities */}
                {

              hasPermission(/^facilities.view_facility$/, userPermissions) &&
               <ListItemButton 
               sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
               className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                onClick={() => {
                      
                            handleQuickFiltersClick('khis_synched')

                        }}
                >
                    <ListItemText primary="Synchronize Regulated Facilities" />
                </ListItemButton>
                }

                {/* Feedback on Facilities */}
                {

                hasPermission(/^facilities.view_facilityservicerating$/, userPermissions) &&
                <ListItemButton 
                sx={{ borderBottom: 'solid 1px rgba(5, 150, 105, 1)' }} 
                className='hover:text-gray-900 hover:bg-yellow-50 bg-transparent focus:bg-green-600 focus:text-white' 
                    onClick={() => {
                     

                        handleQuickFiltersClick('feedback')

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