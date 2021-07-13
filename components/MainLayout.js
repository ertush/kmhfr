import React from 'react';

export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen">
            <div className="w-full border-b border-gray-100 flex items-center justify-center md:sticky md:top-0 bg-white z-10">
                <header className="flex flex-wrap items-center justify-between gap-4 w-full p-2 max-w-screen-2xl">
                    <nav className="flex flex-auto items-center gap-3 py-3 md:py-0 md:gap-5">
                        <div id="logo" className="px-2 mx:px-3">
                            <a href="/" className="font-mono text-3xl text-green-900 font-bold">KMHFL-v2</a>
                        </div>
                        <ul className="flex flex-wrap items-center justify-between gap-3 md:gap-5">
                            <li className="flex-auto">
                                <a href="/" className="text-green-700 text-base md:text-lg hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-semibold">Home</a>
                            </li>
                            <li className="flex-auto">
                                <a href="/" className="text-gray-700 text-base md:text-lg hover:text-green-700 focus:text-green-700 active:text-green-700">Facilities</a>
                            </li>
                            <li className="flex-auto">
                                <a href="/" className="text-gray-700 text-base md:text-lg hover:text-green-700 focus:text-green-700 active:text-green-700">Community Units</a>
                            </li>
                            <li className="flex-auto">
                                <a href="/" className="text-gray-700 text-base md:text-lg hover:text-green-700 focus:text-green-700 active:text-green-700">GIS Maps</a>
                            </li>
                        </ul>
                    </nav>
                    <div className="flex flex-auto items-center justify-between gap-3 md:gap-5 px-2">
                        <input className="flex-none bg-gray-100 rounded p-2 flex-grow shadow-inner border-2 border-gray-100 focus:shadow-none focus:bg-white focus:border-green-500 outline-none" type="search" placeholder="Search a facility/CHU" />
                        <a href="/" className="bg-green-700 text-white px-4 md:px-8 whitespace-nowrap py-2 rounded text-base font-semibold">Log in</a>
                    </div>
                </header>
            </div>
            <div className="min-h-screen w-full flex flex-col max-w-screen-2xl">
                {children}
            </div>
            <footer className="bg-black py-5 items-center justify-center flex flex-wrap gap-3 text-gray-300 text-sm w-full">
                <p>Built by <a href="https://github.com/benzerbett" className="text-white" rel="noreferrer noopener" target="_blank">Bett</a></p>
            </footer>
        </div>
    );
}