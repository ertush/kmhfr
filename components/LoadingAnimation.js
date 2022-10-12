import React from 'react'


function LoadingAnimation({size, isLight}) {
    return (
        <div className="flex flex-col items-center justify-center leading-none bg-transparent relative p-1 px-2">
            <div className={`w-${size} h-${size} border-[4px] border-t-[4px] loader ${isLight ? 'border-t-gray-200' : 'border-t-gray-700'} ease-in-out rounded-full ${isLight ? 'border-gray-100/60' : 'border-gray-900/20'}`}></div>
        </div>

    )
}


export default LoadingAnimation
