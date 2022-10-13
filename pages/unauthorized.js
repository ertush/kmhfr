import React from 'react'
import Link from 'next/link'
import MainLayout from '../components/MainLayout'

function Unauthorized() {


  return (
    <MainLayout isLoading={false} searchTerm={''}>
      <main className='grid place-content-center w-full h-screen'>
        <h2 className='font-semibold text-2xl'>403 | Access to the page was denied</h2>
    
      </main>
    </MainLayout>
  )
}



export default Unauthorized