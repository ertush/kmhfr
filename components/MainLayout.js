import Link from 'next/link'
import { MenuAlt1Icon, SearchIcon } from '@heroicons/react/solid';
import React from 'react';

export default function MainLayout({ children, isLoading, searchTerm }) {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <div className="w-full border-b border-gray-100 flex items-center justify-center md:sticky md:top-0 bg-white z-10">
                <header className="flex flex-wrap items-center justify-between gap-4 w-full p-2 max-w-screen-2xl">
                    <nav className="flex flex-auto px-2 items-center justify-between md:justify-start gap-3 py-3 md:py-0 md:gap-5">
                        <div id="logo" className="mx:px-3">
                            <a href="/" className="font-mono text-3xl text-black font-bold">KMHFL-v2</a>
                        </div>
                        <div className="group p-3">
                            <button className="border-2 border-gray-600 rounded p-1 md:hidden focus:bg-black focus:border-black focus:text-white hover:bg-black hover:border-black hover:text-white active:bg-black active:border-black active:text-white">
                                <MenuAlt1Icon className="w-6" />
                            </button>
                            <ul className="flex-col md:flex-row items-start md:items-start bg-gray-50 inset-x-4  mt-1 p-4 md:p-1 rounded md:bg-transparent shadow border md:border-none md:shadow-none justify-between gap-5 hidden md:flex group-focus:flex group-active:flex group-hover:flex absolute md:relative">
                                <li className="flex-wrap">
                                    <Link href="/">
                                        <a className="text-black text-base md:text-lg hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-semibold">Home</a>
                                    </Link>
                                </li>
                                <li className="flex-wrap">
                                    <Link href="/facilities">
                                        <a className="text-gray-700 text-base md:text-lg hover:text-black focus:text-black active:text-black">Facilities</a>
                                    </Link>
                                </li>
                                <li className="flex-wrap">
                                    <Link href="/community-units">
                                        <a className="text-gray-700 text-base md:text-lg hover:text-black focus:text-black active:text-black">Community Units</a>
                                    </Link>
                                </li>
                                <li className="flex-wrap">
                                    <Link href="/gis">
                                        <a className="text-gray-700 text-base md:text-lg hover:text-black focus:text-black active:text-black">GIS Maps</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="flex flex-wrap items-center justify-between gap-3 md:gap-5 px-2 flex-grow">
                        <form className="inline-flex flex-grow gap-1" action="/">
                            <input name="q" className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none" type="search" defaultValue={searchTerm} placeholder="Search a facility/CHU" />
                            <button className="bg-white border-2 border-black text-black flex items-center justify-center px-4 py-1 rounded">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                        </form>
                        <a href="/" className="bg-black hover:bg-green-700 focus:bg-green-700 active:bg-green-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white px-4 md:px-8 whitespace-nowrap py-2 rounded text-base font-semibold">Log in</a>
                    </div>
                </header>
            </div>
            <div className="min-h-screen w-full flex flex-col items-center max-w-screen-2xl">
                <>
                    {isLoading ? <div className="absolute inset-0 overflow-hidden bg-white opacity-90 z-20 flex items-center justify-center h-full">
                        <h3 className="text-2xl text-gray-800 font-bold">Loading...</h3>
                    </div> : children}
                </>
            </div>
            <footer className="bg-black py-5 items-center justify-center flex flex-wrap gap-3 text-gray-300 text-sm w-full">
                <p>Built by <a href="https://github.com/benzerbett" className="text-white" rel="noreferrer noopener" target="_blank">Bett</a></p>
            </footer>
        </div>
    );
}