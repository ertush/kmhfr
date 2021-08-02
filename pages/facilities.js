import Head from 'next/head'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, PencilIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = (props) => {
    const router = useRouter()
    // console.log(props)
    let facilities = props?.data?.results
    let filters = props?.filters
    let [drillDown, setDrillDown] = useState({})
    
    useEffect(() => {
        if(filters && Object.keys(filters).length>0){
            Object.keys(filters).map(ft => {
                if(props?.query[ft] && props?.query[ft] != null && props?.query[ft].length>0){
                    setDrillDown({...drillDown, [ft]: props?.query[ft]})
                }
            })
        }
    }, [filters])


    return (
        <div className="">
            <Head>
                <title>KMHFL - Facilities</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-4 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-row gap-2 text-sm md:text-base py-3">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500">Facilities</span>
                        </div>
                        <h1 className="text-4xl tracking-tight font-bold leading-3 flex items-center justify-start gap-x-2">{(props?.query?.searchTerm && props?.query?.searchTerm.length > 0) ? `Facilities matching "${props?.query?.searchTerm}"` : "All facilities"}

                        <span className="text-lg text-gray-700 font-normal">
                            {drillDown && Object.keys(drillDown).length>0 && 
                                `matching (${Object.keys(drillDown).map(k => `${k}: ${filters[k].find(r=>r.id==drillDown[k]).name || k}`).join(', ')})`
                            }
                        </span>
                        
                        {props?.data && props?.data?.results && props?.data?.results.length > 0 && <small className="text-gray-500 text-base">( {props?.data?.results.length} )</small>}</h1>
                        {/* <small className="font-bold text-sm">{JSON.stringify(props?.query)}</small> */}
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none">
                        <div className="flex flex-col justify-center items-center px-1 md:px-4 w-full ">
                            {/* <pre>{JSON.stringify(facilities[0], null, 2)}</pre> */}
                            {facilities && facilities.length > 0 ? facilities.map((facility, index) => (
                                <div key={facility.id} className="px-1 md:px-3 grid grid-cols-8 gap-3 border-b py-4 hover:bg-gray-50 w-full">
                                    <div className="col-span-8 md:col-span-4 flex flex-col gap-1 group items-center justify-start text-left">
                                        <h3 className="text-2xl w-full">
                                            <a href={'/facility/' + facility.id} className="hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800">
                                                <small className="text-gray-500">{index + props?.data?.start_index}.</small>{' '}{facility.official_name || facility.official_name || facility.name}
                                            </a>
                                        </h3>
                                        {/* <p className="text-sm text-gray-600 w-full">{facility.nearest_landmark || ' '}{' '} {facility.location_desc || ' '}</p> */}
                                        <p className="text-sm text-gray-600 w-full flex gap-2 items-center">
                                            <span className="text-lg text-black font-semibold"># {facility.code ? facility.code : 'NO_CODE' || ' '}</span>
                                            <span>{facility.owner_name || ' '}</span>
                                        </p>
                                        <div className="text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full">
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">County:</label>
                                                <span>{facility.county_name || facility.county || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">Sub-county:</label>
                                                <span>{facility.sub_county_name || facility.sub_county || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">Ward:</label>
                                                <span>{facility.ward_name || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">Constituency:</label>
                                                <span>{facility.constituency_name || facility.constituency || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-8 md:col-span-3 flex flex-wrap items-center gap-3 text-lg">
                                        {(facility.operational || facility.operation_status_name) ? <span className={"leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-black"}>Operational</span> : ""}
                                        {!facility.rejected ? <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (facility.approved ? "bg-green-200 text-black" : "bg-gray-400 text-black")}>{facility.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + "bg-gray-400 text-black"}>{facility.rejected ? "Rejected" : ""}</span>}
                                        {facility.has_edits ? <span className={"leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-black"}>Has edits</span> : ""}
                                    </div>
                                    <div className="col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end">
                                        <a href={'/facility/edit/' + facility.id} className="text-blue-800 hover:underline active:underline focus:underline bg-blue-200 md:bg-transparent px-2 md:px-0 rounded md:rounded-none">
                                            Edit
                                        </a>
                                        <a href="/" className="text-blue-800 hover:underline active:underline focus:underline">
                                            <DotsHorizontalIcon className="h-5" />
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full flex items-center justify-start gap-2 bg-yellow-100 border font-medium rounded border-yellow-300 p-3">
                                    <span className="text-base text-gray-700">No facilities found</span>
                                    <a href={props.path || '/'} className="text-blue-700 hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800">
                                        Refresh.
                                    </a>
                                </div>
                            )}
                            {facilities && facilities.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <a href={'/facilities?page=' + props?.data?.current_page} className="text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline">
                                        {props?.data?.current_page}
                                    </a>
                                </li>
                                {props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <a href={'/facilities?page=' + page} className="text-blue-800 p-2 hover:underline active:underline focus:underline">
                                            {page}
                                        </a>
                                    </li>
                                ))}
                                <li className="text-sm text-gray-400 flex">
                                    <DotsHorizontalIcon className="h-3" />
                                </li>
                                {/* {props?.data?.far_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <a href={'/?page=' + page} className="text-blue-800 p-2 hover:underline active:underline focus:underline">
                                            {page}
                                        </a>
                                    </li>
                                ))} */}

                            </ul>}
                        </div>
                    </div>
                    <aside className="flex flex-col col-span-5 md:col-span-1 p-1 md:h-full">
                        <details className="rounded bg-transparent py-2 text-basez flex flex-col w-full md:stickyz md:top-2z" open>
                            <summary className="flex cursor-pointer w-full bg-white p-2">
                                <h3 className="text-2xl tracking-tight font-bold leading-3">Filters</h3>
                            </summary>
                            <div className="flex flex-col gap-2 p-2">
                                {filters && filters?.error ?
                                    (<div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                        <p>No filters.</p>
                                    </div>)
                                    : (
                                        <form action="/" onSubmit={ev => {
                                            ev.preventDefault()
                                            return false
                                        }}>
                                            {filters && Object.keys(filters).length > 0 &&
                                                Object.keys(filters).map(ft => (
                                                    <div key={ft} className="w-full flex flex-col items-start justify-start gap-1 mb-3">
                                                        <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>
                                                        <select name={ft} defaultValue={props?.query[ft] || ""} id={ft} className="w-full p-2 rounded bg-gray-100" onChange={sl => {
                                                            let nf = {}
                                                            nf[ft] = sl.target.value
                                                            setDrillDown({ ...drillDown, ...nf })
                                                            // updateFt(nf)
                                                        }}>
                                                            <option value="">All</option>
                                                            {filters && filters[ft].map(ft_opt => (
                                                                <option key={ft_opt.id} value={ft_opt.id}>{ft_opt.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                            ))}
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="has_edits" className="text-gray-600 capitalize text-sm">Has edits</label>
                                                <input type="checkbox" defaultChecked={props?.query?.has_edits || false} name="has_edits" id="has_edits" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'has_edits': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="is_approved" className="text-gray-600 capitalize text-sm">Approved</label>
                                                <input type="checkbox" defaultChecked={props?.query?.is_approved || false} name="is_approved" id="is_approved" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'is_approved': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="is_complete" className="text-gray-600 capitalize text-sm">Complete</label>
                                                <input type="checkbox" defaultChecked={props?.query?.is_complete || false} name="is_complete" id="is_complete" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'is_complete': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="number_of_beds" className="text-gray-600 capitalize text-sm">Has beds</label>
                                                <input type="checkbox" defaultChecked={props?.query?.number_of_beds || false} name="number_of_beds" id="number_of_beds" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'number_of_beds': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="number_of_cots" className="text-gray-600 capitalize text-sm">Has cots</label>
                                                <input type="checkbox" defaultChecked={props?.query?.number_of_cots || false} name="number_of_cots" id="number_of_cots" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'number_of_cots': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="open_whole_day" className="text-gray-600 capitalize text-sm">Open 24 hours</label>
                                                <input type="checkbox" defaultChecked={props?.query?.open_whole_day || false} name="open_whole_day" id="open_whole_day" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'open_whole_day': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="open_weekends" className="text-gray-600 capitalize text-sm">Open weekends</label>
                                                <input type="checkbox" defaultChecked={props?.query?.open_weekends || false} name="open_weekends" id="open_weekends" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'open_weekends': ev.target.checked })
                                                }} />
                                            </div>
                                            <div className="w-full flex flex-row items-center px-2 justify-between gap-1 mb-3">
                                                <label htmlFor="open_public_holidays" className="text-gray-600 capitalize text-sm">Open holidays</label>
                                                <input type="checkbox" defaultChecked={props?.query?.open_public_holidays || false} name="open_public_holidays" id="open_public_holidays" onChange={ev => {
                                                    setDrillDown({ ...drillDown, 'open_public_holidays': ev.target.checked })
                                                }} />
                                            </div>
                                            <button onClick={ev => {
                                                if (Object.keys(drillDown).length > 0) {
                                                    let qry = Object.keys(drillDown).map(function (key) {
                                                        let er = ''
                                                        if (props.path && !props.path.includes(key + '=')) {
                                                            er = encodeURIComponent(key) + '=' + encodeURIComponent(drillDown[key]);
                                                        }
                                                        return er
                                                    }).join('&')
                                                    let op = '?'
                                                    if (props.path && props.path.includes('?') && props.path.includes('=')) { op = '&' }
                                                    console.log(props.path)
                                                    // setDrillDown({})
                                                    if(typeof window !== 'undefined' && window){
                                                        window.location.href = props.path + op +qry
                                                    }else{
                                                        router.push(props.path + op + qry)
                                                    }
                                                }
                                            }} className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center">Filter</button>
                                            <div className="w-full flex items-center py-2 justify-center">
                                                <button className="cursor-pointer text-sm bg-transparent text-blue-700 hover:text-black hover:underline focus:text-black focus:underline active:text-black active:underline" onClick={ev => {
                                                    router.push('/')
                                                }}>Clear filters</button>
                                            </div>
                                        </form>
                                    )
                                }
                            </div>
                        </details>
                    </aside>
                </div>
            </MainLayout>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {
    const API_URL = process.env.API_URL || 'https://api.kmhfltest.health.go.ke/api'

    const fetchFilters = token => {
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'

        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching filters: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }

    const fetchData = (token) => {
        let url = API_URL + '/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level,operation_status_name'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
        let other_posssible_filters = ["owner_type", "service", "facility_type", "county", "service_category", "sub_county", "keph_level", "owner", "operation_status", "constituency", "ward", "has_edits", "is_approved", "is_complete", "number_of_beds", "number_of_cots", "open_whole_day", "open_weekends", "open_public_holidays"]
        other_posssible_filters.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                url += "&" + flt + "=" + ctx?.query[flt]
            }
        })

        if (ctx?.query?.page) {
            url = `${url}&page=${ctx.query.page}`
        }
        console.log('running fetchData(' + url + ')')
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    return {
                        data: json, query, filters: { ...ft }, path: ctx.asPath || '/facilities'
                    }
                })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/facilities'
                }
            })
    }
    return checkToken(ctx.req, ctx.res).then(t => {
        let token = t.token

        return fetchData(token).then(t => t)
    }).catch(err => {
        console.log('Error checking token: ', err)
        return {
            error: true,
            err: err,
            data: [],
            query: {},
            path: ctx.asPath || '/facilities'
        }
    })

}

export default Home