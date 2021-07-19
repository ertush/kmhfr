import Head from 'next/head'
import Link from 'next/link'
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
                <title>KMHFL - GIS Explorer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-2 gap-6 px-1 md:px-4 p-4 my-4 max-w-screen-lg mx-auto">
                    <div className="col-span-2 p-2 md:p-4 flex flex-col gap-4 items-center justify-center">
                        <h3 className="text-3xl font-medium text-black">GIS Explorer</h3>
                        <p className="font-normal text-lg text-gray-900 text-left">
                            Coming soon.
                        </p>
                    </div>
                </div>
            </MainLayout>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {

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
                    filters: []
                }
            })
    }

    const fetchData = (token) => {
        let url = 'http://api.kmhfltest.health.go.ke/api/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level,operation_status_name'
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
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    return {
                        data: json, query, filters: { ...ft }
                    }
                })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {}
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
            query: {}
        }
    })

}

export default Home