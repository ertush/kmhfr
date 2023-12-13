import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const Login = (props) => {
    const router = useRouter()
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [hidePassword, setHidePassword] = React.useState(true);
    const [error, setError] = React.useState(props.error)
    const [msg, setMsg] = React.useState(props.msg)
    const [loading, setLoading] = React.useState(false)
    const goSomewhere = where => router.push(where) // (where, reload) => reload ? router.reload(where) : router.push(where)
    return (
        <div>
            <Head>
                <title>Log in | KMHFR</title>
                <link rel="icon" href="/favicon.ico" />
              
            </Head>
            <div className="w-full h-screen overflow-hidden bg-gray-200 flex flex-col gap-2 items-center justify-center p-3 md:p-0">
                <div className="w-full flex flex-col max-w-screen-sm items-center justify-between px-2">
                    <div className="text-center text-5xl w-full font-black text-gray-700 flex justify-center gap-x-2 items-center h-24">
                        <img src="/MOH.png" className="h-24" alt="KMHFR 3" />
                        <div className='leading-none tracking-tight flex gap-x-2 justify-center items-center text-black font-bold relative'>
                            <span className="text-6xl leading-none top-0">KMHFR</span>
                            {/* <span className="text-sm bg-yellow-300 rounded-sm shadow border border-yellow-400 leading-none text-yellow-900 p-1 absolute -bottom-3 -right-4">
                            v3
                            </span> */}
                        </div>
                       
                    </div>
                    <div className="flex items-center justify-start w-full py-3">
                        <a className="text-blue-800 text-lg font-medium hover:underline focus:underline active:underline" href="/">&larr; Back home</a>
                    </div>
                </div>
                <form onSubmit={ev => {
                    ev.preventDefault()
                    setLoading(true)
                    setError('')
                    if (
                        (username && username.length > 0) &&
                        (password && password.length > 0)
                    ) {
                        return fetch('/api/login', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                username: username,
                                password: password
                            })
                        })
                            .then(r => r.json())
                            .then(rsp => {

                                if (rsp.error) {
                                    setLoading(false)
                                    setError(rsp.error)
                                } else if (rsp?.access_token || rsp?.token) {
                                    setLoading(false)
                                    setMsg('Log-in successful. Redirecting...')
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

                    className="bg-blue-50 w-full max-w-screen-sm p-4 md:p-6 drop-shadow backdrop-filter flex flex-col items-center gap-4 md:gap-6 shadow-lg border border-blue-50">

                    <h3 className="text-center leading-tight text-xl font-bold tracking-wide text-gray-800 uppercase">Log in</h3>
                    <div className="flex flex-col gap-0 w-full">
                        {error && error.length > 0 && <p className="text-red-900 bg-red-200 rounded drop-shadow py-2 font-medium normal-case text-base px-3">{error}</p>}
                        {msg && msg.length > 0 && <p className="text-blue-900 bg-blue-200 rounded drop-shadow py-2 font-medium normal-case text-base px-3">{msg}</p>}
                    </div>
                    <div className="flex flex-col gap-0 w-full">
                        <label className="text-gray-800">Email / Personal Number</label>
                        <input type="text"
                            data-testid="email_input"
                            autoComplete='username'
                            value={username}
                            onChange={ev => {
                                setError('')
                                setUsername(ev.target.value)
                            }}
                            className="border w-full py-3 px-3 leading-none border-blue-600 bg-transparent focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700" placeholder="user@domain.com" />
                    </div>
                    
                    <div className="flex-col gap-0 items-start w-full">
                    <label className="text-gray-800" htmlFor='password'>Password</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 right-0 flex items-center px-2" onChange={e => {
                            setHidePassword(e.target.checked)
                        }}>
                        <input className="hidden js-password-toggle" id="toggle" type="checkbox" />
                        <label className="  px-2 py-1 cursor-pointer js-password-label" htmlFor="toggle">
                            {   
                                !hidePassword &&
                                <EyeOffIcon className='w-5 h-5 text-gray-600'></EyeOffIcon>
                            }
                            {
                                hidePassword &&
                                <EyeIcon className='w-5 h-5 text-gray-600'></EyeIcon>
                        
                            }
                            
                        </label>
                        </div>
                           

                        <input  
                        data-testid="password_input"
                        onChange={ev => {
                            setError('')
                            setPassword(ev.target.value)
                        }}
                        value={password} 
                        autoSave='on'
                        autoComplete='current-password'
                        aria-autocomplete='inline'
                        className="border w-full py-3 px-3 leading-none border-blue-600 bg-transparent focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16" name="password" type={hidePassword ? 'password' : 'text'} 
                        />
                    </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full text-center">
                        <button type="submit" data-testid="login_btn" disabled={loading} className={"focus:outline-none focus:ring-1 focus:ring-yellow-500 text-white px-4 md:px-8 whitespace-nowrap py-3 text-xl font-semibold hover:bg-blue-800 focus:bg-blue-600 active:bg-blue-800 " + (loading ? "bg-gray-900 cursor-not-allowed" : "bg-blue-700")}
                        >{loading ? "Loading..." : "Log in"}</button>
                        <div className="flex justify-end items-center w-full px-2">
                            <a data-testid="forgot_password_link" onClick={()=>router.push('/auth/reset_password')} className="text-base text-gray-700 hover:text-blue-700 focus:text-blue-700 active:text-blue-700 hover:underline focus:underline active:underline">Forgot password?</a>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

Login.getInitialProps = async (ctx) => {
    const was = ctx.query.was || '/'
    const err = ctx.query.err || ''
    const msg = ctx.query.msg || ''
    return {
        'was': was,
        'error': err,
        'msg': msg
    }
}


export default Login
