import MainLayout from '../../components/MainLayout'
import React from 'react'
import Head from 'next/head'
import { checkToken } from '../../controllers/auth/public_auth'
import { Download } from '@mui/icons-material'
import Link from 'next/link'
import * as Tabs from "@radix-ui/react-tabs";
import { UserContext } from '../../providers/user'
import { useRouter } from 'next/router'


function Downloads(props) {

    const userCtx = useContext(UserContext)

    const router = useRouter()

    React.useEffect(() => {
        if (userCtx.id === 6) {
			router.push('/auth/login')
		}
    }, [])

    // return (
    //     <pre>
    //         {
    //             JSON.stringify(props, null, 2)
    //         }
    //     </pre>
    // )

    console.log({ props })

    return (
        <React.Fragment>
            <Head>
                <title>KMHFR | Downloads</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout>
                <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-5 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">
                    {/* Heading Matters */}
                    <div className="col-sapn-1 md:col-span-5 flex flex-col gap-3 ">

                        {/* Buttons section */}
                        <div className="flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between">
                            <div className="flex w-full flex-wrap items-start md:items-center justify-between gap-2 text-sm md:text-base py-1">
                                {/* Bread Crumbs */}

                                {/* <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                    <span className="text-gray-600 text-2xl">Facilities</span> 
                                </div> */}


                                <div className={"col-span-1 md:col-span-5 flex justify-between w-full bg-django-blue border drop-shadow  text-black p-4 md:divide-x md:divide-gray-200 items-start md:items-center border-l-8 " + (true ? "border-gray-700" : "border-red-600")}>
                                    <h2 className='flex items-center text-2xl font-bold text-gray-900 capitalize gap-2'>
                                        Documents Available for Download
                                    </h2>

                                </div>
                            </div>


                        </div>

                    </div>

                    {/* Main */}
                    <Tabs.Root
                        orientation="horizontal"
                        className="w-full flex flex-col col-span-1 md:col-span-5 tab-root"
                        defaultValue="all"
                    >
                        <Tabs.List className="list-none grid grid-cols-3 uppercase leading-none tab-list font-semibold border-b border-gray-400">
                            <Tabs.Tab
                                id={1}
                                value="all"
                                className="p-2 whitespace-nowrap  focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-pointer border-b-2 border-transparent tab-item"
                            >
                                All
                            </Tabs.Tab>

                            <Tabs.Tab
                                id={2}
                                value="common"
                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-pointer border-b-2 border-transparent tab-item"
                            >
                                Common
                            </Tabs.Tab>

                            <Tabs.Tab
                                id={3}
                                value="checklist"
                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-pointer border-b-2 border-transparent tab-item"
                            >
                                Checklist
                            </Tabs.Tab>

                        </Tabs.List>

                        <Tabs.Panel
                            value="all"
                            className="grow-1 py-4 tab-panel"
                        >
                            <div className='bg-gray-50 rounded w-full h-auto flex flex-col p-2'>

                                {
                                    props?.all?.map(docItem => (
                                        <Link href={docItem?.fyl}>
                                            <div className="w-full max-h-min p-3 border-b hover:bg-gray-200 border-gray-300 flex justify-between ">
                                                <div className="flex gap-2">
                                                    <Download className='w-12 h-12 mt-1 text-gray-400' />
                                                    <div className='flex flex-col gap-2 justify-center'>
                                                        <h2>
                                                            {docItem?.facility_name}{" "}
                                                            {docItem?.document_type?.includes('FACILITY_LICENSE') && 'License File'}
                                                            {docItem?.document_type?.includes('Facility_ChecKList') && 'Checklist File'}
                                                        </h2>
                                                        <h4 className='text-gray-500'>
                                                            {docItem?.description}

                                                        </h4>
                                                    </div>
                                                </div>

                                                <h2 className='hidden md:flex'>Download</h2>


                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel
                            value="common"
                            className="grow-1 py-4 tab-panel"
                        >
                            <div className='bg-gray-50 rounded w-full h-auto flex flex-col p-2'>

                                {
                                    props?.common?.map(docItem => (
                                        <Link href={docItem?.fyl}>
                                            <div className="w-full max-h-min p-3 border-b hover:bg-gray-200 border-gray-300 flex justify-between ">
                                                <div className="flex gap-2">
                                                    <Download className='w-12 h-12 mt-1 text-gray-400' />
                                                    <div className='flex flex-col gap-2 justify-center'>
                                                        <h2>
                                                            {docItem?.name}

                                                        </h2>
                                                        <h4 className="text-gray-500">

                                                            {docItem?.description}

                                                        </h4>
                                                    </div>
                                                </div>

                                                <h2 className='hidden md:flex'>Download</h2>


                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </Tabs.Panel>


                        <Tabs.Panel
                            value="checklist"
                            className="grow-1 py-4 tab-panel"
                        >
                            <div className='bg-gray-50 rounded w-full h-auto flex flex-col p-2'>

                                {
                                    props?.checklist?.map(docItem => (
                                        <Link href={docItem?.fyl}>
                                            <div className="w-full max-h-min p-3 border-b hover:bg-gray-200 border-gray-300 flex justify-between ">
                                                <div className="flex gap-2">
                                                    <Download className='w-12 h-12 mt-1 text-gray-400' />
                                                    <div className='flex flex-col gap-2 justify-center'>
                                                        <h2>
                                                            {docItem?.facility_name}{" "}
                                                            {docItem?.document_type?.includes('FACILITY_LICENSE') && 'License File'}
                                                            {docItem?.document_type?.includes('Facility_ChecKList') && 'Checklist File'}
                                                        </h2>
                                                        <h4 className="text-gray-500">
                                                            {docItem?.description}

                                                        </h4>
                                                    </div>
                                                </div>

                                                <h2 className='hidden md:flex'>Download</h2>


                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </Tabs.Panel>




                    </Tabs.Root>




                </div>
            </MainLayout>
        </React.Fragment>
    )
}


export default Downloads



// Data fetching

export async function getServerSideProps(ctx) {

    // Cache Page Contents

    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )


    const token = (await checkToken(ctx.req, ctx.res))?.token



    async function fetchDocuments(url, token) {

        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }

        })
            .then(res => res.json())
            .then(res => res)
            .catch(e => { console.error(e.message); return [] })

    }


    return {
        props: {
            all: (await fetchDocuments(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/`, token))?.results,
            common: (await fetchDocuments(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/?document_type=NORMAL&page=1`, token))?.results,
            checklist: (await fetchDocuments(`${process.env.NEXT_PUBLIC_API_URL}/common/documents/?document_type=Facility_ChecKList&page=1`, token))?.results
        }
    }

}