// import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../controllers/auth/auth'
import LoadingAnimation from './LoadingAnimation';
import HeaderLayout from './HeaderLayout';


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
        return <a href="/auth/login" className="bg-black hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-8 whitespace-nowrap py-2 rounded text-base font-semibold">Log in</a>
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
                        setIsLoggedIn(true)
                        setUser(usr)
                    }
                })
            } else {
                console.log('no session. Refreshing...')
            
            }
        }
        return () => { mtd = false }
    }, [])


    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <div className="w-full border-b border-gray-100 shadow-sm flex items-center justify-center lg:sticky lg:top-0 bg-white z-30">
                <HeaderLayout>

                </HeaderLayout>

            </div>
            <div className={"min-h-screen w-full flex flex-col items-center " + (isFullWidth ? "" : "max-w-screen-2xl") + (classes && classes.length > 0 ? classes.join(" ") : "")}>
                <>
                    {isLoading ? <div className="absolute inset-0 overflow-hidden bg-white opacity-90 z-20 flex items-center justify-center h-full">
                        <h3 className="text-2xl text-gray-800 font-bold">Loading...</h3>
                    </div> : children}
                </>
            </div>
            <footer className="bg-black py-5 items-center justify-center flex flex-wrap gap-y-3 gap-x-4 text-gray-300 text-sm w-full">
                <p>KMHFR V3 Beta</p>
                <span className="text-lg text-gray-400">&middot;</span>
                <a className="text-blue-300 hover:underline focus:underline active:underline hover:text-white focus:text-white active:text-white" href="https://health.go.ke" target="_blank" rel="noreferrer noopener">Ministry of Health</a>
                <span className="text-lg text-gray-400">&middot;</span>
                <a className="text-blue-300 hover:underline focus:underline active:underline hover:text-white focus:text-white active:text-white" href="https://healthit.uonbi.ac.ke" target="_blank" rel="noreferrer noopener">USAID HealthIT</a>
                <span className="text-lg text-gray-400">&middot;</span>
                <a className="text-blue-300 hover:underline focus:underline active:underline hover:text-white focus:text-white active:text-white" href="http://KMHFR.health.go.ke" target="_blank" rel="noreferrer noopener">KMHFL v2</a>
            </footer>
        </div>
    );
}