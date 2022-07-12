import React, {useState, useEffect} from 'react'

// component / controllers imports
import MainLayout from '../components/MainLayout'
import { checkToken } from '../controllers/auth/auth';

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
    const [rows, setRows] = useState(() => props?.data?.results.map(({id, name, code}) => ({id, name, code})) || [])  
    // const [fetchData, setFetchData] = useState('')

    useEffect(() => {

     
    }, [rows])

    const handleAdminUnitsClick = () => {
        setTitle('Admin')
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

    const fetchDataCategory = () => {
        if(addBtnLabel == "Counties"){
            setAff
        }
    }


    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'code', label: 'Code', minWidth: 100},
        { id: 'action',label: 'Action',minWidth: 170, align:'right'}
      ];
      

      
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'county' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('Counties'); setAddBtnLabel('County');}}>
                                            <ListItemText primary="Counties" />
                                        </ListItemButton>
                                        {/* Constituencies */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'constituency' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('constituencies'); setAddBtnLabel('constituency')}}>
                                            <ListItemText primary="Constituencies"/>
                                        </ListItemButton>
                                        {/* Wards */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'ward' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('wards'); setAddBtnLabel('ward'), setRows([])}}>
                                            <ListItemText primary="Wards" />
                                        </ListItemButton>
                                        {/* Towns */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'town' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('towns'); setAddBtnLabel('town')}}>
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('categories'); setAddBtnLabel('category')}}>
                                            <ListItemText primary="Categories" />
                                        </ListItemButton>
                                        {/* Option groups */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'option group' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('option groups'); setAddBtnLabel('option group')}}>
                                            <ListItemText primary="Option Groups" />
                                        </ListItemButton>
                                        {/* Services */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'service' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('services'); setAddBtnLabel('service')}}>
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('categories'); setAddBtnLabel('category')}}>
                                            <ListItemText primary="Categories" />
                                        </ListItemButton>
                                        {/* Infrastructure */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'infrastructure' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('infrastructures'); setAddBtnLabel('infrastructure')}}>
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'hr category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('HR Categories'); setAddBtnLabel('hr category')}}>
                                            <ListItemText primary="HR Categories" />
                                        </ListItemButton>
                                        {/* Specialities */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'specialty' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('specialties'); setAddBtnLabel('specialty')}}>
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'contact type' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('contact types'); setAddBtnLabel('contact type')}}>
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility department' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility departments'); setAddBtnLabel('facility department')}}>
                                            <ListItemText primary="Facility Departments" />
                                        </ListItemButton>

                                        {/* Facility Type Details */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility type details'); setAddBtnLabel('facility type detail')}}>
                                            <ListItemText primary="Facility Type Details" />
                                        </ListItemButton>

                                        {/* Facility Type Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility type category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility type categories'); setAddBtnLabel('facility type category')}}>
                                            <ListItemText primary="Facility Type Categories" />
                                        </ListItemButton>

                                        {/* Facility Operation Status */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility operation status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility operation statuses'); setAddBtnLabel('facility operation status')}}>
                                            <ListItemText primary="Facility Operation Status" />
                                        </ListItemButton>

                                        {/*  Facility Admission Status */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility admission status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility admission statuses'); setAddBtnLabel('facility admission status')}}>
                                            <ListItemText primary="Facility Admission Status" />
                                        </ListItemButton>

                                        {/*  Feedback */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'feedback' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('feedbacks'); setAddBtnLabel('feedback')}}>
                                            <ListItemText primary="Feedback" />
                                        </ListItemButton>

                                        {/*  Facility Owner Details */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner detail' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility owner details'); setAddBtnLabel('facility owner detail')}}>
                                            <ListItemText primary="Facility Owner Details" />
                                        </ListItemButton>

                                        {/* Facility Owners Categories */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'facility owner category' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('facility owner categories'); setAddBtnLabel('facility owner category')}}>
                                            <ListItemText primary="Facility Owners Categories" />
                                        </ListItemButton>

                                        {/*  Job Titles */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'job title' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('job titles'); setAddBtnLabel('job title') }}>
                                            <ListItemText primary="Job Titles" />
                                        </ListItemButton>

                                        {/*  Regulatory Bodies */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory body' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('regulatory bodies'); setAddBtnLabel('regulatory body') }}>
                                            <ListItemText primary="Regulatory Bodies" />
                                        </ListItemButton>

                                        {/*  Regulatory Status */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'regulatory status' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('regulatory statuses'); setAddBtnLabel('regulatory status') }}>
                                            <ListItemText primary="Regulatory Status" />
                                        </ListItemButton>

                                        {/*  Upgrade Reason */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'upgrade reason' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('upgrade reasons'); setAddBtnLabel('upgrade reason') }}>
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
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'chu rating comment' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('CHU Rating Comments'); setAddBtnLabel('CHU Rating Comment') }}>
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
                                        {/* CHU Rating Comments */}
                                        <ListItemButton sx={{ ml: 8, backgroundColor:`${addBtnLabel.toLocaleLowerCase() == 'document' ? '#e7ebf0' : 'none'}` }} onClick={() =>  {setTitle('Documents'); setAddBtnLabel('Document') }}>
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
                                    {columns.map((column) => (
                                        <TableCell
                                        key={column.id}
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
                                            {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <>
                                                    {
                                                    column.id === 'action' ?
                                                        <TableCell key={column.id} align={column.align}>
                                                            <button className='bg-indigo-500 rounded p-2 text-white font-semibold'>view</button>
                                                        </TableCell>
                                                        :
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    }
                                                </>
                                                
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
        
        // if(addBtnLabel == 'ward') {
            console.log('rows changed')
        // }

        let url = process.env.NEXT_PUBLIC_API_URL + '/common/counties/?fields=id,code,name'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }

        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }

        // let other_posssible_filters = ["owner_type", "service", "facility_type", "county", "service_category", "sub_county", "keph_level", "owner", "operation_status", "constituency", "ward", "has_edits", "is_approved", "is_complete", "number_of_beds", "number_of_cots", "open_whole_day", "open_weekends", "open_public_holidays"]
        // other_posssible_filters.map(flt => {
        //     if (ctx?.query[flt]) {
        //         query[flt] = ctx?.query[flt]
        //         url = url.replace('facilities/facilities', 'facilities/facilities') + "&" + flt + "=" + ctx?.query[flt]
        //     }
        // })

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