import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, DownloadIcon, PencilIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import BarChart from '../components/BarChart'

const Dash = (props) => {
    const router = useRouter()
    console.log('props:::', Object.keys(props))
    console.log('props.data:::', Object.keys(props?.data))
    let facilities = props?.data?.results
    let filters = props?.filters
    let fltrs = filters
    let [drillDown, setDrillDown] = useState({})
    if (filters) {
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

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {

            Object.keys(filters).map(ft => {
                if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                    setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                }
            })
        }
    }, [filters])


    return (
        <div className="">
            <Head>
                <title>KMHFL - Overview</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-6 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-6 flex flex-col gap-3 md:gap-5 px-2">
                        <div className="flex flex-row gap-2 text-sm md:text-base py-3">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500">Overview Dashboard</span>
                        </div>
                        <div className="flex flex-wrap gap-1 text-sm md:text-base py-3 items-center justify-between">
                            <h1 className="text-4xl tracking-tight font-bold leading-3 flex items-center justify-start gap-x-1">Overview</h1>
                        </div>
                    </div>

                    {/* Facilities summary 1/3 - FILTERABLE */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facilities summary</h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total facilities</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.total_facilities || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total approved</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.approved_facilities || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total rejected</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.rejected_facilities_count || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total closed</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.closed_facilities_count || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total pending approval</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.pending_updates || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* CUs summary - FILTERABLE 1/3 */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Community Units summary</h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total community health units</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.total_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total CHUs rejected</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.rejected_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">New CHUs pending_approval</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_created_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Updated CHUs pending approval</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.chus_pending_approval || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Recent changes 1/3 - FILTERABLE */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Recent changes</h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">New facilities added</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_created || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Facilities updated</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_updated || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">New CHUs added</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_created_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">CHUs updated</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_updated_chus || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Facilities & CHUs by county (bar) 1/1 */}
                    <div className="col-span-6 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facilities &amp; CHUs by county</h4>
                        <BarChart 
                            title="Facilities & CHUs by county" 
                            categories={Array.from(props?.data?.county_summary, cs => cs.name) || []} 
                            tooltipsuffix="#" 
                            xaxistitle="County" 
                            yaxistitle="Number"
                            data={( ()=>{
                                let data = [];
                                data.push({
                                    name: 'Facilities',
                                    data: Array.from(props?.data?.county_summary, cs => parseFloat(cs.count)) || []
                                });
                                data.push({
                                    name: 'CHUs',
                                    data: Array.from(props?.data?.county_summary, cs => parseFloat(cs.chu_count)) || []
                                });
                                return data;
                            })() || []} />
                    </div>
                    {/* Facility owners & categories - national summary - FILTERABLE (bar) 1/2 */}
                    <div className="col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facility owners</h4>
                        <BarChart 
                            title="Facility owners" 
                            categories={Array.from(props?.data?.owner_types, ot => ot.name) || []} 
                            tooltipsuffix="#" 
                            xaxistitle="Owner" 
                            yaxistitle="Number"
                            data={( ()=>{
                                return [{name:"Owner",data:Array.from(props?.data?.owner_types, ot => parseFloat(ot.count)) || []}];
                            })() || []} />
                    </div>
                    {/* Facility types - national summary - FILTERABLE (bar) 1/2 */}
                    <div className="col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facility types</h4>
                        <BarChart 
                            title="Facility types" 
                            categories={Array.from(props?.data?.types_summary, ts => ts.name) || []} 
                            tooltipsuffix="#" 
                            xaxistitle="Type" 
                            yaxistitle="Number"
                            data={( ()=>{
                                return [{name:"Type",data:Array.from(props?.data?.types_summary, ts => parseFloat(ts.count)) || []}];
                            })() || []} />
                    </div>


                    {/* (((((( Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited at the moment.
                        </p>
                    </div>
                    {/* ))))))) */}
                </div>
            </MainLayout>
        </div>
    )
}

Dash.getInitialProps = async (ctx) => {
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
        let url = API_URL + '/facilities/dashboard/'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`
        }
        let other_posssible_filters = ["owner_type", "service", "facility_type", "county", "service_category", "sub_county", "keph_level", "owner", "operation_status", "constituency", "ward", "has_edits", "is_approved", "is_complete", "number_of_beds", "number_of_cots", "open_whole_day", "open_weekends", "open_public_holidays"]

        other_posssible_filters.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                url += "&" + flt + "=" + ctx?.query[flt]
            }
        })
        console.log('running fetchData(' + url + ')')
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return {
                    data: json, query, path: ctx.asPath || '/dashboard', current_url: url
                }
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/dashboard',
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
                window.location.href = '/dashboard'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/dashboard',
                current_url: ''
            }
        }, 1000);
    })

}

export default Dash




/*

http://api.kmhfltest.health.go.ke/api/facilities/dashboard/

http://api.kmhfltest.health.go.ke/api/facilities/dashboard/?fields=recently_created&last_month=true

http://api.kmhfltest.health.go.ke/api/facilities/dashboard/?fields=recently_created&last_week=true

http://api.kmhfltest.health.go.ke/api/facilities/dashboard/?fields=recently_created&last_three_months=true

*/