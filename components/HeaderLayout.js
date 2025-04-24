import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronDownIcon
} from "@heroicons/react/solid";
import { UserCircleIcon } from "@heroicons/react/outline";
import React, { useState, useEffect, useContext } from "react";
import { Menu } from "@headlessui/react";
// import { getUserDetails } from "../controllers/auth/auth";
import LoadingAnimation from "./LoadingAnimation";

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { UserContext } from "../providers/user";
import Image from "next/legacy/image";
import Head from 'next/head'
import { CloseOutlined, Login, Logout } from '@mui/icons-material'
// import Select from 'react-select'
import Backdrop from '@mui/material/Backdrop';
import { CancelRounded } from '@mui/icons-material'
import { Menu as MenuIcon } from '@mui/icons-material'
// import { groupBy } from "underscore";
import { IsUserLoggedInCtx } from "../pages";


export function DelayedLoginButton() {


  const [delayed, setDelayed] = useState(false);

  useEffect(() => {

    let mtd = true;
    setTimeout(() => {
      if (mtd === true) {
        setDelayed(true);
      }
    }, 1000);
    return () => {
      mtd = false;
    };
  }, []);

  if (delayed) {
    return (
      <div className='text-lg group hover:border hover:border-gray-800 hover:text-gray-800 rounded max-h-min px-3 flex gap-x-2 items-center text-gray-100 md:text-gray-800 capitalize font-semibold'>
        <Login className='w-6 h-6 text-gray-800 md:text-gray-800 group-hover:text-gray-800' />
        <Link href="/auth/login">
          log in
        </Link>
      </div>

    );
  } else {
    return (
      <div className="p-3 w-16">
        {" "}
        <LoadingAnimation size={6} />{" "}
      </div>
    );
  }
};


export default function HeaderLayout({
  searchTerm,
}) {


  const userCtx = useContext(UserContext)

  const [isFAQ, setIsFAQ] = useState(false)

  const router = useRouter();

  const currentPath = router.asPath.split("?", 1)[0];

  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const [user, setUser] = useState(userCtx);

  const [isMobileMenu, setIsMobileMenu] = useState(false)


  const [userID, setUserID] = useState(userCtx?.id)

  const [groupID, setGroupID] = useState(userCtx?.groups[0]?.id)

  // const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (
    typeof window !== "undefined" &&
    window.location.hostname === "127.0.0.1"
  ) {

  }


  let path = router.asPath;
  if (path.includes("facilities") || path.includes("facility")) {
    path = "/facilities";
  } else if (path.includes("community")) {
    path = "/community-units";
  } else {
    path = "/facilities";
  }

  const isLoggedIn = useContext(IsUserLoggedInCtx)

  
  // useEffect(() => {
  //   let mtd = true;
  //   if (mtd) {
  //     let is_user_logged_in =
  //       (typeof window !== "undefined" &&
  //         window.document.cookie.indexOf("access_token=") > -1) ||
  //       false;

  //     let session_token = null;
  //     if (is_user_logged_in) {
  //       session_token = JSON.parse(
  //         window.document.cookie.split("access_token=")[1].split(";")[0]
  //       );
  //     }

  //     if (
  //       is_user_logged_in &&
  //       typeof window !== "undefined" &&
  //       session_token !== null
  //     ) {


  //       getUserDetails(session_token.token, `${API_URL}/rest-auth/user/`).then(
  //         (usr) => {

  //           console.log('Checking if user is authenticated...')
  //           if (usr.error || usr.detail) {
  //             setIsLoggedIn(false);
  //             setUser(null);
  //           } else {
  //             usr.id == 6 ? setIsLoggedIn(false) : setIsLoggedIn(true);
  //             setUser(usr);


  //           }
  //         }
  //       );
  //     } else {
  //       console.log("no session. Refreshing...");

  //     }
  //   }

  //   return () => {
  //     mtd = false;
  //   };
  // }, []);


  useEffect(() => {
    if (userID == 6) {
      if (window) {
        const timeOut = setTimeout(() => {
          setUserID(JSON.parse(window.localStorage.getItem('user'))?.id)
          setGroupID(JSON.parse(window.localStorage.getItem('user'))?.groups[0]?.id)

        }, 1000)

        return () => {
          clearTimeout(timeOut)
        }

      }

    }


  }, [])


  return (
    (<header className='w-full max-h-min flex'>
      {/* {
        <pre className="hidden">{
          JSON.stringify({ isLoggedIn, userCtx }, null, 2)
        }</pre>
      } */}
      <Head>
        {/*   <title>KMHFR | Home</title> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {
        <pre>
          {

            JSON.stringify({currentPath, out: `${/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}, null, 2) &&
            console.log('[+] Header Rerender ..(/)
          }
        </pre>
      } */}
      <div className="w-full overflow-y-scroll flex flex-col ">

        <div className='w-full h-auto z-10 fixed top-0'>

          {/* Logo And Title */}
          <div className='w-full fixed  max-h-min bg-gray-50 flex'>
            {/* Heading */}
            <div className="max-h-min md:w-[80%] w-full container flex md:mx-auto">
              {/* Heading */}
              <div className='w-full flex md:justify-between md:items-center justify-center py-4 max-h-min '>
                {/* Logo */}
                <Link
                  href={`${userID !== 6 ? '/dashboard' : '/'}`}
                  className="leading-none tracking-tight flex justify-center items-center text-black font-bold relative"
                >

                  <Image src="/moh-logo-alt.png" alt="logo" height="65" width="350" />

                </Link>

                {/* Title */}

                {/* <pre>{
                  JSON.stringify({isLoggedIn}, null, 2)
                  }</pre> */}

                {/* Login / Logout button */}
                {isLoggedIn ? (
                  <div className="text-lg group hidden  duration-200 hover:rounded ease-in-out hover:border hover:border-gray-800 hover:text-gray-800 md:h-[40px] max-h-min px-3 md:flex gap-x-2 items-center text-gray-800 capitalize font-semibold">
                    <Menu as="div" className="relative p-2" >
                      <Menu.Button
                        as="div"
                        className="flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="leading-none p-0 inline sm:hidden">
                          <UserCircleIcon className="h-6 w-6 text-gray-800" />
                        </span>
                        <span className="leading-none text-gray-800 p-0 hidden sm:inline">
                          {userCtx?.full_name || "My account"}
                        </span>
                        <span className="leading-none p-0">
                          <ChevronDownIcon className="h-4 w-5" />
                        </span>
                      </Menu.Button>

                      <Menu.Items
                        as="ul"
                        style={{ backgroundColor: "#eff6ff", color: "black", outline: 'none' }}
                        className="list-none outline-none text-black bg-gray-100 shadow-md flex flex-col items-center justify-start gap-2 p-3 absolute mt-3  right-0  w-40 "
                      >

                        <Menu.Item as="li" className="flex items-center w-full gap-1">
                          {({ active }) => (
                            <button
                              className={`w-full text-gray-800 font-medium cursor-pointer flex items-center ${active && "text-gray-400"
                                }`}
                              onClick={() => router.push('/account')}
                            >

                              <AccountCircleOutlinedIcon fontSize="small" /> &nbsp; Profile

                            </button>
                          )}
                        </Menu.Item>

                        <Menu.Item
                          as="li"
                          className={"flex items-center w-full gap-1 mt-2 border-t border-gray-300 py-2"}
                        >
                          {({ active }) => (
                            <button
                              onClick={() => router.push({
                                pathname:'/logout',
                                query: {
                                  previous_path: router.asPath
                                }
                              })}
                              data-testid="logout"
                              className={`w-full cursor-pointer flex items-center text-gray-800 font-medium ${active && "text-gray-400"
                                }`}

                            >

                              <Logout className="w-6 aspect-ratio" />  &nbsp; Log out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                ) : (
                  <div className="hidden md:flex">
                    <DelayedLoginButton />
                  </div>

                )}


              </div>

              {/* Mobile Nav Bar */}

              <div style={{ backgroundColor: '#8e16b6' }} className='w-full bg-gray-300 top-[94px] md:top-[95px] fixed z-10 max-h-min flex items-center justify-between md:items-start md:items-between p-3 md:p-0'>
                <button className='md:hidden relative' onClick={() => {setIsMobileMenu(!isMobileMenu)}}>
                  {
                    !isMobileMenu &&
                    <MenuIcon className='w-6 aspect-square text-gray-100' />
                  }

                  {
                    isMobileMenu &&
                    <CloseOutlined className='w-6 aspect-square text-gray-100' />
                  }

                  {
                    isMobileMenu &&
                    <nav className="flex max-h-min w-auto container md:hidden mx-auto absolute top-[120%]">

                      {
                        groupID == 7 && // Super Users
                        isLoggedIn &&

                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex flex-col rounded items-center  justify-between '>


                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85'} ${currentPath == "/public/chu" && 'border-r-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/user'>Users</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/system_setup" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/system_setup'><span>System Setup</span></Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/analytics'>Analytics</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/admin_offices'>Admin Offices</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                  <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                </li>

                          <li className={`text-lg h-[60px] flex w-full text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/downloads'>Downloads</Link>
                          </li>
                        </ul>
                      }

                      {
                        (groupID == 5 || // National Administrators
                        groupID == 11) && // Data Cleaning National
                        isLoggedIn &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex flex-col rounded items-center justify-between '>


                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-r-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/user'>Users</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/system_setup" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/system_setup'><span>System Setup</span></Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/admin_offices'>Admin Offices</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-center w-full justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                  <Link target="_blank"  href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                </li>

                          <li className={`text-lg h-[60px] flex text-nowrap w-full items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/downloads'>Downloads</Link>
                          </li>
                        </ul>
                      }

                      {
                        groupID == 1 && // CHRIO
                        isLoggedIn &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex flex-col rounded items-center justify-between'>


                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex  text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex  text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-r-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/user'>Users</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                  <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/downloads'>Downloads</Link>
                          </li>
                        </ul>
                      }

                      {
                        groupID == 2 && // SCHRIO
                        isLoggedIn &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex-col rounded flex  justify-between '>


                          <li className={`text-lg h-[60px] w-full flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] w-full flex  text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] w-full flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-r-2 border-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] w-full flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                            <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/downloads'>Downloads</Link>
                          </li>
                        </ul>
                      }


                      {
                        groupID == 12 && // Report Viewer County
                        isLoggedIn &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex flex-col items-center  justify-between '>


                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>
                        </ul>
                      }
                      {
                        groupID == 6 && // Report Viewer National
                        isLoggedIn &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none rounded w-full flex flex-col items-center  justify-between '>


                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-r-2 border-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>
                        </ul>
                      }

                      {
                        groupID == 8 && // Report User Group
                        isLoggedIn &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex items-center  justify-between '>


                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-r-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                <Link target="_blank"  href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                              </li>

                          <li className={`text-lg h-[60px] flex  text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-r-2 border-b-gray-50 bg-blue-500/85'}`}>
                            <Link href='/downloads'>Downloads</Link>
                          </li>
                        </ul>
                      }

                      {
                        /**
                         * If group Id does not match any user group and user is logged in; render this menu
                         */
                        ((
                          groupID == undefined ||
                          groupID == null
                        ) && isLoggedIn) ||
                        ((
                          groupID !== 7 &&
                          groupID !== 5 &&
                          groupID !== 1 &&
                          groupID !== 2 &&
                          groupID !== 12 &&
                          groupID !== 6 &&
                          groupID !== 8
                        )
                          &&
                          isLoggedIn) &&
                        <ul style={{ backgroundColor: '#8e16b6' }} className='list-none w-full flex-col rounded flex  justify-between '>


                          <li className={`text-lg h-[60px] w-full flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/dashboard'>Dashboard</Link>
                          </li>

                          <li className={`text-lg h-[60px] w-full flex  text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-r-2 border-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                          </li>

                          <li className={`text-lg h-[60px] w-full flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-r-2 border-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-r-2 border-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                          </li>

                          <li className={`text-lg h-[60px] w-full flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/reports'>Reports</Link>
                          </li>

                          <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                            <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                          </li>

                          <li className={`text-lg h-[60px] flex text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-r-2 border-gray-50 bg-blue-500/85'}`}>
                            <Link href='/downloads'>Downloads</Link>
                          </li>
                        </ul>

                      }

                      {
                        groupID == 4 &&
                        !isLoggedIn &&
                        <ul className='list-none w-[200px] flex flex-col text-start items-start  bg-gray-50 shadow-sm rounded'>
                          <li className={`text-lg h-[50px] w-full border-b border-b-gray-300 flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 hover:text-gray-100 px-4 font-semibold capitalize ${currentPath == "/" && 'border-r-2 border-r-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href="/">Home</Link>
                          </li>
                          <li className={`text-lg h-[50px] w-full border-b border-b-gray-300 flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 hover:text-gray-100 px-4 font-semibold capitalize ${currentPath == "/public/facilities" && 'border-r-2 border-r-gray-50 bg-blue-700/85 text-gray-100 '}`}>
                            <Link href='/public/facilities'>Facilities</Link>
                          </li>
                          <li className={`text-lg h-[50px] w-full border-b border-b-gray-300 flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 hover:text-gray-100 px-4 font-semibold capitalize ${currentPath == "/public/chu" && 'border-r-2 border-r-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href='/public/chu'>Community</Link>
                            <>Units</>

                          </li>
                          <li className={`text-lg h-[50px] w-full border-b border-b-gray-300 flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 hover:text-gray-100 px-4 font-semibold capitalize ${currentPath == "/public/about" && 'border-r-2 border-r-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href="/public/about">About</Link>
                          </li>
                          <li className={`text-lg h-[50px] w-full border-b border-b-gray-300 flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 hover:text-gray-100 px-4 font-semibold capitalize ${currentPath == "/public/faqs" && 'border-r-2 border-r-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link href="/public/faqs">FAQs</Link>
                          </li>

                          <li className={`text-lg h-[50px] w-full border-b border-b-gray-300 flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 hover:text-gray-100 px-4 font-semibold capitalize ${currentPath == "/public/faqs" && 'border-r-2 border-r-gray-50 bg-blue-700/85 text-gray-100'}`}>
                            <Link target="_blank"  href="https://kmhfr-docs.vercel.app">Documentation</Link>
                          </li>

                        </ul>
                      }

                    </nav>
                  }
                </button>

                <div className='text-lg md:hidden max-h-min flex items-center justify-center text-gray-100 capitalize font-semibold'>
                  {isLoggedIn ? (
                    <div className="text-lg group  duration-200 hover:rounded ease-in-out hover:bg-blue-800 hover:text-gray-100 max-h-min md:px-3 md:flex gap-x-2 items-center text-gray-100 capitalize font-semibold">
                      <Menu as="div" className="relative " >
                        <Menu.Button
                          as="div"
                          className="flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="leading-none p-0 inline sm:hidden">
                            <UserCircleIcon className="h-6 w-6" />
                          </span>
                          <span className="leading-none p-0 sm:inline">
                            {userCtx?.full_name || "My account"}
                          </span>
                          <span className="leading-none p-0">
                            <ChevronDownIcon className="h-4 w-5" />
                          </span>
                        </Menu.Button>

                        <Menu.Items
                          as="ul"
                          style={{ backgroundColor: "#eff6ff", color: "black", outline: 'none' }}
                          className="list-none rounded outline-none text-black bg-gray-100 shadow-md flex flex-col items-center justify-start gap-2 md:p-3 py-3 absolute mt-3  right-0  w-40 "
                        >

                          <Menu.Item as="li" className="flex items-center px-3 w-full gap-1">
                            {({ active }) => (
                              <button
                                className={`w-full text-gray-800 font-medium cursor-pointer flex items-center ${active && "text-gray-400"
                                  }`}
                                onClick={() => router.push('/account')}
                              >

                                <AccountCircleOutlinedIcon fontSize="small" /> &nbsp; Profile

                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item
                            as="li"
                            className={"flex items-center w-full px-3 gap-1 mt-2 border-t border-gray-300 py-2"}
                          >
                            {({ active }) => (
                              <button
                                onClick={() => router.push('/logout')}
                                data-testid="logout"
                                className={`w-full cursor-pointer flex items-center text-gray-800 font-medium ${active && "text-gray-400"
                                  }`}

                              >

                                <Logout className="w-6 aspect-ratio" />  &nbsp; Log out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </div>
                  ) : (
                    <div className="flex md:hidden">
                      <DelayedLoginButton />
                    </div>

                  )}
                </div>

              </div>

            </div>

          </div>

          {/* Menu Heading */}
          {
            currentPath !== '/logout' &&
            <div style={{ backgroundColor: '#8e16b6' }} className='w-full md:mt-[97px] mt-[82px] bg-gray-300 max-h-min flex items-center justify-between md:items-start md:items-between p-3 md:p-0'>
              {/* Wide view Port Nav bar */}
              <nav className="hidden max-h-min w-[60%] lg:w-[80%] container md:flex mx-auto ">



                <>
                  {
                    (() => {
                      switch (groupID) {
                        case 7: // Super User
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'} ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/user'>Users</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/system_setup" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/system_setup'><span>System Setup</span></Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/admin_offices'>Admin Offices</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/analytics'>Analytics</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                              <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                            </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/downloads'>Downloads</Link>
                              </li>
                            </ul>)
                          );
                        case 5: // National Level Admin
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/user'>Users</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/system_setup" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/system_setup'><span>System Setup</span></Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/admin_offices'>Admin Offices</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                      <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                    </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/downloads'>Downloads</Link>
                              </li>
                            </ul>)
                          );
                        case 11: // Data Cleaning National
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/user'>Users</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/system_setup" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/system_setup'><span>System Setup</span></Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/admin_offices\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/admin_offices'>Admin Offices</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                      <Link target="_blank"  href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                    </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/downloads'>Downloads</Link>
                              </li>
                            </ul>)
                          );
                        case 1: // CHRIO
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${/\/user\/*/.test(currentPath) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/user'>Users</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                  <Link target="_blank"  href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                                </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/downloads'>Downloads</Link>
                              </li>
                            </ul>)
                          );
                        case 2: // SCHRIO
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                            <Link target="_blank" href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                          </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/downloads'>Downloads</Link>
                              </li>
                            </ul>)
                          );
                        case 12: // Report Viewer County
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                            </ul>)
                          );
                        case 6: // Report Viewer National
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                            </ul>)
                          );
                        case 8: //Report User Group
                          return (
                            (<ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/dashboard'>Dashboard</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/facilities\/.+/.test(currentPath) || /\/facilities/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85 text-gray-100 '}  ${currentPath == "/public/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/facilities' : '/public/facilities'}`}>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${(/\/community-units\/.+/.test(currentPath) || /\/community-units/.test(currentPath)) && 'border-b-2 border-b-gray-50 bg-blue-500/85'}  ${currentPath == "/public/chu" && 'border-b-2 border-b-gray-50 bg-blue-700/85 text-gray-100'}`}>
                                <Link href={`${userID !== 6 && isLoggedIn ? '/community-units' : '/public/chu'}`}>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/reports'>Reports</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/documentation" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                                <Link target="_blank"  href='https://kmhfr-docs.vercel.app'>Documentation</Link>
                                              </li>
                              <li className={`text-lg h-[60px] flex text-center justify-center text-nowrap items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/downloads" && 'border-b-2 border-b-gray-50 bg-blue-500/85'}`}>
                                <Link href='/downloads'>Downloads</Link>
                              </li>
                            </ul>)
                          );
                        case 4:
                          return (
                            <ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex items-center  hover:text-gray-100  duration-200 ease-out hover:bg-blue-500 px-4 text-gray-100 font-semibold capitalize `}>
                                <Link href="/">Home</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/facilities" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href='/public/facilities'>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/chu" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href='/public/chu'>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/about" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href="/public/about">About</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/faqs" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href="/public/faqs">FAQs</Link>
                              </li>

                              <li className={`text-lg h-[60px] flex items-center hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href="https://kmhfr-docs.vercel.app">Documentation</Link>
                              </li>

                            </ul>
                          )

                        default:
                          return (
                            <ul className='list-none w-full flex items-center  justify-between '>
                              <li className={`text-lg h-[60px] flex items-center  hover:text-gray-100  duration-200 ease-out hover:bg-blue-500 px-4 text-gray-100 font-semibold capitalize `}>
                                <Link href="/">Home</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/facilities" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href='/public/facilities'>Facilities</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/chu" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href='/public/chu'>Community Units</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/about" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href="/public/about">About</Link>
                              </li>
                              <li className={`text-lg h-[60px] flex items-center ${router.asPath == "/public/faqs" && 'border-b-2 text-gray-100 border-b-gray-50 bg-blue-500/85'} hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href="/public/faqs">FAQs</Link>
                              </li>

                              <li className={`text-lg h-[60px] flex items-center hover:bg-blue-500 hover:text-gray-100 duration-200 ease-out px-4 font-semibold capitalize text-gray-100`}>
                                <Link href="https://kmhfr-docs.vercel.app">Documentation</Link>
                              </li>

                            </ul>
                          )

                      }
                    })()
                  }
                </>




              </nav>
            </div>
          }

        </div>

        {/* FAQ */}
        {
          isFAQ &&
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', paddingTop: '170px' }}
            open={isFAQ}

          >
            <div className="p-6 w-[600px] bg-gray-100 max-h-min shadow-sm rounded flex flex-col gap-y-6">
              <div className='flex flex-col gap-2'>

                <button className="text-black self-end">
                  <CancelRounded onClick={() => setIsFAQ(false)} className='w-7 aspect-square text-red-400' />
                </button>

                <h2 className='text-3xl text-gray-500 font-semibold'>
                  WHAT'S A HEALTH FACILITY?
                </h2>
                <p className='text-lg text-justify text-black'>
                  This is a defined health service delivery structure that provides services and has one or more departments operating within it e.g. Outpatient, pharmacy, laboratory . In KMHFL, a facility is described by it’s unique code, ownership, type, administrative and geographical location, and services provided.
                </p>
              </div>

              <div className='flex flex-col gap-2'>
                <h2 className='text-3xl text-gray-500 font-semibold'>
                  WHAT'S A STAND-ALONE HEALTH FACILITY?
                </h2>
                <p className='text-lg text-justify text-black'>
                  A stand-alone health facility is a type of facility that offers services to complement the facilities offering consultative and curative services
                </p>
              </div>

              <div className='flex flex-col gap-2'>
                <h2 className='text-3xl text-gray-500 font-semibold'>
                  WHAT'S A COMMUNITY HEALTH UNIT?
                </h2>
                <p className='text-lg text-justify text-black'>
                  This is a health service delivery structure within a defined geographical area covering a population of approximately 5,000 people. Each unit is assigned 5 Community Health Extension Workers (CHEWs) and community health volunteers who offer promotive, preventative and basic curative health services. These are governed by a Community Health Committee (CHC) and each Community Health unit is linked to a specific Health facility.
                </p>
              </div>
            </div>
          </Backdrop>
        }

      </div>
    </header>)
  );
}
