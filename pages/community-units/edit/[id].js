import {CommunityUnitEditForm } from '../../../components/Forms/CommunityUnitsForms'
import {useState, useEffect, createContext} from 'react'
import { checkToken } from '../../../controllers/auth/auth'
// import Alert from '@mui/material/Alert'


export const ChuOptionsContext = createContext()

export default function CommunityUnitEdit (props){
  // console.log({props})

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  

  if(isClient){

    return (
      <ChuOptionsContext.Provider value={{
          facilities: props?.facilities,
          services: props?.services,
          statuses: props?.statuses,
          contactTypes: props?.contact_types
      }}>
          <CommunityUnitEditForm props={{...props?.cu, token: props?.token}} />
      </ChuOptionsContext.Provider>
          )
  }else {
    return null
  }


}


export async function getServerSideProps(ctx) {

  const {token} = await checkToken(ctx?.req, ctx?.res)

  const response = {}
  
  const options = [
    "cu",
    "statuses",
    "facilities",
    "contact_types",
    "services"
  ]


  async function getFacilityCount(token) {
    try {
    return (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/`, {
      headers:{
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      }

    })).json())?.count
    }
    catch (e) {
      console.error(e.message)
    }
  }

  // const count = await getFacilityCount(token)


  async function getProps(token, options){

  try {
      
      if(token.error) throw Error('Unable to get token')

      for( let option of options){
      switch(option){ 

        case "cu":
            const cu = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${ctx?.query.id}/`,{
            headers:{
              'Authorization': 'Bearer ' + token,
              'Accept': 'application/json'
            }
            
          })

          response["cu"] =  await (await cu.json())

          break;

      case "statuses":
        const statuses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/statuses/?fields=id,name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["statuses"] =  (await (await statuses.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))
        break;

      case "facilities":

        // page_size=${count > 500 ? '500' : count}& ; For limiting number of CHUs
        const url = `${process.env.NEXT_PUBLIC_API_URL}/common/sub_counties/?name=${response?.cu?.facility_subcounty.split(' ').join('+')}`

        fetch(url, {
          headers:{
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then(async (resp) => {
          
          if(resp.ok) {

          const results = await resp.json()

          const params = `?sub_county=${results?.results[0].id}&fields=id,name,county,sub_county_name,constituency,ward_name`

          const facilities = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${params}&reporting_in_dhis=true&owner_type=6a833136-5f50-46d9-b1f9-5f961a42249f`,{
            headers:{
              'Authorization': 'Bearer ' + token,
              'Accept': 'application/json'  
            } 
            
          })
  
          response["facilities"] =  (await (await facilities.json()))?.results?.map(({ id, name }) => ({ label: name, value: id })) 
          
          } 
          
        })
        .catch(e => console.error('Error: ', e.message))

     
        break;

      case "contact_types":
        const contact_types = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/contact_types/?fields=id,name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["contact_types"] =  (await (await contact_types.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))
        break;

      case "services":
        const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["services"] =  (await (await services.json()))?.results
        break;
      }
      } 

      response['token'] = token


    }
  catch(e) {
    console.error(e.message)
  }

  return response

}

const props = await getProps(token, options)

// console.log({props})

  return {
    props 
  }

}

