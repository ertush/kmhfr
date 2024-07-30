import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const ResetPassword = (props) => {
    
    const router = useRouter()
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState(props.error)
    const [msg, setMsg] = React.useState(props.msg)
    const [loading, setLoading] = React.useState(false)
    const goSomewhere = where => router.push(where) // (where, reload) => reload ? router.reload(where) : router.push(where)
    return (
        <div>
            <Head>
                <title>Reset Password | KMHFR</title>
                <link rel="icon" href="/favicon.ico" />
               
            </Head>
            <div className="w-full h-screen overflow-hidden bg-gray-50 flex flex-col gap-2 items-center justify-center p-3 md:p-0">
                <div className="w-full flex flex-col max-w-screen-sm items-center justify-between px-2">
                    <div className="text-center text-5xl w-full font-black text-gray-700 flex justify-center gap-x-2 items-center">
                        <img src="/MOH.png" className="h-16" alt="KMHFR 3" />
                        <span>KMHFR-v3</span>
                    </div>
                    <div className="flex items-center justify-start w-full py-3">
                        <a className="text-gray-800 text-lg font-medium hover:underline focus:underline active:underline" href="/">&larr; Back home</a>
                    </div>
                </div>
                <form onSubmit={ev => {
                    ev.preventDefault()
                    setLoading(true)
                    setError('')
                    if (
                        (email && email.length > 0) 
                    ) {
                        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/rest-auth/password/reset/`, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                email: email,
                            })
                        })
                            .then(r => r.json())
                            .then(rsp => {
                                console.log(rsp)
                                if (rsp.detail) {
                                    setLoading(false)
                                    setError(rsp.detail ||rsp.detail[0])
                                } else if (rsp?.access_token || rsp?.token) {
                                    setLoading(false)
                                    setMsg('Reset successful. Redirecting...')
                                    setTimeout(() => {
                                        goSomewhere(props.was)
                                    }, 2000);
                                } else {
                                    setError(error)
                                    setLoading(false)
                                }
                                return false
                            }).catch(err => {
                                setLoading(false)
                                setError(err.message)
                                return false
                            })

                    } else {
                        setLoading(false)
                        setError('Please fill in all fields')
                        return false
                    }
                }}

                    className="bg-white w-full max-w-screen-sm rounded-md p-4 md:p-6 drop-shadow backdrop-filter flex flex-col items-center gap-4 md:gap-6 ">

                    <h3 className="text-center leading-tight text-xl font-bold tracking-wide text-gray-800 uppercase">Request Password Reset</h3>
                    <div className="flex flex-col gap-0 w-full">
                        {error && error.length > 0 && <p className="text-red-900 bg-red-200 drop-shadow rounded py-2 font-medium normal-case text-base px-3">{error}</p>}
                        {msg && msg.length > 0 && <p className="text-gray-900 bg-blue-200 drop-shadow rounded py-2 font-medium normal-case text-base px-3">{msg}</p>}
                    </div>
                    <div className="flex flex-col gap-0 w-full">
                        <label className="text-gray-800">Email address</label>
                        <input type="email"
                            value={email}
                            onChange={ev => {
                                setError('')
                                setEmail(ev.target.value)
                            }}
                            className="text-gray-900 bg-gray-50 border border-gray-300 py-3 px-3 w-full flex items-center leading-none rounded" placeholder="you@geemail.com" />
                    </div>
                   
                    <div className="flex flex-row gap-4 w-full text-center">
                        <button type="submit" disabled={loading} className={"focus:outline-none focus:ring-1 focus:ring-yellow-500 text-white px-4 md:px-8 whitespace-nowrap py-3 rounded text-xl font-semibold hover:bg-blue-800 focus:bg-blue-600 active:bg-blue-800 " + (loading ? "bg-gray-900 cursor-not-allowed" : "bg-blue-700")}
                        >{loading ? "Loading..." : "Send Request"}</button> 
                        <button className='flex justify-end items-center focus:outline-none focus:ring-1 focus:ring-yellow-500 text-black px-4 md:px-8 whitespace-nowrap py-3 rounded text-xl font-semibold hover:bg-gray-400 focus:bg-grey-400 active:bg-grey-400 ' 
                        onClick={()=>router.push('/auth/login')}
                        >Cancel</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

ResetPassword.getInitialProps = async (ctx) => {
    const was = ctx.query.was || '/'
    const err = ctx.query.err || ''
    const msg = ctx.query.msg || ''
    return {
        'was': was,
        'error': err,
        'msg': msg
    }
}


export default ResetPassword
