import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronDownIcon,
  MenuAlt1Icon,
  SearchIcon,
} from "@heroicons/react/solid";
import { UserCircleIcon } from "@heroicons/react/outline";
import React, { useState, useEffect, useContext } from "react";
import { Menu } from "@headlessui/react";
import { getUserDetails } from "../controllers/auth/auth";
import LoadingAnimation from "./LoadingAnimation";
import { PermissionContext } from "../providers/permissions";
import {
  hasPermission
} from "../utils/checkPermissions"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserContext } from "../providers/user";


const DelayedLoginButton = () => {


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

  if (delayed === true) {
    return (
      <a
        href="/auth/login"
        className="bg-blue-700 hover:bg-black focus:bg-blue-700 active:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-2 md:mr-3 whitespace-nowrap py-2 text-base font-semibold"
      >
        Log in
      </a>
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

  const userPermissions = useContext(PermissionContext)
  const userCtx = useContext(UserContext)


  const router = useRouter();
  const activeClasses =
    "text-black hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-medium border-b-4  border-blue-600";
  const inactiveClasses =
    "text-gray-700 hover:text-black focus:text-black active:text-black";
  const currentPath = router.asPath.split("?", 1)[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOption, setSearchOption]=useState('');
  const [user, setUser] = useState(null);

  const groupID = userCtx?.groups[0]?.id

  let API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (
    typeof window !== "undefined" &&
    window.location.hostname === "127.0.0.1"
  ) {
    API_URL = "http://localhost:8000/api";
  }

  //check if a session cookie is set
  let path = router.asPath;
  if (path.includes("facilities") || path.includes("facility")) {
    path = "/facilities";
  } else if (path.includes("community")) {
    path = "/community-units";
  } else {
    path = "/facilities";
  }

  useEffect(() => {
    let mtd = true;
    if (mtd) {
      let is_user_logged_in =
        (typeof window !== "undefined" &&
          window.document.cookie.indexOf("access_token=") > -1) ||
        false;
      // console.log("is_user_logged_in", is_user_logged_in)
      // setIsLoggedIn(is_user_logged_in);
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
              // setIsLoggedIn(true);
              // setUser(usr);
              
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

  // console.log(isLoggedIn)

  return (
    <header className="flex flex-wrap items-center justify-start gap-x-4 w-full bg-blue-50 p-1 max-w-screen-3xl">
      <title>KMHFR </title>
      <nav className="flex flex-wrap px-2 items-center justify-between md:justify-start flex-grow sm:flex-grow-0 gap-x-3 gap-y-2 py-1 md:py-3 md:gap-5">
        <div id="logo" className="mx:px-3 pb-1">
          <a
            href="/"
            className="leading-none tracking-tight flex gap-x-2 justify-center items-center text-black font-bold relative"
          >
            <img src="/MOH.png" alt="KMHFL3" className="h-14" />
            <span className="text-3xl leading-none">KMHFR</span>
            {/* <span className="text-sm bg-yellow-300 -sm shadow border border-yellow-400 leading-none text-yellow-900 px-1 absolute bottom-0 -right-2">
              v1
            </span> */}
          </a>
        </div>
        <div className="group px-3 py-2">
          <button className="border-2 border-gray-600  p-1 md:hidden focus:bg-black focus:border-black focus:text-white hover:bg-black hover:border-black hover:text-white active:bg-black active:border-black active:text-white">
            <MenuAlt1Icon className="w-6" />
          </button>
          <ul className="flex-col md:flex-row items-start md:items-start bg-gray-50 inset-x-4  mt-1 md:mx-6 py-1 md:p-1  md:bg-transparent shadow border md:border-none md:shadow-none gap-5 hidden md:flex group-focus:flex group-active:flex group-hover:flex absolute md:relative">
            {/* Dashboard / Home */}
            <li className="flex-wrap font-semibold" id="dashboard">
              <Link href={isLoggedIn ? "/dashboard" : "/"}>
                <p
                  className={`
                  text-base 
                  md:text-lg
                  cursor-pointer
                  ${(currentPath == "/" || currentPath == "/dashboard"
                      ? activeClasses
                      : inactiveClasses)
                    }`}
                >
                  {isLoggedIn ? "Dashboard" : "Home"}
                </p>
              </Link>
            </li>
            {/* Facilities */}
          
            <li className="flex-wrap font-semibold">
              <Link href="/facilities">
                <p
                  className={
                    `
                    text-base
                    md:text-lg
                    cursor-pointer
                    ${(currentPath == "/facilities" ||
                      currentPath.includes("facility")
                      ? activeClasses
                      : inactiveClasses)

                    }`}
                >
                  Facilities
                </p>
              </Link>
            </li>
            
            {/* Community Units */}
           
            <li className="flex-wrap font-semibold">
              <Link href="/community-units">
                <p
                  className={`
                  text-base
                  md:text-lg
                  cursor-pointer
                    ${(currentPath == "/community-units" ||
                      currentPath.includes("community-unit")
                      ? activeClasses
                      : inactiveClasses)
                    }`}
                >
                  Community Units
                </p>
              </Link>
            </li>
            
            {/* Users */}
         
            {( groupID == 7 ||
               groupID == 2 ||
               groupID == 3 ) && isLoggedIn &&
              <li className="flex-wrap font-semibold">
                <Link href="/users">
                  <p
                    className={
                      `
                    text-base 
                    md:text-lg
                    cursor-pointer
                    ${(currentPath == "/users" ? activeClasses : inactiveClasses)

                      }`}
                  >
                    Users
                  </p>
                </Link>
              </li>
            }
            {/* GIS */}
            { 1 != 1 && // hasPermission(/^mfl_gis.view_.*$/, userPermissions) && isLoggedIn &&
              <li className="flex-wrap font-semibold">
                <Link href="/gis">
                  <p
                    className={`
                  text-base 
                  md:text-lg
                  cursor-pointer
                   ${(currentPath == "/gis" ||
                        currentPath.includes("gis")
                        ? activeClasses
                        : inactiveClasses)
                      }`}
                  >
                    GIS
                  </p>
                </Link>
              </li>
            }
            {/* System setup */}
            {
              hasPermission(/^common.add_county$/, userPermissions) &&
              hasPermission(/^common.delete_county$/, userPermissions) && isLoggedIn&&
              <li className="flex-wrap font-semibold">
                <Link href="/system_setup">
                  <p
                    className={`
                  text-base
                  md:text-lg
                  cursor-pointer 
                  ${(currentPath == "/system_setup" ||
                        currentPath.includes("system_setup")
                        ? activeClasses
                        : inactiveClasses)
                      } `}
                  >
                    System setup
                  </p>
                </Link>
              </li>
            }

            {/* Public site menus */}
            {!isLoggedIn &&
            <Menu as="div" className="relative ">
              <Menu.Button
                as="div"
                className="flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className={`
                    text-base 
                    md:text-lg 
                    font-semibold 
                    leading-none 
                    p-0 
                    hidden 
                    sm:inline
                    cursor-pointer
                    ${(currentPath == "/public/facility/facilities" || currentPath == "/public/chu/community_units"
                    ? activeClasses
                    : inactiveClasses)
                  }`}>
                  Find
                </span>
                <span className="leading-none p-0">
                  <ChevronDownIcon className="h-4 w-5" />
                </span>
              </Menu.Button>
              <Menu.Items
                as="ul"
                className="list-none flex flex-col items-center bg-white outline-none shadow-md font-semibold justify-start gap-2 p-3 absolute mt-3 text-gray-800 right-0 w-40 "
              >
                <Menu.Item as="li" className="flex items-center w-full gap-1">
                  {({ active }) => (
                    <Link
                      className={`w-full hover:text-gray-400  font-medium flex items-center ${active && "text-blue-400"
                        }`}
                      href="/public/facility/facilities"
                      target="_blank"
                    >
                      Facilities
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item as="li" className="flex items-center w-full gap-1">
                  {({ active }) => (
                    <Link
                      className={`w-full hover:text-gray-400  font-medium flex items-center ${active && "text-blue-400"
                        }`}
                      href="/public/chu/community_units"
                      target="_blank"
                    >
                      Community units
                    </Link>
                  )}
                </Menu.Item>

              </Menu.Items>
            </Menu>
            }

            {/* Reports */}
            {isLoggedIn &&
            <Menu as="div" className="relative ">
             <Menu.Item as="li" className="flex items-center w-full gap-1">
                  {({ active }) => (
                    <span
                      className={`w-full hover:text-gray-400 font-medium flex items-center ${active && "text-blue-400"
                        }`}
                      // href="/reports"
                      onClick={() => router.push('/reports')}
                      target="_blank"
                    >
                          <p
                    className={`
                text-base 
                md:text-lg
                font-semibold
                cursor-pointer
                ${(currentPath == "/reports" ? activeClasses : inactiveClasses)

                      }`}
                  >

                  Reports
                  </p>
                      
                    </span>
                  )}
                </Menu.Item>
            </Menu>
            }

            {/* Admin Offices */}
            { hasPermission(/^admin_offices.view_adminoffice.*$/, userPermissions) && isLoggedIn &&
              <li className="flex-wrap font-semibold">
                <Link href="/admin_offices">
                  <p
                    className={`
                text-base 
                md:text-lg
                cursor-pointer
                ${(currentPath == "/admin_offices" ? activeClasses : inactiveClasses)

                      }`}
                  >
                    Admin Offices
                  </p>
                </Link>
              </li>
            }

          </ul>
        </div>
      </nav>
      <div className="flex flex-wrap items-center justify-end gap-2 md:gap-5 px-2 md:flex-grow order-last sm:order-none flex-grow sm:flex-grow-0z">
        {
          !router.asPath.includes('/dashboard') &&
          // !router.asPath.includes('/facilities') &&
         !isLoggedIn ?
        <form
          className="inline-flex flex-row justify-start flex-grow mt-2 lg:py-0"
          action= {(()=>{
            if(searchOption == "Facilities"){
              return "/public/facility/facilities"
            }else if(searchOption == "Community Health Unit"){
              return "/public/chu/community_units"
            }else if(searchOption == "Services"){
              return "/public/services"
            }else{
             return  router.asPath.includes('searchTerm')? router.route : "/public/facility/facilities"
            }
          })()}
        >
          <select className="bg-transparent border border-blue-600 p-2 w-6/9 focus:outline-none focus:ring-1 focus:ring-black" name="find"
          onChange={ev => {
              if (ev.target.value && ev.target.value.length > 0) {
                  // setFormDetails({ ...formDetails, [ev.target.name]: ev.target.value });
                  setSearchOption(ev.target.value)
              }
          }}
          >
               <option value="Facilities">{`Facilities`}</option>
               <option value="Community Health Unit">{`Community Health Unit`}</option>
               <option value="Services">{`Services`}</option>
          </select>          

          <input
            name="q"
            id="search-input"
            type="search"
            defaultValue={searchTerm}
            placeholder="Search a facility/CHU..."
            className="flex-none bg-transparent ml-2 p-2 md:w-6/12 md:flex-grow-0 flex-grow shadow-sm border border-blue-600 placeholder-gray-600  focus:shadow-none focus:ring-black focus:border-black outline-none"
          />
          <button
            type="submit"
          className="bg-transparent border-t border-r border-b border-blue-600 text-black flex items-center justify-center px-4 py-1"
            
          >
            <SearchIcon className="w-5 h-5 text-blue-600" />
          </button>
        </form> :
        <form
        className="inline-flex flex-row justify-start flex-grow py-2 lg:py-0"
        action={ path || '/facilities' }
      >
               
        <input
          name="q"
          id="search-input"
          className="flex-none bg-transparent p-2 md:w-9/12 md:flex-grow-0 flex-grow shadow-sm border border-blue-600 placeholder-gray-600  focus:shadow-none focus:ring-black focus:border-black outline-none"
          type="search"
          defaultValue={searchTerm}
          placeholder="Search a facility/CHU..."
        />
        <button
          type="submit"
          className="bg-transparent border-t border-r border-b border-blue-600 text-black flex items-center justify-center px-4 py-1"
          
        >
          <SearchIcon className="w-5 h-5 text-blue-600" />
        </button>
      </form>
      }
      </div>
      {isLoggedIn && user ? (
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

              <Menu.Item as="li" className="flex items-center w-full gap-1">
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
              {/* <Menu.Item as="li" className="flex items-center w-full gap-1">
                {({ active }) => (
                  <a
                    className={`w-full hover:text-blue-400 font-medium flex items-center ${active && "text-blue-400"
                      }`}
                    href="https://KMHFR.health.go.ke/"
                    target="_blank"
                  >
                    KMHFR live <ExternalLinkIcon className="h-4 w-4 ml-2" />
                  </a>
                )}
              </Menu.Item> */}
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
      )}
    </header>
  );
}
