import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { LicenseManager } from '@ag-grid-enterprise/core';


const Resources = ({setColumns, setUsers, search, setFiltered}) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    const router = useRouter()

	const [openHFR, setOpenHFR] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);
    const [openCHUs, setOpenCHUs] = useState(false);

	const handleHFRUnitsClick = () => {
		setOpenHFR(!openHFR);
	}
    const handleAdminClick = () => {
		setOpenAdmin(!openAdmin);
	}
    const handleCHUClick = () => {
		setOpenCHUs(!openCHUs);
	}

    let linelist =[]
    const handleClick =(params)=>{
        console.log(params)
        fetch(`/api/common/submit_form_data/?path=${params}`, {
            headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
                
            },
            method: 'GET' 
        })
        .then(res => res.json()).then(res=>{
            switch (params) {
                case 'beds_cots':
                    linelist=  res.results.map((county_beds)=>{
                        return {
                            ...county_beds,
                            area_name: county_beds.area_name,
                            facilities: county_beds.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    filter(search)
                    break;
                case 'facility_owners':
                    linelist =  res.results.map((facility_owners)=>{
                        return {
                            ...facility_owners,
                            owner: facility_owners.owner_category,
                            facilities: facility_owners.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    filter(search)
                    break;
                case 'owner_categories':
                    linelist =  res.results.map((facility_owners)=>{
                        return {
                            ...facility_owners,
                            owner: facility_owners.owner,
                            facilities: facility_owners.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    filter(search)
                    break; 
                case 'facility_type':
                    linelist =  res.results.map((facility_type)=>{
                        return {
                            ...facility_type,
                            facility_type: facility_type.type_category,
                            facilities: facility_type.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    filter(search)
                    break;
                case 'keph_level':
                    linelist =  res.results.map((keph)=>{
                        return {
                            ...keph,
                            keph_level: keph.keph_level,
                            facilities: keph.number_of_facilities,
                            actions: (<a href="#">View</a>)
                        }
                        
                    })
                    setUsers(linelist)
                    filter(search)
                    break;
                case 'facility_coordinates':
                    linelist =  res.results.map((coordinates)=>{
                        return {
                            ...coordinates,
                            code: coordinates.code,
                            name: coordinates.name,
                            county: coordinates.county_name,
                            sub_county: coordinates.sub_county_name,
                            ward: coordinates.ward_name,
                            lat: coordinates.lat_long !== null? coordinates.lat_long[0] : null,
                            long: coordinates.lat_long !== null? coordinates.lat_long[1] : null,
                        }
                        
                    })
                    setUsers(linelist) 
                    filter(search)
                    break;
                case 'officers_in_charge':
                    linelist =  res.results.map((officers)=>{
                        return {
                            ...officers,
                            facility_name: officers.facility_name,
                            officer_name: officers.officer_name,
                            job_title: officers.job_title,
                            contacts: officers.contacts.map(c=>{return c.contact_type +': ' + c.contact}).join(','),
                            
                        }
                        
                    })
                    setUsers(linelist) 
                    filter(search)
                    break;
                case 'admin_offices':
                    linelist =  res.results.map((offices)=>{
                        return {
                            ...offices,
                            county: offices.county_name,
                            sub_county: offices.sub_county_name,
                            first_name: offices.name,
                            // last_name: offices?.job_title,
                            // job_title: offices?.job_title,
                            national: offices.is_national,
                            phone_number: offices?.phone_number,
                            email: offices.email,
                        }
                        
                    })
                    setUsers(linelist) 
                    filter(search)
                    break;
                case 'chu_count':
                    linelist =  res.results.map((chu)=>{
                        return {
                            ...chu,
                            county: chu.county_name,
                            CHUs: chu.number_of_units,
                            CHVs: chu.chvs,
                            CHEWs: chu.chews,
                            action: (<a href="#">View</a>),
                        }
                        
                    })
                    setUsers(linelist) 
                    filter(search)
                    break;
                case 'chu_status':
                    linelist =  res.results.map((chu)=>{
                        return {
                            ...chu,
                            status: chu.status_name,
                            CHUs: chu.number_of_units,
                            action: (<a href="#">View</a>),
                        }
                        
                    })
                    setUsers(linelist) 
                    filter(search)
                    break;
                default: 
                    break;
            }
        })
        
    }

    const filterField = (search, value) => value?.toString().toLowerCase().includes(search.toLowerCase());
    const filter =(search)=>{
        if (search !== '' && search.length > 3) {
            const filteredData = linelist.filter((row) => {
                return Object.keys(row).some((field) => {
                    return filterField(search, row[field]);
                });
            });
            setFiltered(filteredData);
        } else {
            setFiltered(linelist);
        }
            
    }
    useEffect(() => {
        filter(search)
    }, [search])

    return (
    <div className='col-span-1 w-full col-start-1 h-auto border-r-2 border-gray-300'>
        
        <List
        sx={{ width: '100%', bgcolor: 'background.paper', flexGrow:1 }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
            <ListSubheader component="div" id="nested-list-subheader">
                Resources
            </ListSubheader>
        }
        >	
            {/* Health Facility Reports*/}
            <ListItemButton onClick={handleHFRUnitsClick}>
                <ListItemText primary="HealthFacility Reports" />
                {openHFR ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openHFR} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {/* <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('counties'); setResourceCategory('AdminUnits'); setTitle('counties'); setAddBtnLabel('county');}}>
                        <ListItemText primary="Counties" />
                    </ListItemButton> */}
                    <ListItemButton sx={{ ml: 8 }}>
                        <ListItemText primary="Beds and Cots"/>
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('beds_cots'); setColumns([
                            {headerName: "County", field: "area_name",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Facilities", field: "facilities"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View Facilities </button>
                            },}])}}>
                        <ListItemText primary="Facilities Count" />
                    </ListItemButton>
                
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('facility_owners'); setColumns([
                            {headerName: "Owner", field: "owner",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Facilities", field: "facilities"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View Facilities </button>
                            },}])}}>
                        <ListItemText primary="Facilities by Owners" />
                    </ListItemButton>

                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('owner_categories'); setColumns([
                            {headerName: "Owner", field: "owner",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Facilities", field: "facilities"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View Facilities </button>
                            },}])}}>
                        <ListItemText primary="Facilities by Owner Categories" />
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('facility_type'); setColumns([
                            {headerName: "Facility Type", field: "facility_type",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Facilities", field: "facilities"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View Facilities </button>
                            },}])}}>
                        <ListItemText primary="Facilities by Facility Type" />
                    </ListItemButton>

                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('keph_level'); setColumns([
                            {headerName: "Keph Level", field: "keph_level",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Facilities", field: "facilities"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View Facilities </button>
                            },}])}}>
                        <ListItemText primary="Keph Levels" />
                    </ListItemButton>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('facility_coordinates'); setColumns([
                            {headerName: "Code", field: "code",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Name", field: "name"},
                            {headerName: "County", field: "county"},
                            {headerName: "Sub County", field: "sub_county"},
                            {headerName: "Ward", field: "ward"},
                            {headerName: "Latitude", field: "lat"},
                            {headerName: "Longitude", field: "long"},
                            ])}}>
                        <ListItemText primary="Facility Coordinates" />
                    </ListItemButton>

                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('officers_in_charge'); setColumns([
                            {headerName: "Facility Name", field: "facility_name",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Officer Name", field: "officer_name"},
                            {headerName: "Job Title", field: "job_title"},
                            {headerName: "Contacts", field: "contacts"},
                            ])}}>
                        <ListItemText primary="Officers In-charge" />
                    </ListItemButton>
                </List>
            </Collapse>

            {/* Administrative Offices*/}
            <ListItemButton onClick={handleAdminClick}>
                <ListItemText primary="Administrative Offices" />
                {openAdmin ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('admin_offices'); setColumns([
                            {headerName: "County", field: "county",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Sub County", field: "sub_county"},
                            {headerName: "Name", field: "first_name"},
                            {headerName: "National", field: "national"},
                            {headerName: "Phone Number", field: "phone_number"},
                            {headerName: "Email", field: "email"},
                            ])}}>
                        <ListItemText primary="Admin Offices" />
                    </ListItemButton>
                    
                </List>
            </Collapse>
            
                {/* Community Health Units*/}
            <ListItemButton onClick={handleCHUClick}>
                <ListItemText primary="Community Health Units" />
                {openCHUs ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCHUs} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('chu_count'); setColumns([
                            {headerName: "County", field: "county",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Community Health Units", field: "CHUs"},
                            {headerName: "Number of CHVs", field: "CHVs"},
                            {headerName: "Number of CHEWs", field: "CHEWs"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View CHUs </button>
                            },}
                            ])}}>
                        <ListItemText primary="Community Health Units Count" />
                    </ListItemButton>
                </List>
                <List component="div" disablePadding>
                    
                    <ListItemButton sx={{ ml: 8 }} onClick={()=>{handleClick('chu_status'); setColumns([
                            {headerName: "Status", field: "status",   cellRenderer: "LinkCellRenderer"},
                            {headerName: "Number of Community Health Units", field: "CHUs"},
                            {headerName: "Actions",field: "actions", cellRendererFramework: function(params) {
                                return <button  className='rounded bg-green-600 p-2 text-white flex items-center text-sm font-semibold' 
                                onClick={() => {
                                    router.push({
                                        pathname: `/reports/by_facility/`,
                                        query: { id: params.data.county, level: 'county' }
                                    })
                                }}
                                > View CHUs </button>
                            },}
                            ])}}>
                        <ListItemText primary="Community Health Units (Status)" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    </div>
    )
}   


export default Resources