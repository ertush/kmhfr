


import { useRouter } from 'next/router'
import { getUserDetails } from "../controllers/auth/auth"

export default function withAuth(Component) {
    return  function (props) {
        
        const router = useRouter()
        // const isLoggedIn = useContext(IsUserLoggedInCtx)

        // Check If current User is public user

        console.log({props})


        getUserDetails(props?.token, `${process.env.NEXT_PUBLIC_API_URL}/rest-auth/user/`)
        .then(async user => {

        if(user && user?.id == 6) {
             
          return router.push('/auth/login')
         
        }
      })
    
        return <Component {...props}/>
    }

   
    
  }