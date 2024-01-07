import {CommunityUnitEditForm } from '../../../components/Forms/CommunityUnitsForms'
import {useState, useEffect, createContext} from 'react'
import { checkToken } from '../../../controllers/auth/auth'


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


export async function getServerSideProps({req, res, query}) {

  const {token} = await checkToken(req, res)

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

  try {
      
      if(token.error) throw Error('Unable to get token')

      for( let option of options){
      switch(option){ 

        case "cu":
            const cu = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${query.id}/`,{
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

        const count = await getFacilityCount(token)
        
        const facilities = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?page_size=${count ?? '500'}&fields=id,name,county,sub_county_name,constituency,ward_name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["facilities"] =  (await (await facilities.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))
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
     

      return {
        props: response 
      }
      
    }
    
  catch(e) {
    console.error(e.message)
  }

}

