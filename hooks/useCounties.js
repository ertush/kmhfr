import useSWR from 'swr'

export function useCounties(county_id) {

  const fetcher = async (url) => {
    try{
        const resp = await fetch(url)
        return county_id ?  [(await resp.json())].map(({id, name}) => ({value:id, label:name})) : 
        (await resp.json())?.results.map(({id, name }) => ({value:id, label:name}))
    }
    catch(e){
        console.error(e.message)
    }
  }


  const url = county_id ? `/api/common/fetch_form_data/?path=counties&id=${county_id}` : `/api/common/fetch_form_data/?path=counties`;
  return useSWR(url, fetcher)
}
