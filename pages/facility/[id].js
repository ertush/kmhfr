import Head from 'next/head'
import MainLayout from '../../components/MainLayout'
import { LocationMarkerIcon } from '@heroicons/react/solid'
import { ArrowsExpandIcon } from '@heroicons/react/outline'

const Home = ({ facility }) => {
    return (
        <div className="">
            <Head>
                <title>KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout>
                <div className="w-full grid grid-cols-5 gap-4 p-2 my-6">
                    <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-4">
                        <div className="flex flex-row gap-2 text-sm md:text-base">
                            <a className="text-green-700" href="/">Home</a> >
                            <a className="text-green-700" href="/">Facilities</a> >
                            <span>{facility.official_name}</span>
                        </div>
                        <div className="col-span-5 flex flex-row items-center justify-start gap-4 py-2">
                            <h1 className="text-4xl tracking-tight font-bold leading-tight">{facility.official_name}</h1>
                            <div className="flex flex-wrap gap-3 items-center justify-end">
                                <a href={'/facility/edit' + facility.id} className="bg-white border-2 border-green-700 text-green-800 hover:bg-green-700 focus:bg-green-700 active:bg-green-700 font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white">
                                    Edit
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-3 flex flex-col gap-3">
                        <ul className="list-none flex flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none">
                            <li className="p-2 flex items-center justify-center text-green-700 border-b-2 border-green-700 font-semibold">
                                <a href="/">Overview</a>
                            </li>
                            <li className="p-2 flex items-center justify-center text-gray-700">
                                <a href="/">Services</a>
                            </li>
                            <li className="p-2 flex items-center justify-center text-gray-700">
                                <a href="/">Infrastructure</a>
                            </li>
                            <li className="p-2 flex items-center justify-center text-gray-700">
                                <a href="/">HR &amp; Staffing</a>
                            </li>
                            <li className="p-2 flex items-center justify-center text-gray-700">
                                <a href="/">Community Units</a>
                            </li>
                        </ul>
                        <div className="flex flex-col px-4 w-full">
                            <div className="col-span-4 md:col-span-4 flex flex-col group items-center justify-start text-left">
                                <div className="bg-gray-100 w-full p-4 rounded">
                                    <pre className="language-json leading-normal text-sm whitespace-pre-wrap text-gray-500">
                                        {JSON.stringify(facility, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside className="flex flex-col col-span-5 md:col-span-2 divide-y divide-gray-100 gap-4">
                        <h3 className="text-2xl tracking-tight font-bold leading-5">Map</h3>
                        <br />
                        <div className="w-full h-96 bg-gray-200 shadow rounded-lg flex flex-col items-center justify-center relative">
                            <span className="absolute top-2 right-2 cursor-pointer">
                                <ArrowsExpandIcon className="h-5 w-5 text-gray-500" />
                            </span>
                            <LocationMarkerIcon className="h-28 text-gray-400" />
                        </div>
                    </aside>
                </div>
            </MainLayout>
        </div>
    )
}

Home.getInitialProps = async (ctx) => {
    let fcl = await fetch('http://localhost:3900/api/facility/' + ctx.query.id)
    let facility = await fcl.json()
    return {
        facility
    }
}

export default Home