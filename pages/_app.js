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
  const  { Component, pageProps } = props


  useEffect(() => {
    router.events.on('routeChangeStart', () => {setIsNavigating(true)}); 
    router.events.on('routeChangeComplete', () => {setIsNavigating(false)}); 
    router.events.on('routeChangeError', () => {setIsNavigating(false)});  

  }, [])

//  console.log({pageProps, ctx})
  return (
    
    <Provider template={AlertTemplate} {...options}>
      <UserContext.Provider value={(() => {
          let user
          if (typeof window !== "undefined") {
                
                user = JSON.parse(window.localStorage.getItem('user'))
          }
          
        return user
        
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
     
    </Provider>
  )
  
}



