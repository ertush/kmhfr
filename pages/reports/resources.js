import React, { useReducer } from 'react'
import { useRouter } from 'next/router'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { LicenseManager } from '@ag-grid-enterprise/core';
import ListItemIcon from '@mui/material/ListItemIcon';

import { Groups, HomeWork, LocalHospital } from '@mui/icons-material';



const Resources = ({ label }) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    // const router = useRouter();

    const menuReducer = (state, action) => {
        switch (action.type) {
            case 'health_facility_reports':
                return {
                    ...state,
                    openFacilityReports: action.value
                }
            case 'admin_offices':
                return {
                    ...state,
                    openAdminOfficesReports: action.value
                }
            case 'community_health_units':
                return {
                    ...state,
                    openCUReports: action.value
                }
            default:
                return {
                    ...state
                }
        }
    }

    const [menu, dispatch] = useReducer(menuReducer, {
        openFacilityReports: false,
        openAdminOfficesReports: false,
        openCUReports: false
    })



    return (

        <div className='col-span-2 w-full col-start-1 border bg-django-green h-screen border-green-600'>


            {/* Health Facility Reports*/}

            <List
                component="div"
                aria-labelledby="nested-list-subheader"
                className='border-b border-green-600 p-0'
                subheader={
                    <ListItemButton 
                    onClick={() => dispatch({ type: 'health_facility_reports', value: !menu.openFacilityReports })} 
                    className={`${menu.openFacilityReports && 'bg-gray-500 bg-opacity-25 text-gray-800'}`}>
                        <ListItemIcon>
                            <LocalHospital className={`${menu.openFacilityReports && 'text-gray-500' } group-hover:text-gray-500 group-hover:bg-gray-100 `} />
                        </ListItemIcon>
                        <ListItemText sx={{fontWeight:'2rem'}} primary="Facilities" />
                        {menu.openFacilityReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }
            >


                <Collapse in={menu.openFacilityReports} timeout="auto" unmountOnExit>
                    <List component="ul" disablePadding>
                        <ListItemButton className={`${label?.toLocaleLowerCase() == 'beds_cots' && 'bg-green-600 text-white'}  group hover:text-gray-600 hover:bg-gray-100`} onClick={() => { console.log('/reports') }}>
                            <ListItemText  primary="Beds and Cots" />
                        </ListItemButton>
                        {console.log({label})}
                        <ListItemButton className={`${label?.toLocaleLowerCase() == 'facilities_count' && 'bg-green-600 text-white'}  group hover:text-gray-600 hover:bg-gray-100`} onClick={() => { console.log('/reports/facilities_count') }}>
                            <ListItemText  primary="Facilities Count" />
                        </ListItemButton>

                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'facilities_owners' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/facilities_by_owners') }}>
                            <ListItemText  primary="Facilities by Owners" />
                        </ListItemButton>

                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'facilities_owner_categories' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/facilities_by_owner_categories') }}>
                            <ListItemText  primary="Facilities by Owner Categories" />
                        </ListItemButton>
                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'facilities_type' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/facilities_by_type') }}>
                            <ListItemText  primary="Facilities by Facility Type" />
                        </ListItemButton>

                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'facilities_keph_level' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/facilities_by_keph_levels') }}>
                            <ListItemText  primary="Keph Levels" />
                        </ListItemButton>
                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'facilities_coordinates' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/facility_coordinates') }}>
                            <ListItemText  primary="Facility Coordinates" />
                        </ListItemButton>

                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'officers_in_charge' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/officers_in_charge') }}>
                            <ListItemText  primary="Officers In-charge" />
                        </ListItemButton>
                    </List>
                </Collapse>


            </List>


            {/* Administrative Offices*/}

            <List
                component="div"
                aria-labelledby="nested-list-subheader"
                className='border-b border-green-600 p-0'
                subheader={
                    <ListItemButton 
                    onClick={() => dispatch({ type: 'admin_offices', value: !menu.openAdminOfficesReports })}  
                    className={`${menu.openAdminOfficesReports && 'bg-gray-500 bg-opacity-25'} border-t-2 border-gray-500`}>
                        <ListItemIcon>
                            <HomeWork />
                        </ListItemIcon>
                        <ListItemText  primary="Administrative Offices" />
                        {menu.openAdminOfficesReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }
            >
                <Collapse in={menu.openAdminOfficesReports} timeout="auto" unmountOnExit>
                <List component="ul" disablePadding>
                    <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'admin_offices' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/admin_offices') }}>
                        <ListItemText  primary="Admin Offices" />
                    </ListItemButton>
                </List>
                </Collapse >

            </List>


            {/* Community Health Units*/}
            <List
                component="div"
                aria-labelledby="nested-list-subheader"
                className={`${menu.openCUReports && 'border-b border-green-600'} p-0`}
                subheader={
                    <ListItemButton 
                    onClick={() => dispatch({ type: 'community_health_units', value: !menu.openCUReports })}
                    className={`${menu.openCUReports && 'bg-gray-500 bg-opacity-25'}`}>
                        <ListItemIcon>
                            <Groups />
                        </ListItemIcon>
                        <ListItemText  primary="Community Health Units" />
                        {menu.openCUReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }
            >
                <Collapse in={menu.openCUReports} timeout="auto" unmountOnExit>
                    <List component="ul" disablePadding>
                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'chus_count' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/chus_count') }}>
                            <ListItemText  primary="Community Health Units Count" />
                        </ListItemButton>
                        <ListItemButton className="" sx={{  backgroundColor: `${label?.toLocaleLowerCase() == 'chus_status' ? '#e7ebf0' : 'none'}` }} onClick={() => { console.log('/reports/chus_status') }}>
                            <ListItemText  primary="Community Health Units (Status)" />
                        </ListItemButton>
                     </List>
                </Collapse>
            </List>


        </div>
    )
}


export default Resources