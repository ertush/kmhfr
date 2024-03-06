import MainLayout from '../../../components/MainLayout';
import Image from 'next/image';
import { useEffect, useState } from 'react'


export default function FAQs() {

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    },[]) 

    if(isClient) {
    return (
        
      <MainLayout>
       <div  className='w-[80%] mx-auto flex flex-col items-start gap-2 mt-8 md:mt-[100px]'>
        <h1 className='text-gray-600 opacity-80 duration-200 ease-in-out font-semibold text-4xl'>FAQs</h1>
        <hr className='w-[50px] h-2 opacity-80 bg-blue-600'></hr>
      </div>

      {/* Body */}
      <div className="w-[80%] mx-auto md:mt-6 mt-8 h-full flex flex-col gap-y-5 md:gap-y-12 ">
                    <div className='flex  w-full flex-col gap-2'>

                        <h2 className='md:text-3xl text-2xl text-gray-500 font-semibold'>
                            WHAT'S A HEALTH FACILITY? 
                        </h2>
                        <p className='text-lg text-justify text-black'>
                          This is a defined health service delivery structure that provides services and has one or more departments operating within it e.g. Outpatient, pharmacy, laboratory . In KMHFL, a facility is described by it’s unique code, ownership, type, administrative and geographical location, and services provided.
                         </p>
                    </div>

                    <div className='flex flex-col w-full gap-2'>
                        <h2 className='md:text-3xl text-2xl w-full text-gray-500 font-semibold'>
                         WHAT'S A STAND-ALONE HEALTH FACILITY? 
                        </h2>
                        <p className='text-lg text-justify text-black'>
                        A stand-alone health facility is a type of facility that offers services to complement the facilities offering consultative and curative services 
                         </p>
                    </div>

                    <div className='flex flex-col w-full gap-2'>
                        <h2 className='md:text-3xl text-2xl text-gray-500 font-semibold'>
                        WHAT'S A COMMUNITY HEALTH UNIT?
                        </h2>
                        <p className='text-lg text-justify text-black'>
                        This is a health service delivery structure within a defined geographical area covering a population of approximately 5,000 people. Each unit is assigned 5 Community Health Extension Workers (CHEWs) and community health volunteers who offer promotive, preventative and basic curative health services. These are governed by a Community Health Committee (CHC) and each Community Health unit is linked to a specific Health facility.  
                         </p>
                    </div>
         </div>
      </MainLayout>

    )
    } else {
        return null
    }
}