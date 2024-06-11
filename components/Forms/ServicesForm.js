import {useState, useEffect, useContext, createContext, useMemo, useRef} from 'react';
import EditListItem from './formComponents/EditListItem';
import { FormOptionsContext } from '../../pages/facilities/add';
// import { FormContext } from './Form';

import {
    // handleServiceDelete,
    handleServiceSubmit,
    handleServiceUpdates
} from '../../controllers/facility/facilityHandlers'
// import { FacilityIdContext } from './EditForm'
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import {useRouter} from 'next/router'
import { UpdateFormIdContext } from './Form';


export const SubmitTypeCtx = createContext(null)


export function ServicesForm() {


    const setFormId = useContext(UpdateFormIdContext)

    const[facilityId, setFacilityId] = useMemo(() => {
        let id = ''

        function setId(_id) {
            id = _id
        }

        if(window) {
            setId(new URL(window.location.href).searchParams.get('facilityId') ?? '')
        }

        // console.log({id})

        return [id, setId]
    }, [])
 

    const router = useRouter()

    const [submitting, setSubmitting] = useState(false)
    
    const options = useContext(FormOptionsContext);
    
    const submitType = useRef(null)

    //Options
    const serviceOptions = ((_services) => {

		// extract service categories and compose into an array of objects

		const categories = _services.map(({category_name, category}) => ({label:category_name, value:category}));

		const serviceCategoryValues = [ ...(new Set(categories.map(({value}) => value)).values()) ];

		const serviceCategories = serviceCategoryValues.map((id) => {
			return categories.filter(({value}) => value === id)[0]
		})

		return {
			categories: serviceCategories,
		}
	})(options?.services ?? [])

    //State
    const [cachedServices, setCachedServices] = useState();

    const editMode = options?.data ? true : false

    //Event handlers
    function handleServicePrevious(e) {
      
        e.preventDefault()

        router.push({
            pathname: '/facilities/add',
            query: {
                formId: 3,
                facilityId,
                from:'previous'
            }
        })
        .then((navigated) => {
            if(navigated) setFormId(3)
        })
        

  } 

  useEffect(() => {

    if(window) {
        const currentUrl = new URL(window.document.location.href)

        if(currentUrl.searchParams.get('from') == "previous") {
            const servicesEnc = window.localStorage.getItem('services')
            const servicesStr = Buffer.from(servicesEnc ?? 'e30=', 'base64').toString()
            const services = JSON.parse(servicesStr)

            // console.log(servicesEnc, services)

            // setCachedServices(services)

            function getServiceAttr(serviceId, prop) {
                return options?.services?.find(({id}) => id == serviceId)[prop]
              }
          
              function getServiceCategoryAttr(serviceId, prop) {
                return serviceOptions.categories?.find(({value}) => value == getServiceAttr(serviceId, "category"))[prop]
              }
          
              if (Array.isArray(services)) {
                const result = []
          
                setCachedServices(() => {
          
                    // console.log("setting selectedItems")
                    services?.map((service) => {
                      result.push({ sname: getServiceAttr(service?.service, "name"), rowid: service?.service, category_id: getServiceCategoryAttr(service?.service, "value"), category_name: getServiceCategoryAttr(service?.service, "label") })
                    })
          
                    return result
          
                })
              }
    
        }
     
        
    }
  }, [])

    return <>
                <h4 className="text-lg uppercase pb-2 mt-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900">Services</h4>
                <div className='flex flex-col w-full items-start justify-start gap-3 mt-1'>

                
                    {/* Edit list Container */}
                    <div className='flex items-center w-full h-auto min-h-[300px]'>

                        <SubmitTypeCtx.Provider value={submitType}>

                        <EditListItem
                            itemData={(options?.data ? {currentServices: options?.data.facility_services} : {currentServices: cachedServices}) ?? null}
                            categoryItems={serviceOptions.categories}
                            itemId={options?.data?.id}
                            options={options?.services}
                            token={options?.token}
                            itemName={'facility_services'}
                            handleItemsSubmit={handleServiceSubmit}
                            handleItemsUpdate={handleServiceUpdates}
                            setSubmitting={setSubmitting}
                            submitting={submitting}
                            editMode={editMode}
                            handleItemPrevious={handleServicePrevious}
                            setFormId={setFormId}     
                            /> 
                        </SubmitTypeCtx.Provider>

                    </div>
                </div>
            </>
}