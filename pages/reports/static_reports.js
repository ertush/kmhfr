import React from 'react'
import Head from 'next/head'
import MainLayout from '../../components/MainLayout'
import { List, ListItem, ListItemText } from '@mui/material'
import { DownloadIcon } from '@heroicons/react/solid'
import { checkToken } from '../../controllers/auth/auth'
import { useEffect } from 'react'



const StaticReports = (props) => {

  useEffect(() => {
    console.log({data: props?.data})
  }, [])


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

StaticReports.getInitialProps = async (ctx) => {    
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchFilters = token => {
      // let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Csub_county'
      let filters_url = API_URL + '/common/filtering_summaries/?fields=county'
      return fetch(filters_url, {
          headers: {
              'Authorization': 'Bearer ' + token,
              'Accept': 'application/json'
          }
      }).then(r => r.json())
          .then(jzon => {
              return jzon
          }).catch(err => {
              console.log('Error fetching filters: ', err)
              return {
                  error: true,
                  err: err,
                  filters: [],
                  api_url: API_URL
              }
          })
  }

  const fetchData = (token) => {
      let url = API_URL + '/reports/static_reports'
      let query = { 'searchTerm': '' }
      if (ctx?.query?.q) {
          query.searchTerm = ctx.query.q
          url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`
      }
      let other_posssible_filters = ["county"]

      other_posssible_filters.map(flt => {
          if (ctx?.query[flt]) {
              query[flt] = ctx?.query[flt]
              if (url.includes('?')) {
                  url += `&${flt}=${ctx?.query[flt]}`
              } else {
                  url += `?${flt}=${ctx?.query[flt]}`
              }
          }
      })
      console.log('running fetchData(' + url + ')')

      return fetch(url, {
          headers: {
              'Authorization': 'Bearer ' + token,
              'Accept': 'application/json'
          }
      }).then(r => r.json())
          .then(json => {
              return {
                  data: json, query, path: ctx.asPath || '/reports/static_reports', current_url: url, api_url: process.env.NEXT_PUBLIC_API_URL
              }
          })
          .then(json => {
              return fetchFilters(token).then(ft => {
                  return {
                      data: json, query, filters: { ...ft }, path: ctx.asPath || '/dashboard', current_url: url, api_url: API_URL
                  }
              })
          })
          .catch(err => {
              console.log('Error fetching dynamic reports: ', err)
              return {
                  error: true,
                  err: err,
                  data: [],
                  query: {},
                  filters: {},
                  path: ctx.asPath || '/reports/static_reports',
                  current_url: '',
                  api_url: API_URL
              }
          })
  }
  return checkToken(ctx.req, ctx.res).then(t => {
      if (t.error) {
          throw new Error('Error checking token')
      } else {
          let token = t.token
          return fetchData(token).then(t => t)
      }
  }).catch(err => {
      console.log('Error checking token: ', err)
      if (typeof window !== 'undefined' && window) {
          if (ctx?.asPath) {
              window.location.href = ctx?.asPath
          } else {
              window.location.href = '/reports/static_reports'
          }
      }
      setTimeout(() => {
          return {
              error: true,
              err: err,
              data: [],
              query: {},
              path: ctx.asPath || '/reports/static_reports',
              current_url: '',
              api_url: API_URL
          }
      }, 1000);
  })
}

export default StaticReports