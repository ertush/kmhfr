import React from 'react'
import Head from 'next/head'
import MainLayout from '../../components/MainLayout'
import { List, ListItem, ListItemText } from '@mui/material'
import { DownloadIcon } from '@heroicons/react/solid'



const StaticReports = (props) => {
  return (
    <div className="">
            <Head>
                <title>KMHFL - Facilities</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                          <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-green-700" href="/">Home</a> {'>'}
                                <span className="text-gray-500">Reports</span> {'>'}
                                <span className="text-gray-500">Static Reports</span>
                            </div>
          
                        </div>
                       
                    </div>
                    <div className='col-span-5'>
                      <List sx={{width:"100%"}}>
                        <ListItem sx={{width:"auto", display:'flex', py:3, flexDirection:'row', justifyContent:'between', alignItems:'center', borderBottom:1, borderTop:1, borderBottomColor:'grey'}}>
                              <ListItemText>Report 1</ListItemText>
                              <DownloadIcon className='w-8 h-8 text-green-800' />
                        </ListItem>
                    </List>
                    </div>
                   
                  
                    {/* (((((( Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 100 results.
                        </p>  
                    </div>
                    {/* ))))))) */}
                </div>
            </MainLayout >
        </div >
  )
}

// StaticReports.getInitialProps = async (ctx) => {

// }

export default StaticReports