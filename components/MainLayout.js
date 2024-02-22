// import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../controllers/auth/auth'
import LoadingAnimation from './LoadingAnimation';
import HeaderLayout from './HeaderLayout';
import Link from 'next/link'
import { NorthEast } from '@mui/icons-material';
import Image from 'next/image'
import NavBar from './Navbar';

const DelayedLoginButton = () => {
    const [delayed, setDelayed] = useState(false)
    useEffect(() => {
        let mtd = true
        setTimeout(() => {
            if (mtd === true) {
                setDelayed(true)
            }
        }, 1000)
        return () => { mtd = false }
    }, [])
    if (delayed) {
        return <a href="/auth/login" className="bg-black hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-8 whitespace-norow py-2 rounded text-base font-semibold">Log in</a>
    } else {
        return <div className="p-3 w-16"> <LoadingAnimation size={6} isLight={true} /> </div>
    }
}

export default function MainLayout({ children, isLoading, searchTerm, isFullWidth, classes }) {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    let API_URL = process.env.NEXT_PUBLIC_API_URL
    if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
        API_URL = 'http://localhost:8000/api'
    }

    //check if a session cookie is set
    let path = router.asPath
    if (path.includes('facilities') || path.includes('facility')) {
        path = '/facilities'
    } else if (path.includes('community')) {
        path = '/community-units'
    } else {
        path = '/facilities'
    }


    useEffect(() => {
        let mtd = true
        if (mtd) {
            let is_user_logged_in = (typeof window !== 'undefined' && window.document.cookie.indexOf('access_token=') > -1) || false
            setIsLoggedIn(is_user_logged_in)
            let session_token = null
            if (is_user_logged_in) {
                session_token = JSON.parse(window.document.cookie.split('access_token=')[1].split(';')[0])
            }

            if (is_user_logged_in && typeof window !== 'undefined' && session_token !== null) {
                console.log('active session found')

                getUserDetails(session_token.token, `${API_URL}/rest-auth/user/`).then(usr => {
                    if (usr.error || usr.detail) {
                        setIsLoggedIn(false)
                        setUser(null)
                    } else {
                        if (usr?.full_name == "public public public") {
                            setIsLoggedIn(false)
                            setUser(null)
                        } else {
                            setIsLoggedIn(true)
                            setUser(usr)
                        }
                    }
                })
            } else {
                console.log('no session. Refreshing...')

            }
        }
        return () => { mtd = false }
    }, [])


    return (
        <div className="flex flex-col items-center justify-start w-full bg-gray-200 min-h-screen">
            {/* memoize the navbar */}
            <NavBar loggedIn={isLoggedIn} user={user} />

            <div className={"h-full w-full flex flex-col items-center " + (isFullWidth ? "" : "max-w-screen-2xl") + (classes && classes.length > 0 ? classes.join(" ") : "")}>
                {children}
            </div>

            {/* Footer */}

            <div className="w-full flex flex-col mt-12 h-auto">
                <div className="w-full max-h-min py-4 md:py-8 bg-gray-500">
                    <div className="flex flex-col gap-2 md:gap-4 items-between">
                        <div className="w-full md:w-[75%] lg:w-[60%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 p-2">
                            <div className="flex flex-col text-gray-200 gap-2 mb-2">
                                <h2 className='text-blue-50 font-semibold mt-4 md:mt-2 border-b border-gray-400'>Contacts</h2>
                                <Link href="tel:+254 20 2717077" className="t">+254-20-2717077</Link>
                                <Link href="mailto:kmhfl@health.go.ke" className="text-gray-200">kmhfl@health.go.ke</Link>
                                <Link href="https://servicedesk.health.go.ke/portal" className="text-gray-200">MOH Service Desk</Link>
                            </div>

                            <div className="flex flex-col gap-2 mb-2">
                                <h2 className='text-blue-50 font-semibold mt-4 md:mt-2 border-b border-gray-400'>Partners</h2>
                                <p className="text-gray-200">HealthIT</p>
                                <p className="text-gray-200">USAID</p>
                                <p className="text-gray-200">Ministry of Health</p>
                            </div>

                            <div className="flex flex-col text-gray-200 gap-2 mb-2">
                                <h2 className='text-blue-50 font-semibold mt-4 md:mt-2 border-b border-gray-400'>Quick Links</h2>
                                <div className='flex items-center gap-2'>
                                    <Link href="https://healthit.uonbi.ac.ke" className="text-gray-200 hover:underline">HealthIT</Link>
                                    <NorthEast className="text-gray-200 w-1 md:w-3 aspect-square" />
                                </div>

                                <div className='flex items-center gap-2'>
                                    <Link href="https://usaid.gov/kenya" className="text-gray-200 hover:underline">USAID</Link>
                                    <NorthEast className="text-gray-200 w-1 md:w-3 aspect-square" />
                                </div>

                                <div className='flex items-center gap-2'>
                                    <Link href="https://health.go.ke" className="text-gray-200 hover:underline">Ministry of Health</Link>
                                    <NorthEast className="text-gray-200 w-1 md:w-3 aspect-square" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full max-h-min py-5  bg-gray-700">
                    <div className='w-full md:w-[75%] lg:w-[60%] mx-auto max-h-min flex flex-col md:flex-row justify-between items-center py-4 px-2 gap-2'>
                        <p className='text-gray-400'>&copy; Copyright {new Date().getFullYear()}. All Rights Reserved. Republic of Kenya, Ministry of Health</p>
                        <p className='text-gray-400'>Version 3.0.1</p>
                    </div>
                </div>
            </div>
        </div>
    );
}