import { CommunityUnitEditForm } from '../../../components/Forms/CommunityUnitsForms'
import { useState, useEffect, createContext } from 'react'
import { checkToken } from '../../../controllers/auth/auth'
import {z} from 'zod'
import { getUserDetails } from '../../../controllers/auth/auth'
// import Alert from '@mui/material/Alert'


export const ChuOptionsContext = createContext()


export default function CommunityUnitEdit(props) {
  // console.log({props})

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  if (isClient) {

    return (
      <ChuOptionsContext.Provider value={{
        facilities: props?.facilities,
        services: props?.services,
        statuses: props?.statuses,
        contactTypes: props?.contact_types
      }}>
        <CommunityUnitEditForm props={{ ...props?.cu, token: props?.token }} />
      </ChuOptionsContext.Provider>
    )
  } else {
    return null
  }


}


export async function getServerSideProps(ctx) {

  const { token } = await checkToken(ctx?.req, ctx?.res)

  const response = {}

  const options = [
    "cu",
    "statuses",
    "facilities",
    "contact_types",
    "services"
  ]

  const zSchema = z.object({
    id: z.string('Should be a uuid string').optional(),
  })


  const queryId = zSchema.parse(ctx.query).id


  async function fetchFacilities(wardCode) {
   

      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?ward_code=${wardCode}&reporting_in_dhis=true&closed=false`, { /*&owner_type=6a833136-5f50-46d9-b1f9-5f961a42249f*/
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        }

      })
      .then(resp => resp.json())
      .then(resp => {        
        return resp?.results?.map(({ id, name }) => ({ label: name, value: id }))
      })
      .catch(console.error)
   
  }



  async function getProps(token, options) {

    try {

      if (token.error) throw Error('Unable to get token')

      for (let option of options) {
        switch (option) {

          case "cu":
            const cu = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${queryId}/`, {
              headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
              }

            })

            response["cu"] = (await (await cu.json())) ?? []

            break;

          case "statuses":
            const statuses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/statuses/?fields=id,name`, {
              headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
              }

            })

            response["statuses"] = ((await (await statuses.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))) ?? []
            break;

          case "facilities":

            
            response['facilities'] = (await fetchFacilities(response?.cu?.ward_code)) ?? []

            break;

          case "contact_types":
            const contact_types = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/contact_types/?fields=id,name`, {
              headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
              }

            })

            response["contact_types"] = ((await (await contact_types.json()))?.results?.map(({ id, name }) => ({ label: name, value: id }))) ?? []
            break;

          case "services":
            const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`, {
              headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
              }

            })

            response["services"] = ((await (await services.json()))?.results) ?? []
            break;
        }
      }

      response['token'] = token


    }
    catch (e) {
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

