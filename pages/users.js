import React from 'react'

// next imports
import Head from 'next/dist/shared/lib/head'

// components imports
import MainLayout from '../components/MainLayout'

const Users = () => {
  return (
    <>
    <Head>
        <title>KMHFL - Users</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/assets/css/leaflet.css" />
    </Head>

    <MainLayout>
        <div className="w-full grid grid-cols-5 gap-4 p-2 my-6 ">
            <div className="col-span-5 flex flex-col items-start px-4 justify-start gap-3">
                <div className="flex flex-row gap-2 text-sm md:text-base">
                    <a className="text-green-700" href="/">Home</a> {'>'}
                    <span className="text-gray-500" >Users</span> 
                   
                </div>
                <div className={"col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                </div>   
            </div>
                                                                                                    
       
        </div>
    </MainLayout>
</>
  )
}

export default Users