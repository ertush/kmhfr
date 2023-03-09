import useSWR from 'swr'

export function useSubCounties(county_id) {

  const fetcher = async (url) => {
    try{
        const resp = await fetch(url)
        return county_id ?  (await resp.json())?.results.map(({id, name, county}) => ({value:id, label:name, county})) : 
        (await resp.json())?.results.map(({id, name, county }) => ({value:id, label:name, county}))
    }
    catch(e){
        console.error(e.message)
    }
  }


  const url = county_id ? `/api/common/fetch_form_data/?path=sub_counties&id=${county_id}` : `/api/common/fetch_form_data/?path=sub_counties`;
  return useSWR(url, fetcher)
}
