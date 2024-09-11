import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon, PlusIcon } from '@heroicons/react/solid'
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, FilterIcon, SearchIcon } from '@heroicons/react/outline'
import { Select as CustomSelect } from '../../components/Forms/formComponents/Select'
import { getUserDetails } from '../../controllers/auth/auth'


// @mui imports
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import FacilitySideMenu from '../../components/FacilitySideMenu'
import { UserContext } from '../../providers/user'
import {Formik, Form, Field} from 'formik';
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { useSearchParams } from 'next/navigation'
import withAuth from '../../components/ProtectedRoute'
import {v4 as uuid} from 'uuid'


function FacilityHome (props){
    
    const router = useRouter()

   
    // const facilities = props?.data?.results
    const filters = props?.filters
    const fltrs = props?.filters
    
    const userCtx = useContext(UserContext);

    const groupID = userCtx?.groups[0]?.id

    const userCounty = userCtx?.user_counties[0]?.county

    const userSubCounty = userCtx?.user_sub_counties[0]?.sub_county

    const [searchTerm, setSearchTerm] = useState('')


    // const qf = props?.query?.qf ?? null
    
    if (filters && typeof filters === "object")
     {
        filters["has_edits"] = [{ id: "has_edits", name: "Has edits" },]
        filters["is_approved"] = [{ id: "is_approved", name: "Is approved" }]
        filters["is_complete"] = [{ id: "is_complete", name: "Is complete" }]
        filters["number_of_beds"] = [{ id: "number_of_beds", name: "Number of beds" }]
        filters["number_of_cots"] = [{ id: "number_of_cots", name: "Number of cots" }]
        filters["open_whole_day"] = [{ id: "open_whole_day", name: "Open whole day" }]
        filters["open_weekends"] = [{ id: "open_weekends", name: "Open weekends" }]
        filters["open_public_holidays"] = [{ id: "open_public_holidays", name: "Open public holidays" }]
        delete fltrs.has_edits
        delete fltrs.is_approved
        delete fltrs.is_complete
        delete fltrs.number_of_beds
        delete fltrs.number_of_cots
        delete fltrs.open_whole_day
        delete fltrs.open_weekends
        delete fltrs.open_public_holidays
    }

    const [drillDown, setDrillDown] = useState({})
  
    const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
    const [title, setTitle] = useState('Facilities') 

    // quick filter themes
    const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState(props?.path?.split('id=')[1] || '') 
    const [allFctsSelected, setAllFctsSelected] = useState(true);
    const [isClient, setIsClient] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false)

    const pageParams = useSearchParams()

    const currentPageParams = {
        filter: pageParams.get('filter')
    }

    const orgUnitFilter = (() => {
        if(groupID == 1) { //CHHIO
            return `&county=${userCtx?.county ?? userCtx?.user_counties[0]?.county}`
        }else if(groupID == 2){ //SCHRIO
            return `&sub_county=${userCtx?.user_sub_counties[0]?.sub_county}`
        }else if(groupID == 5 || groupID == 7 || groupID == 6){ // National & Admin
            return ""
        }
    })()



	useEffect(() => {
	
	  setIsClient(true)
	}, [])


    useEffect(() => {
        let qry = props?.query
        
        delete qry?.searchTerm
        delete qry?.qfstart
        setDrillDown({ ...drillDown, ...qry })

        return () => {
            
        }
    }, [facilityFeedBack, title])

    function userOrgUnit() {
        if(groupID === 1) { // CHRIO
            return {county: userCounty}
        } else if (groupID === 2) { // SCHRIO
            return {sub_county: userSubCounty}
        } else {
            return {}
        }
    }


     function handleAccordionExpand(ev) {
        if(isAccordionExpanded){
            setIsAccordionExpanded(false)
        }else{
            setIsAccordionExpanded(true)
        }
        
    }

    function handleFiltersSubmit(event) {
        event.preventDefault()

        const formDataEntries = new FormData(event.target)

        const formData = Object.fromEntries(formDataEntries)

        router.push({
            pathname: '/facilities',
            query: formData
        })

    }

    function handleFiltersReset(event) {
        event.preventDefault()

        const filterForm = document.querySelector('#filter-panel')

       filterForm.reset()
        
    }

    function handleNext() {

        // const params = Object.fromEntries(pageParams.entries())


        router.push({
            pathname:'/facilities',
            query: {
                next: Buffer.from(`${props?.next}`).toString('base64'),
                ...userOrgUnit,
                ...(() => searchTerm !== '' ? ({q: searchTerm}) : ({}))()

                 //default: page_size=30
                
                // ...params
            }
        })
    }

   

    function handlePrevious() {

        // const params = Object.fromEntries(pageParams.entries())

        router.push({
            pathname:'/facilities',
            query: {
                previous: Buffer.from(`${props?.previous}`).toString('base64'),
                ...userOrgUnit,
                ...(() => searchTerm !== '' ? ({q: searchTerm}) : ({}))()

               //default: page_size=30
                //...params
            }
        })
    }

    function handlePageLoad(e) {

        const page = e.target.innerHTML

        // const params = Object.fromEntries(pageParams.entries())


        router.push({
            pathname:'/facilities',
            query: {
                 page,
                 ...userOrgUnit(),
                 ...(() => searchTerm !== '' ? ({q: searchTerm}) : ({}))()
                 
                // ...params
            }
        })
    }

    if(isClient){

      return (
        <>
            <Head>
                <title>KMHFR | Facilities</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">

                    {/* Header Matters */}
                    <div className="col-sapn-1 md:col-span-5 flex flex-col gap-3 ">

                          {/* Buttons section */}

                          <div className="flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between">
                          

                            <div className="flex w-full flex-wrap items-start md:items-center justify-between gap-2 text-sm md:text-base py-1">
                            {/* Bread Crumbs */}

                                <div className={"col-span-1 md:col-span-5 flex justify-between w-full bg-django-blue border drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 items-start md:items-center border-l-8 " + (true ? "border-gray-700" : "border-red-600")}>
                                    <h2 className='flex items-center text-2xl font-bold text-gray-900 capitalize gap-2'>
                                        {title}
                                     </h2>
                                     {/* dropdown options to download data */}
                            {props?.current_url && props?.current_url.length > 5 && 
                            <Menu as="div" className="relative">
                                {/* Button group */}
                             
                                
                                <div className='flex flex-col z-40 gap-5 md:flex-row md:items-center md:space-x-6 w-auto'>
                                    {/* Facility Button */}
                                    

                                     {
                                        (
                                            userCtx?.groups[0]?.id == 2 || // SCHRIO
                                            userCtx?.groups[0]?.id == 7    // SuperAdmin
                                            /*allFctsSelected || pathId === 'all'*/) &&
                                     // Display add facility button if  user belong to SCHRIO group

                                   <Menu.Item as="div"  className="px-3 py-2 bg-gray-600 rounded text-white text-md tracking-tighter font-semibold whitespace-nowrap  hover:bg-black focus:bg-black active:bg-black uppercase">
                                        <button  onClick={() => {router.push('/facilities/add?formId=0')}} className='flex items-center justify-center'>

                                            <span className='text-base uppercase font-semibold'>Add Facility</span>
                                            <PlusIcon className="w-4 h-4 ml-2" />
                                        </button>
                                    </Menu.Item>
                                    }

                                     {/* Export Button */}
                                     <Menu.Button as="button" className="px-3 py-2 bg-gray-600 rounded text-white text-md tracking-tighter font-semibold flex items-center justify-center whitespace-nowrap  hover:bg-black focus:bg-black active:bg-black uppercase">
                                        <DownloadIcon className="w-5 h-5 mr-1" />
                                        <span className='text-base uppercase font-semibold'>Export</span>
                                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                                    </Menu.Button>
                                </div>
                                
                                {/* <pre>
                                    {
                                        JSON.stringify(orgUnitFilter, null, 2)
                                    }
                                </pre> */}
                            
                                <Menu.Items as="ul" className="absolute top-0 left-[100%] w-auto flex flex-col gap-y-1 items-center justify-start bg-white  shadow-lg border border-gray-200 p-1">
                                   
                                    <Menu.Item as="li" className="p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200">
                                        {({ active }) => (
                                            <button className={"flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full " + (active ? 'bg-gray-200' : '')} onClick={() => {
                                                  
                                                window.location.href = `${process.env.NEXT_PUBLIC_FACILITY_EXPORT_URL}?&access_token=${props?.token}&format=csv&page_size=${props?.count}&page=1${orgUnitFilter}`
                                              
                                            }}>
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span className='text-base uppercase font-semibold'>CSV</span>
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item as="li" className="p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200">
                                        {({ active }) => (
                                            <button className={"flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full " + (active ? 'bg-gray-200' : '')} 
                                            onClick={() => {
                                               
                                                
                                                 window.location.href = orgUnitFilter ? `${process.env.NEXT_PUBLIC_FACILITY_EXPORT_URL}?access_token=${props?.token}&format=excel&page_size=${props?.count}&page=1${orgUnitFilter}` : `${process.env.NEXT_PUBLIC_FACILITY_EXPORT_URL}?access_token=${props?.token}&format=excel&page_size=${props?.count}&page=1`
                                               
                                            }}>
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span className='text-base uppercase font-semibold'>Excel</span>
                                            </button>
                                        )}
                                    </Menu.Item>

                                </Menu.Items>
                            </Menu>
                            }
                                    
                                </div>  
                            </div>
                      

                        </div>

                        <div className="flex-wrap items-center justify-between gap-2 text-sm md:text-base ">
                  

                            {/* Accordion Filter */}
                            <Accordion 
                            sx={{borderRadius:'4px', boxShadow:'none', zIndex: '0px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}} className='border bg-gray-50 z-0 border-gray-200  mb-4 w-full shadow-none' expanded={isAccordionExpanded} onChange={handleAccordionExpand}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                
                                                >
                                                
                                                <h2 className='my-2 font-semibold text-xl text-gray-900 flex items-center space-x-2'>
                                                <FilterIcon className='w-6 h-6 text-gray-900'/>
                                                    <p>Filter Facilities By ...</p></h2>
                                            </AccordionSummary>

                                            <AccordionDetails sx={{width:'100%', padding:4, height:'auto' }}>
                                            <div className="flex flex-col gap-2">
                                                        {filters && filters?.error ?
                                                            (<div className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                                <p>No filters.</p>
                                                            </div>)
                                                            : (
                                                                     <form 
                                                                            id="filter-panel"
                                                                            onSubmit={handleFiltersSubmit}
                                                                            className='flex flex-col md:grid md:grid-cols-4 place-content-center items-content-end gap-2'>
                                                                    {  
                                                                        filters && Object.keys(filters).length > 0 &&
                                                                        Object.keys(fltrs).map((ft) => (
                                                                           
                                                                                
                                                                                <div key={uuid()} className="w-full flex flex-col items-start justify-start gap-1 mb-1">
                                                                                <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>
                                                                               

                                                                                <CustomSelect
                                                                                            options={Array.from(filters[ft] || [],
                                                                                                fltopt => {
                                                                                                    return {
                                                                                                        value: fltopt.id, label: fltopt.name
                                                                                                    }
                                                                                                })}
                                                                                            
                                                                                            placeholder={`Select ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}`}
                                                                                            name={ft} // facility_type
                                                                                            onChange={sl => {
                                                                                                let nf = {}
                                                                                                if (Array.isArray(sl)) {
                                                                                                    nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(sl, l_ => l_.value).join(',')
                                                                                                } else if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                                                    nf[ft] = sl.value
                                                                                                } else {
                                                                                                    delete nf[ft]
                                                                                                   
                                                                                                }
                                                                                                setDrillDown({ ...drillDown, ...nf })
                                                                                        }}

                                                                                        /> 
                                                                            </div>
                                                                        ))
                                                                    }

                                                                    {/* From and To Date Picker Components */}


                                                                    {/* Yes/No Dialog */}
                                                                    <div className="w-full col-span-3 gap-x-3 grid md:grid-cols-4 grid-cols-2 mb-3">
                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                            <span className='inline-flex gap-2'>
                                                                                <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={false} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="has_edits" onChange={ev => {
                                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                                }} />
                                                                                <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm">Has edits</label>

                                                                            </span>
                                                                            

                                                                            <span className='inline-flex gap-2'>
                                                                                <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.is_approved === "true"} name="is_approved" id="is_approved" onChange={ev => {
                                                                                    setDrillDown({ ...drillDown, 'is_approved': true })
                                                                                }} />   
                                                                                <label htmlFor="is_approved" className="text-gray-700 capitalize text-sm">Approved</label>

                                                                            </span>
                                                                        </div>

         
                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                                <span className='inline-flex gap-2'>
                                                                                
                                                                                    <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.is_complete === "true"} name="is_complete" id="is_complete" onChange={ev => {
                                                                                        setDrillDown({ ...drillDown, 'is_complete': true })
                                                                                    }} />
                                                                                <label htmlFor="is_complete" className="text-gray-700 capitalize text-sm">Complete</label>

                                                                                </span>
                                                                        
                                                                        
                                                                                <span className='inline-flex gap-2'>
                                                                        
                                                                            <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.number_of_beds === "true"} name="number_of_beds" id="number_of_beds" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'number_of_beds': true })
                                                                            }} />
                                                                            <label htmlFor="number_of_beds" className="text-gray-700 capitalize text-sm">Has beds</label>

                                                                            </span>
                                                                        </div>
                                                                        

                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                                    <span className='inline-flex gap-2'>
                                                                        
                                                                            <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.number_of_cots === "true"} name="number_of_cots" id="number_of_cots" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'number_of_cots': true })
                                                                            }} />
                                                                            <label htmlFor="number_of_cots" className="text-gray-700 capitalize text-sm">Has cots</label>

                                                                            </span>
                                                                        
                                                                            <span className='inline-flex gap-2'>
                                                                        
                                                                            <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.open_whole_day === "true"} name="open_whole_day" id="open_whole_day" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'open_whole_day': true })
                                                                            }} />
                                                                            <label htmlFor="open_whole_day" className="text-gray-700 capitalize text-sm">Open 24 hours</label>

                                                                            </span>
                                                                        </div>
                                                                    
                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                                    <span className='inline-flex gap-2'>
                                                                        
                                                                        <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.open_weekends === "true"} name="open_weekends" id="open_weekends" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_weekends': true })
                                                                        }} />
                                                                        <label htmlFor="open_weekends" className="text-gray-700 capitalize text-sm">Open weekends</label>

                                                                        </span>
                                                                        
                                                                        <span className='inline-flex gap-2'>
                                                                    
                                                                    <input type="checkbox" className="justify-self-end border border-gray-600 bg-django-blue" value={true} defaultChecked={props?.query?.open_public_holidays === "true"} name="open_public_holidays" id="open_public_holidays" onChange={ev => {
                                                                        setDrillDown({ ...drillDown, 'open_public_holidays': true })
                                                                    }} />
                                                                        <label htmlFor="open_public_holidays" className="text-gray-700 capitalize text-sm">Open holidays</label>

                                                                        </span>
                                                                        </div>
                                                                        
                                                                    
                                                                    </div>



                                                                    <button 
                                                                    type="submit"
                                                                    className="bg-django-blue col-start-1  border border-gray-600  text-gray-600 hover:bg-black hover:text-white hover:border-black font-semibold px-5 py-1 text-base  w-full whitespace-nowrap text-center">
                                                                        Search
                                                                    </button>
                                                                    
                                                                    <button 
                                                                    onClick={handleFiltersReset} 
                                                                    type='reset'
                                                                    className="bg-blue-700 boder border-gray-700 text-white hover:bg-black hover:border-black font-semibold px-5 py-1 text-base  w-full whitespace-nowrap text-center"
                                                                     >
                                                                     Reset
                                                                    </button>
                                                                    

                                                                    </form>
                                                                    
                                                            )
                                                        }
                                             </div>
                                            </AccordionDetails>
                            </Accordion> 
                        
                           
                        </div>
                        
                      
                    </div>

                  
                    {/* Side Menu Filters Wide View port*/}
                    <div className="hidden md:flex col-span-1">
                        <FacilitySideMenu 
                        /*filters={filters ?? {}}
                        states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                        stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} 
                        */
                        />
                   </div>

                    {/* Side Menu Filters Small View port*/}

                   <button className='md:hidden relative p-2 border border-gray-800 rounded w-full self-start my-4' onClick={() => setIsMenuOpen(!isMenuOpen)}>
							Facility Menu
							{
								!isMenuOpen &&
								<KeyboardArrowRight className='w-8 aspect-square text-gray-800' />
							}

							{
								isMenuOpen &&
								<KeyboardArrowDown className='w-8 aspect-square text-gray-800' />
							}

							{
								isMenuOpen &&
								<FacilitySideMenu
									filters={filters}
									states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
									stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
							}
				   </button>
                    
                    {/* Main Body */}
                    <div className="w-full col-span-1 md:col-span-4 mr-24 md:col-start-2  md:h-auto bg-gray-50 shadow-md">
                                    {/* Data Indicator section */}
                                    <div className='w-full p-2 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-400'>
                                        {/* search input */}
                                    
                                        <Formik
                                        initialValues={
                                            {
                                                q:""
                                            }
                                        }
                                            onSubmit={(values) => {

                                                const query = values.q.split(' ').join('+');
                                                const href = new URL(window.location.href)
                                                const filter = href.searchParams.get('filter')
                                                // console.log({values})
                                                setSearchTerm(query)


                                                switch(filter){
                                                    case "all_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=all_facilities`)
                                                        break;
                                                    case "approved_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=approved_facilities&approved=true&approved_national_level=true&rejected=false`)
                                                        break;
                                                    case "pending_validation_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=pending_validation_facilities&pending_approval=true&has_edits=false`)
                                                        break;
                                                    case "updated_pending_validation_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=updated_pending_validation_facilities&have_updates=true`)
                                                        break;
                                                    case "pending_approval_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=pending_approval_facilities&to_publish=true`)
                                                        break;
                                                    case "dhis_synched_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=dhis_synched_facilities&approved=true&approved_national_level=true&rejected=false&reporting_in_dhis=true`)
                                                        break;
                                                    case "failed_validation_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=failed_validation_facilities&rejected=true`)
                                                        break;
                                                    case "rejected_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=rejected_facilities&rejected_national_true=true`)
                                                        break;
                                                    case "closed":
                                                        router.push(`/facilities/?search=${query}&filter=closed_facilities&closed=true`)
                                                        break;
                                                    case "incomplete":
                                                        router.push(`/facilities/?search=${query}&filter=incomplete_facilities&is_complete=true`)
                                                        break;
                                                    case "synchronized_regulated_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=synchronized_regulated_facilities&mfl_code_null=true`)
                                                        break;
                                                    case "feed_back_facilities":
                                                        router.push(`/facilities/?search=${query}&filter=feed_back_facilities`)
                                                        break;
                                                    default:
                                                        router.push(`/facilities/?search=${query}&filter=all_facilities`)
                                                        break;
                                                
                                                }

                                            }}  
                                        >

                                        <Form
                                        className="inline-flex flex-row justify-start flex-grow py-2 lg:py-0"
                                        
                                    >
                                          
                                        <Field
                                        name="q"
                                        id="search-input"
                                        className="flex-none bg-transparent p-2 w-3/5 md:flex-grow-0 flex-grow shadow-sm rounded-tl rounded-bl border border-gray-400 placeholder-gray-600  focus:shadow-none focus:ring-black focus:border-black outline-none"
                                        type="search"
                                        
                                        placeholder="Search for a facility"
                                        />
                                        <button
                                        type="submit"
                                        className="bg-transparent border-t border-r border-b rounded-tr rounded-br border-gray-400 text-black flex items-center justify-center px-4 py-1"
                                        
                                        >
                                        <SearchIcon className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </Form>
                                         </Formik>

                                        <h5 className="text-lg  md:text-end font-medium flex  gap-2 md:gap-3 text-gray-800 md:pr-2">      
                                            
                                            <small className="text-gray-500 text-base"> Total facilities: {props?.count}</small>
                                            <small className="text-gray-500 text-base"> Current page: {props?.current_page}</small>
                                            <small className="text-gray-500 text-base"> Facility count: {props?.page_size}</small>
                                            
                                            
                                        </h5>
                                    </div>
                                  
                                    {/* <pre>
                                                {
                                                    JSON.stringify(props?.facilities, null, 2)
                                                }
                                      </pre> */}
                                            
                        
                                    {/*  Quick Filters status display */}
                                    {
                                        pageParams.get('filter') !== 'feed_back_facilities' ?
                                    (
                                    <div className="flex-grow w-full flex flex-col items-center gap-1 order-last md:order-none">
                                        <div className="flex flex-col justify-center items-center  w-full">
                                            {/* Facilities View */}
                                           
                                            {
                                            props?.facilities.length > 0 ?

                                            props?.facilities.map((facility) => (
                                                <div key={facility?.id} 
                                                title={`Incomplete Details : ${facility?.is_complete ? 'none' : facility?.in_complete_details}`}
                                                className={`grid grid-cols-8 gap-2 border-b py-4 w-full ${!facility?.is_complete && !facility?.in_complete_details ? 'bg-yellow-50 border-yellow-500 hover:bg-gray-50' : 'bg-transparent border-gray-400 hover:border-grat-400' }`}>
                                                    <div className="px-2 col-span-8 md:col-span-8 lg:col-span-6 gap-2 md:gap-0 flex flex-col group items-center justify-start text-left">
                                                        <h3 className="text-2xl font-semibold w-full">
                                                            <span onClick={() => router.push({pathname: `/facilities/${facility?.id}`, query: currentPageParams})} className={`cursor-pointer text-blue-500 hover:underline ${facility?.is_complete ? 'hover:text-blue-500' : 'hover:text-yellow-600'} group-focus:text-blue-500 active:text-blue-500`} >
                                                                {facility?.official_name || facility?.official_name || facility?.name} 
                                                            </span>
                                                        </h3>
                                                        
                                                        <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-1">
                                                           

                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap mb-2">
                                                                <label className="text-xs text-gray-500 ">Code:</label>
                                                                <span className="whitespace-pre-line font-semibold"># {facility?.code ?? 'NO_CODE' }</span>
                                                            </div>

                                                            <div className="flex flex-col  items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Type:</label>
                                                                <span className="whitespace-pre-line text-wrap">{facility?.facility_type_name ?? ' '}</span>
                                                            </div>
                                                            
                                                          
                                                            <div className="flex flex-col  items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Owner:</label>
                                                                <span className="whitespace-pre-line text-wrap">{facility?.owner_name ?? ' '}</span>
                                                            </div>
                                                            
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Keph:</label>
                                                                <span className="whitespace-pre-line">{filters?.keph_level.find(({id}) => id == facility?.keph_level)?.name ?? '-'}</span>
                                                            </div>

                                                            <div className="flex flex-col items-start col-start-2 row-start-1 md:col-start-5 justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Updated:</label>
                                                                <span className="whitespace-pre-line">{new Date(facility?.updated).toDateString()}{", "}{new Date(facility?.updated).toLocaleTimeString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-base grid grid-cols-2 md:grid-cols-5 items-center justify-start gap-1 w-full">
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">County:</label>
                                                                <span className="whitespace-pre-line">{facility?.county_name || facility?.county || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Sub-county:</label>
                                                                <span className="whitespace-pre-line">{facility?.sub_county_name || facility?.sub_county || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Ward:</label>
                                                                <span className="whitespace-pre-line">{facility?.ward_name || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Constituency:</label>
                                                                <span className="whitespace-pre-line">{facility?.constituency_name || facility?.constituency || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-8 md:col-span-8 lg:col-span-2 grid grid-cols-2 grid-rows-4 gap-x-2 gap-y-1 text-lg">
                                                        {/* {console.log({facility})} */}
                                                        {/* {(facility?.operational || facility?.operation_status_name) ? <span className={"shadow-sm col-start-2 leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 font-semibold text-gray-900"}>Operational</span> : ""} */}
                                                        {
                                                        !facility?.rejected ?
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2  py-1 px-2 " + (facility?.approved_national_level ? "bg-green-200 font-semibold text-green-900" :"bg-gray-500 font-semibold p-1 text-gray-50")}>
                                                        
                                                        
                                                        {
                                                        facility?.approved_national_level ? 
                                                        "Approved" : "Not Approved"}</span> : 
                                                        facility?.rejected && <span className={"shadow-sm  col-start-2 leading-none whitespace-nowrap px-2 text-sm font-semibold py-1 bg-red-200 text-red-900"}>Rejected Validate</span> 
                                                        }

                                                        {
                                                        facility?.rejected_national &&
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-red-200 font-semibold text-yellow-900"}>Rejected Approve</span> 
                                                        }
                                                        
                                                        {
                                                        facility?.has_edits && facility?.latest_update &&
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-yellow-200 font-semibold text-yellow-900"}>Has edits</span> 
                                                        }
                                                        
                                                        {
                                                        !facility?.is_complete &&
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-pink-200 font-semibold text-pink-900"}>Incomplete</span> 
                                                        }
                                                        
                                                        {
                                                        facility?.is_approved ? 
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-purple-200 font-semibold text-purple-900"}>Validated</span> : 
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-gray-500 font-semibold text-gray-50"}>Not Validated</span>
                                                        }

                                                        {
                                                        facility?.closed &&
                                                        <span className={"shadow-sm leading-none whitespace-nowrap text-sm col-start-2 py-1 px-2 bg-red-200 font-semibold text-red-900"}>Closed</span>  
                                                        }


                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <div className='w-[98%] hidden my-4  rounded border border-yellow-600 items-center justify-start gap-2 bg-yellow-100  font-medium p-3'>
												<span className='text-base text-gray-700'>
													No Facilities found
												</span>
												<Link href={props.path || '/'}>
													<span className='text-gray-700 hover:text-gray-800 group-focus:text-gray-800 active:text-gray-800'>
														Refresh.
													</span>
												</Link>
											</div>
                                            }

                                            {/* Feedback Facilities View */}
                                            {
                                                facilityFeedBack && facilityFeedBack.length > 0  ? facilityFeedBack.map((facility) => (
                                                    <div key={facility?.id} className="grid grid-cols-8 gap-2 border-b py-4 hover:bg-gray-50 w-full">
                                                    <div className="col-span-8 md:col-span-8 lg:col-span-6 flex flex-col gap-1 group items-center justify-start text-left">
                                                        <h3 className="text-2xl w-full">
                                                            <Link href={'/facilities/' + facility?.id} className="hover:text-gray-800 group-focus:text-gray-800 active:text-gray-800 ">
                                                                <small className="text-gray-500">{index + props?.data?.start_index}.</small>{' '}{facility?.facility_name}
                                                            </Link>
                                                        </h3>
                                                     
                                                        <div className="text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full">
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Service:</label>
                                                                <span className="whitespace-pre-line">{facility?.service_name || facility?.county || '-'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Comment:</label>
                                                                <span className="whitespace-pre-line">{facility?.comment || facility?.county || '-'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Rating:</label>
                                                                <span className="whitespace-pre-line">{facility?.rating || facility?.sub_county || '0'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Date:</label>
                                                                <span className="whitespace-pre-line">{new Date(facility?.created).toLocaleDateString() || '-'}</span>
                                                            </div>
                                                          
                                                        </div>
                                                    </div>
                                                
                                                </div>
                                                )):(
                                                    
                                                    (props?.facilities?.length === 0 && facilityFeedBack?.length == 0 ) &&
                                                    // No Facility feedback data found
                                                    <Alert severity="warning" sx={{width:'100%', marginInline:'4px'}} >No facilities found <span onClick={() => {
                                                        setTitle('Facilities')
                                                        setAllFctsSelected(true)
                                                       
    
                                                        router.push({pathname:'/facilities', query: {qf: 'all'}})
                                                    }} className='hover:underline text-indigo-700 cursor-pointer'>back to all facilities</span>
                                                    </Alert>
                                                  
                                                )

                                            }

                                            {props?.facilities && 
                                            <div className='flex w-full justify-between p-2 items-center'>
                                                <div className="flex items-center gap-2">

                                                <button className="border border-gray-800 p-1 flex place-content-center rounded" onClick={handlePrevious}>
                                            {'<< Previous'}
                                            </button>

                                        <button className=" border border-gray-800 p-1 flex place-content-center rounded" onClick={handleNext}>
                                            {'Next >>'}
                                            </button>
                                                </div>

                                                <div className="flex items-center gap-2">

                                                        {
                                                            // props?.current_page > 5 &&
                                                            Array(props?.current_page + 5).fill(0).map((_, i) => i+1).slice(props?.current_page - 6, props?.current_page + 5).map(i => (
                                                                <button key={uuid()} className={`border p-1 px-2 flex font-semibold place-content-center rounded ${props?.current_page == i ? 'bg-blue-600 text-gray-50 border-blue-600': ' border-gray-800'}`} onClick={handlePageLoad}>
                                                                {i}
                                                                </button>
                                                            ))
                                                        }

                                                        {/* {
                                                                props?.current_page <= 5 &&
                                                                Array(10).fill(0).map((_, i) => i+1).slice(0, 10).map(i => (
                                                                    <button className={`border p-1 px-2 flex font-semibold place-content-center rounded ${props?.current_page == i ? 'bg-blue-600 text-gray-50 border-blue-600': ' border-gray-800'}`} onClick={handlePageLoad}>
                                                                    {i}
                                                                    </button>
                                                                ))
                                                         } */}
                                                        
                                                </div>

                                            </div>
                                            }
                                        </div>
                                    </div>
                                    )
    
                                    :
                                    (
                                    <div className="flex-grow w-full flex flex-col items-center gap-1 order-last md:order-none">
                                         <div className="flex flex-col justify-center items-center  w-full">
                                             {/* Facilities View */}
                                            
                                             {
                                             props?.facilities.length > 0 ?
 
                                             props?.facilities.map((facility) => (
                                                 <div key={facility?.id} 
                                                 
                                                 className={`grid grid-cols-8 gap-2 border-b px-3 py-4 w-full`}>
                                                     <div className="px-2 col-span-8 md:col-span-8 lg:col-span-6 gap-2 md:gap-0 flex flex-col group items-center justify-start text-left">
                                                         <h3 className="text-2xl font-semibold w-full">
                                                             <span onClick={() => router.push({pathname: `/facilities/${facility?.id}`, query: currentPageParams})} className={`cursor-pointer text-blue-500 hover:underline ${facility?.is_complete ? 'hover:text-blue-500' : 'hover:text-yellow-600'} group-focus:text-blue-500 active:text-blue-500`} >
                                                                 {facility?.facility_name} 
                                                             </span>
                                                         </h3>
                                                         
                                                         <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-1">
                                                            
 
                                                             <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap mb-2">
                                                                 <label className="text-xs text-gray-500 ">Rating:</label>
                                                                 <span className="whitespace-pre-line font-semibold">{facility?.rating }</span>
                                                             </div>
 
                                                             <div className="flex flex-col  items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                 <label className="text-xs text-gray-500">Service:</label>
                                                                 <span className="whitespace-pre-line text-wrap">{facility?.service_name ?? ' '}</span>
                                                             </div>
                                                             
                                                           
                                                             <div className="flex flex-col  items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                 <label className="text-xs text-gray-500">Comment:</label>
                                                                 <span className="whitespace-pre-line text-wrap">{facility?.comment ?? '-'}</span>
                                                             </div>
                                                             
                                                             <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                 <label className="text-xs text-gray-500">Active:</label>
                                                                 <span className="whitespace-pre-line">{filters?.active ?? '-'}</span>
                                                             </div>
 
                                                             <div className="flex flex-col items-start col-start-2 row-start-1 md:col-start-5 justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                 <label className="text-xs text-gray-500">Updated:</label>
                                                                 <span className="whitespace-pre-line">{new Date(facility?.updated).toDateString()}{", "}{new Date(facility?.updated).toLocaleTimeString()}</span>
                                                             </div>
                                                         </div>
 
                                                        
                                                     </div>
 
                                                     
                                                 </div>
                                             ))
                                             :
                                             <div className='w-[98%] hidden my-4  rounded border border-yellow-600 items-center justify-start gap-2 bg-yellow-100  font-medium p-3'>
                                                 <span className='text-base text-gray-700'>
                                                     No Facilities found
                                                 </span>
                                                 <Link href={props.path || '/'}>
                                                     <span className='text-gray-700 hover:text-gray-800 group-focus:text-gray-800 active:text-gray-800'>
                                                         Refresh.
                                                     </span>
                                                 </Link>
                                             </div>
                                             }
 
 
                                             {props?.facilities && props?.count >= 10 && 
                                             <div className='flex w-full justify-between p-2 items-center'>
                                                 <div className="flex items-center gap-2">
 
                                                 <button className="border border-gray-800 p-1 flex place-content-center rounded" onClick={handlePrevious}>
                                             {'<< Previous'}
                                             </button>
 
                                         <button className=" border border-gray-800 p-1 flex place-content-center rounded" onClick={handleNext}>
                                             {'Next >>'}
                                             </button>
                                                 </div>
 
                                                 <div className="flex items-center gap-2">
 
                                                         {
                                                             // props?.current_page > 5 &&
                                                             Array(props?.current_page + 5).fill(0).map((_, i) => i+1).slice(props?.current_page - 6, props?.current_page + 5).map(i => (
                                                                 <button key={uuid()} className={`border p-1 px-2 flex font-semibold place-content-center rounded ${props?.current_page == i ? 'bg-blue-600 text-gray-50 border-blue-600': ' border-gray-800'}`} onClick={handlePageLoad}>
                                                                 {i}
                                                                 </button>
                                                             ))
                                                         }
 
                                                         {/* {
                                                                 props?.current_page <= 5 &&
                                                                 Array(10).fill(0).map((_, i) => i+1).slice(0, 10).map(i => (
                                                                     <button className={`border p-1 px-2 flex font-semibold place-content-center rounded ${props?.current_page == i ? 'bg-blue-600 text-gray-50 border-blue-600': ' border-gray-800'}`} onClick={handlePageLoad}>
                                                                     {i}
                                                                     </button>
                                                                 ))
                                                          } */}
                                                         
                                                 </div>
 
                                             </div>
                                             }
                                         </div>
                                     </div>
                                    )
                                    }   


                                   
                             
                    </div>
                    
                </div>
            </MainLayout >
        </>
        )

    } else {
        return null
    }
}


export async function getServerSideProps(ctx) {


	ctx?.res?.setHeader(
		'Cache-Control',
		'no-cache, no-store, max-age=0'
	)


    // function fetchCurrentUser(token) {
    //     return fetch(`${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`, {
    //         headers:{
    //             'Authorization': `Bearer ${token}`,
    //             'Accept': 'application/json',
    //             'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
    //           }
    //     })
    //     .then(resp => resp.json())
    //     .then(resp => resp)
    // }



    function fetchFilters(token) {

        const filtersURL = `${process.env.NEXT_PUBLIC_API_URL}/common/filtering_summaries/?fields=county,facility_type,constituency,ward,operation_status,service_category,owner_type,owner,service,keph_level,sub_county`

        return fetch(filtersURL, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        })
        .then(r => r.json())
        .then(json => {
            return json
        })
        .catch(err => {
            console.error('Error fetching filters: ', err)
            return {
                error: true,
                err: err,
                filters: []
            }
        })
    }


    const token = (await checkToken(ctx.req, ctx.res))?.token

    const nextURL = ctx?.query?.next ? Buffer.from(ctx?.query?.next, 'base64').toString() : null

    const page = ctx?.query?.page


    const {response: user} = await getUserDetails(token, `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`)

    const userGroup = user?.groups[0]?.id

    // const nextURL = ctx?.query?.next

    const previousURL = ctx?.query?.previous ?  Buffer.from(ctx?.query?.previous, 'base64').toString() : null

    // const previousURL = ctx?.query?.previous


    const defaultURL = ctx?.query?.q ? `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/` : `${`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/` + `${page ? '?page=' + page + '&': '?' }` + 'page_size=10'}`

    let url = nextURL ?? previousURL ?? defaultURL

    const filters = await fetchFilters(token)

    let facilities 

    let query = { 'searchTerm': '' }

    if (ctx?.query?.qf) {
        query.qf = ctx.query.qf
    
    }

 

    for (let [k, v] of Object.entries(ctx.query)) {
         if(k !== 'filter'){
             url = `${url}&${k}=${v}`
         } else {
            if(v === 'feed_back_facilities') {
                url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_service_ratings/`
            } 
         }

         if (k == 'mfl_code_null') {
            url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/regulator_sync/?${k}=${v}&page_size=10`
         }


    }




    let current_url = url + '&page_size=100'
    if (ctx?.query?.page) {
        url = `${url}&page=${ctx.query.page}`
    }


    try {
        
        if(userGroup === 1) { // CHRIO

            const userCountyID = user?.county
            url = `${url}&county=${userCountyID}`

        } else if(userGroup === 2) { // SCHRIO

            const userSubCountyID = user?.user_sub_counties[0]?.sub_county
            url = `${url}&sub_county=${userSubCountyID}`
        
        } 

       
        
        console.log({url})

        facilities = (await (await fetch(url, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Authorization': `Bearer ${token}`,
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache, no-store, max-age=0'
            }
        })).json())
    } catch(e) {
        console.error('Error message:', e.message)
    }   

    


    if (
        facilities?.results &&
        Array.isArray(facilities?.results) &&
        facilities?.results.length > 0
    ) {

        // console.log({facilities})
        return {
            props: {
                facilities: facilities?.results ?? null,
                next: facilities?.next ?? null,
                previous: facilities?.previous ?? null,
                filters,
                path: ctx.asPath || '/facilities', 
                current_url, 
                current_page: facilities?.current_page ?? null,
                total_pages: facilities?.total_pages ?? null,
                count: facilities?.count ?? null,
                page_size: facilities?.page_size ?? null,
                query,
                token,
            }
        }
    }

    return {
        props: {
                facilities: [],
                next: null,
                previous: null,
                filters: null,
                path:  ctx.asPath || '/facilities', 
                current_url,
                current_page: 0,
                total_pages: 0,
                count:0,
                page_size: 0,
                query,
                token: null
            }
    }
}




export default withAuth(FacilityHome)