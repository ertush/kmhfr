import { MenuAlt1Icon, SearchIcon } from '@heroicons/react/solid';
import React from 'react';

export default function MainLayout({ children, isLoading, isSearchOpen, toggleSearch, searchTerm }) {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <div className="w-full border-b border-gray-100 flex items-center justify-center md:sticky md:top-0 bg-white z-10">
                <header className="flex flex-wrap items-center justify-between gap-4 w-full p-2 max-w-screen-2xl">
                    <nav className="flex flex-auto px-2 items-center justify-between md:justify-start gap-3 py-3 md:py-0 md:gap-5">
                        <div id="logo" className="mx:px-3">
                            <a href="/" className="font-mono text-3xl text-green-900 font-bold">KMHFL-v2</a>
                        </div>
                        <div className="group p-3">
                            <button className="border-2 border-gray-600 rounded p-1 md:hidden focus:bg-green-700 focus:border-green-700 focus:text-white hover:bg-green-700 hover:border-green-700 hover:text-white active:bg-green-700 active:border-green-700 active:text-white">
                                <MenuAlt1Icon className="w-6" />
                            </button>
                            <ul className="flex-col md:flex-row items-start md:items-start bg-gray-50 inset-x-4  mt-1 p-4 md:p-1 rounded md:bg-transparent shadow border md:border-none md:shadow-none justify-between gap-5 hidden md:flex group-focus:flex group-active:flex group-hover:flex absolute md:relative">
                                <li className="flex-wrap">
                                    <a href="/" className="text-green-700 text-base md:text-lg hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-semibold">Home</a>
                                </li>
                                <li className="flex-wrap">
                                    <a href="/" className="text-gray-700 text-base md:text-lg hover:text-green-700 focus:text-green-700 active:text-green-700">Facilities</a>
                                </li>
                                <li className="flex-wrap">
                                    <a href="/" className="text-gray-700 text-base md:text-lg hover:text-green-700 focus:text-green-700 active:text-green-700">Community Units</a>
                                </li>
                                <li className="flex-wrap">
                                    <a href="/" className="text-gray-700 text-base md:text-lg hover:text-green-700 focus:text-green-700 active:text-green-700">GIS Maps</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="flex flex-wrap items-center justify-between gap-3 md:gap-5 px-2 flex-grow">
                        <form className="inline-flex flex-grow gap-1" action="/">
                            <input name="q" className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-green-500 outline-none" type="search" placeholder="Search a facility/CHU" />
                            <button className="bg-white border-2 border-green-700 text-green-700 flex items-center justify-center px-4 py-1 rounded">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                        </form>
                        <a href="/" className="bg-green-700 text-white px-4 md:px-8 whitespace-nowrap py-2 rounded text-base font-semibold">Log in</a>
                    </div>
                </header>
            </div>
            <div className="min-h-screen w-full flex flex-col items-center max-w-screen-2xl">
                <>
                    {isLoading ? <div className="absolute inset-0 overflow-hidden bg-white opacity-90 z-20 flex items-center justify-center h-full">
                        <h3 className="text-2xl text-gray-800 font-bold">Loading...</h3>
                    </div> : children }
                </>
            </div>
            <footer className="bg-black py-5 items-center justify-center flex flex-wrap gap-3 text-gray-300 text-sm w-full">
                <p>Built by <a href="https://github.com/benzerbett" className="text-white" rel="noreferrer noopener" target="_blank">Bett</a></p>
            </footer>
        </div>
    );
}