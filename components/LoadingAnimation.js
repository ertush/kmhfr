import React from 'react'

function LoadingAnimation({size, isLight}) {
    return (
        <div className="flex flex-col items-center justify-center leading-none bg-transparent relative p-1 px-2">
            <div className={`w-${size} h-${size} border-[4px] border-t-[4px] loader border-t-gray-${isLight ? '200' : '700'} ease-in-out rounded-full border-gray-${isLight ? '100/60' : '900/20'}`}></div>
        </div>

    )
}

export default LoadingAnimation
