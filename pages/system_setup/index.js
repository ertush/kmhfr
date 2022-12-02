import React, {useState, useContext, useEffect, useMemo} from 'react'

// component / controllers imports
import MainLayout from '../../components/MainLayout'
import { checkToken } from '../../controllers/auth/auth';
import useDidMountEffect from '../../hooks/useDidMountEffect';

// next imports
import Head from 'next/dist/shared/lib/head'
import { PlusIcon, TrashIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import * as Tabs from "@radix-ui/react-tabs";

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
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
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
import moment from 'moment'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import Select from 'react-select';
import { AddLocationAlt, Article, GroupAdd, LocalHospital, MapsHomeWork, MiscellaneousServices, Phone, ReduceCapacity } from '@mui/icons-material';
import { useAlert } from "react-alert";
import router from 'next/router';


const system_setup = (props) => {

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
    const [selectOptionss, setSelectOptionss] = useState([]);
    const [resource, setResource] = useState('counties'); 
    const [loading, setIsLoading] = useState(true);
    const [logsRows, setLogsRows] = useState([]);
    const alert = useAlert()
    const [viewLog, setViewLog] = useState(false);
    const [fields, setFields] = useState([]);
    const [is_parent, setIsParent] = useState(null);
    const [isAddForm, setIsAddForm] = useState(false);
    const [rows, setRows] = useState(Array.from(props?.data?.results, ({id, name, code}) => ({id, name, code})))
    const [editData, setEditData] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [editID, setEditID] = useState(null);
    const [contactList, setContactList]=useState([{}])
    const [optionGroup, setOptionGroup]=useState([{}])
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [sbcty_constituency, setSbctyConstituency] = useState([]);
    const [value, setValue] = React.useState('1');
    const [columns, setColumns] = useState([
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'code', label: 'Code', minWidth: 100},
        { id: 'action',label: 'Action',minWidth: 100, align:'right'}
      ]);
    const [logsColumns] = useState([
        { id: 'updated_on', label: 'Date', minWidth: 100 },
        { id: 'updated_by', label: 'User', minWidth: 100},
        { id: 'updates',label: 'Updates',minWidth: 100, }
      ]);
    const [constituenciesColumns] = useState([
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'code', label: 'Code', minWidth: 100},
    ]);
    const [wardsColumns] = useState([
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'code', label: 'Code', minWidth: 100},
    ]);
    const [county_users] = useState([
        { field: 'user_full_name', headerName: 'User', width: 200 },
        { field: 'user_email', headerName: 'Email', width: 300 }, 
        { field: 'county_name', headerName: 'County', width: 100 },
        { field: 'county_code', headerName: 'Code', width: 100 },
        { field: 'user', headerName: 'User', width: 100 },
        
    ]);
   


    // Refs
    const {inputsContainerRef, inputsContainerRef2} = useRef(null)
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
    useEffect(() => {
        if(!hasSystemSetupPermissions(/^common.add_county$/, userPermissions)){
            router.push('/unauthorized')
        }

        return () => {
            setFields(null)
            setIsAddForm(false)
            setRows(null)
        }
    },[])
   
    const fetchDataCategory = async () => {
  
    // Fetch data
    try{
        let url =`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&fields=${fields.join(',')}`
        if(is_parent !== null){
            url = url + `&is_parent=${is_parent}`
        }
        console.log(url);
        const response = await fetch(url)

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
                                { id: 'description',label: 'Description', minWidth: 100, align:'right'},
                                { id: 'action',label: 'Action',minWidth: 100, align:'right'}

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

    useDidMountEffect(fetchDataCategory, [resource, isAddForm, is_parent])

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
                <span className={"font-bold text-2x self-start"} key={item.name} >{item.name}</span>:  &nbsp;<span className={'text-red-600 self-start'} key={item.old}>{item.old + ''} </span>{'>>'}  &nbsp;<span className={'text-green-600 self-start'} key={item.new}>{item.new + ''}</span>
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
            <button className='flex items-center justify-start space-x-2 p-1 border-2 border-black rounded px-2'
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
    useEffect(async() => {
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

            const response = await fetch(url)
            const _data = await response.json()
            const results = _data.results.map(({id, name}) => ({value:id, label:name}))
            setSelectOptionss(results)        
        }
        if(addBtnLabel === 'service'){
            let resource =['option_groups', 'service_categories']
            let options = []
            resource.map(async (item, i)=>{
                const response = await fetch(`/api/system_setup/data/?resource=${item}&resourceCategory=ServiceCatalogue&fields=id,name`)
                const _data = await response.json()
                const results = _data.results.map(({id, name}) => ({value:id, label:name}))
                options.push(results)
                setSelectOptionss(options)
               
            })
        }
        isAddForm==false ?? setLogsRows([]); setViewLog(false); 

    }, [addBtnLabel, isAddForm])

    //editData
    useEffect(async() => {
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
                     resp= await Promise.all(url.map(url=>fetch(url)))
                     data = await Promise.all(resp.map(r=>r.json()))
                    setEditData(data)
                    setIsLoading(false)
                break;
                case 'constituency':
                    url = [`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`, 
                    `/api/system_setup/data/?resource=wards&resourceCategory=${resourceCategory}&constituency=${editID}`,
                    ]
                     resp= await Promise.all(url.map(url=>fetch(url)))
                     data = await Promise.all(resp.map(r=>r.json()))
                    setEditData(data)
                    setIsLoading(false)
                break;
            
                default:
                    const response = await fetch(`/api/system_setup/data/?resource=${resource}&resourceCategory=${resourceCategory}&id=${editID}`)
                    const _data = await response.json()
                    setEditData(_data)
                    console.log(_data?.county?.id);
                    addBtnLabel === 'regulatory body' ? setContactList([..._data.contacts]): addBtnLabel === 'option group' ? setOptionGroup([..._data.options]) :null
                    addBtnLabel === 'ward' ? fetchSbctyConstituency(_data.county.id) : null
        
                break;
            }
            
        }else{
            setEditData([])
            setEditMode(false)
        }

    }, [addBtnLabel, editID, editMode])
console.log(editData, editMode, editID);
  return (
  <>
            <Head>
                <title>KHMFL - System Setup</title>
                <metadata zoomAndPan='100'></metadata>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>

            <MainLayout>

                <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
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
                                    bgcolor: 'background.paper',
                                    borderRadius: '6px',
                                    boxShadow: 24,
                                    p: 4,
                                }
                            }>
                                <span className="flex gap-2">    
                                      Are you sure you want to delete<b>{editData.name}</b> ?
                                </span>
                               <div className='flex justify-start gap-4 mt-4'>
                                    <button className="bg-green-500 text-white font-semibold rounded p-2 text-center" type="button" onClick={()=>{handleDelete(addBtnLabel);setOpen(false)}}>Yes</button>
                                    <button className="bg-red-500 text-white font-semibold rounded p-2 text-center" 
                                    onClick={()=> {setEditMode(false);setEditID(null);setIsAddForm(false);setEditData([]);setOpen(false)}} 
                                    >No</button>
                                </div>     
                            </Box>
                            </Fade>
                        </Modal>}
                     {/* Bread Cumbs  */}
                     <div className="flex flex-row gap-2 text-sm md:text-base">
                            <Link className="text-green-700" href="/">Home</Link> {'/'}
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
                        {isAddForm && editMode && addBtnLabel !== 'feedback' && addBtnLabel !== 'CHU Rating Comment' && addBtnLabel !== 'county' && addBtnLabel !== 'constituency' &&
                        <button className='rounded bg-red-600 p-2 text-white flex items-center text-lg font-semibold' onClick={() => {setOpen(true)}}>
                        {`Delete `}
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('counties'); setResourceCategory('AdminUnits'); setTitle('counties'); setAddBtnLabel('county'); setEditMode(false); setEditID(null) }}>
                                                <ListItemText primary="Counties" />
                                            </ListItemButton>
                                            {/* Constituencies */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code']); setResource('constituencies'); setResourceCategory('AdminUnits'); setTitle('constituencies'); setAddBtnLabel('constituency'); setEditMode(false); setEditID(null) }}>
                                                <ListItemText primary="Constituencies"/>
                                            </ListItemButton>
                                            {/* Wards */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'county_name', 'constituency_name', 'sub_county_name', 'county']); setResource('wards'); setResourceCategory('AdminUnits'); setTitle('wards'); setAddBtnLabel('ward'); setEditMode(false); setEditID(null) }}>
                                                <ListItemText primary="Wards" />
                                            </ListItemButton>
                                            {/* Towns */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'town' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'ward_name']); setResource('towns'); setResourceCategory('AdminUnits'); setTitle('towns'); setAddBtnLabel('town'); setEditMode(false); setEditID(null) }}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'abbreviation', 'description']); setResource('service_categories'); setResourceCategory('ServiceCatalogue'); setTitle('categories'); setAddBtnLabel('category'); setEditMode(false); setEditID(null)}}>
                                                <ListItemText primary="Categories" />
                                            </ListItemButton>
                                            {/* Option groups */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name']); setResource('option_groups'); setResourceCategory('ServiceCatalogue'); setTitle('option groups'); setAddBtnLabel('option group'); setEditMode(false); setEditID(null)}}>
                                                <ListItemText primary="Option Groups" />
                                            </ListItemButton>
                                            {/* Services */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'service' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'abbreviation', 'category_name']); setResource('services'); setResourceCategory('ServiceCatalogue'); setTitle('services'); setAddBtnLabel('service'); setEditMode(false); setEditID(null)}}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'description']); setResource('infrastructure_categories'); setResourceCategory('HealthInfrastructure'); setTitle('categories'); setAddBtnLabel('category'); setEditMode(false); setEditID(null)}}>
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
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_depts'); setIsParent(null); setResourceCategory('Facilities'); setTitle('facility departments'); setAddBtnLabel('facility department'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Departments" />
                                            </ListItemButton>

                                            {/* Facility Type Details */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'sub_division']); setIsParent(true); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type details'); setAddBtnLabel('facility type detail'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Type Details" />
                                            </ListItemButton>

                                            {/* Facility Type Categories */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'sub_division']); setIsParent(false); setResource('facility_types'); setResourceCategory('Facilities'); setTitle('facility type categories'); setAddBtnLabel('facility type category'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Type Categories" />
                                            </ListItemButton>

                                            {/* Facility Operation Status */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields([]); setResource('facility_status');setIsParent(null); setResourceCategory('Facilities'); setTitle('facility operation statuses'); setAddBtnLabel('facility operation status'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Operation Status" />
                                            </ListItemButton>

                                            {/*  Facility Admission Status */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']); setResource('facility_admission_status');setIsParent(null); setResourceCategory('Facilities'); setTitle('facility admission statuses'); setAddBtnLabel('facility admission status'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Admission Status" />
                                            </ListItemButton>

                                            {/*  Feedback */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']);setIsParent(null); setResource('facility_service_ratings'); setResourceCategory('Facilities'); setTitle('feedbacks'); setAddBtnLabel('feedback'); setEditMode(false);}}>
                                                <ListItemText primary="Feedback" />
                                            </ListItemButton>

                                            {/*  Facility Owner Details */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id', 'name']);setIsParent(null); setResource('owner_types'); setResourceCategory('Facilities'); setTitle('facility owner details'); setAddBtnLabel('facility owner detail'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Owner Details" />
                                            </ListItemButton>

                                            {/* Facility Owners Categories */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'code', 'abbreviation', 'owner_type_name']);setIsParent(null); setResource('owners'); setResourceCategory('Facilities'); setTitle('facility owner categories'); setAddBtnLabel('facility owner category'); setEditMode(false);}}>
                                                <ListItemText primary="Facility Owners Categories" />
                                            </ListItemButton>

                                            {/*  Job Titles */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name']);setIsParent(null); setResource('job_titles'); setResourceCategory('Facilities'); setTitle('job titles'); setAddBtnLabel('job title'); setEditMode(false); }}>
                                                <ListItemText primary="Job Titles" />
                                            </ListItemButton>

                                            {/*  Regulatory Bodies */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','name', 'abbreviation', 'regulatory_body_type_name', 'regulation_verb']); setIsParent(null);setResource('regulating_bodies'); setResourceCategory('Facilities'); setTitle('regulatory bodies'); setAddBtnLabel('regulatory body'); setEditMode(false); }}>
                                                <ListItemText primary="Regulatory Bodies" />
                                            </ListItemButton>

                                            {/*  Regulatory Status */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['']);setIsParent(null); setResource('regulation_status'); setResourceCategory('Facilities'); setTitle('regulatory statuses'); setAddBtnLabel('regulatory status'); setEditMode(false); }}>
                                                <ListItemText primary="Regulatory Status" />
                                            </ListItemButton>

                                            {/*  Upgrade Reason */}
                                            <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setIsAddForm(false); setFields(['id','reason', 'description']);setIsParent(null); setResource('level_change_reasons'); setResourceCategory('Facilities'); setTitle('upgrade reasons'); setAddBtnLabel('upgrade reason'); setEditMode(false); }}>
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
                                                            
                                                                <button className='bg-indigo-500 rounded p-2 text-white font-semibold' onClick={() => {setEditID(row.id); setEditMode(true); setIsAddForm(true);}}>{
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
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                       
                                                                    </div>}

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                                className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                            options={selectOptionss}
                                                                            required
                                                                            placeholder='Select '
                                                                            id={`add_${addBtnLabel}_county_field`}
                                                                            name='county'
                                                                            key={editData[0]?.county}
                                                                            defaultValue={{value:editData[0]?.county, label:editData[0]?.county_name}}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />

                                        
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                            
                                                                <form className='w-full h-full flex-col gap-1' onSubmit={(e)=>handleFacilityOnChange(e, addBtnLabel)}>
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
                                                                            options={selectOptionss}
                                                                            required
                                                                            placeholder='Select county'
                                                                            onChange={(e) => fetchSbctyConstituency(e.value)}
                                                                            key={editData?.county?.id}
                                                                            id={`add_${addBtnLabel}_county_field`}
                                                                            name='county'
                                                                            defaultValue={{value:editData?.county?.id, label:editData?.county_name}}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
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
                                                                            options={sbcty_constituency[1].results.map(({id, name}) => ({value:id, label:name}))}
                                                                            required
                                                                            placeholder='Select Sub County'
                                                                            key={editData?.sub_county}
                                                                            id={`add_${addBtnLabel}_sub_county_field`}
                                                                            name='sub_county'
                                                                            defaultValue={{value:editData?.sub_county, label:editData?.sub_county_name}}
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
                                                                            options={sbcty_constituency[0].results.map(({id, name}) => ({value:id, label:name}))}
                                                                            required
                                                                            placeholder='Select Constituency'
                                                                            key={editData?.constituency}
                                                                            id={`add_${addBtnLabel}_constituency_field`}
                                                                            name='constituency'
                                                                            defaultValue={{value:editData?.constituency, label:editData?.constituency_name}}
                                                                            className='flex-none w-full bg-gray-50 rounded flex-grow  placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
                                                                        />

                                                                       
                                                                    </div>
                                                                    
                                                                    </>}
                                                                    &nbsp;
                                                                    {editMode && <ChangeLog/>}

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                        />
                                                                      
                                                                    </div>

                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                            <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                            <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                                    options={selectOptionss}
                                                                                    placeholder='Select Parent'
                                                                                    id={`add_${addBtnLabel}_county_field`}
                                                                                    name='parent'
                                                                                    key={editData.parent}
                                                                                    defaultValue={{value: editData?.parent, label: selectOptionss?.find(so=> so.value === editData?.parent)?.label}}
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
                                                                                        id={`add_${addBtnLabel}_constituency_field`}
                                                                                        name='abbreviation'
                                                                                        defaultValue={editData?.abbreviation}
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
                                                                                    id={`add_${addBtnLabel}_constituency_field`}
                                                                                    name='description'
                                                                                    defaultValue={editData?.description}
                                                                                    className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                />
                                                                               
                                                                            </div>

                                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                    &nbsp;
                                                                    <ChangeLog/>
                                                                    
                                                                    </>
                                                                 )
                                                            )

                                                        case 'option group':
                                                            const handleAddOptionGroup = (e,path )=> {
                                                                e.preventDefault()
                                                                const obj = {};
                                                                const jk ={}
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
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-gray-50 rounded flex-grow placeholder-gray-500 focus:bg-white focus:border-gray-200 outline-none'
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
                                                                                    className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                                    className='flex-none w-full bg-gray-50 col-span-3 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                />
                                                                            </div>
                                                                        
                                                                        </>
                                                                    )
                                                                }): (<><p>No Options Assigned to Option Group </p></>)}
                                                                 
                                                                    <div className='col-span-3 flex items-center justify-end'>
                                                                        <button className='rounded p-2 w-auto h-auto bg-indigo-600 text-white flex items-center self-start'
                                                                        onClick={handleAddOptionGroupClick}
                                                                        >Add <PlusIcon className='w-5 h-5 text-white'/></button>
                                                                    </div>
                                                                   
                                                                    
                                                                   
                                                                </div>

                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                            id={`add_${addBtnLabel}_field`}
                                                                            name='abbreviation'
                                                                            defaultValue={editData.abbreviation}
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
                                                                        options={selectOptionss[1]}
                                                                        required
                                                                        placeholder='Select a Category'
                                                                        key={editData.category}
                                                                        id={`add_${addBtnLabel}_category_field`}
                                                                        name='category'
                                                                        defaultValue={{value:editData.category, label:editData.category_name}}
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
                                                                        options={selectOptionss[0]}
                                                                        required
                                                                        placeholder='Select Option Group'
                                                                        key={editData.group}
                                                                        id={`add_${addBtnLabel}_sub_county_field`}
                                                                        name='group'
                                                                        defaultValue={{value:editData.group, label:(selectOptionss[0])?.find(i=> i.value ==editData.group)?.label}}
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
                                                                            id={`add_${addBtnLabel}_desc`}
                                                                            name='description'
                                                                            defaultValue={editData.description}
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
                                                                </div>

                                                                </form>
                                                                &nbsp;
                                                                <ChangeLog/>
                                                                </>
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
                                                                        placeholder='Select a Category'
                                                                        key={editData.category}
                                                                        id={`add_${addBtnLabel}_category_field`}
                                                                        name='category'
                                                                        defaultValue={{value: editData.category, label: editData.category_name}} 
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
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                            className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none' />
                                                                    </div>


                                                                    <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                        options={Array.from(
                                                                            selectOptionss || [],
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
                                                                        id={`add_${addBtnLabel}_type_detail`}
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
                                                        case 'facility operation status':
                                                            return (
                                                            <>
                                                             <form className='w-full h-full' onSubmit={(e)=>handleFacilityOnChange(e,addBtnLabel)}>
                                                                
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
                                                                        // required
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
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>


                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                            options={selectOptionss}
                                                                            required
                                                                            placeholder='Select Facility Owner'
                                                                            onChange={() => console.log('changed type')}
                                                                            key={editData.owner_type}
                                                                            id={`add_${addBtnLabel}_owner_type`}
                                                                            name='owner_type'
                                                                            defaultValue={{value:editData.owner_type, label:editData.owner_type_name}}
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
                                                                                    id={`add_${addBtnLabel}_constituency_field`}
                                                                                    name='abbreviation'
                                                                                    defaultValue={editData.abbreviation}
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
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                    <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                    <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                        id={`add_${addBtnLabel}_abbr`}
                                                                        name="abbreviation"
                                                                        defaultValue={editData.abbreviation}
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
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
                                                                                className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'

                                                                            >

                                                                            {selectOptionss.map((ct, i) => (
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
                                                                                    className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                                />
                                                                        
                                                                        </>
                                                                    )})}
                                                                    
                                                                    <div className='col-span-2 flex items-center justify-end'>
                                                                        <button className='rounded p-2 w-auto h-auto bg-indigo-600 text-white flex items-center self-start'
                                                                        onClick={handleAddClick}
                                                                        >Add <PlusIcon className='w-5 h-5 text-white'/></button>
                                                                    </div>

                                                                </div>
                                                                
                                                                <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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
                                                                        className='flex-none w-full bg-gray-50 rounded p-2 flex-grow border-2 placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                                                    />
                                                            </div>

                                                            <div className='flex items-center space-x-3 mt-4'>
                                                                        <button type='submit' className='p-2 text-white bg-green-600 rounded font-semibold'>save</button>
                                                                        <button className='p-2 text-white bg-indigo-500 rounded font-semibold'>cancel</button>
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