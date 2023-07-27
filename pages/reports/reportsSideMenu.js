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



const ReportsSideMenu = () => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter();
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


   

    const [menu, setMenu] = useReducer(menuReducer, {
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
                        onClick={() => setMenu({ type: 'health_facility_reports', value: !menu.openFacilityReports })}
                        className={`${menu.openFacilityReports && 'bg-gray-500 bg-opacity-25 text-gray-800'} border-t-2 border-gray-500`}
                    >
                        <ListItemIcon>
                            <LocalHospital className={`${menu.openFacilityReports && 'text-gray-500'} group-hover:text-gray-500`} />
                        </ListItemIcon>
                        <ListItemText sx={{ fontWeight: '2rem' }} primary="Facilities" />
                        {menu.openFacilityReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }
            >


                <Collapse in={menu.openFacilityReports} timeout="auto" unmountOnExit>
                    <List component="ul" disablePadding>
                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                            router.push('/reports');
                            }}>
                            <ListItemText primary="Beds and Cots" />
                        </ListItemButton>
                        {/* {console.log({label})} */}
                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                            router.push('/reports/facilities_count');    
                    }}>
                            <ListItemText primary="Keph Level" />
                        </ListItemButton>

                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                            router.push('/reports/facilities_count');
                            
                            
                    }}>
                            <ListItemText primary="Facilities Ownership" />
                        </ListItemButton>

                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                       router.push('/reports/facilities_by_owner_categories')
                            
                            
                    }}>
                            <ListItemText primary="Facility Type" />
                        </ListItemButton>
                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                       router.push('/reports/facilities_by_type')
                            
                            
                    }}>
                            <ListItemText primary="Regulatory Body" />
                        </ListItemButton>

                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                            router.push('/reports/facilities_by_keph_levels')
                            
                            
                    }}>
                            <ListItemText primary="Facility Services" />
                        </ListItemButton>
                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                            router.push('/reports/facility_coordinates')
                            
                            
                    }}>
                            <ListItemText primary="Facility Infrastructure" />
                        </ListItemButton>

                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                            router.push('/reports/officers_in_charge')
                            
                            
                    }}>
                            <ListItemText primary="Facililty Incharge Details" />
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
                        onClick={() => setMenu({ type: 'admin_offices', value: !menu.openAdminOfficesReports })}
                        className={`${menu.openAdminOfficesReports && 'bg-gray-500 bg-opacity-25'} border-t-2 border-gray-500`}>
                        <ListItemIcon>
                            <HomeWork />
                        </ListItemIcon>
                        <ListItemText primary="Administrative Offices" />
                        {menu.openAdminOfficesReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }
            >
                <Collapse in={menu.openAdminOfficesReports} timeout="auto" unmountOnExit>
                    <List component="ul" disablePadding>
                    <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                       
                            
                            
                    }}>
                            <ListItemText primary="Admin Offices" />
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
                        onClick={() => setMenu({ type: 'community_health_units', value: !menu.openCUReports })}
                        className={`${menu.openCUReports && 'bg-gray-500 bg-opacity-25'} border-t-2 border-gray-500`}>
                        <ListItemIcon>
                            <Groups />
                        </ListItemIcon>
                        <ListItemText primary="Community Health Units" />
                        {menu.openCUReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                }
            >
                <Collapse in={menu.openCUReports} timeout="auto" unmountOnExit>
                    <List component="ul" disablePadding>
                    <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                       
                            
                            
                    }}>
                            <ListItemText primary="Community Health Units Count" />
                        </ListItemButton>
                        <ListItemButton className={'focus:bg-green-600 focus:text-white hover:text-gray-600'}  onClick={() => { 
                       
                            
                            
                    }}>
                            <ListItemText primary="Community Health Units (Status)" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>


        </div>
    )
}


export default ReportsSideMenu