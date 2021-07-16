import Head from 'next/head'
import React from 'react'

const Login = (props) => {
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
                    <div class="flex flex-col gap-0 w-full">
                        <label className="text-gray-100">Username</label>
                        <input type="email" className="text-gray-900 bg-gray-50 border border-gray-300 py-3 px-3 w-full flex items-center leading-none rounded" placeholder="you@geemail.com" />
                    </div>
                    <div class="flex flex-col gap-0 w-full">
                        <label className="text-gray-100">Password</label>
                        <input type="password" className="text-gray-900 bg-gray-50 border border-gray-300 py-3 px-3 w-full flex items-center leading-none rounded" placeholder="*********" />
                    </div>
                    <div class="flex flex-col gap-4 w-full text-center">
                        <button className="bg-black hover:text-black hover:bg-gray-300 focus:text-black focus:bg-gray-300 active:text-black active:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-8 whitespace-nowrap py-3 rounded text-xl font-semibold" type="submit">Log in</button>
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
    return {
        'ctx': 1
    }
}


export default Login
