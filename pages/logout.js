import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import useSWR from 'swr'

function Logout () {
    const router = useRouter()

    const [isClient, setIsClient] = useState(false)

    async function logout(url) {
        return await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
           
                    if (response.error || response.detail) {
                        return { error: true, ...response }
                    }
                    return response
                })
}

    const {data} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/rest-auth/logout/`, logout)
    
    useEffect(() => {

        setIsClient(true)

        // const cookieCutter = require('cookie-cutter')
        // cookieCutter.set('access_token', '', "{}", { expires: new Date(0), httpOnly: false })

        // setTimeout(() => {
            if (!data?.error && !data?.detail) {
                if (typeof window !== 'undefined') {
                    window.sessionStorage.removeItem('user')
                    window.localStorage.removeItem('user')
                    window.localStorage.clear()
                    window.document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
                    router.push('/')

                } else {
                    const cookieCutter = require('cookie-cutter')
                    cookieCutter.set('access_token', '', "{}", { expires: new Date(0), httpOnly: false })
                }
            } else {
                    window.localStorage.clear()
                    router.replace('/')


            }
        // }, 1000);

    }, [])

    if(isClient) {
        return (
            <>
                <Head>
                    <title>KMHFR | Log out</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <MainLayout>
                    <div className="w-full flex py-60 overflow-hidden flex-col items-center justify-center">
                        <div className="flex flex-col items-center">
                            <h1 className="text-2xl text-black">Logging out...</h1>
                            {/* <p>You have been logged out.</p> */}
                        </div>
                    </div>
                </MainLayout>
            </>
        )
    }
    else {
        return null
    }
}

// Logout.getInitialProps = async () => {
//     // const cookieCutter = require('cookie-cutter')
//     const API_URL = process.env.NEXT_PUBLIC_API_URL
//     return fetch(API_URL + '/rest-auth/logout/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then((response) => {
           
//             if (response.error || response.detail) {
//                 return { error: true, ...response }
//             }
//             return response
//         })
// }

export default Logout

