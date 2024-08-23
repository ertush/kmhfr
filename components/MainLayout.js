// import Link from 'next/link'
// import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
// import { getUserDetails } from '../controllers/auth/auth'
// import LoadingAnimation from './LoadingAnimation';
import HeaderLayout from './HeaderLayout';
import Link from 'next/link'
import { NorthEast } from '@mui/icons-material';
import { Analytics } from '@vercel/analytics/react';
// import { useAlert } from 'react-alert';



export default function MainLayout({ children, searchTerm }) {

    
    const [isClient, setIsClient] = useState(false)

   
    useEffect(() => {
      setIsClient(true)
    }, [])


    if(isClient){
    return (
        <div className="flex flex-col items-center justify-start w-full bg-gray-200 min-h-screen gap-y-[150px]">
            
            <HeaderLayout {...searchTerm} />
            

            <div className={"h-full w-full flex flex-col py-5 items-center " }>
               
                { children }
                <Analytics />
            </div>

          {/* Footer */}

          <div className="w-full flex flex-col mt-12 h-auto">
            <div className="w-full max-h-min py-8  bg-gray-500">
              <div className="flex flex-col gap-4 items-between">
                <div className="md:w-[90%] w-full md:mx-auto flex justify-between p-4 md:p-0">
                  <div className="flex flex-col text-gray-200 md:gap-2 gap-1">
                    <h2 className='text-gray-50 font-semibold mb-2 '>Contacts</h2>
                    <Link href="tel:+254 20 2717077" className="t">+254-20-2717077</Link>
                    <Link href="mailto:kmhfl@health.go.ke" className="text-gray-200">kmhfl@health.go.ke</Link>
                    <Link href="https://servicedesk.health.go.ke/portal" className="text-gray-200"> servicedesk.health.go.ke/portal</Link>

                  </div>

                  <div className="flex-col md:flex hidden gap-2">
                    <h2 className='text-gray-50 font-semibold mb-2'>Partners</h2>
                    <p className="text-gray-200">HealthIT</p>
                    <p className="text-gray-200">USAID</p>
                    <p className="text-gray-200">Ministry of Health</p>
                  </div>

                  <div className="flex flex-col text-gray-200 md:gap-2 gap-1">
                    <h2 className='text-gray-50 font-semibold mb-2'>Quick Links</h2>
                    <div className='flex items-center gap-2'>
                    <NorthEast className="text-gray-200 w-3 aspect-square"/>
                    <Link href="https://healthit.uonbi.ac.ke" className="text-gray-200 hover:underline">HealthIT</Link>
                    </div>

                    <div className='flex items-center gap-2'>
                    <NorthEast className="text-gray-200 w-3 aspect-square"/>
                    <Link href="https://usaid.gov/kenya" className="text-gray-200 hover:underline">USAID</Link>
                    
                    </div>

                    <div className='flex items-center gap-2'>
                    <NorthEast className="text-gray-200 w-3 aspect-square"/>
                    <Link href="https://health.go.ke" className="text-gray-200 hover:underline">Ministry of Health</Link>
                    
                    </div>

                    <div className='flex items-center gap-2'>
                    <NorthEast className="text-gray-200 w-3 aspect-square"/>
                    <Link href="https://kmhfr-docs.vercel.app" className="text-gray-200 hover:underline">KMHFR Docs</Link>
                    
                    </div>
                  </div>
                </div>

                
              </div>

            </div>

            <div className="w-full max-h-min py-5 md:py-2  bg-gray-700">
              <div className='md:w-[90%] w-full md:mx-auto max-h-min flex flex-col justify-center md:flex md:justify-between items-center md:py-4 md:px-0 text-center p-2'>
                <p className='text-gray-400'>&copy; Copyright {new Date().getFullYear()}. All Rights Reserved. Republic of Kenya, Ministry of Health</p>
                <p className='text-gray-400'>Version 3.0.0</p>
              </div>
            </div>
          </div>

           
        </div>
    );
    } else {
      return null
    }
}