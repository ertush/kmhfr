import React, {useState, useContext, useEffect, useMemo} from 'react'

// component / controllers imports
import MainLayout from '../../components/MainLayout'
import { checkToken } from '../../controllers/auth/auth';
import useDidMountEffect from '../../hooks/useDidMountEffect';

// next imports
import Head from 'next/dist/shared/lib/head'
import { PlusIcon, TrashIcon } from '@heroicons/react/solid'

// MUI imports
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useRef} from 'react'

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
import Alert from '@mui/material/Alert';
import { PermissionContext } from '../../providers/permissions';
import { hasSystemSetupPermissions } from '../../utils/checkPermissions';

import Select from 'react-select';
import { AddLocationAlt, Article, GroupAdd, LocalHospital, MapsHomeWork, MiscellaneousServices, Phone, ReduceCapacity } from '@mui/icons-material';

import useId from 'react-use-uuid';
import router from 'next/router';




const system_setup = (props) => {


    const userPermissions = useContext(PermissionContext)
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
    const [selectOptionss, setSelectOptionss] = useState([]);
    const [resource, setResource] = useState(''); 
    const [columns, setColumns] = useState([
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'code', label: 'Code', minWidth: 100},
        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
      ]);

    const [fields, setFields] = useState([]);
    const [isAddForm, setIsAddForm] = useState(false);
    const [rows, setRows] = useState(Array.from(props?.data?.results, ({id, name, code}) => ({id, name, code})))
    const [editData, setEditData] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [editID, setEditID] = useState(null);

    // Refs
    const optionTypeRef = useRef(null)
    const displayTextRef = useRef(null)
    const optionValueRef = useRef(null)
    const inputsContainerRef = useRef(null)
    const inputsContainerRef2 = useRef(null)
    const contactTypeRef = useRef(null)
    const contactDetailRef = useRef(null)

    const uid = useId();

    useEffect(() => {
        if(!hasSystemSetupPermissions(/^common.add_county$/, userPermissions)){
            router.push('/unauthorized')
        }

        return () => {
            setFields(null)
            setIsAddForm(null)
            setRows(null)
        }
    },[])
   
    const fetchDataCategory = async () => {
  
    // Fetch data
    try{
        const response = await fetch(`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&fields=${fields.join(',')}`)

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
                    
                    // console.log({data: _data.results});
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

                        case 'facility_status':
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

    useDidMountEffect(fetchDataCategory, [resource, isAddForm])

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

    useEffect(async() => {
        let url = ''
        if(addBtnLabel ==='infrastructure' || addBtnLabel ==='facility department'){
            if(addBtnLabel ==='facility department'){
                url =`/api/system_setup/data/?resource=regulating_bodies&resourceCategory=Facilities&fields=id,name`                
            }
            if(addBtnLabel ==='infrastructure'){
                url =`/api/system_setup/data/?resource=infrastructure_categories&resourceCategory=HealthInfrastructure&fields=id,name`                
            }
            const response = await fetch(url)
            const _data = await response.json()
            const results = _data.results.map(({id, name}) => ({value:id, label:name}))
            setSelectOptionss(results)        
        }
        if(editMode && editID !== ''){
            setTitle(`Edit ${addBtnLabel}`); setIsAddForm(true);
            const response = await fetch(`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`);
            const _data = await response.json()
            // console.log(_data);
            setEditData(_data)
        }else{
            setEditData({})
        }
       

    }, [addBtnLabel, editID, editMode])
   
   console.log( editData)
  return (
  <>
            <Head>
                <title>KMHFL - System Setup</title>
                <metadata zoomAndPan='100'></metadata>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>

                <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
                     {/* Bread Cumbs  */}
                     <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500" >System setup</span>   
                    </div>
                    {/* Header Bunner */}
                    <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                        <h2 className='text-xl font-bold text-black capitalize'>{title}</h2>
                        {
                        !isAddForm && addBtnLabel !== 'feedback' && addBtnLabel !== 'CHU Rating Comment' &&
                        <button className='rounded bg-green-600 p-2 text-white flex items-center text-lg font-semibold' onClick={() => {setTitle(`Add ${addBtnLabel}`); setIsAddForm(true)}}>
                        {`Add ${addBtnLabel}`}
                        <PlusIcon className='text-white ml-2 h-5 w-5'/>
                        </button>
                        }
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('counties'); setResourceCategory('AdminUnits'); setTitle('counties'); setAddBtnLabel('county');}}>
                                                <ListItemText primary="Counties" />
                                            </ListItemButton>
                                            {/* Constituencies */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('constituencies'); setResourceCategory('AdminUnits'); setTitle('constituencies'); setAddBtnLabel('constituency')}}>
                                                <ListItemText primary="Constituencies"/>
                                            </ListItemButton>
                                            {/* Wards */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'county_name', 'constituency_name', 'sub_county_name, county']); setResource('wards'); setResourceCategory('AdminUnits'); setTitle('wards'); setAddBtnLabel('ward')}}>
                                                <ListItemText primary="Wards" />
                                            </ListItemButton>
                                            {/* Towns */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'town' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'ward_name']); setResource('towns'); setResourceCategory('AdminUnits'); setTitle('towns'); setAddBtnLabel('town')}}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'abbreviation', 'description']); setResource('service_categories'); setResourceCategory('ServiceCatalogue'); setTitle('categories'); setAddBtnLabel('category')}}>
                                                <ListItemText primary="Categories" />
                                            </ListItemButton>
                                            {/* Option groups */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name']); setResource('option_groups'); setResourceCategory('ServiceCatalogue'); setTitle('option groups'); setAddBtnLabel('option group')}}>
                                                <ListItemText primary="Option Groups" />
                                            </ListItemButton>
                                            {/* Services */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'service' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'abbreviation', 'category_name']); setResource('services'); setResourceCategory('ServiceCatalogue'); setTitle('services'); setAddBtnLabel('service')}}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description']); setResource('infrastructure_categories'); setResourceCategory('HealthInfrastructure'); setTitle('categories'); setAddBtnLabel('category')}}>
                                                <ListItemText primary="Categories" />
                                            </ListItemButton>
                                            {/* Infrastructure */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'category_name', 'numbers']); setResource('infrastructure'); setResourceCategory('HealthInfrastructure'); setTitle('infrastructures'); setAddBtnLabel('infrastructure'); setEditMode(false); setEditID(null)}}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'hr category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description']); setResource('speciality_categories'); setResourceCategory('HR'); setTitle('HR Categories'); setAddBtnLabel('hr category')}}>
                                                <ListItemText primary="HR Categories" />
                                            </ListItemButton>
                                            {/* Specialities */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'specialty' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'category_name']); setResource('specialities'); setResourceCategory('HR'); setTitle('specialities'); setAddBtnLabel('specialty')}}>
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
                                            <ListItemButton sx={{ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'contact type' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name']); setResource('contact_types'); setResourceCategory('Contacts'); setTitle('contact types'); setAddBtnLabel('contact type'); setEditMode(false); setEditID(null)}}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_depts'); setResourceCategory('Facilities'); setTitle('facility departments'); setAddBtnLabel('facility department')}}>
                                                <ListItemText primary="Facility Departments" />
                                            </ListItemButton>

                                            {/* Facility Type Details */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'sub_division&is_parent=true']); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type details'); setAddBtnLabel('facility type detail')}}>
                                                <ListItemText primary="Facility Type Details" />
                                            </ListItemButton>

                                            {/* Facility Type Categories */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'sub_division&is_parent=false']); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type categories'); setAddBtnLabel('facility type category')}}>
                                                <ListItemText primary="Facility Type Categories" />
                                            </ListItemButton>

                                            {/* Facility Operation Status */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields([]); setResource('facility_status'); setResourceCategory('Facilities'); setTitle('facility operation statuses'); setAddBtnLabel('facility operation status')}}>
                                                <ListItemText primary="Facility Operation Status" />
                                            </ListItemButton>

                                            {/*  Facility Admission Status */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_admission_status'); setResourceCategory('Facilities'); setTitle('facility admission statuses'); setAddBtnLabel('facility admission status')}}>
                                                <ListItemText primary="Facility Admission Status" />
                                            </ListItemButton>

                                            {/*  Feedback */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_service_ratings'); setResourceCategory('Facilities'); setTitle('feedbacks'); setAddBtnLabel('feedback')}}>
                                                <ListItemText primary="Feedback" />
                                            </ListItemButton>

                                            {/*  Facility Owner Details */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id', 'name']); setResource('owner_types'); setResourceCategory('Facilities'); setTitle('facility owner details'); setAddBtnLabel('facility owner detail')}}>
                                                <ListItemText primary="Facility Owner Details" />
                                            </ListItemButton>

                                            {/* Facility Owners Categories */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'abbreviation', 'owner_type_name']); setResource('owners'); setResourceCategory('Facilities'); setTitle('facility owner categories'); setAddBtnLabel('facility owner category')}}>
                                                <ListItemText primary="Facility Owners Categories" />
                                            </ListItemButton>

                                            {/*  Job Titles */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name']); setResource('job_titles'); setResourceCategory('Facilities'); setTitle('job titles'); setAddBtnLabel('job title') }}>
                                                <ListItemText primary="Job Titles" />
                                            </ListItemButton>

                                            {/*  Regulatory Bodies */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'abbreviation', 'regulatory_body_type_name', 'regulation_verb']); setResource('regulating_bodies'); setResourceCategory('Facilities'); setTitle('regulatory bodies'); setAddBtnLabel('regulatory body') }}>
                                                <ListItemText primary="Regulatory Bodies" />
                                            </ListItemButton>

                                            {/*  Regulatory Status */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('regulation_status'); setResourceCategory('Facilities'); setTitle('regulatory statuses'); setAddBtnLabel('regulatory status') }}>
                                                <ListItemText primary="Regulatory Status" />
                                            </ListItemButton>

                                            {/*  Upgrade Reason */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','reason', 'description']); setResource('level_change_reasons'); setResourceCategory('Facilities'); setTitle('upgrade reasons'); setAddBtnLabel('upgrade reason') }}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'chu rating comment' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('chu_ratings'); setResourceCategory('CHU'); setTitle('CHU Rating Comments'); setAddBtnLabel('CHU Rating Comment') }}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'document' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description','fyl','document_type']); setResource('documents'); setResourceCategory('Documents'); setTitle('Documents'); setAddBtnLabel('Document') }}>
                                                <ListItemText primary="Documents" />
                                            </ListItemButton>
                                        
                                        </List>
                                    </Collapse>


                                    
                                </List>
                    </div>
                        {
                            !isAddForm ? (
                            <>
                            {/* Table Section */}
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
                                                            
                                                                <button className='bg-indigo-500 rounded p-2 text-white font-semibold' onClick={() => {setEditID(row.id); setEditMode(true); }}>{
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
                            </>
                            ) : (

                            <div className='col-span-4 flex items-start justify-start h-auto w-full'>
                                {/* Add Form */}
                                <Paper sx={{width: '100%', Height: 'auto', padding:5, boxShadow:'none'}} >
                                    {
                                
                                            (() => {
                                                switch(addBtnLabel){
                                                    case 'county':
                                                        return (
                                                        
                                                            <form className='w-full h-full' onSubmit={() => console.log('submitting form')}>
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            County Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='County Name'
                                                                            name={`add_${addBtnLabel}`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                       
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                        </div>
                                                            </form>
                                                    
                                                        )
                                                        case 'constituency':
                                                            return (
                                                            
                                                                <form className='w-full h-full flex-col gap-1' onSubmit={() => console.log('submitting form')}>
                                                                    {/* Constituency Name */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}_constituency_field`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                Constituency Name
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    *
                                                                                </span>
                                                                            </label>
                                                                            <input
                                                                                required
                                                                                type='text'
                                                                                placeholder='Constitency Name'
                                                                                name={`add_${addBtnLabel}_constituency_field`}
                                                                                className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    {/* County */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_county_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                             County{' '}
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select '
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_county_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />

                                        
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                        </div>
                                                                </form>
                                                        )
                                                        case 'ward':
                                                            return (
                                                            
                                                                <form className='w-full h-full flex-col gap-1' onSubmit={() => console.log('submitting form')}>
                                                                    {/* Ward Name */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}_field`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                Ward Name
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    *
                                                                                </span>
                                                                            </label>
                                                                            <input
                                                                                required
                                                                                type='text'
                                                                                placeholder='Ward Name'
                                                                                name={`add_${addBtnLabel}_field`}
                                                                                className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    {/* County */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_county_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                             County{' '}
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select county'
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_county_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />
                                                                    </div>

                                                                    {/* Sub County */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_sub_county_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Sub County{' '}
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select Sub County'
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_sub_county_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />
                                                                    </div>

                                                                    {/* Constituency */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_constituency_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Constitency{' '}
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select Constituency'
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_constituency_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />

                                                                       
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                    </div>

                                                                </form>
                                                            )
                                                        case 'town':
                                                            return (
                                                                <form className='w-full h-full' onSubmit={() => console.log('submitting form')}>
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_town_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Town Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Town Name'
                                                                            name={`add_${addBtnLabel}_town_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                      
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                    </div>
                                                                </form>
                                                            )
                                                        case 'category':
                                                            return (
                                                                 resourceCategory === 'ServiceCatalogue' ? (
                                                                    <form className='w-full h-full flex-col gap-1' onSubmit={() => console.log('submitting form')}>
                                                                            {/* Name */}
                                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                                
                                                                                    <label
                                                                                        htmlFor={`add_${addBtnLabel}_constituency_field`}
                                                                                        className='text-gray-600 capitalize text-sm'>
                                                                                        Name
                                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                                            {' '}
                                                                                            *
                                                                                        </span>
                                                                                    </label>
                                                                                    <input
                                                                                        required
                                                                                        type='text'
                                                                                        placeholder='Name'
                                                                                        name={`add_${addBtnLabel}_constituency_field`}
                                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                    />
                                                                            </div>

                                                                            {/* Parent */}
                                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_county_field`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Parent{' '}
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                                <Select
                                                                                    options={[
                                                                                        {
                                                                                            value: 'type-1',
                                                                                            label: 'type-1',
                                                                                        },
                                                                                        {
                                                                                            value: 'type-2',
                                                                                            label: 'type-2',
                                                                                        },
                                                                                    ]}
                                                                                    
                                                                                    placeholder='Select Parent'
                                                                                    onChange={() => console.log('changed type')}
                                                                                    name={`add_${addBtnLabel}_county_field`}
                                                                                    className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                                />

                                                                            </div>

                                                                            {/* Abbreviation */}
                                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                                
                                                                                    <label
                                                                                        htmlFor={`add_${addBtnLabel}_constituency_field`}
                                                                                        className='text-gray-600 capitalize text-sm'>
                                                                                        Abbreviation
                                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                                            {' '}
                                                                                            
                                                                                        </span>
                                                                                    </label>
                                                                                    <input
                                                                                        required
                                                                                        type='text'
                                                                                        placeholder='Abbreviation'
                                                                                        name={`add_${addBtnLabel}_constituency_field`}
                                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                    />
                                                                            </div>

                                                                            {/* Description */}
                                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_constituency_field`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Description
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                                <textarea
                                                                                    required
                                                                                    type='text'
                                                                                    placeholder='Description'
                                                                                    name={`add_${addBtnLabel}_constituency_field`}
                                                                                    className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                />
                                                                               
                                                                            </div>

                                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                            </div>
                                                                    </form>
                                                                 ) :
                                                                 (
                                                                    <form className='w-full h-full'>
                                                                
                                                                        {/* Name */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_name`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                               Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Name'
                                                                            name={`add_${addBtnLabel}_name`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                 {/* Description */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                    </form>
                                                                 )
                                                            )

                                                        case 'option group':
                                                            const handleAddOptionGroup = e => {
                                                              

                                                                e.preventDefault()
                             
                                                                // Option Type Node
                                                                /*
                                                                const optionTypeNode = document.createElement('select')
                                                                optionTypeNode.setAttribute('class', ' h-10 border-2 border-gray-200 flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none');
                                                                optionTypeNode.setAttribute(
                                                                    'placeholder',
                                                                    'Select Service'
                                                                );
                                                                optionTypeNode.setAttribute(
                                                                    'name',
                                                                    `option_type_${uid}`
                                                                );
            
                                                                const option0 = document.createElement('option');
                                                                option0.innerText = 'BOOLEAN';
                                                                option0.value = 'BOOLEAN';

                                                                const option1 = document.createElement('option');
                                                                option1.innerText = 'INTEGER';
                                                                option1.value = 'INTEGER';

                                                                const option2 = document.createElement('option');
                                                                option2.innerText = 'DECIMAL';
                                                                option2.value = 'DECIMAL';

                                                                const option3 = document.createElement('option');
                                                                option3.innerText = 'TEXT';
                                                                option3.value = 'TEXT';

                                                                optionTypeNode.appendChild(option0.getRootNode());
                                                                optionTypeNode.appendChild(option1.getRootNode());
                                                                optionTypeNode.appendChild(option2.getRootNode());
                                                                optionTypeNode.appendChild(option3.getRootNode());
                                                               

                                                                optionTypeRef.current.append(optionTypeNode)
                                                                 */

                                                                const optionTypeNode = inputsContainerRef.current.childNodes[3].cloneNode(true);
                                                          
													            optionTypeNode.setAttribute('name', `option_type_${uid}`);
                                                                optionTypeNode.setAttribute('options', `
                                                                    type-1
                                                                    type-2
                                                                `)
                                                                optionTypeRef.current.append(optionTypeNode)


                                                                // Display Text
                                                                 const displayTextNode = document.createElement('input')
                                                                 displayTextNode.setAttribute(
                                                                    'placeholder',
                                                                    'Display Text'
                                                                 );
                                                                 displayTextNode.setAttribute(
                                                                    'name',
                                                                    `display_input_${uid}`
                                                                 );
                                                                 displayTextNode.setAttribute('class', 'flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none')
                                                                 displayTextRef.current.append(displayTextNode)

                                                                 // Delete Btn
                                                                const deleteBtnNode = document.createElement('button')
                                                                deleteBtnNode.setAttribute('class', 'w-auto h-auto flex-shrink-1 col-span-1 rounded p-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white')
                                                                deleteBtnNode.append('Delete')
                                                                deleteBtnNode.onclick = (e) => {
                                                                    e.preventDefault()

                                                                    // optionTypeRef.current.childNodes
                                                                    console.log('deleting...', {childNodes: optionTypeRef.current.childNodes});

                                                                }
                                                                

                                                                // Option Value

                                                                const optionValueNode = document.createElement('input')
                                                                optionValueNode.setAttribute('class', 'col-span-2')
                                                                optionValueNode.setAttribute(
                                                                    'placeholder',
                                                                    'Option Value'
                                                                 );
                                                                optionValueNode.setAttribute(
                                                                    'name',
                                                                    `option_value_${uid}`
                                                                 );
                                                                optionValueNode.setAttribute('class', 'flex-none col-span-3 w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none')
                                                                optionValueRef.current.append(optionValueNode)
                                                                optionValueRef.current.append(deleteBtnNode)

                                                                
                                                              

                                                            } 

                                                            return (
                                                                <form className='w-full h-full flex-col gap-1' onSubmit={(e) => {e.preventDefault()}}>
                                                                {/* Name */}
                                                              
                                                                    <div className='col-span-3 flex-1 flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_option_group`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Option Group Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Option Group Name'
                                                                            name={`add_${addBtnLabel}_option_group`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                     </div>
                                                               
                                                                

                                                                {/* inputsContainer */}
                                                                <div className='grid grid-cols-3 place-content-start gap-3 space-y-1' ref={inputsContainerRef}>
                                                                    <h2 className='text-lg font-semibold text-indigo-900'>Option Type*</h2>
                                                                    <h2 className='text-lg font-semibold text-indigo-900'>Display Text*</h2>
                                                                    <h2 className='text-lg font-semibold text-indigo-900'>Option Value*</h2>

                                                                    {/* Option Type */}
                                                                    <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select Option Type'
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_option_type`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />
                                                                    {/* Display Text */}
                                                                      <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Display Text'
                                                                            name={`add_${addBtnLabel}_display_text`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />

                                                                    {/* Option Value */}
                                                                    <div className='grid grid-cols-4 w-full'>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Option Value'
                                                                            name={`add_${addBtnLabel}_option_value`}
                                                                            className='flex-none w-full bg-gray-50 col-span-3 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                    </div>
                                                                    

                                                                    <div ref={optionTypeRef} className='mx-0 px-0 space-y-4'>

                                                                    </div>

                                                                    <div ref={displayTextRef} className='mx-0 px-0 space-y-3'>

                                                                    </div>
                                                                    
                                                                   
                                                                    <div ref={optionValueRef} className='m-0 p-0 grid grid-cols-4 gap-2 w-full'>
                                                                        
                                                                    </div>

                                                                 
                                                                    <div className='col-span-3 flex items-center justify-end'>
                                                                        <button className='rounded p-2 w-auto h-auto bg-indigo-600 text-white flex items-center self-start'
                                                                        onClick={handleAddOptionGroup}
                                                                        >Add <PlusIcon className='w-5 h-5 text-white'/></button>
                                                                    </div>
                                                                   
                                                                    
                                                                   
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                 </div>
                                                        </form>
                                                            )

                                                        case 'service':
                                                            return (
                                                                <form className='w-full h-full'>

                                                                     {/* Service code */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                     <label
                                                                            htmlFor={`add_${addBtnLabel}_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Service Code
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <Alert severity="info">Service Code will be generated after creating the service</Alert>

                                                                    </div>
                                                                     {/* Service Name */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Service Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Service Name'
                                                                            name={`add_${addBtnLabel}_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                  {/* Abbreviation */}
                                                                  <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_field`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                             Abbreviation
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                              
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                        
                                                                            type='text'
                                                                            placeholder='Abbreviation'
                                                                            name={`add_${addBtnLabel}_field`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                {/* Category */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_category_field`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                         Category{' '}
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <Select
                                                                        options={[
                                                                            {
                                                                                value: 'type-1',
                                                                                label: 'type-1',
                                                                            },
                                                                            {
                                                                                value: 'type-2',
                                                                                label: 'type-2',
                                                                            },
                                                                        ]}
                                                                        required
                                                                        placeholder='Select a Category'
                                                                        onChange={() => console.log('changed type')}
                                                                        name={`add_${addBtnLabel}_category_field`}
                                                                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                    />
                                                                </div>

                                                                {/* Option Groups */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_sub_county_field`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Option Groups   {' '}
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <Select
                                                                        options={[
                                                                            {
                                                                                value: 'type-1',
                                                                                label: 'type-1',
                                                                            },
                                                                            {
                                                                                value: 'type-2',
                                                                                label: 'type-2',
                                                                            },
                                                                        ]}
                                                                        required
                                                                        placeholder='Select Option Group'
                                                                        onChange={() => console.log('changed type')}
                                                                        name={`add_${addBtnLabel}_sub_county_field`}
                                                                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                    />
                                                                </div>

                                                                {/* Description */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Service description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                {/* Has options */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                         <label
                                                                            htmlFor={`add_${addBtnLabel}_has_options`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Service has options?
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>

                                                                        <input className='' type='checkbox' name={`add_${addBtnLabel}_has_options`}/>
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )

                                                        case 'infrastructure':
                                                            const handleSubmitInfrastructure = (e) => {
                                                                e.preventDefault()
                                                                const obj = {};
                                                                const elements = [...e.target];
                                                                elements.forEach((element) => {
                                                                    if(element.type== 'checkbox'){
                                                                        obj[element.name] = element.checked
                                                                    }else{
                                                                        obj[element.name] = element.value
                                                                    }
                                                                });

                                                                try {
                                                                    let url = ''
                                                                    editMode? url =`/api/system_setup/submit_form/?path=add_infrastructure&id=${editData.id}` : url =`/api/system_setup/submit_form/?path=add_infrastructure`
                                                                     fetch(url,{
                                                                        headers: {
                                                                            'Accept': 'application/json, text/plain, */*',
                                                                            'Content-Type': 'application/json;charset=utf-8'
                
                                                                        },
                                                                        method: editMode ? 'PATCH' : 'POST' ,
                                                                        body: JSON.stringify(obj).replace(',"":""', '')
                                                                     })
                                                                } catch (error) {
                                                                    console.log(error)
                                                                }
                                                            }
                                                            return (
                                                                <form className='w-full h-full' onSubmit={(e)=>handleSubmitInfrastructure(e)}>

                                                                {/* Name */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Name
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        id={`add_${addBtnLabel}_name`}
                                                                        name='name'
                                                                        defaultValue={editData.name}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                                    </div>                                                            

                                                                {/* Category */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_category_field`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Category{' '}
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <Select
                                                                        options={selectOptionss}
                                                                        required
                                                                        id={`add_${addBtnLabel}_category_field`}
                                                                        name='category'
                                                                        key={editData.category} 
                                                                        defaultValue={{value: editData.category, label: editData.category_name}}
                                                                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                    />
                                                                </div>

                                                                 {/* Track Numbers */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <label
                                                                            htmlFor={`add_${addBtnLabel}_track_numbers`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                             Track Numbers
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>

                                                                        <input className='' type='checkbox' id={`add_${addBtnLabel}_track_numbers`} name='count' 
                                                                        defaultChecked={editData.numbers} 
                                                                        />
                                                                </div>

                                                                {/* Description */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            id={`add_${addBtnLabel}_desc`}
                                                                            name='description'
                                                                            defaultValue={editData.description}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                               

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )

                                                        case 'hr category':
                                                            return (
                                                                <form className='w-full h-full'>
                                                                
                                                                    {/* Name */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_name`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                               Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Name'
                                                                            name={`add_${addBtnLabel}_name`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                 {/* Description */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )
                                                        case 'specialty':
                                                            return(
                                                                <form className='w-full h-full'>

                                                                {/* Name */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Name
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        name={`add_${addBtnLabel}_name`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                                    </div>                                                            

                                                                {/* Category */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>

                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_category_field`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Category{' '}
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <Select
                                                                        options={[
                                                                            {
                                                                                value: 'type-1',
                                                                                label: 'type-1',
                                                                            },
                                                                            {
                                                                                value: 'type-2',
                                                                                label: 'type-2',
                                                                            },
                                                                        ]}
                                                                        required
                                                                        placeholder='Select a Category'
                                                                        onChange={() => console.log('changed type')}
                                                                        name={`add_${addBtnLabel}_category_field`}
                                                                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                    />
                                                                </div>

                                                                {/* Description */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                               

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )

                                                        case 'contact type':
                                                            const handleSubmitContactType = (e) => {
                                                                e.preventDefault()
                                                                const obj = {};
                                                                const elements = [...e.target];
                                                                elements.forEach((element) => {
                                                                        obj[element.name] = element.value
                                                                });

                                                                try {
                                                                    let url = ''
                                                                    editMode? url =`/api/system_setup/submit_form/?path=add_contact_type&id=${editData.id}` : url =`/api/system_setup/submit_form/?path=add_contact_type`
                                                                    fetch(url,{
                                                                       headers: {
                                                                           'Accept': 'application/json, text/plain, */*',
                                                                           'Content-Type': 'application/json;charset=utf-8'
                                                                       },
                                                                       method: editMode ? 'PATCH' : 'POST' ,
                                                                       body: JSON.stringify(obj).replace(',"":""', '')
                                                                    }).then(res => res.json()).then(data => {
                                                                        setEditMode(false);setEditID(null)
                                                                    })
                                                               } catch (error) {
                                                                   console.log(error)
                                                               }
                                                            }
                                                            return (
                                                                <form className='w-full h-full' onSubmit={handleSubmitContactType}>
                                                                
                                                                    {/* Name */}
                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_name`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                                Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Name'
                                                                            id={`add_${addBtnLabel}_name`}
                                                                            name='name'
                                                                            defaultValue={editData.name}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                    {/* Description */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>

                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            id={`add_${addBtnLabel}_desc`}
                                                                            name='description'
                                                                            defaultValue={editData.description}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )
                                                        case 'facility department':
                                                            const handleFacilityDepartment = (e) => {
                                                                e.preventDefault()
                                                                const obj = {};
                                                                const elements = [...e.target];
                                                                elements.forEach((element) => {
                                                                        obj[element.name] = element.value
                                                                });

                                                                try {
                                                                    let url = ''
                                                                    editMode? url =`/api/system_setup/submit_form/?path=add_facility_dept&id=${editData.id}` : url =`/api/system_setup/submit_form/?path=add_facility_dept`
                                                                    fetch(url,{
                                                                       headers: {
                                                                           'Accept': 'application/json, text/plain, */*',
                                                                           'Content-Type': 'application/json;charset=utf-8'
                                                                       },
                                                                       method: editMode ?'PATCH' :'POST' ,
                                                                       body: JSON.stringify(obj).replace(',"":""', '')
                                                                    }).then(res => res.json()).then(data => {
                                                                        setEditMode(false);setEditID(null)
                                                                    })
                                                               } catch (error) {
                                                                   console.log(error)
                                                               }
                                                            }
                                                            return (
                                                            <form className='w-full h-full' onSubmit={(e)=>handleFacilityDepartment(e)}>
                                                                
                                                                {/* Name */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Name
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        id={`add_${addBtnLabel}_name`}
                                                                        name='name'
                                                                        defaultValue={editData.name}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                                {/* Description */}
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_desc`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Description
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            
                                                                        </span>
                                                                    </label>

                                                                    <textarea
                                                                    
                                                                        type='text'
                                                                        placeholder='Description'
                                                                        id={`add_${addBtnLabel}_desc`}
                                                                        name='description'
                                                                        defaultValue={editData.description}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                              {/* Regulatory Body */}
                                                              <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Regulatory Body
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>

                                                                    <Select
                                                                        options={selectOptionss}
                                                                        required
                                                                        placeholder='Select a regulatory body'
                                                                        id={`add_${addBtnLabel}_category_field`}
                                                                        name='regulatory_body'
                                                                        key={editData.regulatory_body}
                                                                        defaultValue={{value:editData.regulatory_body, label: editData.regulatory_body_name}}
                                                                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                    />
                                                                   
                                                            </div>

                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            </form>
                                                            )
                                                        case 'facility type detail':
                                                            const handleFacilityTypeDetail = (e) => {
                                                                e.preventDefault()
                                                                const obj = {};
                                                                const elements = [...e.target];
                                                                elements.forEach((element) => {
                                                                        obj[element.name] = element.value
                                                                });

                                                                try {
                                                                    let url = ''
                                                                    editMode? url =`/api/system_setup/submit_form/?path=add_facility_type&id=${editData.id}` : url =`/api/system_setup/submit_form/?path=add_facility_type`
                                                                    fetch(url,{
                                                                       headers: {
                                                                           'Accept': 'application/json, text/plain, */*',
                                                                           'Content-Type': 'application/json;charset=utf-8'
                                                                       },
                                                                       method: editMode ?'PATCH' :'POST' ,
                                                                       body: JSON.stringify(obj).replace(',"":""', '')
                                                                    }).then(res => res.json()).then(data => {
                                                                        setEditMode(false);setEditID(null)
                                                                    })
                                                               } catch (error) {
                                                                   console.log(error)
                                                               }
                                                            }
                                                            return (
                                                            <form className='w-full h-full' onSubmit={handleFacilityTypeDetail}>
                                                                
                                                                {/* Facility Type */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Facility Type
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        id={`add_${addBtnLabel}_name`}
                                                                        name='name'
                                                                        defaultValue={editData.name}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>


                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            </form>
                                                            )
                                                        case 'facility type category':
                                                            return (
                                                                
                                                            <form className='w-full h-full'>
                                                                
                                                                {/* Facility Type */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_type`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Facility Type
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <Select
                                                                        options={[
                                                                            {
                                                                                value: 'type-1',
                                                                                label: 'type-1',
                                                                            },
                                                                            {
                                                                                value: 'type-2',
                                                                                label: 'type-2',
                                                                            },
                                                                        ]}
                                                                        
                                                                        placeholder='Select facility type'
                                                                        onChange={() => console.log('changed type')}
                                                                        name={`add_${addBtnLabel}_type`}
                                                                        className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                    />
                                                            </div>

                                                            {/* Facility Type Detail */}
                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_type_detail`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Facility Type Detail
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        name={`add_${addBtnLabel}_type_detail`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>


                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            </form>
                                                            )
                                                        case 'facility operation status':
                                                            const handleOperationStatus = (e) => {
                                                                e.preventDefault()
                                                                const obj = {};
                                                                const elements = [...e.target];
                                                                elements.forEach((element) => {
                                                                    element.type == 'checkbox' ? (obj[element.name] = element.checked) : (obj[element.name] = element.value);
                                                                });
                                                                console.log(obj);
                                                                try {
                                                                    let url = ''
                                                                    editMode? url =`/api/system_setup/submit_form/?path=add_facility_status&id=${editData.id}` : url =`/api/system_setup/submit_form/?path=add_facility_status`
                                                                    fetch(url,{
                                                                       headers: {
                                                                           'Accept': 'application/json, text/plain, */*',
                                                                           'Content-Type': 'application/json;charset=utf-8'
                                                                       },
                                                                       method: editMode ?'PATCH' :'POST' ,
                                                                       body: JSON.stringify(obj).replace(',"":""', '')
                                                                    }).then(res => res.json()).then(data => {
                                                                        setEditMode(false);setEditID(null)
                                                                    })
                                                               } catch (error) {
                                                                   console.log(error)
                                                               }
                                                            }
                                                            return (
                                                                
                                                             <form className='w-full h-full' onSubmit={handleOperationStatus}>
                                                                
                                                                {/* Facility Type */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_status`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Facility Status
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        id={`add_${addBtnLabel}_status`}
                                                                        name='name'
                                                                        defaultValue={editData.name}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                            {/* Is Seen Public */}
                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_is_public`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Will facilities with this status be seen in public? 
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='checkbox'
                                                                        placeholder='Name'
                                                                        id={`add_${addBtnLabel}_is_public`}
                                                                        name= 'is_public_visible'
                                                                        defaultChecked={editData.is_public_visible}
                                                                        
                                                                    />
                                                            </div>


                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            </form>
                                                            )
                                                        case 'facility admission status':
                                                            return (
                                                                
                                                            <form className='w-full h-full'>
                                                                
                                                                {/* Facility Type */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_status`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                            Facility Admission Status
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        name={`add_${addBtnLabel}_status`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>


                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            </form>
                                                            )
                                                        case 'facility owner detail':
                                                            return(
                                                                <form className='w-full h-full'>
                                                                
                                                                {/* Name */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                           Name
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        name={`add_${addBtnLabel}_name`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                             {/* Description */}
                                                             <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_desc`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Description
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            
                                                                        </span>
                                                                    </label>
                                                                    <textarea
                                                                    
                                                                        type='text'
                                                                        placeholder='Description'
                                                                        name={`add_${addBtnLabel}_desc`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            <button onClick={(e) => {e.preventDefault()}} className="rounded p-2 bg-indigo-500 mt-3 text-white font-semibold">View change log</button>

                                                                </form>
                                                            )
                                                            case 'facility owner category':
                                                                return(
                                                                    <form className='w-full h-full'>
                                                                    
                                                                    {/* Name */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_name`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                               Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Name'
                                                                            name={`add_${addBtnLabel}_name`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                   
                                                                    {/* Owner Type */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_owner_type`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                               Owner Type
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>

                                                                        <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select Facility Owner'
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_owner_type`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />
                                                                       
                                                                </div>

                                                                  {/* Abbreviation */}
                                                                  <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_constituency_field`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Abbreviation
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                                <input
                                                                                    required
                                                                                    type='text'
                                                                                    placeholder='Abbreviation'
                                                                                    name={`add_${addBtnLabel}_constituency_field`}
                                                                                    className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                />
                                                                     </div>

    
    
                                                                 {/* Description */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>
    
                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>
    
                                                                <button onClick={(e) => {e.preventDefault()}} className="rounded p-2 bg-indigo-500 mt-3 text-white font-semibold">View change log</button>
    
                                                                    </form>
                                                                )
                                                        case 'job title':
                                                            return (
                                                                <form className='w-full h-full'>
                                                                
                                                                {/* Name */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                           Name
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        name={`add_${addBtnLabel}_name`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                             {/* Description */}
                                                             <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_desc`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Description
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            
                                                                        </span>
                                                                    </label>
                                                                    <textarea
                                                                    
                                                                        type='text'
                                                                        placeholder='Description'
                                                                        name={`add_${addBtnLabel}_desc`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                            </div>

                                                            </form>
                                                            )
                                                    case 'regulatory body':
                                                        const handleAddContactGroup = (e) => {
                                                            e.preventDefault()
                                                            // Contact Type
                                                            const contactTypeNode = inputsContainerRef2.current.childNodes[2].cloneNode(true);
                                                          
                                                            contactTypeNode.setAttribute('name', `option_type_${uid}`);
                                                            contactTypeNode.setAttribute('options', `
                                                                type-1
                                                                type-2
                                                            `)
                                                            contactTypeRef.current.append(contactTypeNode)


                                                            // Contact Details
                                                             const contactDetailsNode = document.createElement('input')
                                                             contactDetailsNode.setAttribute(
                                                                'placeholder',
                                                                'Display Text'
                                                             );
                                                             contactDetailsNode.setAttribute(
                                                                'name',
                                                                `display_input_${uid}`
                                                             );
                                                             contactDetailsNode.setAttribute('class', 'flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none')
                                                             contactDetailRef.current.append(contactDetailsNode)
                                                        }
                                                       
                                                        return (
                                                            <form className='w-full h-full'>
                                                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_name`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                           Name
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                        required
                                                                        type='text'
                                                                        placeholder='Name'
                                                                        name={`add_${addBtnLabel}_name`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                             {/* Abbreviation */}
                                                             <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_abbr`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Abbreviation
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                    
                                                                        type='text'
                                                                        placeholder=''
                                                                        name={`add_${addBtnLabel}_abbr`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>


                                                                {/* inputsContainer */}
                                                                <div className='grid grid-cols-2 place-content-start gap-3 space-y-1' ref={inputsContainerRef2}>
                                                                    <h2 className='text-lg font-semibold text-indigo-900'>Contact Type*</h2>
                                                                    <h2 className='text-lg font-semibold text-indigo-900'>Contact Details*</h2>
                                                                

                                                                    {/* Contact Type */}
                                                                    <Select
                                                                            options={[
                                                                                {
                                                                                    value: 'type-1',
                                                                                    label: 'type-1',
                                                                                },
                                                                                {
                                                                                    value: 'type-2',
                                                                                    label: 'type-2',
                                                                                },
                                                                            ]}
                                                                            required
                                                                            placeholder='Select Contact Type'
                                                                            onChange={() => console.log('changed type')}
                                                                            name={`add_${addBtnLabel}_contact_type`}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />
                                                                    {/* Contact Detail */}
                                                                      <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Contact Details'
                                                                            name={`add_${addBtnLabel}_display_text`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />

                                                                    <div ref={contactTypeRef} className='mx-0 px-0 space-y-4'>

                                                                    </div>

                                                                    <div ref={contactDetailRef} className='mx-0 px-0 space-y-3'>

                                                                    </div>
                                                                    
                                                                    <div className='col-span-2 flex items-center justify-end'>
                                                                        <button className='rounded p-2 w-auto h-auto bg-indigo-600 text-white flex items-center self-start'
                                                                        onClick={handleAddContactGroup}
                                                                        >Add <PlusIcon className='w-5 h-5 text-white'/></button>
                                                                    </div>

                                                                </div>
                                                                
                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                 </div>
                                                    
                                                            

                                                            </form>
                                                        )

                                                    case 'regulatory status':
                                                        return (
                                                            <form className='w-full h-full'>
                                                                 {/* regulatory Status */}
                                                             <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                    
                                                                    <label
                                                                        htmlFor={`add_${addBtnLabel}_status`}
                                                                        className='text-gray-600 capitalize text-sm'>
                                                                        Regulatory Status
                                                                        <span className='text-medium leading-12 font-semibold'>
                                                                            {' '}
                                                                            
                                                                        </span>
                                                                    </label>
                                                                    <input
                                                                    
                                                                        type='text'
                                                                        placeholder='Enter Regulatory status'
                                                                        name={`add_${addBtnLabel}_status`}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                             </div>
                                                    
                                                            </form>
                                                        )
                                                        case 'upgrade reason':
                                                            return (
                                                                <form className='w-full h-full'>
                                                                
                                                                    {/* Facility Change reason */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_reason`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                               Facility Change reason
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder='Name'
                                                                            name={`add_${addBtnLabel}_reason`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                 {/* Description */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )

                                                        case 'Document':
                                                            return (
                                                                <form className='w-full h-full'>
                                                                
                                                                    {/* Name */}
                                                                     <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_reason`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                                Name
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type='text'
                                                                            placeholder=''
                                                                            name={`add_${addBtnLabel}_reason`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                 {/* Description */}
                                                                 <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_desc`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Description
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                
                                                                            </span>
                                                                        </label>
                                                                        <textarea
                                                                        
                                                                            type='text'
                                                                            placeholder='Description'
                                                                            name={`add_${addBtnLabel}_desc`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                  {/* File */}
                                                                  <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_file`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            File
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                        
                                                                            type='file'
                                                                            placeholder=''
                                                                            name={`add_${addBtnLabel}_file`}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                            )
                                                            
                                                    

             

                                                }

                                            })()

                                    }

                               </Paper>
                            </div>
                                
                            )
                                
                        }
                        

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