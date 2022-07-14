import React, {useState} from 'react'

// component / controllers imports
import MainLayout from '../components/MainLayout'
import { checkToken } from '../controllers/auth/auth';
import useDidMountEffect from '../hooks/useDidMountEffect';

// next imports
import Head from 'next/dist/shared/lib/head'
import { PlusIcon } from '@heroicons/react/solid'

// MUI imports
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Paper } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { AddLocationAlt, Article, GroupAdd, LocalHospital, MapsHomeWork, MiscellaneousServices, Phone, ReduceCapacity } from '@mui/icons-material';




const system_setup = (props) => {


    const [title, setTitle] = useState('Counties')
    const [addBtnLabel, setAddBtnLabel] = useState('County')
    
    const [openAdminUnits, setOpenAdminUnits] = useState(false);
    const [openServiceCatalogue, setOpenServiceCatalogue] = useState(false);
    const [openHealthInfr, setOpenHealthInfr] = useState(false);
    const [openHR, setOpenHR] = useState(false);
    const [openContacts, setOpenContacts] = useState(false);
    const [openFacilities, setOpenFacilities] = useState(false);
    const [openCHU, setOpenCHU] = useState(false);    
    const [openDocuments, setOpenDocuments] = useState(false); 
    const [resourceCategory, setResourceCategory] = useState('');
    const [resource, setResource] = useState(''); 
    const [columns, setColumns] = useState([
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'code', label: 'Code', minWidth: 100},
        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
      ]);

    const [fields, setFields] = useState([]);
    const [rows, setRows] = useState(Array.from(props?.data?.results, ({id, name, code}) => ({id, name, code})))  

    const fetchDataCategory = async () => {
  
    // Fetch data
    try{
        const response = await fetch(`/api/system_setup/?resource=${resource}&resourceCategory=${resourceCategory}&fields=${fields.join(',')}`)

        const _data = await response.json() 
        
        if(_data.results.length > 0){
            // update columns
            switch(resourceCategory){
              case 'AdminUnits':
                    switch(resource){
                        case 'wards':
                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'code', label: 'Code', minWidth: 100},
                                { id: 'sub_county_name', label: 'Sub-county', minWidth: 100},
                                { id: 'constituency_name', label: 'Constituency', minWidth: 100},
                                { id: 'county_name', label: 'County', minWidth: 100},
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                              ])

                              setRows(Array.from(_data.results, ({id, name, code, sub_county_name, constituency_name, county_name}) => ({id, name, code, sub_county_name, constituency_name, county_name})))

                              break;
                        case 'towns':
                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                              ])
                                
                              setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                              break;
                        default:
                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'code', label: 'Code', minWidth: 100},
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                              ])
                
                            setRows(Array.from(_data.results, ({id, name, code}) => ({id, name, code})))
                    }
                    
                  break;
              case 'ServiceCatalogue':
                  setColumns([
                      { id: 'name', label: 'Name', minWidth: 100 },
                      { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                  ])
      
                  setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                  
                  break;
              case 'HealthInfrastructure':
                  if(resource === 'infrastructure'){
                    setColumns([
                        { id: 'name', label: 'Name', minWidth: 100 },
                        { id: 'category_name', label: 'Category', minWidth: 100 },
                        { id: 'numbers', label: 'Tracking numbers?', minWidth: 100, format: 'boolean' },
                        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                    ])
                    
                    console.log({data: _data.results});
                    setRows(Array.from(_data.results, ({id, name, category_name, numbers}) => ({id, name, category_name, numbers})))
                  }
                  else{
                    setColumns([
                        { id: 'name', label: 'Name', minWidth: 100 },
                        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                    ])
                    
                    setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                  }
                 
                  break;
              case 'HR':
                  setColumns([
                      { id: 'name', label: 'Name', minWidth: 100 },
                      { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                  ])
      
                  setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                  
                  break;
              case 'Contacts':
                  setColumns([
                      { id: 'num', label: '#', minWidth: 100 },
                      { id: 'name', label: 'Name', minWidth: 100 },
                      { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                  ])
      
                  setRows(Array.from(_data.results, ({id, name}, i) => ({id, num:i+1, name})))
                  
                  break;
              case 'Facilities':
                  switch(resource){
                        case 'facility_depts':
                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'description', label: 'Description', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            console.log({data:_data.results})

                            setRows(Array.from(_data.results, ({id, name, description}) => ({id, name, description})))
                            break;

                        case 'facility_types':
                            
                            switch(addBtnLabel){

                                case 'facility type detail':
                                    setColumns([    
                                        { id: 'name', label: 'Facility Type', minWidth: 100 },
                                        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                                    ])
                                    
                                    // console.log({data:_data.results})
                                    setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                                    break;

                                case 'facility type category':
                                    setColumns([
                                        { id: 'name', label: 'Facility Type Details', minWidth: 100 },
                                        { id: 'sub_division', label: 'Facility Type', minWidth: 100 },
                                        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                                    ])

                                    // console.log({data:_data.results})
                                    setRows(Array.from(_data.results, ({id, name, sub_division}) => ({id, name, sub_division})))
                                    break;  

                            }
                           
                            break;

                        case 'facility_operation_status':
                            setColumns([    
                                { id: 'name', label: 'Facility Status', minWidth: 100 },
                                { id: 'is_public_visible', label: 'Public Visible', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            console.log({data:_data.results})

                            setRows(Array.from(_data.results, ({id, name, is_public_visible}) => ({id, name, is_public_visible:is_public_visible ? 'Yes' : 'No'})))

                            break;
                        
                        case 'facility_admission_status':
                            setColumns([
                                { id: 'name', label: 'Facility Admission Status', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            console.log({data:_data.results})

                            setRows(Array.from(_data.results, ({id, name, is_public_visible}) => ({id, name, is_public_visible:is_public_visible ? 'Yes' : 'No'})))
                            break;

                        case 'facility_service_ratings':
                            setColumns([
                                { id: 'facility_name', label: 'Facility', minWidth: 100 },
                                { id: 'service_name', label: 'Service', minWidth: 100 },
                                { id: 'comment', label: 'Comment', minWidth: 100 },
                                { id: 'rating', label: 'Rating', minWidth: 100 },
                                { id: 'created', label: 'Date', minWidth: 100 },
                                
                            ])
                            // console.log({data:_data.results})

                            setRows(Array.from(_data.results, ({id, facility_name, service_name, comment, rating, date}) => ({id, facility_name, service_name, comment, rating, date})))
                            break;

                        case 'owner_types':
    
                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                            
                            break;

                        case 'owners':

                            setColumns([
                                { id: 'code', label: 'Code', minWidth: 100 },
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'abbreviation', label: 'Abbreviation', minWidth: 100 },
                                { id: 'owner_type_name',label: 'Owner Type',minWidth: 100},
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            setRows(Array.from(_data.results, ({id, code, name, abbreviation, owner_type_name}) => ({id, code, name, abbreviation, owner_type_name})))
                            
                            break;

                        
                        case 'job_titles':

                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                            
                            break;
                        
                        case 'regulating_bodies':

                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'abbreviation', label: 'Abbreviation', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            setRows(Array.from(_data.results, ({id, abbreviation, name}) => ({id, abbreviation, name})))
                            
                            break;

                        case 'regulation_status':

                            setColumns([
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                            ])
                            
                            setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                            
                            break;

                        case 'level_change_reasons':

                            setColumns([
                                { id: 'reason', label: 'Change Reason', minWidth: 100 },
                                { id: 'description',label: 'Description', minWidth: 100, align:'right'}
                            ])
                            
                            setRows(Array.from(_data.results, ({id, reason, description}) => ({id, reason, description})))
                            
                            break;

                        default:
                            break;

                  }

                  break;
                 
              case 'CHU':
                  setColumns([
                      { id: 'facility_name', label: 'Facility', minWidth: 100 },
                      { id: 'chu_name', label: 'CHU', minWidth: 100 },
                      { id: 'comment', label: 'Comment', minWidth: 100 },
                      { id: 'rating', label: 'Rating', minWidth: 100 },
                      { id: 'created',label: 'Date',minWidth: 100, align:'right'}
                  ])
                  
                  setRows(Array.from(_data.results, ({id, facility_name, chu_name, comment, rating, date}) => ({id, facility_name, chu_name, comment, rating, date})))
                  break;

              case 'Documents':
      
                  setColumns([
                      { id: 'name', label: 'Name', minWidth: 100 },
                      { id: 'description', label: 'Description', minWidth: 100 },
                      { id: 'fyl', label: 'Link', minWidth: 100,  link: true },
                      { id: 'action',label: 'Action',minWidth: 100, align:'right'}
                  ])
                  
                  setRows(Array.from(_data.results, ({id, name, description, fyl}) => ({id, name, description, fyl})))
               
                  break;

          
      
           }
          }
      

    } catch (e){
        console.error(e.message);
    }

   
}

    useDidMountEffect(fetchDataCategory, [resource])

    const handleAdminUnitsClick = () => {
        setOpenAdminUnits(!openAdminUnits);
      };

    const handleServiceCatalogueClick = () => {
         setOpenServiceCatalogue(!openServiceCatalogue);
    };

    const handleHealthInfrClick = () => {
        setOpenHealthInfr(!openHealthInfr);
      };
    
    const handleHRClick = () => {
        setOpenHR(!openHR);
      };

    const hanldeConactsClick = () => {
        setOpenContacts(!openContacts);
      };

    const handleFacilitiesClick = () => {
         setOpenFacilities(!openFacilities);
    };

    const handleCHUClick = () => {
        setOpenCHU(!openCHU);
      };

    const handleDocumentsClick = () => {
        setOpenDocuments(!openDocuments);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

   
   
  return (
  <>
            <Head>
                <title>KMHFL - System Setup</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
                    {/* <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3"> */}
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500" >System setup</span>   
                        </div>
                        <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                          <h2 className='text-xl font-bold text-black capitalize'>{title}</h2>
                          <button className='rounded bg-green-600 p-2 text-white flex items-center text-lg font-semibold'>
                            {`Add ${addBtnLabel}`}
                            <PlusIcon className='text-white ml-2 h-5 w-5'/>
                          </button>
                        </div>   
                
                        {/* Side Menu */}
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
                                {/* Administrative Units */}
                                <ListItemButton onClick={handleAdminUnitsClick}>
                                    <ListItemIcon>
                                        <AddLocationAlt />
                                    </ListItemIcon>
                                    <ListItemText primary="Administrative Units" />
                                    {openAdminUnits ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openAdminUnits} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* Counties */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'code']); setResource('counties'); setResourceCategory('AdminUnits'); setTitle('counties'); setAddBtnLabel('county');}}>
                                            <ListItemText primary="Counties" />
                                        </ListItemButton>
                                        {/* Constituencies */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'code']); setResource('constituencies'); setResourceCategory('AdminUnits'); setTitle('constituencies'); setAddBtnLabel('constituency')}}>
                                            <ListItemText primary="Constituencies"/>
                                        </ListItemButton>
                                        {/* Wards */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'code', 'county_name', 'constituency_name', 'sub_county_name, county']); setResource('wards'); setResourceCategory('AdminUnits'); setTitle('wards'); setAddBtnLabel('ward')}}>
                                            <ListItemText primary="Wards" />
                                        </ListItemButton>
                                        {/* Towns */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'town' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'ward_name']); setResource('towns'); setResourceCategory('AdminUnits'); setTitle('towns'); setAddBtnLabel('town')}}>
                                            <ListItemText primary="Towns" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                {/* Service Catalogue */}
                                <ListItemButton onClick={handleServiceCatalogueClick}>
                                    <ListItemIcon>
                                        <MiscellaneousServices />
                                    </ListItemIcon>
                                    <ListItemText primary="Service Catalogue" />
                                    {openServiceCatalogue ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openServiceCatalogue} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'abbreviation', 'description']); setResource('service_categories'); setResourceCategory('ServiceCatalogue'); setTitle('categories'); setAddBtnLabel('category')}}>
                                            <ListItemText primary="Categories" />
                                        </ListItemButton>
                                        {/* Option groups */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name']); setResource('option_groups'); setResourceCategory('ServiceCatalogue'); setTitle('option groups'); setAddBtnLabel('option group')}}>
                                            <ListItemText primary="Option Groups" />
                                        </ListItemButton>
                                        {/* Services */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'service' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'code', 'abbreviation', 'category_name']); setResource('services'); setResourceCategory('ServiceCatalogue'); setTitle('services'); setAddBtnLabel('service')}}>
                                            <ListItemText primary="Services" />
                                        </ListItemButton>
                                    
                                    </List>
                                </Collapse>

                                {/* Health Infrastructure */}
                                <ListItemButton onClick={handleHealthInfrClick}>
                                    <ListItemIcon>
                                        <LocalHospital />
                                    </ListItemIcon>
                                    <ListItemText primary="Health Infrastructure" />
                                    {openHealthInfr ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openHealthInfr} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'description']); setResource('infrastructure_categories'); setResourceCategory('HealthInfrastructure'); setTitle('categories'); setAddBtnLabel('category')}}>
                                            <ListItemText primary="Categories" />
                                        </ListItemButton>
                                        {/* Infrastructure */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'category_name', 'numbers']); setResource('infrastructure'); setResourceCategory('HealthInfrastructure'); setTitle('infrastructures'); setAddBtnLabel('infrastructure')}}>
                                            <ListItemText primary="Infrastructure" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                {/* Human Resource */}
                                <ListItemButton onClick={handleHRClick}>
                                    <ListItemIcon>
                                        <ReduceCapacity />
                                    </ListItemIcon>
                                    <ListItemText primary="Human Resource" />
                                    {openHR ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openHR} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* HR Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'hr category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'description']); setResource('speciality_categories'); setResourceCategory('HR'); setTitle('HR Categories'); setAddBtnLabel('hr category')}}>
                                            <ListItemText primary="HR Categories" />
                                        </ListItemButton>
                                        {/* Specialities */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'specialty' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'category_name']); setResource('specialities'); setResourceCategory('HR'); setTitle('specialities'); setAddBtnLabel('specialty')}}>
                                            <ListItemText primary="Specialities" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>

                                {/* Contacts */}
                                <ListItemButton onClick={hanldeConactsClick}>
                                    <ListItemIcon>
                                        <Phone />
                                    </ListItemIcon>
                                    <ListItemText primary="Contacts" />
                                    {openContacts ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openContacts} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* HR Categories */}
                                        <ListItemButton sx={{ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'contact type' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name']); setResource('contact_types'); setResourceCategory('Contacts'); setTitle('contact types'); setAddBtnLabel('contact type')}}>
                                            <ListItemText primary="Contact Type" />
                                        </ListItemButton>
                                    
                                    </List>
                                </Collapse>

                                {/* Facilities */}
                                <ListItemButton onClick={handleFacilitiesClick}>
                                    <ListItemIcon>
                                        <MapsHomeWork />
                                    </ListItemIcon>
                                    <ListItemText primary="Facilities" />
                                    {openFacilities ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openFacilities} timeout="auto" unmountOnExit>
                                    
                                    <List component="div" disablePadding>
                                        {/* Facility Departments */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['']); setResource('facility_depts'); setResourceCategory('Facilities'); setTitle('facility departments'); setAddBtnLabel('facility department')}}>
                                            <ListItemText primary="Facility Departments" />
                                        </ListItemButton>

                                        {/* Facility Type Details */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'sub_division&is_parent=true']); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type details'); setAddBtnLabel('facility type detail')}}>
                                            <ListItemText primary="Facility Type Details" />
                                        </ListItemButton>

                                        {/* Facility Type Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'sub_division&is_parent=false']); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type categories'); setAddBtnLabel('facility type category')}}>
                                            <ListItemText primary="Facility Type Categories" />
                                        </ListItemButton>

                                        {/* Facility Operation Status */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['']); setResource('facility_status'); setResourceCategory('Facilities'); setTitle('facility operation statuses'); setAddBtnLabel('facility operation status')}}>
                                            <ListItemText primary="Facility Operation Status" />
                                        </ListItemButton>

                                        {/*  Facility Admission Status */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['']); setResource('facility_admission_status'); setResourceCategory('Facilities'); setTitle('facility admission statuses'); setAddBtnLabel('facility admission status')}}>
                                            <ListItemText primary="Facility Admission Status" />
                                        </ListItemButton>

                                        {/*  Feedback */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['']); setResource('facility_service_ratings'); setResourceCategory('Facilities'); setTitle('feedbacks'); setAddBtnLabel('feedback')}}>
                                            <ListItemText primary="Feedback" />
                                        </ListItemButton>

                                        {/*  Facility Owner Details */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id', 'name']); setResource('owner_types'); setResourceCategory('Facilities'); setTitle('facility owner details'); setAddBtnLabel('facility owner detail')}}>
                                            <ListItemText primary="Facility Owner Details" />
                                        </ListItemButton>

                                        {/* Facility Owners Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'code', 'abbreviation', 'owner_type_name']); setResource('owners'); setResourceCategory('Facilities'); setTitle('facility owner categories'); setAddBtnLabel('facility owner category')}}>
                                            <ListItemText primary="Facility Owners Categories" />
                                        </ListItemButton>

                                        {/*  Job Titles */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name']); setResource('job_titles'); setResourceCategory('Facilities'); setTitle('job titles'); setAddBtnLabel('job title') }}>
                                            <ListItemText primary="Job Titles" />
                                        </ListItemButton>

                                        {/*  Regulatory Bodies */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'abbreviation', 'regulatory_body_type_name', 'regulation_verb']); setResource('regulating_bodies'); setResourceCategory('Facilities'); setTitle('regulatory bodies'); setAddBtnLabel('regulatory body') }}>
                                            <ListItemText primary="Regulatory Bodies" />
                                        </ListItemButton>

                                        {/*  Regulatory Status */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['']); setResource('regulation_status'); setResourceCategory('Facilities'); setTitle('regulatory statuses'); setAddBtnLabel('regulatory status') }}>
                                            <ListItemText primary="Regulatory Status" />
                                        </ListItemButton>

                                        {/*  Upgrade Reason */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','reason', 'description']); setResource('level_change_reasons'); setResourceCategory('Facilities'); setTitle('upgrade reasons'); setAddBtnLabel('upgrade reason') }}>
                                            <ListItemText primary="Upgrade Reason" />
                                        </ListItemButton>


                                    </List>
                                </Collapse>

                                {/* CHU */}
                                <ListItemButton onClick={handleCHUClick}>
                                    <ListItemIcon>
                                        <GroupAdd />
                                    </ListItemIcon>
                                    <ListItemText primary="CHU" />
                                    {openCHU ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openCHU} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* CHU Rating Comments */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'chu rating comment' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['']); setResource('chu_ratings'); setResourceCategory('CHU'); setTitle('CHU Rating Comments'); setAddBtnLabel('CHU Rating Comment') }}>
                                            <ListItemText primary="CHU Rating Comments" />
                                        </ListItemButton>
                                    
                                    </List>
                                </Collapse>


                                {/* Documents */}
                                <ListItemButton onClick={handleDocumentsClick}>
                                    <ListItemIcon>
                                        <Article />
                                    </ListItemIcon>
                                    <ListItemText primary="Documents" />
                                    {openDocuments ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openDocuments} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {/* Documents */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'document' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setFields(['id','name', 'description','fyl','document_type']); setResource('documents'); setResourceCategory('Documents'); setTitle('Documents'); setAddBtnLabel('Document') }}>
                                            <ListItemText primary="Documents" />
                                        </ListItemButton>
                                    
                                    </List>
                                </Collapse>


                                
                            </List>
                        </div>

                        {/* Form Section */}
                        <div className='col-span-4 w-full h-auto'>
                        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow:'0', flexDirection:'column', alignContent:'start', justifyContent:'start', backgroundColor:'#f9fafb', borderRadius:'10px'}}>
                            <form className="flex items-center space-x-3 m-3" onSubmit={e => {e.preventDefault()}}>
                                <TextField id="search_table_data" label="Search anything" variant="standard" />
                                <button type= "submit" className='bg-indigo-500 rounded p-2 text-base font-semibold text-white'>Export</button>
                            </form>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                  
                                    <TableRow>
                                    {columns.map((column,i) => (
                                        <TableCell
                                        key={i}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, fontWeight:600 }}
                                        >
                                        {column.label}
                                        </TableCell>
                                    ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{paddingX: 4}}>
                                    {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column, i) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {
                                                    column.id === 'action' ?
                                                        
                                                            <button className='bg-indigo-500 rounded p-2 text-white font-semibold'>{
                                                                resourceCategory === "HealthInfrastructure" || resourceCategory === "HR" ?
                                                                'Edit' : 'View'
                                                            }</button>
                                                        
                                                        :
                                                            column.format && typeof value === 'boolean'
                                                                ? value.toString()
                                                                :  column.format && typeof value === 'number'
                                                                ? column.format(value) : column.link ? <a className="text-indigo-500" href={value}>{value}</a> : value
                                                       
                                                    }
                                                </TableCell>
                                                
                                            );
                                            })}
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            </Paper>
                        </div>
                        
                    </div> 
                                                                                                            
            
            </MainLayout>
  </>
  )
}


system_setup.getInitialProps = async (ctx) => {
    const fetchData = (token) => {
        

        let url = process.env.NEXT_PUBLIC_API_URL + '/common/counties/?fields=id,code,name'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }

        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }

       

        let current_url = url + '&page_size=50'
        if (ctx?.query?.page) {
            url = `${url}&page=${ctx.query.page}`
        }
    
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                // return fetchFilters(token).then(ft => {
                    return {
                        data: json, query, path: ctx.asPath || '/system_setup', current_url: current_url 
                    }
                // })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/system_setup',
                    current_url: ''
                }
            })
    }

    return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            return fetchData(token).then(t => t)
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/system_setup'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/system_setup',
                current_url: ''
            }
        }, 1000);
    })

}

export default system_setup