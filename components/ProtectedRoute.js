


import { useRouter } from 'next/router'
// import { getUserDetails } from "../controllers/auth/auth"
// import cookies from 'next-cookies'
// import cookieCutter from 'cookie-cutter'
import { /*useEffect, useState,*/ useContext} from 'react'
import {UserContext} from '../providers/user'

export default function withAuth(Component) {

    

    return  function (props) {
        
        const router = useRouter()

        // const [token, setToken] = useState(null)

        const userCtx = useContext(UserContext)

        // useEffect(() => {
        //   if(window && window.document.cookie) {
        //     setToken(
        //     // window.document.cookie.split("access_token=")[1].split(";")[0]

        //       JSON.parse(window.document.cookie.split('=')[1])?.token ?? props?.token
        //     )
        //   }
        // },[])
        
        if(userCtx && userCtx?.id == 6) {
              router.push('/auth/login')
              return null
        }
    //   else {
    //     getUserDetails(token, `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`)
    //     .then(async user => {

    //     if(user && user?.id == 6) {
             
    //        router.push('/auth/login')
    //        return null
         
    //     }
    //   })
    // }
    
        return <Component {...props}/>
    }

   
    
  }