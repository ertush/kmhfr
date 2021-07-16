import { set } from 'cookie-cutter'
import Head from 'next/head'
import React from 'react'
import { logIn } from '../../controllers/auth/auth'

const Login = (props) => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(props.error)
    const [loading, setLoading] = React.useState(false)
    return (
        <div>
            <Head>
                <title>Log in | KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/assets/css/leaflet.css" />
            </Head>
            <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 flex flex-col gap-2 items-center justify-center p-3 md:p-0">
                <div className="w-full flex max-w-screen-sm">
                    <a className="text-green-800 text-lg font-medium hover:underline focus:underline active:underline" href="/">&larr; Back home</a>
                </div>
                <form className="bg-gradient-to-tl from-blue-500 via-green-500 to-green-800 w-full max-w-screen-sm rounded-md p-4 md:p-6 drop-shadow backdrop-filter flex flex-col items-center gap-4 md:gap-9 ">
                    <h1 className="text-center text-3xl font-black text-green-100">Log in</h1>
                    <div className="flex flex-col gap-0 w-full">
                        {error && error.length > 0 && <p className="text-red-900 bg-red-200 drop-shadow rounded py-1 normal-case text-base px-3">{error}</p>}
                    </div>
                    <div className="flex flex-col gap-0 w-full">
                        <label className="text-gray-100">Username</label>
                        <input type="email" value={username} onChange={ev=>{
                            setError('')
                            setUsername(ev.target.value)
                        }} className="text-gray-900 bg-gray-50 border border-gray-300 py-3 px-3 w-full flex items-center leading-none rounded" placeholder="you@geemail.com" />
                    </div>
                    <div className="flex flex-col gap-0 w-full">
                        <label className="text-gray-100">Password</label>
                        <input type="password" value={password} onChange={ev=>{
                            setError('')
                            setPassword(ev.target.value)
                        }} className="text-gray-900 bg-gray-50 border border-gray-300 py-3 px-3 w-full flex items-center leading-none rounded" placeholder="*********" />
                    </div>
                    <div className="flex flex-col gap-4 w-full text-center">
                        <button disabled={loading} className={"hover:text-black hover:bg-white focus:text-black focus:bg-white active:text-black active:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-8 whitespace-nowrap py-2 rounded text-xl font-semibold border-4 border-black "+(loading ? "bg-gray-700 cursor-not-allowed" : "bg-black")} onClick={ev=>{
                            setLoading(true)
                            setError('')
                            if(
                                (username && username.length > 0) &&
                                (password && password.length > 0)
                            ){
                                logIn(props.req, props.res, {username, password}, was).then(tkn_rst => {
                                    if(tkn_rst && tkn_rst.error){
                                        setError(tkn_rst.error)
                                    }else{
                                        setUsername('')
                                        setPassword('')
                                        setLoading(false)
                                        props.res.cookie('token', tkn_rst.token, {
                                            maxAge: tkn_rst.expires_in * 1000,
                                            httpOnly: true,
                                            secure: false,
                                            signed: true
                                        })
                                        props.res.redirect(props.was)
                                    }
                                    setLoading(false)
                                }).catch(err => {
                                    setLoading(false)
                                    setError(err)
                                })
                            }else{
                                setLoading(false)
                                setError('Please fill in all fields')
                            }
                        }}>{loading?"Loading...":"Log in"}</button>
                        <div className="flex justify-between items-center w-full px-2">
                            <a href="/" className="text-base text-green-100 hover:underline focus:underline active:underline">Forgot password?</a>
                            <a href="/" className="text-base  text-green-100 hover:underline focus:underline active:underline">Request account</a>
                        </div>
                    </div>
                </form>
            </div>
            {/* <div className="absolute inset-0 flex flex-co items-center justify-center bg-white/90">
                <div className="flex items-center flex-col justify-center">
                    <div className="text-4xl font-bold bg-gray-50/60 py-1 px-3 rounded-lg">Loading...</div>
                    <a href="/" className="text-blue-700">Cancel</a>
                </div>
            </div> */}
        </div>
    )
}

Login.getInitialProps = async (ctx) => {
    const was = ctx.query.was || '/'

    // checkToken(ctx.req, ctx.res, false).then(tkn_rst => {
    //     if (!tkn_rst || tkn_rst.error) {
    //         ctx.redirect('/')
    //     }
    // })
    return {
        'req':ctx.req,
        'res':ctx.res,
        'was': was,
        'error': ''
    }
}


export default Login
