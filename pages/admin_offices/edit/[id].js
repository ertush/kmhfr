import React, { useState, useEffect, useRef } from 'react';
import router from 'next/router';
import MainLayout from '../../../components/MainLayout';
import { checkToken } from '../../../controllers/auth/auth';
import Link from 'next/link'
import { Formik, Field, Form } from "formik";
import {
    ChevronDoubleLeftIcon,
} from '@heroicons/react/solid';
import Select from 'react-select';
import {z} from 'zod'
import withAuth from '../../../components/ProtectedRoute';

const _ = require('underscore')

function EditAdminOffice(props) {


    // Form drop down options
    const  counties = props?.counties ?? {counties: []};
    const  sub_counties = props?.sub_counties ?? {sub_counties: []};
    const  {
        id,
        name,
        email,
        phone_number,
        is_national,
        county,
        county_name,
        sub_county,
        sub_county_name,
    } = props?.admin_offices ?? {admin_offices: []}



    const countyOptions = counties.map(({id, name}) => ({label: name, value: id}))
    const subCountyOptions = sub_counties.map(({id, name}) => ({label: name, value: id}))

    const officeData =
        {
            name,
            phone_number,
            email,
            is_national,
            county,
            county_name,
            sub_county,
            sub_county_name,

        }
    const [status, setStatus]=useState(null)
    const [subCountyOpt, setSubCountyOpt] = useState(null);
    const [hide, setHide] = useState(is_national)
    const [isClient, setIsClient] = useState(false)


    function handleCheck(e) {

        if(e.target.checked){
            setHide(true)
        } else {
            setHide(false)
        }
    }

    //Form Field data

    // const formRef = useRef(null)
    const countyRef = useRef(null)
    const subCountyRef = useRef(null)

    function handleSubmit (event) {
        event.preventDefault()

        const values = [];

        const payload = {};

        for(let child of event.target) {
            if(child.value !== ''){
                if(child.name == 'is_national') {
                    values.push([child.name, child.checked])
                } else {
                    values.push([child.name, child.value])
                }
            }
        }

        for(let [k, v] of values) {
              payload[k] = v
        }

        console.log(JSON.stringify(payload))


        let url=`/api/common/submit_form_data/?path=edit_admin_offices&id=${id}`
        try{
            fetch(url, {
                headers:{
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method:'POST',
                body: JSON.stringify(payload)
            })
                .then(resp => resp)
                .then(res => {

                    if(res.ok){
                        router.push('/admin_offices')
                    }
                })
                .catch(e=>{
                    setStatus({status:'error', message: e})
                })
        }catch (e){

            setStatus({status:'error', message: e})
            console.error(e)
        }
     
    }

    useEffect(() => {
        // Pre-fetch values for drop down
            if(countyRef.current){
                countyRef.current.state.value = countyOptions.filter(({value}) => value === county)[0] || ''
            }
            if(subCountyRef.current){
        
                subCountyRef.current.state.value = subCountyOptions.filter(({value}) => value === sub_county)[0] || '----'
            }

    }, [])

    const deleteOffice=(event)=>{
        event.preventDefault()
        try {
            fetch(`/api/common/submit_form_data/?path=delete_admin_office&id=${id}`, {
                headers:{
                	// 'Accept': 'application/json, text/plain, */*',
                	'Content-Type': 'application/json;charset=utf-8'

                },
                method:'DELETE',
            })
                .then(resp =>resp)
                .then(res => {

                    router.push('/admin_offices/')

                })

        } catch (error) {

        }

    }

    useEffect(() => {
       setIsClient(true)
    }, [])


    if(isClient){
    return (
        <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
            <div className="w-full  md:w-[85%] md:mx-auto grid grid-cols-5 gap-4 px-4 md:px-0 py-2 my-4">
                <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                        <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                            {/* <Link href='/' className="text-gray-500">Home</Link>{'/'} */}
                            <Link href='/admin_offices' className="text-gray-500">Admin Offices</Link> {'/'}
                            <span className="text-gray-900">Edit</span>
                        </div>
                    </div>
                    <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-transparent border border-gray-600 drop-shadow  text-black  md:divide-x md:divide-gray-200 border-l-8 " + (true && "border-gray-600" )}>
                        <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                            Edit Admin Office
                        </h2>
                        <button
                            type='button'
                            onClick={deleteOffice}
                            className=' bg-black p-2 text-white flex text-md font-semibold '>
								<span className='text-medium font-semibold text-white'>
									Delete
								</span>
                        </button>
                    </div>

                </div>


                <div className='col-span-5 flex flex-col justify-center items-start px-1 md:px-4 w-full '>
                    <div className=' w-full flex flex-col items-start bg-gray-50 rounded p-4 shadow-md'
                         style={{ minHeight: '250px'}}>

                            {/*    Bio Details*/}
                            <form
                                className='flex flex-col w-full items-start justify-start gap-3'
                                onSubmit={handleSubmit}
                            >
                                {/* Office Name*/}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='name'
                                        className='text-gray-600 capitalize text-sm'>
                                        Office Name
                                        <span className='text-medium leading-12 font-semibold'>
                                            {' '}
                                            *
                                                </span>
                                    </label>
                                    <input
                                        required
                                        type='text'
                                        name='name'
                                        defaultValue={name}
                                        className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* national */}
                                <div className='w-full flex flex-row items-center justify-start gap-1 mb-3'>
                                    
                                    <input
                                            type ="checkbox"
                                            name='is_national'
                                            id='is_national'
                                            onChange={handleCheck}
                                            defaultChecked={is_national}

                                        />
                                    <label
                                        htmlFor='is_national'
                                        className='text-gray-600 capitalize text-sm'>
                                        
                                        Is National Office
                                    </label>

                                </div>
                                {!hide && (
                                    <>

                                {/* County */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='county'
                                        id='county'
                                        className='text-gray-600 capitalize text-sm'>
                                        County
                                        <span className='text-medium leading-12 font-semibold'>
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
                                        options={countyOptions || []}
                                        // required
                                        defaultValue={{
                                            value: county,
                                            label: county_name
                                        }}
                                        placeholder='Select County'
                                        onChange={async (ev) => {
                                            if( ev.value.length > 0){

                                                // setFormData(String(ev.label).toLocaleUpperCase())

                                                try{
                                                    const resp = await fetch(`/api/filters/subcounty/?county=${ev.value}${"&fields=id,name,county&page_size=30"}`)

                                                    setSubCountyOpt((await resp.json()).results.map(({id, name}) => ({value:id, label:name})) ?? [])


                                                }
                                                catch(e){
                                                    console.error('Unable to fetch sub_county options')
                                                    setSubCountyOpt(null)
                                                }
                                            }else{
                                                return setSubCountyOpt(null)
                                            }
                                        }}
                                        name='county'
                                        className='flex-none w-full bg-transparent border border-gray-600 flex-grow  placehold-gray-500 focus:border-gray-200 outline-none'
                                    />
                                </div>

                                {/* Sub County */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='sub_county'
                                        className='text-gray-600 capitalize text-sm'>
                                        Sub-County
                                        <span className='text-medium leading-12 font-semibold'>
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
                                        options={subCountyOpt ?? subCountyOptions}
                                        defaultValue={
                                            {
                                                value: sub_county,
                                                label: sub_county_name
                                            }
                                        }
                                        // required
                                        placeholder='Select Sub County'
                                        name='sub_county'
                                        className='flex-none w-full bg-transparent border border-gray-600 flex-grow  placehold-gray-500  focus:eenr6er-gray-200 outline-none'
                                    />
                                </div>
                                    </>
                                )}

                                {/* Email */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='email'
                                        className='text-gray-600 capitalize text-sm'>
                                        Email
                                        <span className='text-medium leading-12 font-semibold'>
                                            *
                                                </span>
                                    </label>
                                    <input
                                        required
                                        type='email'
                                        name='email'
                                        defaultValue={email}
                                        className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='phone_number'
                                        className='text-gray-600 capitalize text-sm'>
                                        Phone Number
                                        <span className='text-medium leading-12 font-semibold'>
                                            *
                                                </span>
                                    </label>
                                    <input
                                        required
                                        type='number'
                                        defaultValue={phone_number}
                                        name='phone_number'
                                        className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* Cancel & Save */}
                                <div className='flex gap-3 items-center w-full'>
                                    <button type='submit' className=' bg-blue-600 p-2 text-white border-2 border-blue-600 flex text-md font-semibold '
                                    >
                                 <span className='text-medium font-semibold text-white'>
                                    Update
                                 </span>
                                    </button>
                                    <button className='flex items-center justify-start  p-2 border border-black '>
                                        <span className='text-medium font-semibold text-black 'onClick={() => {router.push('admin_offices')}} >
                                                   Cancel
                                                </span>
                                    </button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                </div>
                            </form>
                        

                    </div>
                </div>
            </div>
        </MainLayout>

    )
    }
    else {
        return null
    }
}

export async function getServerSideProps (ctx) {
   

    const allOptions = {}
    const options = [

        'filtering_summaries',
        'admin_offices',
    ]

    const zSchema = z.object({
        id: z.string('Should be a uuid string').optional(),
      })
    
    
    const queryId = zSchema.parse(ctx.query).id


    if (ctx.query.q) {
        const query = ctx.query.q
        if (typeof window !== 'undefined' && query.length > 2) {
            window.location.href = `/admin_offices?q=${query}`
        } else {
            if (ctx.res) {
                ctx.res.writeHead(301, {
                    Location: '/admin_offices?q=' + query
                });
                ctx.res.end();
                return {};
            }
        }
    }

    const response = (() => checkToken(ctx.req, ctx.res).then(async (t) => {

            if (t.error) {
                throw new Error('Error checking token')
            } else {

                let token = t.token;
                let url = '';



                for(let i = 0; i < options.length; i++) {
                    const option = options[i]

                    switch(option) {
                        case 'filtering_summaries':

                            // fetch counties

                            url = `${process.env.NEXT_PUBLIC_API_URL}/common/counties/?page_size=50&page=1`;

                            try{
                                

                                const _data = await fetch(url, {
                                    headers: {
                                        Authorization: 'Bearer ' + token,
                                        Accept: 'application/json',
                                    },
                                })

                                allOptions['counties'] = (await _data.json())?.results

                                
                                // fetch sub counties

                                if(_data.statusText == 'OK'){

                                    try {


                                        url = `${process.env.NEXT_PUBLIC_API_URL}/common/sub_counties/?page_size=20000&page=1`;
                                            

                                        const __data = await fetch(url, {
                                            headers: {
                                                Authorization: 'Bearer ' + token,
                                                Accept: 'application/json',
                                            },
                                        })

                                        allOptions['sub_counties'] = (await __data.json())?.results


                                    }

                                    catch (e) {
                                        console.error('Unable to fetch sub counties: ', e.message)
                                    }
                            
                                    
                                    
                                }

                            }
                            catch(err) {
                                console.log(`Error fetching ${option}: `, err);
                                allOptions[option] = {
                                    error: true,
                                    err: err.message,
                                    filtering_summaries: [],
                                }
                            }
                            break;
                        case 'admin_offices':

                            url = `${process.env.NEXT_PUBLIC_API_URL}/admin_offices/${queryId}/`

                            // console.log({url, token})
                            try{

                                const _data = await fetch(url,
                                    {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Accept': 'application/json',
                                        }
                                    })

                                    allOptions['admin_offices'] = (await _data.json())
                                    



                            }
                            catch(err) {
                                console.log(`Error fetching ${option}: `, err);
                                allOptions[option] = {
                                    error: true,
                                    err: err.message,
                                    admin_offices: [],
                                }
                            }
                            break;
                        default:
                            break;

                    }
                }



                return allOptions

            }
        }).catch(err => {
            console.log('Error checking token: ', err)
            if (typeof window !== 'undefined' && window) {
                if (ctx?.asPath) {
                    window.location.href = ctx?.asPath
                } else {
                    window.location.href = '/admin_offices'
                }
            }
            setTimeout(() => {
                return {
                    error: true,
                    err: err.message,
                    data: [],
                }
            }, 1000);
        }))()


    return {
        props: response
    }
}

export default withAuth(EditAdminOffice)