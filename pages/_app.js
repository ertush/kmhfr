import 'tailwindcss/tailwind.css'
import '/assets/css/style.css';
import '../public/assets/css/global.css';

import { useRouter } from 'next/router';
import { positions, Provider } from "react-alert";
import { PermissionContext } from '../providers/permissions';
import { UserGroupContext } from '../providers/userGroup';
import { UserContext } from '../providers/user';
import AlertTemplate from "react-alert-template-basic";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
// import { getUserDetails } from "../controllers/auth/public_auth";
import { IsUserLoggedInCtx } from '.';

function LoadAnimation({open}) {
  return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}  
      >
        <CircularProgress color="inherit" />
      </Backdrop>
  )
}


const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT
};



export default function App(props) {
 
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState(null);

 
  const  { Component, pageProps } = props


  useEffect(() => {

    router.events.on('routeChangeStart', () => {setIsNavigating(true)}); 
    router.events.on('routeChangeComplete', () => {setIsNavigating(false)}); 
    router.events.on('routeChangeError', () => {setIsNavigating(false)}); 

    
    // if(Number(userID) !== 6) {
    //   // window.localStorage.removeItem('user')
    //   // window.localStorage.clear()
    //   router.push('/logout')

    // }

    let mtd = true;


    // function initializePage() {

      //  const API_URL = process.env.NEXT_PUBLIC_API_URL;
       
      //  console.log(router.asPath)

      if (mtd) {

        // console.log(' Checking if user is logged in ..')
       
        // if (typeof window !== "undefined") {
            

          // }

        // (typeof window !== "undefined" && window.document.cookie.indexOf("access_token=") > -1) || false;

        
        // let session_token = null;

        // if (is_user_logged_in) {
        //   session_token = JSON.parse(
        //     window.document.cookie.split("access_token=")[1].split(";")[0]
        //   );
        // }
  
        // if (
        //     // !is_user_logged_in
        //     typeof window == "undefined" &&
        //     session_token == null
        
        // ) {
        //   console.log('Fetching User....')
        //   getUserDetails(session_token.token, `${API_URL}/rest-auth/user/`).then(
        //     (usr) => {
  
        //       if (usr.error || usr.detail) {
        //         setIsLoggedIn(false);
        //         setUser(null);
        //       } else {
                
        //         if(usr.type !== undefined) {
        //            console.log({usr})
        //            usr.type == 6  ? setIsLoggedIn(false) : setIsLoggedIn(true);
        //         }
  
        //         setUser(usr);
  
        //       }
        //     }
        //   );
        // } else {

        //   console.log("no session. Refreshing...");
        //   // router.push('/auth/login')
        // }
      }
    // }

  //  initializePage()
    
    // Logout after 20 mins of inactivity
    const time = 60 * 1000 * 20
    const timeOut = setTimeout(() => {
      router.push('/logout')
    }, time)

    return () =>  {
      mtd = false
      clearTimeout(timeOut)
    }
  }, [])

//  console.log({pageProps, ctx})
  return (
    
    <Provider template={AlertTemplate} {...options}>
      <IsUserLoggedInCtx.Provider value={
        (() => {
        if (typeof window !== "undefined") {
          
            const _user = JSON.parse(window.localStorage.getItem('user'))

            console.log({_user})

            if(_user && _user?.id !== 6) {
                return true
            } else {
              return false
            }
        }
        })()
      }>
        <UserContext.Provider value={(() => {
           
        if (typeof window !== "undefined") {
                
          return  JSON.parse(window.localStorage.getItem('user'))     

        }
        })()}>

          <UserGroupContext.Provider value={(() => {
            let userGroup
            if (typeof window !== "undefined") {
                  //  userGroup = JSON.parse(window.sessionStorage.getItem('user'))?.groups[0]?.name
                  userGroup = JSON.parse(window.localStorage.getItem('user'))?.groups[0]?.name
          }
            return userGroup
          })()}>

          <PermissionContext.Provider value={(() => {
            let userPermissions
            if (typeof window !== "undefined") {
                  // userPermissions = JSON.parse(window.sessionStorage.getItem('user'))?.all_permissions
                  userPermissions = JSON.parse(window.localStorage.getItem('user'))?.all_permissions
          }

          return userPermissions  

          })()}>
            {
              isNavigating && <LoadAnimation open={true} />
            }
            <Component {...pageProps} />
          
          </PermissionContext.Provider>

          </UserGroupContext.Provider>
        </UserContext.Provider>
      </IsUserLoggedInCtx.Provider>
     
    </Provider>
  )
  
}



