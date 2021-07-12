import Head from 'next/head'
import MainLayout from '../components/MainLayout'
import { DotsHorizontalIcon, PencilIcon } from '@heroicons/react/solid'

const Home = ({ facilities }) => {
    return (
        <div className="">
            <Head>
                <title>KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-5 gap-4 p-4 my-8">
                    <div className="col-span-4 flex flex-col gap-4 p-4">
                        <h1 className="text-4xl tracking-tight font-bold leading-3">All facilities</h1>
                    </div>
                    <div className="col-span-5 md:col-span-4 flex flex-col gap-4">
                        <div className="flex flex-col px-4 w-full">
                            {facilities.map(facility => (
                                <div key={facility.id} className="p-2 grid grid-cols-8 border-b py-3">
                                    <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                        <h3 className="text-2xl w-full">
                                            <a href={'/facility/' + facility.id} className="hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800">
                                                {facility.official_name}
                                            </a>
                                        </h3>
                                        <p className="text-sm text-gray-600 w-full">{facility.nearest_landmark || ' '}{' '} {facility.location_desc || ' '}</p>
                                    </div>
                                    <div className="col-span-8 md:col-span-3 flex flex-wrap items-center gap-4 text-lg">
                                        <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (facility.approved ? "bg-green-300 text-black" : "bg-gray-400 text-black")}>{facility.approved ? "Approved" : "Not approved"}</span>
                                    </div>
                                    <div className="col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg">
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
            </MainLayout>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {
    let fcl = await fetch('http://localhost:3900/api/facilities')
    let facilities = await fcl.json()
    facilities
        .filter(facility => facility.deleted === false)
        .sort((a, b) => a.name.localeCompare(b.name))
    return {
        facilities
    }
}

export default Home