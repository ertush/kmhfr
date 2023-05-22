import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getUserDetails } from "../controllers/auth/public_auth";
import { checkToken } from '../controllers/auth/public_auth';

const Home = (props) => {


    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
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
                  usr.id == 6 ?  setIsLoggedIn(false) :setIsLoggedIn(true); setUser(usr);
                  
                }
              }
            );
          } else {
            console.log("no session. Refreshing...");
            // router.push('/auth/login')
          }
        }
    
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
    }, [])


    return (
        <>
            <Head>
                <title>KMHFL</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
           
            
                <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                    <div className="w-full grid grid-cols-2 gap-6 px-3 md:px-4 p-4 my-4 max-w-screen-lg mx-auto">
                        <div className="col-span-2 p-2 md:p-4 flex flex-col gap-4 items-center justify-center">
                            <h3 className="text-3xl font-medium text-black">Welcome to KMHFL</h3>
                            <p className="font-normal text-lg text-gray-900 text-left">
                                Kenya Master Health Facility List (KMHFL) is an application with all health facilities and community units in Kenya. Each health facility and community unit is identified with unique code and their details describing the geographical location, administrative location, ownership, type and the services offered.
                            </p>
                        </div>
                        <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                            <Link href="/facilities">
                                <span className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">Facilities</span>
                            </Link>
                            <p className="text-base">
                                This provides a list of all health facilities and there is a provided advanced search where you can refine your search.
                            </p>
                        </div>
                        <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                            <Link href="/community-units">
                                <span className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">Community Units</span>
                            </Link>
                            <p className="text-base">
                                This provides a list of all community health units and the system provided advance search where you can refine your search by using administrative units.
                            </p>
                        </div>
                        <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                            <Link href="/gis">
                                <span className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">GIS Explorer</span>
                            </Link>
                            <p className="text-base">
                                This visualizes administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
                            </p>
                        </div>
                        
                        <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                            <a href="https://mfl-api-docs.readthedocs.io/en/latest/" className="text-left w-full text-blue-800 hover:text-black focus:text-black active:text-black font-semibold text-xl">KMHFL API</a>
                            <p className="text-base">
                                This provides a RESTful API for developers to use. The documentation is available at <br /> <a className="text-blue-800 hover:underline focus:underline active:underline" href="https://mfl-api-docs.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://mfl-api-docs.readthedocs.io/en/latest</a>
                            </p>
                        </div>
                        <div className="col-span-2 md:col-span-1 border rounded-lg border-gray-300 shadow group hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                            <a className="font-semibold text-left text-xl w-full text-blue-800 hover:text-black focus:text-black active:text-black" href="https://elearning.health.go.ke" target="_blank" rel="noopener noreferrer">MoH Virtual Academy</a>
                            <p className="text-base">
                                You can learn all about KMHFL, its implementation and how to use it here (<a className="text-blue-800 hover:underline focus:underline active:underline" target="_blank" rel="noopener noreferrer" href="https://elearning.health.go.ke">https://elearning.health.go.ke</a>). Enrol and start learning.
                            </p>
                        </div>
                    </div>
                </MainLayout>
     
         
        </>
    )
}


Home.getInitialProps = async (ctx) => {

    // return {loggedIn: false, token: null}
    return checkToken(ctx.req, ctx.res, {username:process.env.NEXT_PUBLIC_CLIENT_USERNAME, password:process.env.NEXT_PUBLIC_CLIENT_PASSWORD})
		.then((t) => {
            console.log(t)
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
        return {loggedIn: false, token: token}
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