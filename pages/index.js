import Head from 'next/head'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, PencilIcon } from '@heroicons/react/solid'

const Home = (props) => {
    let facilities = props?.facilities?.results
    return (
        <div className="">
            <Head>
                <title>KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-5 gap-4 px-4 py-2 my-4">
                    <div className="col-span-4 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-row gap-2 text-sm md:text-base py-3">
                            <a className="text-green-700" href="/">Home</a> >
                            <span href="/">Facilities</span>
                        </div>
                        <h1 className="text-4xl tracking-tight font-bold leading-3">{(props?.query && props.query.length > 0) ? `Facilities matching ${props.query}` : "All facilities"}</h1>
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col gap-4 mt-2">
                        <div className="flex flex-col px-4 w-full">
                            {/* <pre>{JSON.stringify(facilities,null,2)}</pre> */}
                            {facilities.map(facility => (
                                <div key={facility.id} className="p-2 grid grid-cols-8 border-b py-3">
                                    <div className="col-span-8 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                        <h3 className="text-2xl w-full">
                                            <a href={'/facility/' + facility.id} className="hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800">
                                                {facility.official_name || facility.official_name || facility.name}
                                            </a>
                                        </h3>
                                        {/* <p className="text-sm text-gray-600 w-full">{facility.nearest_landmark || ' '}{' '} {facility.location_desc || ' '}</p> */}
                                        <p className="text-sm text-gray-600 w-full">{facility.owner_name || ' '}</p>
                                    </div>
                                    <div className="col-span-8 md:col-span-3 flex flex-wrap items-center gap-4 text-lg">
                                        {!facility.rejected ? <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (facility.approved ? "bg-green-300 text-black" : "bg-gray-400 text-black")}>{facility.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + "bg-gray-400 text-black"}>{facility.rejected ? "Rejected" : ""}</span>}
                                    </div>
                                    <div className="col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end">
                                        <a href={'/facility/edit/' + facility.id} className="text-blue-800 hover:underline active:underline focus:underline">
                                            Edit
                                        </a>
                                        <a href="/" className="text-blue-800 hover:underline active:underline focus:underline">
                                            <DotsHorizontalIcon className="h-5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <aside className="flex flex-col col-span-5 md:col-span-1 divide-y divide-gray-100 gap-4">
                        <h3 className="text-2xl tracking-tight font-bold leading-3">Filter</h3>
                        <label>County:</label>
                        <input type="text" name="County" className="w-full p-2 rounded bg-gray-100" />
                        <label>Sub-county:</label>
                        <input type="text" name="County" className="w-full p-2 rounded bg-gray-100" />
                        <label>Operational status:</label>
                        <select name="Operational Status" className="w-full p-2 rounded bg-gray-100">
                            <option value="Active">All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </aside>
                </div>
                {/* <div className="absolute inset-0 overflow-hidden bg-white opacity-90 z-20 flex items-center justify-center">
                    <h3 className="text-2xl text-gray-800 font-bold">Loading...</h3>
                </div> */}
            </MainLayout>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {
    let url = 'http://api.kmhfltest.health.go.ke/api/facilities/facilities/?has_edits=true&fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected'
    let query = ''
    if(ctx?.query?.q){
        query = ctx.query.q
        url = `http://api.kmhfltest.health.go.ke/api/facilities/material/?fields=id,code,name,regulatory_status_name,facility_type_name,owner_name,county,constituency,ward_name,keph_level,operation_status_name&search={"query":{"query_string":{"default_field":"name","query":"${query}"}}}`
    }
    console.log(ctx.query)
    let fcl = await fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Accept': 'application/json'
        }
    })
    let facilities = await fcl.json()

    return {
        facilities, query
    }
}

export default Home