import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import MainLayout from '../components/MainLayout'

const Logout = props => {
    const router = useRouter()
    useEffect(() => {
        setTimeout(() => {
            if (!props?.error && !props?.detail) {
                if (typeof window !== 'undefined') {
                    window.sessionStorage.removeItem('user')
                    window.document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
                    window.location.href = '/'
                } else {
                    const cookieCutter = require('cookie-cutter')
                    cookieCutter.set('access_token', '', "{}", { expires: new Date(0), httpOnly: false })
                }
            } else {
                if (typeof window !== 'undefined') {
                    window.location.href = '/'
                } else {
                    router.push('/')
                }
            }
        }, 1200);
    }, [])
    return (
        <>
            <Head>
                <title>KMHFR - Log out</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout>
                <div className="w-full flex py-60 overflow-hidden flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl text-black">Logout</h1>
                        <p>You have been logged out.</p>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

Logout.getInitialProps = async () => {
    const cookieCutter = require('cookie-cutter')
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    return fetch(API_URL + '/rest-auth/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        // .then(re => re.json())
        .then((response) => {
           
            if (response.error || response.detail) {
                return { error: true, ...response }
            }
            return response
        })
}

export default Logout

