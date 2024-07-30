


import { useRouter } from 'next/router'
import { getUserDetails } from "../controllers/auth/auth"
// import cookies from 'next-cookies'
// import cookieCutter from 'cookie-cutter'
import { useEffect, useState } from 'react'

export default function withAuth(Component) {

    

    return  function (props) {
        
        const router = useRouter()

        const [token, setToken] = useState(null)

        useEffect(() => {
          if(window && window.document.cookie) {
            setToken(
              JSON.parse(window.document.cookie.split('=')[1])?.token
            )
          }
        },[])
        /

        getUserDetails(token ?? props?.token, `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`)
        .then(async user => {

        if(user && user?.id == 6) {
             
          return router.push('/auth/login')
         
        }
      })
    
        return <Component {...props}/>
    }

   
    
  }