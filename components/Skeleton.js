export default function Skeleton({w, h, bg}) {
    return (
      <div className='max-w-min h-auto animate-pulse'>
         <div className={`w-[${w ?? '100px'}] h-[${h ?? '24px'}] ${bg} rounded-full`}></div>
      </div>
     
    )
  }
  