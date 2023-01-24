import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
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
        className="bg-black hover:bg-green-700 focus:bg-green-700 active:bg-green-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-2 md:mr-3 whitespace-nowrap py-2 rounded text-base font-semibold"
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


  const router = useRouter();
  const activeClasses =
    "text-black hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-medium border-b-4 rounded  border-green-600";
  const inactiveClasses =
    "text-gray-700 hover:text-black focus:text-black active:text-black";
  const currentPath = router.asPath.split("?", 1)[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hideUserMenu, setHideUserMenu] = useState(false)
  const [hideSystemSetupMenu, setHideSystemSetupMenu] = useState(false)
  const [hideAdminOfficesMenu, setHideAdminOfficesMenu] = useState(false)
  const [hideGISMenu, setHideGISMenu] = useState(false)

  const [user, setUser] = useState(null);

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
      setIsLoggedIn(is_user_logged_in);
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
      

        getUserDetails(session_token.token, API_URL + "/rest-auth/user/").then(
          (usr) => {
        
            if (usr.error || usr.detail) {
              setIsLoggedIn(false);
              setUser(null);
            } else {
              setIsLoggedIn(true);
              setUser(usr);
              
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

  return (
    <header className="flex flex-wrap items-center justify-start gap-x-4 w-full p-1 max-w-screen-3xl">
      <title>KHMFL 3</title>
      <nav className="flex flex-wrap px-2 items-center justify-between md:justify-start flex-grow sm:flex-grow-0 gap-x-3 gap-y-2 py-1 md:py-3 md:gap-5">
        <div id="logo" className="mx:px-3 pb-1">
          <a
            href="/"
            className="leading-none tracking-tight flex gap-x-2 justify-center items-center text-black font-bold relative"
          >
            <img src="/MOH.png" alt="KHMFL3" className="h-14" />
            <span className="font-mono text-3xl leading-none">KHMFL</span>
            <span className="text-sm bg-yellow-300 rounded-sm shadow uppercase border border-yellow-400 leading-none text-yellow-900 px-1 absolute bottom-0 -right-4">
              V3 Alpha
            </span>
          </a>
        </div>
        <div className="group px-3 py-2">
          <button className="border-2 border-gray-600 rounded p-1 md:hidden focus:bg-black focus:border-black focus:text-white hover:bg-black hover:border-black hover:text-white active:bg-black active:border-black active:text-white">
            <MenuAlt1Icon className="w-6" />
          </button>
          <ul className="flex-col md:flex-row items-start md:mx-4 md:items-start bg-gray-50 inset-x-4  mt-1 md:mx-6 py-1 md:p-1 rounded md:bg-transparent shadow border md:border-none md:shadow-none gap-5 hidden md:flex group-focus:flex group-active:flex group-hover:flex absolute md:relative">
            {/* Dashboard / Home */}
            <li className="flex-wrap font-semibold">
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
            {hasPermission(/^facilities.view_facility$/, userPermissions) &&
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
            }
            {/* Community Units */}
            {hasPermission(/^chul.view_communityhealthunit$/, userPermissions) &&
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
            }
            {/* Users */}
         
            {hasPermission(/^users.view_mfluser$/, userPermissions) &&
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
            {hasPermission(/^mfl_gis.view_.*$/, userPermissions) &&
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
              hasPermission(/^common.delete_county$/, userPermissions) &&
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
            {/* Reports */}

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
                    ${(currentPath == "/reports/static_reports" || currentPath == "/reports/dynamic_reports"
                    ? activeClasses
                    : inactiveClasses)
                  }`}>
                  Reports
                </span>
                <span className="leading-none p-0">
                  <ChevronDownIcon className="h-4 w-5" />
                </span>
              </Menu.Button>
              <Menu.Items
                as="ul"
                className="list-none flex flex-col items-center bg-white outline-none shadow-md font-semibold justify-start gap-2 p-3 absolute mt-3 text-gray-800 right-0 w-40 rounded"
              >
                <Menu.Item as="li" className="flex items-center w-full gap-1">
                  {({ active }) => (
                    <Link
                      className={`w-full hover:text-gray-400  font-medium flex items-center ${active && "text-green-400"
                        }`}
                      href="/reports/dynamic_reports"
                      target="_blank"
                    >
                      Dynamic Reports
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item as="li" className="flex items-center w-full gap-1">
                  {({ active }) => (
                    <Link
                      className={`w-full hover:text-gray-400  font-medium flex items-center ${active && "text-green-400"
                        }`}
                      href="/reports/static_reports"
                      target="_blank"
                    >
                      Static Reports
                    </Link>
                  )}
                </Menu.Item>

              </Menu.Items>
            </Menu>

            {/* Admin Offices */}
            { hasPermission(/^admin_offices.view_adminoffice.*$/, userPermissions) &&
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
        <form
          className="inline-flex flex-row justify-start flex-grow gap-x-2 py-2 lg:py-0"
          action={path || "/facilities"}
        >
          <input
            name="q"
            id="search-input"
            className="flex-none bg-gray-50 rounded p-2 md:w-9/12 md:flex-grow-0 flex-grow shadow-sm border placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
            type="search"
            defaultValue={searchTerm}
            placeholder="Search a facility/CHU"
          />
          <button
            type="submit"
            className="bg-white border-2 border-black text-black flex items-center justify-center px-4 py-1 rounded"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
      {isLoggedIn && user ? (
        <div className="flex flex-wrap items-center gap-3 md:gap-5 px-2 md:flex-grow justify-end">
          <Menu as="div" className="relative p-2">
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
              className="list-none flex flex-col items-center justify-start gap-2 p-3 absolute mt-3 bg-black right-0 text-white w-40 rounded"
            >

              <Menu.Item as="li" className="flex items-center w-full gap-1">
                {({ active }) => (
                  <a
                    className={`w-full hover:text-green-400 font-medium flex items-center ${active && "text-green-400"
                      }`}
                    href="https://kmhfltest.health.go.ke/"
                    target="_blank"
                  >
                    KHMFL test <ExternalLinkIcon className="h-4 w-4 ml-2" />
                  </a>
                )}
              </Menu.Item>
              <Menu.Item as="li" className="flex items-center w-full gap-1">
                {({ active }) => (
                  <a
                    className={`w-full hover:text-green-400 font-medium flex items-center ${active && "text-green-400"
                      }`}
                    href="https://kmhfl.health.go.ke/"
                    target="_blank"
                  >
                    KHMFL live <ExternalLinkIcon className="h-4 w-4 ml-2" />
                  </a>
                )}
              </Menu.Item>
              <Menu.Item
                as="li"
                className="flex items-center w-full gap-1 mt-2 border-t border-gray-600 py-2"
              >
                {({ active }) => (
                  <a
                    className={`w-full hover:text-green-400 font-medium ${active && "text-green-400"
                      }`}
                    href="/logout"
                  >
                    Log out
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
