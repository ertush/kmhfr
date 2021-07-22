import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = (props) => {
    const router = useRouter()


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

// Home.getInitialProps = async (ctx) => {

// }

export default Home