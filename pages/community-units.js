import Head from 'next/head'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, PencilIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = (props) => {
    const router = useRouter()
    // console.log(props)
    let cus = props?.data?.results
    let filters = props?.filters
    let [drillDown, setDrillDown] = useState({})
    const updateFt = nu_vl => {
        // console.log('updading Filters: ', nu_vl)
        let srch_trm = nu_vl[Object.keys(nu_vl)[0]]
        let new_dd = { ...drillDown, ...nu_vl }
        if (srch_trm != null && srch_trm != undefined && srch_trm != "" && srch_trm && srch_trm.length > 0) {
            // setDrillDown(new_dd)
        } else {
            new_dd = { ...drillDown }
            delete new_dd[Object.keys(nu_vl)[0]]

        }
        setDrillDown(new_dd)
    }


    return (
        <div className="">
            <Head>
                <title>KMHFL - Community Units</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-4 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-row gap-2 text-sm md:text-base py-3">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500">Community Units</span>
                        </div>
                        <h1 className="text-4xl tracking-tight font-bold leading-3 flex items-start justify-start gap-1">{(props?.query?.searchTerm && props?.query?.searchTerm.length > 0) ? `Community Units matching "${props?.query?.searchTerm}"` : "All Community Units"}{props?.data && props?.data?.results && props?.data?.results.length > 0 && <small className="text-gray-500 text-base">( {props?.data?.results.length} )</small>}</h1>
                        {/* <small className="font-bold text-sm">{JSON.stringify(props)}</small> */}
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none">
                        <div className="flex flex-col justify-center items-center px-1 md:px-4 w-full ">
                            {/* <pre>{JSON.stringify(cus[0], null, 2)}</pre> */}
                            {cus && cus.length > 0 ? cus.map((comm_unit, index) => (
                                <div key={comm_unit.id} className="px-1 md:px-3 grid grid-cols-8 gap-3 border-b py-4 hover:bg-gray-50 w-full">
                                    <div className="col-span-8 md:col-span-4 flex flex-col gap-1 group items-center justify-start text-left">
                                        <h3 className="text-2xl w-full">
                                            <a href={'/cu/' + comm_unit.id} className="hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800">
                                                <small className="text-gray-500">{index + props?.data?.start_index}.</small>{' '}{comm_unit.official_name || comm_unit.official_name || comm_unit.name}
                                            </a>
                                        </h3>
                                        {/* <p className="text-sm text-gray-600 w-full">{comm_unit.nearest_landmark || ' '}{' '} {comm_unit.location_desc || ' '}</p> */}
                                        <p className="text-sm text-gray-600 w-full flex gap-2 items-center">
                                            <span className="text-lg text-black font-semibold"># {comm_unit.code ? comm_unit.code : 'NO_CODE' || ' '}</span>
                                            <span>{comm_unit.facility_name || ' '}</span>
                                        </p>
                                        <div className="text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full">
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">County:</label>
                                                <span>{comm_unit.facility_county || comm_unit.county || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">Sub-county:</label>
                                                <span>{comm_unit.facility_subcounty || comm_unit.sub_county || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">Ward:</label>
                                                <span>{comm_unit.facility_ward || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-0 leading-none">
                                                <label className="text-xs text-gray-500">Constituency:</label>
                                                <span>{comm_unit.constituency_name || comm_unit.facility_constituency || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-8 md:col-span-3 flex flex-wrap items-center gap-3 text-lg">
                                        {(comm_unit.operational || comm_unit.operation_status_name) ? <span className={"leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-black"}>Operational</span> : ""}
                                        {!comm_unit.rejected ? <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (comm_unit.approved ? "bg-green-200 text-black" : "bg-gray-400 text-black")}>{comm_unit.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + "bg-gray-400 text-black"}>{comm_unit.rejected ? "Rejected" : ""}</span>}
                                        {comm_unit.has_edits ? <span className={"leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-black"}>Has edits</span> : ""}
                                    </div>
                                    <div className="col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end">
                                        <a href={'/community-unit/edit/' + comm_unit.id} className="text-blue-800 hover:underline active:underline focus:underline bg-blue-200 md:bg-transparent px-2 md:px-0 rounded md:rounded-none">
                                            Edit
                                        </a>
                                        <a href="/" className="text-blue-800 hover:underline active:underline focus:underline">
                                            <DotsHorizontalIcon className="h-5" />
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full flex items-center justify-start gap-2 bg-yellow-100 border font-medium rounded border-yellow-300 p-3">
                                        <span className="text-base text-gray-700">No community units found</span>
                                        <a href={props.path || '/'} className="text-blue-700 hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800">
                                            Refresh.
                                        </a>
                                </div>
                            )}
                            {cus && cus.length>0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <a href={'/?page=' + props?.data?.current_page} className="text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline">
                                        {props?.data?.current_page}
                                    </a>
                                </li>
                                {props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <a href={'/?page=' + page} className="text-blue-800 p-2 hover:underline active:underline focus:underline">
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
                                            {filters && Object.keys(filters).length>0 &&
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
                                                            {filters[ft].map(ft_opt => (
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
                                                        return encodeURIComponent(key) + '=' + encodeURIComponent(drillDown[key]);
                                                    }).join('&')
                                                    // setDrillDown({})
                                                    router.push(props.path + '?' + qry)
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
    console.log("=======================================")
    console.log(ctx.req)
    const fetchFilters = token => {
        let filters_url = 'http://api.kmhfltest.health.go.ke/api/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'

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
                    filters: [],
                    path: ctx.asPath || '/'
                }
            })
    }

    const fetchData = (token) => {
        // let url = 'http://api.kmhfltest.health.go.ke/api/chul/units/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,is_approved,rejected,keph_level,operation_status_name'
        let url = 'http://api.kmhfltest.health.go.ke/api/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency,is_approved,has_edits,is_complete'
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
        console.log('running fetchData('+url+')')
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    return {
                        data: json, query, filters: { ...ft }, path: ctx.asPath || '/'
                    }
                })
            }).catch(err => {
                console.log('Error fetching community units: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/'
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
            path: ctx.asPath || '/'
        }
    })

}

export default Home