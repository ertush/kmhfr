import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import MainLayout from '../components/MainLayout'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { getUserDetails } from "../controllers/auth/public_auth";
import { checkToken } from '../controllers/auth/public_auth';
import LogoutIcon from '@mui/icons-material/Logout';
import { DelayedLoginButton } from '../components/HeaderLayout'
import { Menu } from "@headlessui/react";
import { Login } from '@mui/icons-material'


function Home(props) {


    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [_, setUser] = useState(null);
    const[isClient, setIsClient] = useState(null);

    const mohRef = useRef(null)

    let API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // if(is_user_logged_in) router.push('/dashboard')

    useEffect(() => {


      let mtd = true;
      if (mtd) {
        let is_user_logged_in =
          (typeof window !== "undefined" &&
            window.document.cookie.indexOf("access_token=") > -1) ||
          false;
        let session_token = null;
        if (is_user_logged_in) {
          session_token = JSON.parse(
            window.document.cookie.split("access_token=")[1].split(";")[0]
          );
        }

        if (
          is_user_logged_in &&
          typeof window !== "undefined" &&
          session_token !== null
        ) {
        

          getUserDetails(session_token.token, `${API_URL}/rest-auth/user/`).then(
            (usr) => {
          
              if (usr.error || usr.detail) {
                setIsLoggedIn(false);
                setUser(null);
              } else {
                usr.id == 6 ?  setIsLoggedIn(false) : setIsLoggedIn(true); 
                setUser(usr);
                
              }
            }
          );
        } else {
          console.log("no session. Refreshing...");
          // router.push('/auth/login')
        }
      }

      setIsClient(true)

      return () => {
        mtd = false;
      };
    }, []);
    
   
  

    useEffect(() => {    
        let mtd = true
       

        if (mtd) {
            isLoggedIn? router.push('/dashboard') : router.push('/')
        }

        return () => {
            mtd = false
        }
    }, [isLoggedIn])


    function animateValue(event, start, end, duration) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        event.target.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }


    



    if(isClient){

      return (
        <>
            <Head>
                <title>KMHFR - Home</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
          <div className="w-full h-screen overflow-y-scroll flex flex-col">
            {/* Logo And Title */}
             <div className='w-full fixed z-10 max-h-min bg-gray-100 flex'>
                {/* Heading */}
                <div style={{width:"60%"}}  className="max-h-min container flex   mx-auto ">
                  {/* Heading */}
                  <div className='w-full flex justify-between py-4 max-h-min '>
                    <div className='flex gap-6 items-center'>
                    {/* Logo */}
                    <a
                    href="/"
                    className="leading-none tracking-tight flex justify-center items-center text-black font-bold relative"
                  >

                    <Image src="/moh_court_of_arms.png" alt="logo" height="56" width="85"  />
                  
                  </a>

                    {/* Title */}
                    
                    <h2 style={{color: '3#1651b6'}} className=' leading-4 font-semibold text-xl uppercase'>Kenya Master Health Facility Registry</h2>
                    </div>

                    {/* Login Button */}
                    <div className='text-lg group hover:bg-blue-800 hover:text-gray-100 max-h-min px-3 flex gap-x-2 items-center text-blue-800 capitalize font-semibold'>
                      <Login className='w-6 h-6 text-blue-800 group-hover:text-gray-100' />
                      <Link href="/auth/login">
                        log in
                      </Link>
                    </div>
                    
                    {/* {isLoggedIn ? (
            <div className="flex flex-wrap items-center gap-3 md:gap-5 px-2 md:flex-grow justify-end">
              <Menu as="div" className="relative p-2" >
                <Menu.Button
                  as="div"
                  className="flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="leading-none p-0 inline sm:hidden">
                    <UserCircleIcon className="h-6 w-6" />
                  </span>
                  <span className="leading-none p-0 hidden sm:inline">
                    {user.full_name || "My account"}
                  </span>
                  <span className="leading-none p-0">
                    <ChevronDownIcon className="h-4 w-5" />
                  </span>
                </Menu.Button>
                <Menu.Items
                  as="ul"
                  style={{backgroundColor:"#eff6ff", color: "black", outline:'none'}}
                  className="list-none shadow-md flex flex-col items-center justify-start gap-2 p-3 absolute mt-3 bg-black right-0 text-white w-40 "
                >

                  <Menu.Item as="li" className="flex items-center w-full ">
                    {({ active }) => (
                      <button
                        className={`w-full hover:text-blue-600 font-medium cursor-pointer flex items-center ${active && "text-blue-400"
                          }`}
                      onClick={() => router.push('/account')}
                      >
                      
                      <AccountCircleOutlinedIcon fontSize="small"/> &nbsp; Profile
                      
                      </button>
                    )}
                  </Menu.Item>
                
                  <Menu.Item
                    as="li"

                    className="flex items-center w-full gap-1 mt-2 border-t border-gray-300 py-2"
                  >
                    {({ active }) => (
                      <a
                        data-testid="logout"
                        className={`w-full hover:text-blue-600 font-medium ${active && "text-blue-400"
                          }`}
                        href="/logout"
                      >
                      <LogoutIcon /> &nbsp; Log out
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
                    ) : (
                      <DelayedLoginButton />
                    )} */}

                  </div>
                  

                  

                </div>

             </div>
            {/* Menu Heading */}
             <div style={{backgroundColor: '#1651b6', top:'88px'}} className='w-full fixed z-10 max-h-min flex'>
                {/* Menu Heading */}
                <nav style={{width:"60%"}} className="max-h-min container flex  mx-auto ">
                  <ul className='list-none w-full flex items-center py-4 justify-between '>
                    <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                      <Link href='/public/facilities'>Facilities</Link>
                    </li>
                    <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                      <Link href='/public/cu'>Community Units</Link>
                    </li>
                    <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                      <Link href='/public/faq'>FAQs</Link>
                    </li>
                    <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                      <Link href='/public/contacts'>Contacts</Link>
                    </li>
                  </ul>
                </nav>
             </div>
            {/* Hero Section */}
            <div style={{height:'100vh'}} className='w-full mb-24'>
             <div className='w-full  relative' style={{
              height: '85vh',
              backgroundImage: "url('/assets/css/images/moh_lab.jpg')",
              backgroundBlendMode: "darken",
              backgroundSize: "cover",
            
             }}>  
              <div className='w-full h-full bg-gray-900 opacity-60 absolute inset-0'></div> 
                <div style={{left: '20%', width: '70%'}} className='absolute top-1/4 h-auto flex-col items-start '>
                  <h1 style={{fontWeight: '800'}} className="text-6xl text-wrap text-gray-100 font-extrabold">Discover <span className='text-blue-500'>Health Facilities</span> and <span className='text-blue-500'>Community Health Units</span> Near You</h1>
                  <h4 className='text-lg mt-4 text-gray-100 capitalize'>the Official registry of health facilities and Community units in kenya</h4>
                </div>  


                <div style={{width:"60%", left:"20%", bottom:"30%"}} className='absolute h-auto bg-gray-200 bg-opacity-40 p-5 flex place-content-center'>
                    <form className='w-full bg-gray-100 flex'>
                      <input placeholder="Search for a facility" className=' w-full border-none h-12 p-3 outline-none placeholder-gray-500' />
                      <button type="submit" className='py-2 px-3 bg-blue-600 text-gray-100 font-semibold '>search</button>
                    </form>
                </div>


                <div style={{bottom:"-9%", left:"20%", width:"60%"}} className="absolute h-auto grid grid-cols-4 place-content-center gap-6">
                  <div style={{backgroundColor: '#1651b6'}} className='h-36 aspect-square  rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                    <h2 className="text-lg font-semibold text-gray-100">Ministy of Health</h2>
                    <h1 ref={mohRef} id="moh_owner_counter" onMouseOver={e => animateValue(e, 0, 34, 1000)}  className="text-5xl font-bold text-gray-100">34</h1>
                  </div>
                  
                  <div style={{backgroundColor: '#1651b6'}} className='h-36 aspect-square  rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                    <h2 className="text-lg font-semibold text-gray-100">Private</h2>
                    <h1 id="private_owner_counter" onMouseOver={e => animateValue(e, 0, 30, 1000)} className="text-5xl font-bold text-gray-100">30</h1>
                  </div>

                  <div style={{backgroundColor: '#1651b6'}} className='h-36 aspect-square  rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                    <h2 className="text-lg font-semibold text-gray-100">Faith Based</h2>
                    <h1 id="faith_based_owner_counter" onMouseOver={e => animateValue(e, 0, 64, 1000)} className="text-5xl font-bold text-gray-100">64</h1>
                  </div>

                  <div style={{backgroundColor: '#1651b6'}} className='h-36 aspect-square rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                    <h2 className="text-lg font-semibold text-gray-100">Non Govermental</h2>
                    <h1 id="non_gov_owner_counter" onMouseOver={e => animateValue(e, 0, 14, 1000)} className="text-5xl font-bold text-gray-100">14</h1>
                  </div>

                </div>


              
                {/* <div class="w-full h-full bg-blue-500 absolute top-[400px] z-10"></div>*/}

                {/* <Image quality={80} class="overflow-hidden absolute inset-0" src="/assets/css/images/moh_lab.jpg" style={{objectFit: "cover"}} width={1900} height={700} alt="Hero Image" />                  */}
             </div>
             </div>
            
            {/* Body */}
            <div style={{width:'60%'}} className='h-auto mx-auto flex mt-12  gap-4'>
              <Image src="/assets/css/images/distribution_map.png" width="1200" height="1200" />
              <p className="text-base text-justify">
              This visualizes administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
              </p>
            </div>


            {/* Footer */}
              
              {/* <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                  <div className="w-full grid grid-cols-2 gap-6 px-3 md:px-4 p-4 my-4 max-w-screen-lg mx-auto">
                      <div className="col-span-2 p-2 md:p-4 flex flex-col gap-4 items-center justify-center">
                          <h3 className="text-5xl font-medium text-black">Welcome to KMHFR</h3>
                          <p className="font-normal text-lg text-gray-900 text-left">
                              Kenya Master Health Facility List (KMHFR) is an application with all health facilities and community units in Kenya. Each health facility and community unit is identified with unique code and their details describing the geographical location, administrative location, ownership, type and the services offered.
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <Link href="/facilities">
                              <span className="tex3t-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">Facilities</span>
                          </Link>
                          <p className="text-base">
                              This provides a list of all health facilities and there is a provided advanced search where you can refine your search.
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <Link href="/community-units">
                              <span className="tex3t-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">Community Units</span>
                          </Link>
                          <p className="text-base">
                              This provides a list of all community health units and the system provided advance search where you can refine your search by using administrative units.
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <Link href="/gis">
                              <span className="tex3t-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">GIS Explorer</span>
                          </Link>
                          <p className="text-base">
                              This visualizes administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
                          </p>
                      </div>
                      
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <a href="https://mfl3-api-docs.readthedocs.io/en/latest/" className="text-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">KMHFR API</a>
                          <p className="text-base">
                              This provides a RESTful API for developers to use. The documentation is available at <br /> <a className="text-blue-700 group-hover:underline group-hover:text-gray-50 focus:underline active:underline" href="https://mfl-api-docs.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://mfl-api-docs.readthedocs.io/en/latest</a>
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <a className="font-s3emibold text-left text-xl w-full cursor-pointer group-hover:text-white focus:text-black active:text-black" href="https://elearning.health.go.ke" target="_blank" rel="noopener noreferrer">MoH Virtual Academy</a>
                          <p className="text-base">
                              You can learn all about KMHFR, its implementation and how to use it here (<a className="text-blue-700 group-hover:underline group-hover:text-white focus:underline active:underline" target="_blank" rel="noopener noreferrer" href="https://elearning.health.go.ke">https://elearning.health.go.ke</a>). Enrol and start learning.
                          </p>
                      </div>
                  </div>
              </MainLayout> */}
      
          
          </div>
          </>
      )
    }
    else
    {
      return null
    }
}



export async function getServerSideProps(ctx) {

    // return {loggedIn: false, token: null}
    return  checkToken(ctx.req, ctx.res, {username:process.env.NEXT_PUBLIC_CLIENT_USERNAME, password:process.env.NEXT_PUBLIC_CLIENT_PASSWORD})
		.then((t) => {
            console.log(t)
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
        return {props: {loggedIn: false, token: token}}
				// return fetchData(token).then((t) => t);
			}
		})
		.catch((err) => {
			console.log('Error checking token: ', err);
			if (typeof window !== 'undefined' && window) {
				if (ctx?.asPath) {
					window.location.href = ctx?.asPath;
				} else {
					window.location.href = '/';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/',
					current_url: '',
				};
			}, 1000);
		});

}

export default Home