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

        <div className='col-span-1 w-full md:col-start-1 border-r-2 border-gray-300 h-full'>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper', borderLeft:'2px solid #d1d5db', flexGrow: 1 }}
                component="nav"
                aria-labelledby="nested-list-subheader"

            >
                {/* All Facilities */}
              
                <ListItemButton sx={{ backgroundColor: (allFctsSelected || pathId === 'all') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }} name="rt"
                    onClick={(ev) => {
                        setTitle('Facilities')
                        setPathId('all')
                        setAllFctsSelected(true)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setFailedValidationFctsSelected(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('all')

                    }}
                >
                    <ListItemText primary="All Facilities" />
                </ListItemButton>
                    

                {/* Approved Facilities */}
                {

                hasPermission(/^facilities.view_facility$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (approvedFctsSelected || pathId === 'approved') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={(ev) => {
                        setTitle('Approved Facilities')
                        setAllFctsSelected(false)
                        setPathId('approved')
                        setApprovedFctsSelected(true)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setFailedValidationFctsSelected(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('approved')


                    }}
                >
                    <ListItemText primary="Approved Facilities" />
                </ListItemButton>
                }

                {/* New Facilities Pending Validation */}

                {

                hasPermission(/^facilities.view_facilityapproval$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (newFtsSelected || pathId === 'new_pending_validation') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Validate New Facilities')
                        setPathId('new_pending_validation')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(true)
                        setUpdatedFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setFailedValidationFctsSelected(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('new_pending_validation')

                    }}
                >
                    <ListItemText primary="New Facilities Pending Validation" />
                </ListItemButton>
                }

                {/* Update Facilities Pending Validation */}
                {

                hasPermission(/^facilities.view_facilityapproval$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (updatedFctsSelected || pathId === 'updated_pending_validation') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Validate Updated Facilities')
                        setPathId('updated_pending_validation')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(true)
                        setFailedValidationFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('updated_pending_validation')

                    }}
                >
                    <ListItemText primary="Updated Facilities Pending Validation" />
                </ListItemButton>
                }

                {/* Facilities Pending Approval  */}
                {

                 hasPermission(/^facilities.view_facilityapproval$/, userPermissions) && // confirm permission
                 
                <ListItemButton sx={{ backgroundColor: (facilitiesPendingApproval || pathId === 'to_publish') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Facilities Pending Approval')
                        setPathId('to_publish')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFacilitiesPendingApproval(true)
                        setDHISSyncedFacilities(false)
                        setFailedValidationFctsSelected(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('to_publish')

                    }}
                >
                    <ListItemText primary="Facilities Pending Approval" />
                </ListItemButton>
                }

                {/* Approved DHIS Synced Facilities */}
                {
                    hasPermission(/^facilities.view_facilityapproval$/, userPermissions) && // confirm permission

                <ListItemButton sx={{ backgroundColor: (DHISSyncedFacilities || pathId === 'dhis_synced_facilities') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('DHIS Synced Approved Facilities')
                        setPathId('dhis_synced_facilities')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(true)
                        setFailedValidationFctsSelected(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('dhis_synced_facilities')

                    }}
                >
                    <ListItemText primary="Approved DHIS Synced Facilities" />
                </ListItemButton>
                }

                {/* Failed Validation Facilities */}
                {

                hasPermission(/^facilities.view_rejected_facilities$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (failedValidationFctsSelected || pathId === 'failed_validation') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Failed Validation Facilities')
                        setPathId('failed_validation')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFailedValidationFctsSelected(true)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('failed_validation')
                    }}
                >
                    <ListItemText primary="Failed Validation Facilities" />
                </ListItemButton>
                }

                {/* Rejected Facilities */}
                {

                hasPermission(/^facilities.view_rejected_facilities$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (rejectedFctsSelected || pathId === 'rejected') ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Rejected Facilities')
                        setPathId('rejected')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFailedValidationFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(true)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)
                        handleQuickFiltersClick('rejected')

                    }}
                >
                    <ListItemText primary="Rejected Facilities" />
                </ListItemButton>
                }

                {/* Closed Facilities */}
                {

                hasPermission(/^facilities.view_closed_facilities$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (closedFctsSelected || pathId == "closed") ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Closed Facilities')
                        setPathId('closed')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFailedValidationFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(true)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('closed')

                    }}
                >
                
                    <ListItemText primary="Closed Facilities " />
                </ListItemButton>       
                }

                {/* Incomplete Facilities */}
                {

                hasPermission(/^facilities.view_facility$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (incompleteFctsSelected || pathId == "incomplete") ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Incomplete Facilities')
                        setPathId('incomplete')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFailedValidationFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(true)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('incomplete')

                    }}
                >
                    <ListItemText primary="Incomplete Facilities" />
                </ListItemButton>
                }

                {/* Synchronize Regulated Facilities */}
                {

              hasPermission(/^facilities.view_facility$/, userPermissions) &&
               <ListItemButton sx={{ backgroundColor: (syncRegulatedFctsSelected || pathId == "khis_synched") ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Synchronize Regulated Facilities')
                        setPathId('khis_synched')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFailedValidationFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(true)
                        setFeedBackFctsSelected(false)

                        handleQuickFiltersClick('khis_synched')

                    }}
                >
                    <ListItemText primary="Synchronize Regulated Facilities" />
                </ListItemButton>
                }

                {/* Feedback on Facilities */}
                {

                hasPermission(/^facilities.view_facilityservicerating$/, userPermissions) &&
                <ListItemButton sx={{ backgroundColor: (feedBackFctsSelected || pathId == "feedback") ? '#e7ebf0' : 'none', borderBottom: 'solid 1px #9ca3af' }}
                    onClick={() => {
                        setTitle('Facilities Feedback From Public')
                        setPathId('feedback')
                        setAllFctsSelected(false)
                        setApprovedFctsSelected(false)
                        setNewFctsSelected(false)
                        setUpdatedFctsSelected(false)
                        setFailedValidationFctsSelected(false)
                        setFacilitiesPendingApproval(false)
                        setDHISSyncedFacilities(false)
                        setRejectedFctsSelected(false)
                        setClosedFctsSelected(false)
                        setIncompleteFctsSelected(false)
                        setSyncRegulatedFctsSelected(false)
                        setFeedBackFctsSelected(true)

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