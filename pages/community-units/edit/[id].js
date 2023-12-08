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
          facilities: props?.facilities?.results,
          services: props?.services?.results,
          statuses: props?.statuses?.results,
          contact_types: props?.contact_types?.results
      }}>
          <CommunityUnitEditForm cu={props?.cu} />
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

  // cu['facility_name'] = facilities.find(fac => fac.name = cu['facility_name'])[]

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

        response["statuses"] =  await (await statuses.json())
        break;

      case "facilities":
        const facilities = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?page_size=20&fields=id,name,county,sub_county_name,constituency,ward_name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["facilities"] =  await (await facilities.json())
        break;

      case "contact_types":
        const contact_types = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/contact_types/?fields=id,name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["contact_types"] =  await (await contact_types.json())
        break;

      case "services":
        const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=1000&fields=id,name`,{
          headers:{
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
          
        })

        response["services"] =  await (await services.json())
        break;
      }
      } 

      console.log({response})

      return {
        props: response 
      }
      
    }
    
  catch(e) {
    console.error(e.message)
  }

}

