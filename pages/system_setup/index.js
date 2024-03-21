import React, {useState, useContext, useEffect, useCallback, useRef} from 'react'

// component / controllers imports
import MainLayout from '../../components/MainLayout'
import { checkToken } from '../../controllers/auth/auth';
import useDidMountEffect from '../../hooks/useDidMountEffect';

// next imports
import Head from 'next/dist/shared/lib/head'
import { PlusIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import * as Tabs from "@radix-ui/react-tabs";

// MUI imports
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

import TableRow from '@mui/material/TableRow';

import Alert from '@mui/material/Alert';
import { PermissionContext } from '../../providers/permissions';
import { hasPermission } from '../../utils/checkPermissions';
import moment from 'moment'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import Select from 'react-select';
import { AddLocationAlt, Article, GroupAdd, LocalHospital, MapsHomeWork, MiscellaneousServices, Phone, ReduceCapacity } from '@mui/icons-material';
import { useAlert } from "react-alert";
import router from 'next/router';

import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid'

import { styled } from '@mui/material/styles';
import { PencilAltIcon } from '@heroicons/react/outline';
import { UserContext } from '../../providers/user';


const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid rgba(156, 163, 175, 1)`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        // borderRight: `1px solid rgba(156, 163, 175, 1)`,
        FontFace: 'IBM Plex Sans'

    }
}))


function SystemSetup(props) {

    const userCtx = useContext(UserContext)



    const userPermissions = useContext(PermissionContext)
    const [title, setTitle] = useState('Counties')
    const [addBtnLabel, setAddBtnLabel] = useState('county')  
    const [openAdminUnits, setOpenAdminUnits] = useState(false);
    const [openServiceCatalogue, setOpenServiceCatalogue] = useState(false);
    const [openHealthInfr, setOpenHealthInfr] = useState(false);
    const [openHR, setOpenHR] = useState(false);
    const [openContacts, setOpenContacts] = useState(false);
    const [openFacilities, setOpenFacilities] = useState(false);
    const [openCHU, setOpenCHU] = useState(false);    
    const [openDocuments, setOpenDocuments] = useState(false); 
    const [resourceCategory, setResourceCategory] = useState('AdminUnits');
    const [selectOptions, setSelectOptions] = useState([]);
    const [resource, setResource] = useState('counties'); 
    const [loading, setIsLoading] = useState(true);
    const [logsRows, setLogsRows] = useState([]);
    const alert = useAlert()
    const [viewLog, setViewLog] = useState(false);
    const [fields, setFields] = useState([]);
    const [is_parent, setIsParent] = useState(null);
    const [isAddForm, setIsAddForm] = useState(false);
    const [editData, setEditData] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [editID, setEditID] = useState(null);
    const [contactList, setContactList]=useState([{}])
    const [optionGroup, setOptionGroup]=useState([{}])
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [sbcty_constituency, setSbctyConstituency] = useState([]);
    const [value, setValue] = React.useState('1');
    const [user, setUser] = useState(userCtx);
	  
    const [isClient, setIsClient] = useState(false)
    const [columns, setColumns] = useState([
        { field: 'name', label: 'Name', flex: 1 },
        { field: 'code', label: 'Code', flex: 1},
        { field: 'action',label: 'Action', renderCell: (params) => (
            <button
              variant="contained"
              size="small"
              className="flex flex-row items-center gap-2"
              onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
              
            >
              <p className="text-gray-900 font-semibold">Edit</p>
              <PencilAltIcon className="h-5 w-5 text-gray-900"/>
            </button>
        ) ,flex: 1}
      ]);
    const [rows, setRows] = useState(Array.from(props?.data?.results ?? [], ({id, name, code}) => ({name, code, id})))

    const [logsColumns] = useState([
        { field: 'updated_on', label: 'Date', flex: 1 },
        { field: 'updated_by', label: 'User', flex: 1},
        { field: 'updates',label: 'Updates',flex: 1, }
      ]);
    const [constituenciesColumns] = useState([
        { field: 'name', label: 'Name', flex: 1 },
        { field: 'code', label: 'Code', flex: 1},
    ]);
    const [wardsColumns] = useState([
        { field: 'name', label: 'Name', flex: 1 },
        { field: 'code', label: 'Code', flex: 1},
    ]);
    const [county_users] = useState([
        { field: 'user_full_name', label: 'User', width: 200 },
        { field: 'user_email', label: 'Email', width: 300 }, 
        { field: 'county_name', label: 'County', width: 100 },
        { field: 'county_code', label: 'Code', width: 100 },
        { field: 'user', label: 'User', width: 100 },
        
    ]);

    
   
    const groupID = userCtx?.groups[0]?.id


    // Refs
    const {inputsContainerRef, inputsContainerRef2} = useRef(null);

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
      }, []);
    
    useEffect(() => {

        setUser(userCtx);
        if(user.id === 6){
            router.push('/auth/login')
        }

        // if(
        //     /*!hasPermission(/^common.add_county$/, userPermissions)*/
        //     groupID !== 7 || 
        //     groupID !== 5
        //  ){
        //     router.push('/unauthorized')
        // }

	  setIsClient(true)
	}, [])

   
    const fetchDataCategory =  () => {
  
    // Fetch data
    try{
        let url =`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&fields=${fields.join(',')}`
        if(is_parent !== null){
            url = url + `&is_parent=${is_parent}`
        }
        // console.log(url);
        fetch(url)
        .then(res => res.json())
        .then(_data => {
            if(_data.results.length > 0){
                // update columns
                // console.log({resourceCategory})
                switch(resourceCategory){
                  case 'AdminUnits':
                        console.log({resource})
                        switch(resource){

                            case 'counties':
                               
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'code', label: 'Code', flex: 1},
                                    { field: 'action',label: 'Action', renderCell: (params) => (
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                            {console.log({countiesParams: params})}
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    ) ,flex: 1}
                                  ])
    
                                  setRows(Array.from(_data.results, ({id, name, code}) => ({name, code, id})))
    
                                  break;
                                // Check and fix the data
                                case 'sub_counties':
                               
                                  setColumns([
                                      { field: 'name', label: 'Name', flex: 1 },
                                      { field: 'code', label: 'Code', flex: 1},
                                      { field: 'action',label: 'Action', renderCell: (params) => (
                                          <button
                                            variant="contained"
                                            size="small"
                                            className="flex flex-row items-center gap-2"
                                            onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                            
                                          >
                                            <p className="text-gray-900 font-semibold">Edit</p>
                                            <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                          </button>
                                      ) ,flex: 1}
                                    ])
      
                                    setRows(Array.from(_data.results, ({id, name, code}) => ({name, code, id})))
      
                                    break;

                                    case 'constituencies':
                               
                                    setColumns([
                                        { field: 'name', label: 'Name', flex: 1 },
                                        { field: 'code', label: 'Code', flex: 1},
                                        { field: 'action',label: 'Action', renderCell: (params) => (
                                            <button
                                              variant="contained"
                                              size="small"
                                              className="flex flex-row items-center gap-2"
                                              onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                              
                                            >
                                              <p className="text-gray-900 font-semibold">Edit</p>
                                              <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                            </button>
                                        ) ,flex: 1}
                                      ])
        
                                      setRows(Array.from(_data.results, ({id, name, code}) => ({name, code, id})))
        
                                      break;

                            case 'wards':
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'code', label: 'Code', flex: 1},
                                    { field: 'sub_county_name', label: 'Sub-county', flex: 1},
                                    { field: 'constituency_name', label: 'Constituency', flex: 1},
                                    { field: 'county_name', label: 'County', flex: 1},
                                    { field: 'action', label: 'Action', flex: 1, renderCell: (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                  ])
    
                                  setRows(Array.from(_data.results, ({id, name, code, sub_county_name, constituency_name, county_name}) => ({id, name, code, sub_county_name, constituency_name, county_name})))
    
                                  break;
                            case 'towns':
                           
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'action',label: 'Action', flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                  ])
                                    
                                  setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                                  break;
                            default:
                                  
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'code', label: 'Code', flex: 1},
                                    { field: 'action',label: 'Action',flex: 1}
                                  ])
                    
                                setRows(Array.from(_data.results, ({id, name, code}) => ({id, name, code})))
                        }
                        
                      break;
                  case 'ServiceCatalogue':
                        
                      setColumns([
                          { field: 'name', label: 'Name', flex: 1 },
                          { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                      ])
          
                      setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                      
                      break;
                  case 'HealthInfrastructure':
                      if(resource === 'infrastructure'){
                        setColumns([
                            { field: 'name', label: 'Name', flex: 1 },
                            { field: 'category_name', label: 'Category', flex: 1 },
                            { field: 'numbers', label: 'Tracking numbers?', flex: 1, format: 'boolean' },
                            { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                        ])
                        
                       
                        setRows(Array.from(_data.results, ({id, name, category_name, numbers}) => ({id, name, category_name, numbers})))
                      }
                      else{
                        setColumns([
                            { field: 'name', label: 'Name', flex: 1 },
                            { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                        ])
                        
                        setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                      }
                     
                      break;
                  case 'HR':
                      setColumns([
                          { field: 'name', label: 'Name', flex: 1 },
                          { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                      ])
          
                      setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                      
                      break;
                  case 'Contacts':
                      setColumns([
                          { field: 'num', label: '#', flex: 1 },
                          { field: 'name', label: 'Name', flex: 1 },
                          { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                      ])
          
                      setRows(Array.from(_data.results, ({id, name}, i) => ({id, num:i+1, name})))
                      
                      break;
                  case 'Facilities':
                      switch(resource){
                            case 'facility_depts':
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'description', label: 'Description', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          {/* { console.log({params})} */}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                              
    
                                setRows(Array.from(_data.results, ({id, name, description}) => ({id, name, description})))
                                break;
    
                            case 'facility_types':
                                
                                switch(addBtnLabel){
    
                                    case 'facility type detail':
                                        setColumns([    
                                            { field: 'name', label: 'Facility Type', flex: 1 },
                                            { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                        ])
                                        
                                        
                                        setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                                        break;
    
                                    case 'facility type category':
                                        setColumns([
                                            { field: 'name', label: 'Facility Type Details', flex: 1 },
                                            { field: 'sub_division', label: 'Facility Type', flex: 1 },
                                            { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                        ])
    
                                       
                                        setRows(Array.from(_data.results, ({id, name, sub_division}) => ({id, name, sub_division})))
                                        break;  
    
                                }
                               
                                break;
    
                            case 'facility_status':
                                setColumns([    
                                    { field: 'name', label: 'Facility Status', flex: 1 },
                                    { field: 'is_public_visible', label: 'Public Visible', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                              
    
                                setRows(Array.from(_data.results, ({id, name, is_public_visible}) => ({id, name, is_public_visible:is_public_visible ? 'Yes' : 'No'})))
    
                                break;
                            
                            case 'facility_admission_status':
                                setColumns([
                                    { field: 'name', label: 'Facility Admission Status', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                             
    
                                setRows(Array.from(_data.results, ({id, name, is_public_visible}) => ({id, name, is_public_visible:is_public_visible ? 'Yes' : 'No'})))
                                break;
    
                            case 'facility_service_ratings':
                                setColumns([
                                    { field: 'facility_name', label: 'Facility', flex: 1 },
                                    { field: 'service_name', label: 'Service', flex: 1 },
                                    { field: 'comment', label: 'Comment', flex: 1 },
                                    { field: 'rating', label: 'Rating', flex: 1 },
                                    { field: 'created', label: 'Date', flex: 1 },
                                    
                                ])
                               
    
                                setRows(Array.from(_data.results, ({id, facility_name, service_name, comment, rating, date}) => ({id, facility_name, service_name, comment, rating, date})))
                                break;
    
                            case 'owner_types':
        
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                                setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                                
                                break;
    
                            case 'owners':
    
                                setColumns([
                                    { field: 'code', label: 'Code', flex: 1 },
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'abbreviation', label: 'Abbreviation', flex: 1 },
                                    { field: 'owner_type_name',label: 'Owner Type',flex: 1},
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                                setRows(Array.from(_data.results, ({id, code, name, abbreviation, owner_type_name}) => ({id, code, name, abbreviation, owner_type_name})))
                                
                                break;
    
                            
                            case 'job_titles':
    
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                                setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                                
                                break;
                            
                            case 'regulating_bodies':
    
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'abbreviation', label: 'Abbreviation', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                                setRows(Array.from(_data.results, ({id, abbreviation, name}) => ({id, abbreviation, name})))
                                
                                break;
    
                            case 'regulation_status':
    
                                setColumns([
                                    { field: 'name', label: 'Name', flex: 1 },
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                                ])
                                
                                setRows(Array.from(_data.results, ({id, name}) => ({id, name})))
                                
                                break;
    
                            case 'level_change_reasons':
    
                                setColumns([
                                    { field: 'reason', label: 'Change Reason', flex: 1 },
                                    { field: 'description',label: 'Description', flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )},
                                    { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
    
                                ])
                                
                                setRows(Array.from(_data.results, ({id, reason, description}) => ({id, reason, description})))
                                
                                break;
    
                            default:
                                break;
    
                      }
    
                      break;
                     
                  case 'CHU':
                      setColumns([
                          { field: 'facility_name', label: 'Facility', flex: 1 },
                          { field: 'chu_name', label: 'CHU', flex: 1 },
                          { field: 'comment', label: 'Comment', flex: 1 },
                          { field: 'rating', label: 'Rating', flex: 1 },
                          { field: 'created',label: 'Date',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                      ])
                      
                      setRows(Array.from(_data.results, ({id, facility_name, chu_name, comment, rating, date}) => ({id, facility_name, chu_name, comment, rating, date})))
                      break;
    
                  case 'Documents':
          
                      setColumns([
                          { field: 'name', label: 'Name', flex: 1 },
                          { field: 'description', label: 'Description', flex: 1 },
                          { field: 'fyl', label: 'Link', flex: 1,  link: true },
                          { field: 'action',label: 'Action',flex: 1, renderCell:  (params) => (
                                    
                                        <button
                                          variant="contained"
                                          size="small"
                                          className="flex flex-row items-center gap-2"
                                          onClick={() => {setEditID(params.row.id); setEditMode(true); setIsAddForm(true);}}
                                          
                                        >
                                          <p className="text-gray-900 font-semibold">Edit</p>
                                          { console.log({params})}
                                          <PencilAltIcon className="h-5 w-5 text-gray-900"/>
                                        </button>
                                    )}
                      ])
                      
                      setRows(Array.from(_data.results, ({id, name, description, fyl}) => ({id, name, description, fyl})))
                   
                      break;
    
              
          
               }
              }
        })

      
        
        
      

    } catch (e){
        console.error(e.message);
    }

   
}

    useDidMountEffect(fetchDataCategory, [resource, isAddForm, is_parent]);

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
    //onChange 
    const handleFacilityOnChange = (e, path) => {
        e.preventDefault()
        const obj = {};
        const elements = [...e.target];
        elements.forEach((element) => {
            if (obj[element.name] === '') {
                delete obj[element.name];
              }
            if(element.name == 'contact_type' || element.name == 'contact'){
                let data = [...contactList];
                obj['contacts'] = {}
                data[element.id][element.name] = element.value
                obj['contacts'] = data.map((ct)=>{
                    return{
                    ...ct,
                    contact_type: ct.contact_type,
                    contact: ct.contact
                }
                })

            }else{
                element.type === 'checkbox' ? obj[element.name] = element.checked : obj[element.name] = element.value;
            }
        });
        try {
            let url = ''
            editMode? url =`/api/system_setup/submit_form/?path=${path}&id=${editID}&resourceCategory=${resourceCategory}` : url =`/api/system_setup/submit_form/?path=${path}&resourceCategory=${resourceCategory}`
            fetch(url,{
               headers: {
                   'Accept': 'application/json, text/plain, */*',
                   'Content-Type': 'application/json;charset=utf-8'
               },
               method: editMode ?'PATCH' :'POST' ,
               body: JSON.stringify(obj).replace(',"":""', '')
            }).then(res => res.json()).then(data => {
                setEditMode(false);setEditID(null);setIsAddForm(false);setEditData([])
                if(data.details){
                    alert.danger('Error: '+data.details)
                  }else{
                    alert.success( (editMode? 'Updated' : 'Added') +' Successfully')
                  }
            })
       } catch (error) {
           alert.danger('Error: '+error)
       }
    }

    const handleDelete = async (path) => {
        await fetch(`/api/system_setup/submit_form/?path=${path}&id=${editData.id}&resourceCategory=${resourceCategory}`,{
            method: 'DELETE'
        })
        setEditMode(false);setEditID(null);setIsAddForm(false);setEditData([])   
    }

    const fetchSbctyConstituency = async (id) => {
        const url =[`/api/system_setup/data/?resource=constituencies&resourceCategory=${resourceCategory}&county=${id}`,
            `/api/system_setup/data/?resource=sub_counties&resourceCategory=${resourceCategory}&county=${id}` ]
        const resp= await Promise.all(url.map(url=>fetch(url)))
        const data = await Promise.all(resp.map(r=>r.json()))
        setSbctyConstituency(data)
    }
    console.log(sbcty_constituency);

    const fetchChangeLogs = async () => {
        let id = editData.id
        if(addBtnLabel== 'county')id=editData[0].id
        await fetch(`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${id}&fields=__rev__&include_audit=true`,{
          headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'
            
          },
          method:'GET',
        }).then(res => res.json()).then(data=>{
         const res = data.revisions.map((item, ky)=>{
    
              return {
              updated_on: moment(item.updated_on).format('ddd, Do MMM YYYY, h:mm a'),
              updated_by: item.updated_by,
              updates: (item.updates.map((item, i)=> (
                <div className={"self-start"}>
                <span className={"font-bold text-2x self-start"} key={item.name} >{item.name}</span>:  &nbsp;<span className={'text-red-600 self-start'} key={item.old}>{item.old + ''} </span>{'>>'}  &nbsp;<span className={'text-gray-600 self-start'} key={item.new}>{item.new + ''}</span>
               </div>
          )))
            }
          })
          setLogsRows(res)
        }).catch(err=>{console.log(err)})
      }
    //change logs
    const ChangeLog = () => {
        return(
            <>
            <button className='flex items-center justify-start space-x-2 p-1 border border-black  px-2'
            onClick={() => {
                setViewLog(!viewLog);
                fetchChangeLogs()
            } }
            >
                <span className='text-medium font-semibold text-black '>
                    {!viewLog ? 'View Changelog' : 'Hide Changelog'}
                </span>
            </button>
            
            {viewLog && (

                <div className='col-span-4 w-full h-auto'>
                        <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                    {logsColumns.map((column,i) => (
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
                                    {logsRows
                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {logsColumns.map((column, i) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {
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
                </div>
            )}
            </>
        )
    }
    //select options
    useEffect(() => {
        let url = ''
        if(addBtnLabel ==='infrastructure' || addBtnLabel ==='facility department' || addBtnLabel ==='facility owner category' || addBtnLabel === 'facility type category' || addBtnLabel === 'regulatory body' || addBtnLabel === 'specialty' || addBtnLabel === 'category' || addBtnLabel === 'constituency'|| addBtnLabel === 'ward'){
            if(addBtnLabel ==='facility department'){
                url =`/api/system_setup/data/?resource=regulating_bodies&resourceCategory=Facilities&fields=id,name`  
                              
            }
            if(addBtnLabel ==='infrastructure'){
                url =`/api/system_setup/data/?resource=infrastructure_categories&resourceCategory=HealthInfrastructure&fields=id,name`                
            }
            if(addBtnLabel ==='facility owner category'){
                url =`/api/system_setup/data/?resource=owner_types&resourceCategory=Facilities&fields=id,name`                
            }
            if(addBtnLabel ==='facility type category'){
                url =`/api/system_setup/data/?resource=facility_types&resourceCategory=Facilities&fields=id,name&is_parent=true`                
            }
            if(addBtnLabel ==='regulatory body'){
                url =`/api/system_setup/data/?resource=contact_types&resourceCategory=Contacts&fields=id,name`                
            }
            if(addBtnLabel ==='specialty'){
                url =`/api/system_setup/data/?resource=speciality_categories&resourceCategory=HR&fields=id,name`                
            }
            if(addBtnLabel ==='category'){
                url =`/api/system_setup/data/?resource=service_categories&resourceCategory=ServiceCatalogue&fields=id,name`                
            }
            if(addBtnLabel ==='constituency' || addBtnLabel ==='ward'){
                url =`/api/system_setup/data/?resource=counties&resourceCategory=AdminUnits&fields=id,name`                
            }

             fetch(url)
             .then(res => res.json())
             .then(res => {
                console.log({res: res?.results})
                setSelectOptions(res.results.map(({id, name}) => ({value:id, label:name})))
            })
                
        }
        if(addBtnLabel === 'service'){
            let resource =['option_groups', 'service_categories']
            let options = []
            resource.forEach((item, i)=>{
                fetch(`/api/system_setup/data/?resource=${item}&resourceCategory=ServiceCatalogue&fields=id,name`)
                .then(res => res.json())
                .then(res => {
                    const results = res.results.map(({id, name}) => ({value:id, label:name}));
                    options.push(results)
                    setSelectOptions(options)


                })
               
               
            })
        }
        isAddForm==false ?? setLogsRows([]); setViewLog(false); 
   
        // const results = _data.
        // setSelectOptions(results) 
    }, [addBtnLabel, isAddForm])

    //editData
    useEffect(() => {
        if(editMode && editID !== ''){
            setTitle(`Edit ${addBtnLabel}`); 
            let url = []
            let resp = []
            let data = []
            switch (addBtnLabel) {
                case 'county':
                     url = [`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`, 
                    `/api/system_setup/data/?resource=constituencies&resourceCategory=${resourceCategory}&county=${editID}`,
                    `/api/system_setup/data/?resource=user_counties&resourceCategory=${resourceCategory}&county=${editID}`,
                    ]
                     Promise.all(url.map(url=>fetch(url)))
                     .then(resp => {
                        Promise.all(resp.map(r=>r.json()))
                        .then(
                           data => {
                               setEditData(data)
                               setIsLoading(false)
                           }
                        )
                     })
                    
                    
                break;
                case 'sub_county':
                    url = [`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`, 
                    `/api/system_setup/data/?resource=wards&resourceCategory=${resourceCategory}&sub_county=${editID}`,
                    ]
                    Promise.all(url.map(url=>fetch(url)))
                    .then(resp => {
                        Promise.all(resp.map(r=>r.json()))
                        .then(
                           data => {
                               
                               setEditData(data)
                               setIsLoading(false)
                           }
                        )
                    })
                    
                    
                break;
                case 'constituency':
                    url = [`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`, 
                    `/api/system_setup/data/?resource=wards&resourceCategory=${resourceCategory}&constituency=${editID}`,
                    ]
                    Promise.all(url.map(url=>fetch(url)))
                    .then(resp => {
                        Promise.all(resp.map(r=>r.json()))
                        .then(
                           data => {
                               
                               setEditData(data)
                               setIsLoading(false)
                           }
                        )
                    })
                    
                    
                break;
            
                default:
                   fetch(`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`)
                   .then(res => res.json())
                   .then(_data => {
                    setEditData(_data)
                    addBtnLabel === 'regulatory body' ? setContactList([..._data.contacts]): addBtnLabel === 'option group' ? setOptionGroup([..._data.options]) :null
                    addBtnLabel === 'ward' ? fetchSbctyConstituency(_data.county.id) : null
        
                   })
                  
                    // console.log(_data?.county?.id);
                  
                break;
            }
            
        }else{
            setEditData([])
            setEditMode(false)
        }

    }, [addBtnLabel, editID, editMode])
// console.log(editData, editMode, editID);
    if(isClient){
    return (
    <>
                <Head>
                    <title>KMHFR | System Setup</title>
                    <metadata zoomAndPan='100'></metadata>
                    <link rel="icon" href="/favicon.ico" />
                    {/* {console.log({columns, rows})} */}
                </Head>

                <MainLayout>

                    <div className="w-full  md:w-[85%] md:mx-auto grid grid-cols-5 gap-4 p-2 my-6">
                        {open && 
                        <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                timeout: 500,
                                }}
                            >
                                <Fade in={open}>
                                <Box sx={
                                    {
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 700,
                                        bgcolor: 'rgba(255, 251, 235, 1)',
                                        boxShadow: 24,
                                        p: 4,
                                    }
                                }>
                                    <span className="flex gap-2">    
                                        Are you sure you want to delete<b>{editData.name}</b> ?
                                    </span>
                                <div className='flex justify-start gap-4 mt-4'>
                                        <button className="bg-gray-500 text-white font-semibold  p-2 text-center" type="button" onClick={()=>{handleDelete(addBtnLabel);setOpen(false)}}>Yes</button>
                                        <button className="bg-red-500 text-white font-semibold  p-2 text-center" 
                                        onClick={()=> {setEditMode(false);setEditID(null);setIsAddForm(false);setEditData([]);setOpen(false)}} 
                                        >No</button>
                                    </div>     
                                </Box>
                                </Fade>
                            </Modal>}
                        {/* Bread Cumbs  */}
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                                <Link className="text-gray-700" href="/">Home</Link> {'/'}
                                <span className="text-gray-500" >System setup</span>   
                        </div>
                        {/* Header Bunner */}
                        <div className={"col-span-5 flex justify-between w-full bg-transparent drop-shadow border border-gray-600 text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
                            <h2 className='text-xl font-bold text-black capitalize'>{title}</h2>
                            {
                            !isAddForm && addBtnLabel !== 'feedback' && addBtnLabel !== 'CHU Rating Comment' &&
                            <button className=' bg-blue-600 p-2 text-white flex items-center text-lg font-semibold' onClick={() => {setTitle(`Add ${addBtnLabel}`); setIsAddForm(true)}}>
                            {`Add ${addBtnLabel}`}
                            <PlusIcon className='text-white ml-2 h-5 w-5'/>
                            </button>
                            }
                            {isAddForm && editMode && addBtnLabel !== 'feedback' && addBtnLabel !== 'CHU Rating Comment' && addBtnLabel !== 'county' && addBtnLabel !== 'constituency' &&
                            <button className=' bg-black p-2 text-white flex items-center text-lg font-semibold' onClick={() => {setOpen(true)}}>
                            {`Delete `}
                            </button>
                            }
                        </div> 

                        {/* Side Menu */}
                        <div className='col-span-1 w-full col-start-1 h-auto shadow-sm bg-gray-50'>
                                    <List
                                        sx={{ width: '100%', bgcolor: '#f9fafb', flexGrow:1}}
                                        component="div"
                                        aria-labelledby="nested-list-subheader"
                                        
                                        >
                                        {/* Administrative Units */}
                                        <ListItemButton onClick={handleAdminUnitsClick} sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <AddLocationAlt />
                                            </ListItemIcon>
                                            <ListItemText primary="Administrative Units" />
                                            {openAdminUnits ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openAdminUnits} timeout="auto" unmountOnExit>
                                            <List component="ul" disablePadding>
                                                {/* Counties */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#2563eb' : 'none'}`, 
                                                color:`${addBtnLabel.toLocaleLowerCase() == 'county' ? 'white' :'none'}`,
                                                borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'county' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                }} 
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('counties'); setResourceCategory('AdminUnits'); setTitle('counties'); setAddBtnLabel('county'); setEditMode(false); setEditID(null) }}>
                                                    <ListItemText primary="Counties" />
                                                </ListItemButton>
                                                {/* Sub Counties */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'sub county' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'sub county' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'sub county' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }} 
                                                    onClick={() =>  {setIsAddForm(false); setAddBtnLabel('sub county'); setTitle('Sub Counties'); setFields(['id','name', 'code']); setResource('sub_counties')}} 

                                                >
                                                    <ListItemText primary="Sub Counties"/>
                                                </ListItemButton>
                                                {/* Constituencies */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }} 
                                                    onClick={() =>  {setIsAddForm(false); setAddBtnLabel('constituency'); setFields(['id','name', 'code']); setTitle('Constituencies'); setResource('constituencies')}} 
                                                >
                                                    {console.log({addBtnLabel})}
                                                    <ListItemText primary="Constituencies"/>
                                                </ListItemButton>
                                                {/* Wards */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }} 
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'county_name', 'constituency_name', 'sub_county_name', 'county']); setTitle('Wards'); setResource('wards'); setResourceCategory('AdminUnits'); setTitle('wards'); setAddBtnLabel('ward'); setEditMode(false); setEditID(null) }}>
                                                    <ListItemText primary="Wards" />
                                                </ListItemButton>
                                                {/* Towns */}
                                                <ListItemButton componene="li" 
                                                        sx={{
                                                            backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'town' ? '#2563eb' : 'none'}`, 
                                                            color:`${addBtnLabel.toLocaleLowerCase() == 'town' ? 'white' :'none'}`,
                                                            borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'town' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                            }} 
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'ward_name']); setResource('towns'); setResourceCategory('AdminUnits'); setTitle('Towns'); setAddBtnLabel('town'); setEditMode(false); setEditID(null) }}>
                                                    <ListItemText primary="Towns" />
                                                </ListItemButton>
                                            </List>
                                        </Collapse>

                                        {/* Service Catalogue */}
                                        <ListItemButton onClick={handleServiceCatalogueClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <MiscellaneousServices />
                                            </ListItemIcon>
                                            <ListItemText primary="Service Catalogue" />
                                            {openServiceCatalogue ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openServiceCatalogue} timeout="auto"  unmountOnExit>
                                            <List component="ul" disablePadding>
                                                {/* Categories */}
                                                <ListItemButton componene="li" 
                                                    sx={{
                                                            backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#2563eb' : 'none'}`, 
                                                            color:`${addBtnLabel.toLocaleLowerCase() == 'category' ? 'white' :'none'}`,
                                                            borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'category' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                            }} 
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'abbreviation', 'description']); setResource('service_categories'); setResourceCategory('ServiceCatalogue'); setTitle('Service categories'); setAddBtnLabel('Service Category'); setEditMode(false); setEditID(null)}}>
                                                    <ListItemText primary="Categories" />
                                                </ListItemButton>
                                                {/* Option groups */}
                                                <ListItemButton componene="li"
                                                sx={{
                                                            backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? '#2563eb' : 'none'}`, 
                                                            color:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? 'white' :'none'}`,
                                                            borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                            }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name']); setResource('option_groups'); setResourceCategory('ServiceCatalogue'); setTitle('option groups'); setAddBtnLabel('option group'); setEditMode(false); setEditID(null)}}>
                                                    <ListItemText primary="Option Groups" />
                                                </ListItemButton>
                                                {/* Services */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'service' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'service' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'service' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'abbreviation', 'category_name']); setResource('services'); setResourceCategory('ServiceCatalogue'); setTitle('services'); setAddBtnLabel('service'); setEditMode(false); setEditID(null)}}>
                                                    <ListItemText primary="Services" />
                                                </ListItemButton>
                                            
                                            </List>
                                        </Collapse>

                                        {/* Health Infrastructure */}
                                        <ListItemButton onClick={handleHealthInfrClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <LocalHospital />
                                            </ListItemIcon>
                                            <ListItemText primary="Health Infrastructure" />
                                            {openHealthInfr ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openHealthInfr} timeout="auto" unmountOnExit>
                                            <List component="ul" disablePadding>
                                                {/* Categories */}
                                                <ListItemButton componene="li" 
                                                    sx={{
                                                        backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure category' ? '#2563eb' : 'none'}`, 
                                                        color:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure category' ? 'white' :'none'}`,
                                                        borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure category' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                        }}
                                                    onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description']); setResource('infrastructure_categories'); setResourceCategory('HealthInfrastructure'); setTitle('Infrastructure categories'); setAddBtnLabel('infrastructure category'); setEditMode(false); setEditID(null)}}>
                                                    <ListItemText primary="Categories" />
                                                </ListItemButton>
                                                {/* Infrastructure */}
                                                <ListItemButton componene="li" 
                                                    sx={{
                                                        backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure' ? '#2563eb' : 'none'}`, 
                                                        color:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure' ? 'white' :'none'}`,
                                                        borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                        }}
                                                        onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'category_name', 'numbers']); setResource('infrastructure'); setResourceCategory('HealthInfrastructure'); setTitle('infrastructures'); setAddBtnLabel('infrastructure'); setEditMode(false); setEditID(null)}}>
                                                    <ListItemText primary="Infrastructure" />
                                                </ListItemButton>
                                            </List>
                                        </Collapse>

                                        {/* Human Resource */}
                                        <ListItemButton onClick={handleHRClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <ReduceCapacity />
                                            </ListItemIcon>
                                            <ListItemText primary="Human Resource" />
                                            {openHR ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openHR} timeout="auto" unmountOnExit>
                                            <List component="ul" disablePadding>
                                                {/* HR Categories */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'human resource category' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'human resource category' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'human resource category' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                            onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description']); setResource('speciality_categories'); setResourceCategory('HR'); setTitle('HR Categories'); setAddBtnLabel('human resource category')}}>
                                                    <ListItemText primary="HR Categories" />
                                                </ListItemButton>
                                                {/* Specialities */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'specialty' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'specialty' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'specialty' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'category_name']); setResource('specialities'); setResourceCategory('HR'); setTitle('specialities'); setAddBtnLabel('specialty')}}>
                                                    <ListItemText primary="Specialities" />
                                                </ListItemButton>
                                            </List>
                                        </Collapse>

                                        {/* Contacts */}
                                        <ListItemButton onClick={hanldeConactsClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <Phone />
                                            </ListItemIcon>
                                            <ListItemText primary="Contacts" />
                                            {openContacts ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openContacts} timeout="auto" unmountOnExit>
                                            <List component="ul" disablePadding>
                                                
                                                <ListItemButton componene="li"
                                                    sx={{
                                                        backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'contact type' ? '#2563eb' : 'none'}`, 
                                                        color:`${addBtnLabel.toLocaleLowerCase() == 'contact type' ? 'white' :'none'}`,
                                                        borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'contact type' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                        }}
                                                    onClick={() =>  {setIsAddForm(false); setFields(['id','name']); setResource('contact_types'); setResourceCategory('Contacts'); setTitle('contact types'); setAddBtnLabel('contact type'); setEditMode(false); setEditID(null)}}>
                                                    <ListItemText primary="Contact Type" />
                                                </ListItemButton>
                                            
                                            </List>
                                        </Collapse>

                                        {/* Facilities */}
                                        <ListItemButton onClick={handleFacilitiesClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <MapsHomeWork />
                                            </ListItemIcon>
                                            <ListItemText primary="Facilities" />
                                            {openFacilities ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openFacilities} timeout="auto" unmountOnExit>
                                            
                                            <List component="ul" disablePadding>
                                                {/* Facility Departments */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_depts'); setIsParent(null); setResourceCategory('Facilities'); setTitle('facility departments'); setAddBtnLabel('facility department'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Departments" />
                                                </ListItemButton>

                                                {/* Facility Type Details */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'sub_division']); setIsParent(true); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type details'); setAddBtnLabel('facility type detail'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Type Details" />
                                                </ListItemButton>

                                                {/* Facility Type Categories */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type category' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility type category'? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility type category' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'sub_division']); setIsParent(false); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type categories'); setAddBtnLabel('facility type category'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Type Categories" />
                                                </ListItemButton>

                                                {/* Facility Operation Status */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status'? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields([]); setResource('facility_status');setIsParent(null); setResourceCategory('Facilities'); setTitle('facility operation statuses'); setAddBtnLabel('facility operation status'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Operation Status" />
                                                </ListItemButton>

                                                {/*  Facility Admission Status */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_admission_status');setIsParent(null); setResourceCategory('Facilities'); setTitle('facility admission statuses'); setAddBtnLabel('facility admission status'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Admission Status" />
                                                </ListItemButton>

                                                {/*  Feedback */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['']);setIsParent(null); setResource('facility_service_ratings'); setResourceCategory('Facilities'); setTitle('feedbacks'); setAddBtnLabel('feedback'); setEditMode(false);}}>
                                                    <ListItemText primary="Feedback" />
                                                </ListItemButton>

                                                {/*  Facility Owner Details */}
                                                <ListItemButton componene="li"
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail'? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id', 'name']);setIsParent(null); setResource('owner_types'); setResourceCategory('Facilities'); setTitle('facility owner details'); setAddBtnLabel('facility owner detail'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Owner Details" />
                                                </ListItemButton>

                                                {/* Facility Owners Categories */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'abbreviation', 'owner_type_name']);setIsParent(null); setResource('owners'); setResourceCategory('Facilities'); setTitle('facility owner categories'); setAddBtnLabel('facility owner category'); setEditMode(false);}}>
                                                    <ListItemText primary="Facility Owners Categories" />
                                                </ListItemButton>

                                                {/*  Job Titles */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name']);setIsParent(null); setResource('job_titles'); setResourceCategory('Facilities'); setTitle('job titles'); setAddBtnLabel('job title'); setEditMode(false); }}>
                                                    <ListItemText primary="Job Titles" />
                                                </ListItemButton>

                                                {/*  Regulatory Bodies */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'abbreviation', 'regulatory_body_type_name', 'regulation_verb']); setIsParent(null);setResource('regulating_bodies'); setResourceCategory('Facilities'); setTitle('regulatory bodies'); setAddBtnLabel('regulatory body'); setEditMode(false); }}>
                                                    <ListItemText primary="Regulatory Bodies" />
                                                </ListItemButton>

                                                {/*  Regulatory Status */}
                                                <ListItemButton componene="li"
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}
                                                onClick={() =>  {setIsAddForm(false); setFields(['']);setIsParent(null); setResource('regulation_status'); setResourceCategory('Facilities'); setTitle('regulatory statuses'); setAddBtnLabel('regulatory status'); setEditMode(false); }}>
                                                    <ListItemText primary="Regulatory Status" />
                                                </ListItemButton>

                                                {/*  Upgrade Reason */}
                                                <ListItemButton componene="li"
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }} 
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','reason', 'description']);setIsParent(null); setResource('level_change_reasons'); setResourceCategory('Facilities'); setTitle('upgrade reasons'); setAddBtnLabel('upgrade reason'); setEditMode(false); }}>
                                                    <ListItemText primary="Upgrade Reason" />
                                                </ListItemButton>


                                            </List>
                                        </Collapse>

                                        {/* CHU */}
                                        <ListItemButton onClick={handleCHUClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <GroupAdd />
                                            </ListItemIcon>
                                            <ListItemText primary="CHU" />
                                            {openCHU ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openCHU} timeout="auto" unmountOnExit>
                                            <List component="ul" disablePadding>
                                                {/* CHU Rating Comments */}
                                                <ListItemButton componene="li" 
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'chu rating comment' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'chu rating comment' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'chu rating comment' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }} 
                                                onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('chu_ratings'); setResourceCategory('CHU'); setTitle('CHU Rating Comments'); setAddBtnLabel('CHU Rating Comment') }}>
                                                    <ListItemText primary="CHU Rating Comments" />
                                                </ListItemButton>
                                            
                                            </List>
                                        </Collapse>


                                        {/* Documents */}
                                        <ListItemButton onClick={handleDocumentsClick}  sx={{ borderBottom: 'solid 1px #d3d6db'}}>
                                            <ListItemIcon>
                                                <Article />
                                            </ListItemIcon>
                                            <ListItemText primary="Documents" />
                                            {openDocuments ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openDocuments} timeout="auto" unmountOnExit>
                                            <List component="ul" disablePadding>
                                                {/* Documents */}
                                                <ListItemButton componene="li"
                                                sx={{
                                                    backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'document' ? '#2563eb' : 'none'}`, 
                                                    color:`${addBtnLabel.toLocaleLowerCase() == 'document' ? 'white' :'none'}`,
                                                    borderBottom:`${addBtnLabel.toLocaleLowerCase() == 'document' ? 'solid 1px #d3d6db': 'solid 1px rgba(156, 163, 175, 1)'}`
                                                    }}  
                                                onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description','fyl','document_type']); setResource('documents'); setResourceCategory('Documents'); setTitle('Documents'); setAddBtnLabel('Document') }}>
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
                                    {/* <form className="flex items-center space-x-3 m-3" onSubmit={e => {e.preventDefault()}}>
                                        <TextField id="search_table_data" label="Search anything" variant="standard" />
                                        <button type= "submit" className='bg-gray-500  p-2 text-base font-semibold text-white'>Export</button>
                                    </form> */}
                                <Paper className="shadow-md rounded-none" sx={{ width: '100%', height:'auto', overflow: 'hidden', boxShadow:'0', flexDirection:'column', alignContent:'start', justifyContent:'start', backgroundColor:'#f9fafb'}}>
                                <StyledDataGrid
                                            columns={columns}
                                            rows={rows}
                                            getRowClassName={() => `super-app-theme--Row`}
                                            rowSpacingType="border"
                                            showColumnRightBorder
                                            showCellRightBorder
                                            rowSelection={false}
                                            // getCellClassName={() => 'super-app-theme--Cell'}
                                            slots={{
                                                toolbar: () => (
                                                    <GridToolbar
                                                        sx={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            marginX: 'auto',
                                                            gap: 5,
                                                            padding: '0.45rem'
                                                        }}
                                                    />
                                                ),
                                            }}
                                        />
                                    
                                    </Paper>
                                </div>
                                </>
                                ) : (

                                <div className='col-span-4 flex items-start justify-start h-auto w-full'>
                                    {/* Add Form */}
                                    <div className="w-full h-auto p-3 bg-gray-50 shadow-md" >
                                        {
                                    
                                                (() => {
                                                    switch(addBtnLabel){
                                                        case 'county':
                                                            return (
                                                            <>
                                                                <form className='w-full h-full'  onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                                id={`add_${addBtnLabel}`}
                                                                                name='name'
                                                                                defaultValue={editMode ? editData[0]?.name : ''}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                        
                                                                        </div>
                                                                        {editMode &&
                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                County Code
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    *
                                                                                </span>
                                                                            </label>
                                                                            <input
                                                                                readOnly
                                                                                type='text'
                                                                                placeholder='County Code'
                                                                                id={`add_${addBtnLabel}`}
                                                                                name='county_code'
                                                                                defaultValue={editMode ? editData[0]?.code : ''}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                        
                                                                        </div>}

                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                                <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                            </div>
                                                                </form>
                                                            &nbsp;
                                                            {editMode &&
                                                            <>
                                                            <ChangeLog/>
                                                                &nbsp;

                                                                <Tabs.Root
                                                                    orientation="horizontal"
                                                                    className="w-full flex flex-col tab-root"
                                                                    defaultValue="constituencies"
                                                                >
                                                                    <Tabs.List className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b">
                                                                        <Tabs.Tab
                                                                            id={1}
                                                                            value="constituencies"
                                                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                                        >
                                                                            Constituencies
                                                                        </Tabs.Tab>
                                                                        <Tabs.Tab
                                                                            id={2}
                                                                            value="county_users"
                                                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-400 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                                        >
                                                                            County Users
                                                                        </Tabs.Tab>
                                                                    
                                                                    </Tabs.List>

                                                                    <Tabs.Panel
                                                                    value="constituencies"
                                                                    className="grow-1 py-1 px-4 tab-panel"
                                                                    >
                                                                        <div className='col-span-4 w-full h-auto'>
                                                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                                                        <Table stickyHeader aria-label="sticky table">
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                            {constituenciesColumns.map((column,i) => (
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
                                                                                            {editData[1]?.results.map((row) => {
                                                                                                return (
                                                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                                                    {constituenciesColumns.map((column, i) => {
                                                                                                    const value = row[column.id];
                                                                                                    return (
                                                                                                        <TableCell key={column.id} align={column.align}>
                                                                                                            {
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
                                                                        </div>
                                                                    </Tabs.Panel>
                                                                    <Tabs.Panel
                                                                    value="county_users"
                                                                    className="grow-1 py-1 px-4 tab-panel"
                                                                    >
                                                                        <div className='col-span-4 w-full h-auto'>
                                                                        {loading ? <div>loading...</div>: 
                                                                        <DataGrid
                                                                            rows={editData[2]?.results?.map(({id,user_full_name, user_email,county_name,county_code,user}) => ({id,user_full_name, user_email,county_name,county_code,user})) }
                                                                            columns={county_users}
                                                                            autoHeight
                                                                            pageSize={5}
                                                                            rowsPerPageOptions={[5]}
                                                                            disableSelectionOnClick
                                                                            experimentalFeatures={{ newEditingApi: true }}
                                                                            components={{
                                                                                Toolbar: GridToolbar,
                                                                            }}
                                                                        />}
                                                                                {/*  */}
                                                                        </div>
                                                                    </Tabs.Panel>
                                                                </Tabs.Root>

                                                            
                                                                </>
                                                                }

                                                            </>
                                                        
                                                            )
                                                            case 'sub county':
                                                                return (
                                                                <>
                                                                    <form className='w-full h-full flex-col gap-1' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
                                                                      {/* Constituency Name */}
                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_sub_county_field`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Sub County Name
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        *
                                                                                    </span>
                                                                                </label>
                                                                                <input
                                                                                    required
                                                                                    type='text'
                                                                                    placeholder='Sub County Name'
                                                                                    id={`add_${addBtnLabel}_sub_county_field`}
                                                                                    name='name'
                                                                                    defaultValue={editData[0]?.name}
                                                                                    className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                                />
                                                                        </div>

                                                                        {editMode &&
                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                Sub County Code
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    *
                                                                                </span>
                                                                            </label>
                                                                            <input
                                                                                readOnly
                                                                                type='text'
                                                                                placeholder='Sub County Code'
                                                                                id={`add_${addBtnLabel}`}
                                                                                name='code'
                                                                                defaultValue={editData[0]?.code}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                        
                                                                        </div>}

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
                                                                                styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                options={selectOptions}
                                                                                required
                                                                                placeholder='Select '
                                                                                id={`add_${addBtnLabel}_county_field`}
                                                                                name='county'
                                                                                key={editData[0]?.county}
                                                                                defaultValue={{value:editData[0]?.county, label:editData[0]?.county_name}}
                                                                                className='flex-none w-full border border-gray-800 bg-transparent flex-grow  placeholder-gray-500 focus:border-gray-600 outline-none'
                                                                            />

                                            
                                                                        </div>

                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                                <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                            </div>
                                                                    </form>
                                                                &nbsp;
                                                                {editMode && 
                                                                <>
                                                                <ChangeLog/>   
                                                                &nbsp;
                                                                <div className='col-span-4 w-full h-auto'>
                                                                    <h3>{editData[0]?.name} Wards</h3>
                                                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                                                        <Table stickyHeader aria-label="sticky table">
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                            {wardsColumns.map((column,i) => (
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
                                                                                            {editData[1]?.results.map((row) => {
                                                                                                return (
                                                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                                                    {wardsColumns.map((column, i) => {
                                                                                                    const value = row[column.id];
                                                                                                    return (
                                                                                                        <TableCell key={column.id} align={column.align}>
                                                                                                            {
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
                                                                    </div>
                                                                </>
                                                                

                                                                }
                                                                </>
                                                            )
                                                            case 'constituency':
                                                                return (
                                                                <>
                                                                    <form className='w-full h-full flex-col gap-1' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                                    id={`add_${addBtnLabel}_constituency_field`}
                                                                                    name='name'
                                                                                    defaultValue={editData[0]?.name}
                                                                                    className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                                />
                                                                        </div>

                                                                        {editMode &&
                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                Constitency Code
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    *
                                                                                </span>
                                                                            </label>
                                                                            <input
                                                                                readOnly
                                                                                type='text'
                                                                                placeholder='Constituency Code'
                                                                                id={`add_${addBtnLabel}`}
                                                                                name='code'
                                                                                defaultValue={editData[0]?.code}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                        
                                                                        </div>}

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
                                                                                styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                options={selectOptions}
                                                                                required
                                                                                placeholder='Select '
                                                                                id={`add_${addBtnLabel}_county_field`}
                                                                                name='county'
                                                                                key={editData[0]?.county}
                                                                                defaultValue={{value:editData[0]?.county, label:editData[0]?.county_name}}
                                                                                className='flex-none w-full  border border-gray-600 bg-transparent rounded flex-grow  placeholder-gray-500 focus:border-gray-600 outline-none'
                                                                            />

                                            
                                                                        </div>

                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                                <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                            </div>
                                                                    </form>
                                                                &nbsp;
                                                                {editMode && 
                                                                <>
                                                                <ChangeLog/>   
                                                                &nbsp;
                                                                <div className='col-span-4 w-full h-auto'>
                                                                    <h3>{editData[0]?.name} Wards</h3>
                                                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                                                        <Table stickyHeader aria-label="sticky table">
                                                                                        <TableHead>
                                                                                            <TableRow>
                                                                                            {wardsColumns.map((column,i) => (
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
                                                                                            {editData[1]?.results.map((row) => {
                                                                                                return (
                                                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                                                    {wardsColumns.map((column, i) => {
                                                                                                    const value = row[column.id];
                                                                                                    return (
                                                                                                        <TableCell key={column.id} align={column.align}>
                                                                                                            {
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
                                                                    </div>
                                                                </>
                                                                

                                                                }
                                                                </>
                                                            )
                                                            case 'ward':
                                                                return (
                                                                
                                                                    <form className='w-full h-full flex-col gap-1 rounded-none' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                                    id={`add_${addBtnLabel}_field`}
                                                                                    name='name'
                                                                                    defaultValue={editData?.name}
                                                                                    className='flex-none w-full bg-transparent rounded  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none  focus:border-black outline-none'
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
                                                                                styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                options={selectOptions}
                                                                                required
                                                                                placeholder='Select county'
                                                                                onChange={(e) => fetchSbctyConstituency(e.value)}
                                                                                key={editData?.county?.id}
                                                                                id={`add_${addBtnLabel}_county_field`}
                                                                                name='county'
                                                                                defaultValue={{value:editData?.county?.id, label:editData?.county_name}}
                                                                                className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                                                            />
                                                                        </div>
                                                                        {sbcty_constituency.length > 0 && <>
                                                                        
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
                                                                                styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                options={sbcty_constituency[1].results.map(({id, name}) => ({value:id, label:name}))}
                                                                                required
                                                                                placeholder='Select Sub County'
                                                                                key={editData?.sub_county}
                                                                                id={`add_${addBtnLabel}_sub_county_field`}
                                                                                name='sub_county'
                                                                                defaultValue={{value:editData?.sub_county, label:editData?.sub_county_name}}
                                                                                className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                                styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                options={sbcty_constituency[0].results.map(({id, name}) => ({value:id, label:name}))}
                                                                                required
                                                                                placeholder='Select Constituency'
                                                                                key={editData?.constituency}
                                                                                id={`add_${addBtnLabel}_constituency_field`}
                                                                                name='constituency'
                                                                                defaultValue={{value:editData?.constituency, label:editData?.constituency_name}}
                                                                                className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                                                            />

                                                                        
                                                                        </div>
                                                                        
                                                                        </>}
                                                                        &nbsp;
                                                                        {editMode && <ChangeLog/>}

                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                        </div>

                                                                    </form>
                                                                )
                                                            case 'town':
                                                                return (
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                                id={`add_${addBtnLabel}_town_field`}
                                                                                name="name"
                                                                                defaultValue={editData.name}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                        
                                                                        </div>

                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                                <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                        </div>
                                                                    </form>
                                                                    &nbsp;
                                                                    {editMode && <ChangeLog/>}
                                                                    </>
                                                                )
                                                            case 'category':
                                                                return (
                                                                    resourceCategory === 'ServiceCatalogue' ? (
                                                                        <>
                                                                        <form className='w-full h-full flex-col gap-1' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                                            id={`add_${addBtnLabel}_constituency_field`}
                                                                                            name='name'
                                                                                            defaultValue={editData.name}
                                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                        styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                        options={selectOptions}
                                                                                        placeholder='Select Parent'
                                                                                        id={`add_${addBtnLabel}_county_field`}
                                                                                        name='parent'
                                                                                        key={editData.parent}
                                                                                        defaultValue={{value: editData?.parent, label: selectOptions?.find(so=> so.value === editData?.parent)?.label}}
                                                                                        className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                                            id={`add_${addBtnLabel}_constituency_field`}
                                                                                            name='abbreviation'
                                                                                            defaultValue={editData?.abbreviation}
                                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                        id={`add_${addBtnLabel}_constituency_field`}
                                                                                        name='description'
                                                                                        defaultValue={editData?.description}
                                                                                        className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                                    />
                                                                                
                                                                                </div>

                                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                                </div>
                                                                        </form>
                                                                        &nbsp;
                                                                        <ChangeLog/>
                                                                        </>

                                                                    ) :
                                                                    (
                                                                        <>
                                                                        <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
                                                                    
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                        </form>
                                                                        &nbsp;
                                                                        <ChangeLog/>
                                                                        
                                                                        </>
                                                                    )
                                                                )

                                                            case 'option group':
                                                                const handleAddOptionGroup = (e,path )=> {
                                                                    e.preventDefault()
                                                                    let obj = {};
                                                                    const jk = {}
                                                                    editMode ? obj = {...editData}: null
                                                                    console.log(jk);
                                                                    const elements = [...e.target];
                                                                    elements.forEach((element) => {
                                                                        if (obj[element.name] === '') {
                                                                            delete obj[element.name];
                                                                        }
                                                                        if(element.name == 'option_type' || element.name == 'display_text' || element.name == 'value'){
                                                                            let data = [...optionGroup];
                                                                            obj['options'] = {}
                                                                            data[element.id][element.name] = element.value
                                                                            obj['options'] = data.map((op)=>{
                                                                                return{
                                                                                ...op,
                                                                                option_type: op.option_type,
                                                                                display_text: op.display_text,
                                                                                value: op.value
                                                                            }
                                                                            })
                                                            
                                                                        }else{
                                                                            element.type ==='checkbox'?obj[element.name]= element.checked  :obj[element.name] = element.value;
                                                                        }
                                                                    });

                                                                    try {
                                                                        let url = ''
                                                                        editMode? url =`/api/system_setup/submit_form/?path=${path}&resourceCategory=${resourceCategory}` : url =`/api/system_setup/submit_form/?path=${path}&resourceCategory=${resourceCategory}`
                                                                        fetch(url,{
                                                                        headers: {
                                                                            'Accept': 'application/json, text/plain, */*',
                                                                            'Content-Type': 'application/json;charset=utf-8'
                                                                        },
                                                                        method: 'POST',
                                                                        body: JSON.stringify(obj).replace(',"":""', '')
                                                                        }).then(res => res.json()).then(data => {
                                                                            setEditMode(false);setEditID(null);setIsAddForm(false);setEditData([])
                                                                            if(data.details){
                                                                                alert.danger('Error: '+data.details)
                                                                            }else{
                                                                                alert.success( (editMode? 'Updated' : 'Added') +' Successfully')
                                                                            }
                                                                        })
                                                                } catch (error) {
                                                                    alert.danger('Error: '+error)
                                                                }
                                                                } 

                                                                const handleAddOptionGroupClick = (e) => {
                                                                    e.preventDefault();
                                                                    setOptionGroup(s=>{
                                                                        return [...s, {option_type: '', display_text: '', value: ''}]
                                                                    })
                                                                };

                                                                return (
                                                                    <>  
                                                                    <form className='w-full h-full flex-col gap-1' onSubmit={(e)=>handleAddOptionGroup(e, addBtnLabel)}>
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
                                                                                id={`add_${addBtnLabel}_option_group`}
                                                                                name='name'
                                                                                defaultValue={editData?.name}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                        </div>
                                                                        {editMode && (

                                                                            <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <input 
                                                                                className=''
                                                                                name="active" 
                                                                                type='checkbox'
                                                                                defaultChecked={editData.active}
                                                                                id={`add_${addBtnLabel}_active`}   
                                                                            />
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_active`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Is Active?
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                            )}
                                                                    

                                                                    {/* inputsContainer */}
                                                                    <div className='grid grid-cols-3 place-content-start gap-3 space-y-1' ref={inputsContainerRef}>
                                                                        <h2 className='text-lg font-semibold text-indigo-900'>Option Type*</h2>
                                                                        <h2 className='text-lg font-semibold text-indigo-900'>Display Text*</h2>
                                                                        <h2 className='text-lg font-semibold text-indigo-900'>Option Value*</h2>
                                                                    {optionGroup.length > 0 ? optionGroup.map((option, index) => {
                                                                        return (
                                                                            <>
                                                                                {/* Option Type */}
                                                                                <select
                                                                                    required
                                                                                    placeholder='Select Option Type'
                                                                                    id={index}
                                                                                    name='option_type'
                                                                                    defaultValue={option.option_type}
                                                                                    className='flex-none w-full bg-transparent rounded flex-grow placeholder-gray-500 focus:border-gray-600 outline-none'
                                                                                >
                                                                                        <option value='BOOLEAN'>BOOLEAN</option>
                                                                                        <option value='INTEGER'>INTEGER</option>
                                                                                        <option value='DECIMAL'>DECIMAL</option>
                                                                                        <option value='TEXT'>TEXT</option>
                                                                                </select>
                                                                                {/* Display Text */}
                                                                                    <input
                                                                                        required
                                                                                        type='text'
                                                                                        placeholder='Display Text'
                                                                                        id={index}
                                                                                        name='display_text'
                                                                                        defaultValue={option.display_text}
                                                                                        className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                                    />

                                                                                {/* Option Value */}
                                                                                <div className='grid grid-cols-4 w-full'>
                                                                                    <input
                                                                                        required
                                                                                        type='text'
                                                                                        placeholder='Option Value'
                                                                                        id={index}
                                                                                        name='value'
                                                                                        defaultValue={option.value}
                                                                                        className='flex-none w-full bg-transparent roundedcol-span-3  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                                    />
                                                                                </div>
                                                                            
                                                                            </>
                                                                        )
                                                                    }): (<><p>No Options Assigned to Option Group </p></>)}
                                                                    
                                                                        <div className='col-span-3 flex items-center justify-end'>
                                                                            <button className=' p-2 w-auto h-auto bg-indigo-600 text-white flex items-center self-start'
                                                                            onClick={handleAddOptionGroupClick}
                                                                            >Add <PlusIcon className='w-5 h-5 text-white'/></button>
                                                                        </div>
                                                                    
                                                                        
                                                                    
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>
                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog/>
                                                                    
                                                                    </>
                                                                )

                                                            case 'service':
                                                                return (
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>

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
                                                                            {editMode ? editData.code: (
                                                                            <Alert severity="info">Service Code will be generated after creating the service</Alert>
                                                                            )}

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
                                                                                id={`add_${addBtnLabel}_field`}
                                                                                name='name'
                                                                                defaultValue={editData.name}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                id={`add_${addBtnLabel}_field`}
                                                                                name='abbreviation'
                                                                                defaultValue={editData.abbreviation}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={selectOptions[1]}
                                                                            required
                                                                            placeholder='Select a Category'
                                                                            key={editData.category}
                                                                            id={`add_${addBtnLabel}_category_field`}
                                                                            name='category'
                                                                            defaultValue={{value:editData.category, label:editData.category_name}}
                                                                            className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                                                        />
                                                                    </div>

                                                                    {/* Option Groups */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1'>

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
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={selectOptions[0]}
                                                                            required
                                                                            placeholder='Select Option Group'
                                                                            key={editData.group}
                                                                            id={`add_${addBtnLabel}_sub_county_field`}
                                                                            name='group'
                                                                            defaultValue={{value:editData.group, label:(selectOptions[0])?.find(i=> i.value ==editData.group)?.label}}
                                                                            className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                                id={`add_${addBtnLabel}_desc`}
                                                                                name='description'
                                                                                defaultValue={editData.description}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    {/* Has options */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        <input className='' type='checkbox' id={`add_${addBtnLabel}_has_options`} name='has_options' defaultChecked ={editData.has_options}/>
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}_has_options`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                Service has options?
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    
                                                                                </span>
                                                                            </label>

                                                                    </div>

                                                                    {/* Active */} 
                                                                    {editMode && (

                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <input 
                                                                                className=''
                                                                                name="active" 
                                                                                type='checkbox'
                                                                                defaultChecked={editData.active}
                                                                                id={`add_${addBtnLabel}_active`}   
                                                                            />
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_active`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Is Active?
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                        </div>
                                                                        )}

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog/>
                                                                    </>
                                                                )

                                                            case 'Service Category':
                                                                return ( 
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>

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
                                                                            type="text"
                                                                            placeholder='Name'
                                                                            id={`add_${addBtnLabel}_name`}
                                                                            name='name'
                                                                            defaultValue={editData.name}
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                        />
                                                                            
                                                                    </div>    

                                                                    {/* Parent */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_name`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Parent
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>

                                                                            
                                                                        </label>
                                                                        <Select
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={selectOptions[1]}
                                                                            required
                                                                            placeholder={'Select a Category'}
                                                                            key={editData.category}
                                                                            id={`add_${addBtnLabel}_category_field`}
                                                                            name='category'
                                                                            defaultValue={{value:editData.category, label:editData.category_name}}
                                                                            className='flex-none w-full rounded  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                                                        />
                                                                            
                                                                    </div>  

                                                                    {/* Abbreviation */}
                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        
                                                                        <label
                                                                            htmlFor={`add_${addBtnLabel}_name`}
                                                                            className='text-gray-600 capitalize text-sm'>
                                                                            Abbreviation
                                                                            <span className='text-medium leading-12 font-semibold'>
                                                                                {' '}
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            required
                                                                            type="text"
                                                                            placeholder='Name'
                                                                            id={`add_${addBtnLabel}_name`}
                                                                            name='name'
                                                                            defaultValue={editData.name}
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                )

                                                            case 'infrastructure':
                                                                return ( 
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>

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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={selectOptions}
                                                                            required
                                                                            id={`add_${addBtnLabel}_category_field`}
                                                                            name='category'
                                                                            key={editData.category} 
                                                                            defaultValue={{value: editData.category, label: editData.category_name}}
                                                                            className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                )

                                                            case 'infrastructure category':
                                                                return ( 
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>

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
                                                                            type="text"
                                                                            placeholder='Name'
                                                                            id={`add_${addBtnLabel}_name`}
                                                                            name='name'
                                                                            defaultValue={editData.name}
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                )

                                                            case 'human resource category':
                                                                return (
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
                                                                    
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog/>
                                                                    </>
                                                                )
                                                            case 'specialty':
                                                                return(
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>

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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={selectOptions}
                                                                            required
                                                                            placeholder='Select a Category'
                                                                            key={editData.category}
                                                                            id={`add_${addBtnLabel}_category_field`}
                                                                            name='category'
                                                                            defaultValue={{value: editData.category, label: editData.category_name}} 
                                                                            className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                )

                                                            case 'contact type':
                                                                return (
                                                                    <> 
                                                                    <form className='w-full h-full'  onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
                                                                    
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>
                                                                    {/* Active */} 
                                                                    {editMode && (

                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <input 
                                                                                className=''
                                                                                name="active" 
                                                                                type='checkbox'
                                                                                defaultChecked={editData.active}
                                                                                id={`add_${addBtnLabel}_active`}   
                                                                            />
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_active`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Is Active?
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                        </div>
                                                                    )}

    
                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                    </>
                                                                )
                                                            case 'facility department':
                                                                return (
                                                                <>    
                                                                <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                    
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={selectOptions}
                                                                            required
                                                                            placeholder='Select a regulatory body'
                                                                            id={`add_${addBtnLabel}_category_field`}
                                                                            name='regulatory_body'
                                                                            key={editData.regulatory_body}
                                                                            defaultValue={{value:editData.regulatory_body, label: editData.regulatory_body_name}}
                                                                            className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                                                        />
                                                                    
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                                &nbsp;
                                                                <ChangeLog />
                                                                </>
                                                                )
                                                            case 'facility type detail':
                                                                return (
                                                                <>
                                                                    <form className='w-full h-full' onSubmit={(e) => handleFacilityOnChange(e, addBtnLabel)}>

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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none' />
                                                                        </div>


                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                        </div>


                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                </>

                                                                )
                                                            case 'facility type category':
                                                                return (
                                                                    
                                                                <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
                                                                    
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
                                                                            styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                            options={Array.from(
                                                                                selectOptions || [],
                                                                                (fltopt) => {
                                                                                return {
                                                                                    value: fltopt.label,
                                                                                    label: fltopt.label,
                                                                                };
                                                                                }
                                                                            )}
                                                                            placeholder='Select facility type'
                                                                            id={`add_${addBtnLabel}_type`}
                                                                            name='sub_division'
                                                                            key={editData.parent}
                                                                            defaultValue={{value:editData.sub_division, label: editData.sub_division}}
                                                                            className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                            id={`add_${addBtnLabel}_type_detail`}
                                                                            name='name'
                                                                            defaultValue={editData.name}
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                        />
                                                                </div>


                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                                )
                                                            case 'facility operation status':
                                                                return (
                                                                <>
                                                                <form className='w-full h-full ' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                    
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            // required
                                                                            type='checkbox'
                                                                            placeholder='Name'
                                                                            id={`add_${addBtnLabel}_is_public`}
                                                                            name= 'is_public_visible'
                                                                            defaultChecked={editData.is_public_visible}
                                                                            
                                                                        />
                                                                </div>


                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                                &nbsp;
                                                                <ChangeLog />                                                            
                                                                </>
                                                                )
                                                            case 'facility admission status':
                                                                return (
                                                                <>
                                                                <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                    
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
                                                                            id={`add_${addBtnLabel}_status`}
                                                                            name='name'
                                                                            defaultValue={editData.name}
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                        />
                                                                </div>


                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                                &nbsp;
                                                                <ChangeLog />
                                                                </>   
                                                                )
                                                            case 'facility owner detail':
                                                                return(
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                    
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                        />
                                                                </div>
                                                                {editMode && (

                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <input 
                                                                                className=''
                                                                                name="active" 
                                                                                type='checkbox'
                                                                                defaultChecked={editData.active}
                                                                                id={`add_${addBtnLabel}_active`}
                                                                                />
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_active`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Is Active?
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                        </div>
                                                                )}

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                </div>

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                    </>

                                                                )
                                                            case 'facility owner category':
                                                                    return(
                                                                        <>
                                                                        <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                        
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                styles={{
                                                                        control: (baseStyles) => ({
                                                                            ...baseStyles,
                                                                            backgroundColor: 'transparent',
                                                                            outLine: 'none',
                                                                            border: 'none',
                                                                            outLine: 'none',
                                                                            textColor: 'transparent',
                                                                            padding: 0,
                                                                            height: '4px'
                                                                        }),

                                                                    }}
                                                                                options={selectOptions}
                                                                                required
                                                                                placeholder='Select Facility Owner'
                                                                                onChange={() => console.log('changed type')}
                                                                                key={editData.owner_type}
                                                                                id={`add_${addBtnLabel}_owner_type`}
                                                                                name='owner_type'
                                                                                defaultValue={{value:editData.owner_type, label:editData.owner_type_name}}
                                                                                className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
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
                                                                                        id={`add_${addBtnLabel}_constituency_field`}
                                                                                        name='abbreviation'
                                                                                        defaultValue={editData.abbreviation}
                                                                                        className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>
                                                                    {editMode && (

                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <input 
                                                                                className=''
                                                                                name="active" 
                                                                                type='checkbox'
                                                                                defaultChecked={editData.active}
                                                                                id={`add_${addBtnLabel}_active`}
                                                                                />
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_active`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Is Active?
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                        </div>
                                                                    )}
        
                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>
            
                                                                        </form>
                                                                        &nbsp;
                                                                        <ChangeLog />
                                                                        </>
                                                                )
                                                            case 'job title':
                                                                return (
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                    
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                        />
                                                                </div>

                                                                {editMode && (

                                                                    <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                        <input 
                                                                            className=''
                                                                            name="active" 
                                                                            type='checkbox'
                                                                            defaultChecked={editData.active}
                                                                            id={`add_${addBtnLabel}_active`}
                                                                            />
                                                                            
                                                                            <label
                                                                                htmlFor={`add_${addBtnLabel}_active`}
                                                                                className='text-gray-600 capitalize text-sm'>
                                                                                Is Active?
                                                                                <span className='text-medium leading-12 font-semibold'>
                                                                                    {' '}
                                                                                    
                                                                                </span>
                                                                            </label>
                                                                    </div>
                                                                )}

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                </div>

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                    </>
                                                                )
                                                            case 'regulatory body':
                                                                const handleAddClick = (e) => {
                                                                    e.preventDefault();
                                                                    setContactList(s=>{
                                                                        return [...s, {contact_type: '', contact: ''}]
                                                                    })
                                                                };
                                                            
                                                                return ( 
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={e=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                                name="name"
                                                                                defaultValue={editData.name}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                id={`add_${addBtnLabel}_abbr`}
                                                                                name="abbreviation"
                                                                                defaultValue={editData.abbreviation}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>
                                                                    {editMode && (

                                                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                                                            <input 
                                                                                className=''
                                                                                name="active" 
                                                                                type='checkbox'
                                                                                defaultChecked={editData.active}
                                                                                id={`add_${addBtnLabel}_active`}
                                                                                />
                                                                                
                                                                                <label
                                                                                    htmlFor={`add_${addBtnLabel}_active`}
                                                                                    className='text-gray-600 capitalize text-sm'>
                                                                                    Is Active?
                                                                                    <span className='text-medium leading-12 font-semibold'>
                                                                                        {' '}
                                                                                        
                                                                                    </span>
                                                                                </label>
                                                                        </div>
                                                                    )}

                                                                        {/* inputsContainer */}
                                                                        <div className='grid grid-cols-2 place-content-start gap-3 space-y-1' ref={inputsContainerRef2}>
                                                                            <h2 className='text-lg font-semibold text-indigo-900'>Contact Type*</h2>
                                                                            <h2 className='text-lg font-semibold text-indigo-900'>Contact Details*</h2>
                                                                        
                                                                            {contactList.map((contact, index) =>{ return (
                                                                                <>
                                                                                    {/* Contact Type */}

                                                                                    <select
                                                                                        required
                                                                                        key={index}
                                                                                        id={`${index}`}
                                                                                        name='contact_type'
                                                                                        defaultValue={contact?.contact_type}
                                                                                        className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'

                                                                                    >

                                                                                    {selectOptions.map((ct, i) => (
                                                                                        <option value={ct.value} key ={i}>{ct.label}</option>
                                                                                    ))}
                                                                                    </select>

                                                                                    {/* Contact Detail */}
                                                                                    <input
                                                                                            required
                                                                                            type='text'
                                                                                            placeholder='Contact Details'
                                                                                            key={index}
                                                                                            id={index}
                                                                                            name="contact"
                                                                                            defaultValue={contact?.contact}
                                                                                            className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                                        />
                                                                                
                                                                                </>
                                                                            )})}
                                                                            
                                                                            <div className='col-span-2 flex items-center justify-end'>
                                                                                <button className=' p-2 w-auto h-auto bg-indigo-600 text-white flex items-center self-start'
                                                                                onClick={handleAddClick}
                                                                                >Add <PlusIcon className='w-5 h-5 text-white'/></button>
                                                                            </div>

                                                                        </div>
                                                                        
                                                                        <div className='flex items-center space-x-3 mt-4'>
                                                                                <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                        </div>
                                                            
                                                                    

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                    </>
                                                                )
                                                            case 'regulatory status':
                                                                return (
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
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
                                                                                id={`add_${addBtnLabel}_status`}
                                                                                name='name'
                                                                                defaultValue={editData.name}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                                <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                                <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>
                                                            
                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                    </>
                                                                )
                                                            case 'upgrade reason':
                                                                return (
                                                                    <>
                                                                    <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                    
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
                                                                                id={`add_${addBtnLabel}_reason`}
                                                                                name='reason'
                                                                                defaultValue={editData.reason}
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                    &nbsp;
                                                                    <ChangeLog />
                                                                    </>
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-transparent rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:border-black outline-none'
                                                                            />
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500  font-semibold'>cancel</button>
                                                                    </div>

                                                                    </form>
                                                                )
                                                                
                                                        

                

                                                    }

                                                })()

                                        }

                                </div>
                                </div>
                                    
                                )
                                    
                            }
                            

                    </div> 
                                                                                                                
                
                </MainLayout>
    </>
    )
    }
    else{
        return null
    }
}


SystemSetup.getInitialProps = async (ctx) => {

    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )

    function fetchData(token) {

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

        // console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/system_setup'
            }
        }

        // setTimeout(() => {  
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/system_setup',
                current_url: ''
            }
        // }, 1000);
    })

}

export default SystemSetup