import { useContext, useEffect, createContext, useRef, useState} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { useRouter } from 'next/router'


import {
    handleInfrastructureSubmit, handleInfrastructureUpdates,
} from '../../controllers/facility/facilityHandlers'
// import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import { UpdateFormIdContext } from './Form';
import { useSearchParams } from 'next/navigation';

export const SubmitTypeCtxInfra = createContext(null)

export function InfrastructureForm() {

    // Context
    const options = useContext(FormOptionsContext);
    const setFormId = useContext(UpdateFormIdContext)

    const pageParams = useSearchParams()

    const facilityId = pageParams.get('facilityId')
      

    // const [servicesFormUrl, setServicesFormUrl] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [cachedInfrastructure, setCachedInfrastructure] = useState();
    const [from, setFrom] = useState();

    const submitType = useRef()

    const router = useRouter()
    
    const tableheaders =[
        "Name",
        "Category",
        "Present",
        "Number"
    ]

    //Options
    const infrastructureOption = ((_infrastructure) => {

		
		const categories = _infrastructure.map(({category_name, category}) => ({label:category_name, value:category}));

		const infraCategoryValues = [ ...(new Set(categories.map(({value}) => value)).values()) ];

		const infraCategories = infraCategoryValues.map((id) => {
			return categories.filter(({value}) => value === id)[0]
		})

		return {
			categories: infraCategories,
		}

	})(options.infrastructure ?? [])

       //Event handlers
    function handleInfrastructurePrevious(e) {

        e.preventDefault()

       
        router.push({
            pathname: '/facilities/add',
            query: {
                formId: 4,
                from: "previous",
                facilityId,

            }
        })
        .then((navigated) => {
            if(navigated) setFormId(4)
        })


    }

    useEffect(() => {
        if(window) {
            const currentUrl = new URL(window.document.location.href)


            setFrom(currentUrl.searchParams.get('from'))

            if(currentUrl.searchParams.get('from') == "previous") {
                const infraEnc = window.localStorage.getItem('infrastructure')
                const infraStr = Buffer.from(infraEnc ?? 'e30=', 'base64').toString()
                const infrastructure = JSON.parse(infraStr)
    
                console.log({infraEnc, infrastructure})


                function getServiceAttr(infraId, prop) {
                return options?.infrastructure?.find(({id}) => id == infraId)[prop]
              }
          
              function getServiceCategoryAttr(infraId, prop) {
                return infrastructureOption.categories?.find(({value}) => value == getServiceAttr(infraId, "category"))[prop]
              }
          
              if (Array.isArray(infrastructure)) {
                const result = []
          
                setCachedInfrastructure(() => {

                    /**
                     *  rowid: element.speciality,
                        sname: element.speciality_name,
                        count: element.count,
                        category_id: cat,
                        category_name: options.filter((e) => e.id == element.speciality)[0].category_name,
                        iscategoryvisible: false
                     */
          
                    // console.log("setting selectedItems")
                    infrastructure?.map((infrastructure) => {
                      result.push({ 
                        sname: getServiceAttr(infrastructure?.infrastructure, "name"), 
                        rowid: infrastructure?.infrastructure, 
                        category_id: getServiceCategoryAttr(infrastructure?.infrastructure, "value"), 
                        category_name: getServiceCategoryAttr(infrastructure?.infrastructure, "label"),
                        count: infrastructure?.count, 
                        iscategoryvisible: false,

                     })
                    })
          
                    return result
          
                })
              }
            }
        }
    
    }, [])


       return (
         <>
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900">Infrastracture</h4>
            
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>
          
                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <SubmitTypeCtxInfra.Provider value={submitType} >
                    <EditListWithCount
                        otherItemsCategory={null}
                        itemsCategoryName={'infrastructure'}
                        categoryItems={infrastructureOption.categories}
                        options={options.infrastructure}
                        token={options.token}
                        itemId={options?.data?.id ?? facilityId}
                        handleItemsSubmit={handleInfrastructureSubmit}
                        handleItemsUpdate={handleInfrastructureUpdates}
                        setSubmitting={setSubmitting}
                        submitting={submitting}
                        handleItemPrevious={handleInfrastructurePrevious}
                        nextItemCategory={'human resource'}
                        previousItemCategory={'services'}
                        itemData={options?.data ? options?.data?.facility_infrastructure : cachedInfrastructure ?? null}
                        title={tableheaders}
                        setFormId={setFormId}
                        from={from}
                    />
                    </SubmitTypeCtxInfra.Provider>

                </div>
            </div>
        </>
       )
}