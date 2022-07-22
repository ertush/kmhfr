
import React from 'react'
import MainLayout from '../../components/MainLayout'
import Head from 'next/head'
import router from 'next/router'


const Upgrade = props => {
    return (
        <>
        <Head>
               <title>KMHFL - Upgrade Facility</title>
               <link rel="icon" href="/favicon.ico" />
           </Head>
       <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
        <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                                <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                    <span className="text-indigo-700 cursor-pointer" onClick={() => router.push('/')}>Home</span>{'>'}
                                    <span className="text-indigo-700 cursor-pointer" onClick={() => router.push('/facilities')}>Facilities</span> {'>'}
                                    <span className="text-gray-500">Upgrade</span>
                                </div>
                            </div>
                            <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                    <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    Upgrade Facility
                                    </h2>
                            </div>
                    
                </div>
            </div>
        </MainLayout>
        </>
    )
}


Upgrade.getInitialProps = async (ctx) => {

   /* return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            let url = process.env.NEXT_PUBLIC_API_URL + '/facilities/facilities/' + ctx.query.id + '/'
            return fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            }).then(r => r.json())
                .then(json => {
                    return {
                        data: json
                    }
                }).catch(err => {
                    console.log('Error fetching facilities: ', err)
                    return {
                        error: true,
                        err: err,
                        data: [],
                    }
                })
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/facilities'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
            }
        }, 1000);
    })*/

    return {
        props: {
            id: null,
            query:{
                searchTerm: ''
            }
        }
    }

}

export default Upgrade