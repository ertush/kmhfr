import Head from 'next/head'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, PencilIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'

const Home = (props) => {
    console.log(props)
    let facilities = props?.data?.results
    return (
        <div className="">
            <Head>
                <title>KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false}>
                <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-4 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-row gap-2 text-sm md:text-base py-3">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500">Facilities</span>
                        </div>
                        <h1 className="text-4xl tracking-tight font-bold leading-3">{(props?.query && props.query.length > 0) ? `Facilities matching ${props.query}` : "All facilities"}</h1>
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col items-center gap-4 mt-2 order-last md:order-none">
                        <div className="flex flex-col justify-center items-center px-1 md:px-4 w-full ">
                            {/* <pre>{JSON.stringify(facilities[0], null, 2)}</pre> */}
                            {facilities.map((facility, index) => (
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
                            ))}
                            <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <a href={'/?page=' + props?.data?.current_page} className="text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline">
                                        {props?.data?.current_page}
                                    </a>
                                </li>
                                {props?.data?.near_pages.map(page => (
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

                            </ul>
                        </div>
                    </div>
                    <aside className="flex flex-col col-span-5 md:col-span-1 p-1 md:h-full">
                        <details className="rounded bg-transparent py-2 text-basez flex flex-col w-full sticky top-2" open>
                            <summary className="flex cursor-pointer w-full bg-white p-2">
                                <h3 className="text-2xl tracking-tight font-bold leading-3">Filters</h3>
                            </summary>
                            <div className="flex flex-col gap-4 p-2">
                                <div>
                                    <label className="text-gray-600">County:</label>
                                    <input type="text" name="County" className="w-full p-2 rounded bg-gray-100" />
                                </div>
                                <div>
                                    <label className="text-gray-600">Sub-county:</label>
                                    <input type="text" name="County" className="w-full p-2 rounded bg-gray-100" />
                                </div>
                                <div>
                                    <label className="text-gray-600">Operational status:</label>
                                    <select name="Operational Status" className="w-full p-2 rounded bg-gray-100">
                                        <option value="Active">All</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </details>
                    </aside>
                </div>
            </MainLayout>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {

    const fetchData = (token) => {
        let url = 'http://api.kmhfltest.health.go.ke/api/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected'
        let query = ''
        if (ctx?.query?.q) {
            query = ctx.query.q
            url = `http://api.kmhfltest.health.go.ke/api/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency_name,ward_name,keph_level,operation_status_name&search={"query":{"query_string":{"default_field":"name","query":"${query}"}}}`
        }
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
                console.log(json.results.length)
                return {
                    data: json, query
                }
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: ''
                }
            })
    }
    return checkToken(ctx.req, ctx.res).then(t => {
        let token = t.token

        return fetchData(token).then(t=>t)
    }).catch(err => {
        console.log('Error checking token: ', err)
        return {
            error: true,
            err: err,
            data: [],
            query: ''
        }
    })

}

export default Home