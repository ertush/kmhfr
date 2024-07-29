import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import useSWR from 'swr'
import { checkToken } from '../controllers/auth/public_auth'
import { useSearchParams } from 'next/navigation'
import withAuth from '../components/ProtectedRoute'


function Logout (props) {
    const router = useRouter()

    const [isClient, setIsClient] = useState(false)

    const pageParams = useSearchParams()

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

   
    // console.log(process.env.TOKEN_URL.replace('token','revoke_token'))

    // const revokeToken = useSWR(`${process.env.TOKEN_URL.replace('token','revoke_token')}`,  
    // (url) => {
      
    // }
    // )

    
    useEffect(() => {

        setIsClient(true)

        console.log(props?.response?.error)

        // const cookieCutter = require('cookie-cutter')
        // cookieCutter.set('access_token', '', "{}", { expires: new Date(0), httpOnly: false })
      
        
                if (!data?.error && !data?.detail && props?.response) {
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
                        // window.localStorage.clear()  
                        router.replace(pageParams.get('previous_path'))


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


export async function getServerSideProps(ctx) {

    const token = (await checkToken(ctx?.req, ctx?.res))?.token

    const payload = {
        token: token,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }

    let response = null

    if(token) {
        response = await (await fetch(`${process.env.TOKEN_URL.replace('token','revoke_token')}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: JSON.stringify(payload)
        })).json()
    }


    console.log({response})
    


    return {
        props: {
            response
        }
    }
}

export default withAuth(Logout)

