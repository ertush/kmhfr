import MainLayout from '../../../components/MainLayout';
import Image from "next/legacy/image";
import { useEffect, useState } from 'react'


export default function About() {

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    },[]) 

    if(isClient) {
    return (
        
      <MainLayout>
        <div  className='w-[80%] mx-auto  flex flex-col items-start gap-2 mt-8 md:mt-[100px]'>
        <h1 className='text-gray-600 opacity-80 duration-200 ease-in-out font-semibold text-4xl'>About</h1>
        <hr className='w-[50px] h-2 opacity-80 bg-blue-600'></hr>
      </div>

      {/* Body */}
      <div className='h-auto items-start w-[80%] mx-auto flex-col mt-12 gap-3 '>

        <p className="text-lg">Kenya Master Health Facility Registry (KMHFR) is an application with all health facilities and community units in Kenya. Each health facility and community unit is identified with unique code and their details describing the geographical location, administrative location, ownership, type and the services offered. </p>

       <div className="h-auto w-full flex flex-col items-start mt-8 gap-8"> 
       <div className="flex flex-col gap-4 md:flex-row md:justify-between w-full">
        <Image src="/assets/css/images/distribution_map.png" objectFit="contain" width="400" height="400" />
        <Image src="/assets/css/images/public_health_facilities_map.png" objectFit="contain" width="400" height="400" />
        <Image src="/kenya_geo_map.png" objectFit="contain" width="400" height="400" />
       </div>     
          <div className="md:grid md:grid-cols-2 md:gap-x-8 flex flex-col gap-y-4 mt-8 h-full md:gap-y-24">
            <p className="text-lg text-justify relative">
              <h1>1.</h1>
              {/* <h1 className="text-8xl absolute text-gray-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">1</h1> */}
              Users can view administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
            </p>

            <p className="text-lg text-justify relative">
              <h1>2.</h1>

              {/* <h1 className="text-8xl absolute text-gray-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">2</h1> */}
              KMHFR provides a list of all health facilities which comes with an advanced search where you can refine your search.
            </p>

            <p className="text-lg text-justify relative">
             <h1>3.</h1>

              {/* <h1 className="text-8xl absolute text-gray-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">3</h1> */}
              The system provides a list of all community health units along side an advance search where you can refine your search by using administrative units.
            </p>

            <p className="text-lg text-justify relative">
            <h1>4.</h1>

              {/* <h1 className="text-8xl absolute text-gray-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">4</h1> */}
              KMHFR provides a RESTful API for developers to use. The documentation is available at <br /> <a className="text-gray-700 group-hover:underline group-hover:text-gray-50 focus:underline active:underline" href="https://mfl-api-docs.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://mfl-api-docs.readthedocs.io/en/latest</a>
            </p>

            <p className="text-lg text-justify relative">
            <h1>5.</h1>

              {/* <h1 className="text-8xl absolute text-gray-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">5</h1> */}
              To learn all about KMHFR, its implementation and how to use it here (<a className="text-gray-700 group-hover:underline group-hover:text-white focus:underline active:underline" target="_blank" rel="noopener noreferrer" href="https://elearning.health.go.ke">https://elearning.health.go.ke</a>). Enrol and start learning.
            </p>
          </div>
        </div>




      </div>
      </MainLayout>

    )
    } else {
        return null
    }
}