import { useContext, useMemo, useState} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { useRouter } from 'next/router'


import {
    handleInfrastructureSubmit, handleInfrastructureUpdates,
} from '../../controllers/facility/facilityHandlers'
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import { UpdateFormIdContext } from './Form';


export function InfrastructureForm() {


    // Context
    const options = useContext(FormOptionsContext);
    const setFormId = useContext(UpdateFormIdContext)

    // const [formId, setFormId] = useMemo(() => {
    //     let id = ''

    //     function setId(_id) {
    //         id = _id
    //     }

    //     if(window) {
    //         setId(new URL(window.location.href).searchParams.get('formId'))
    //     }

        

    //     return [id, setId]
    // }, [])
    const[facilityId, setFacilityId] = useMemo(() => {
        let id = ''

        function setId(_id) {
            id = _id
        }

        if(window) {
            setId(new URL(window.location.href).searchParams.get('facilityId'))
        }

        
        return [id, setId]
    }, [])

    // const [servicesFormUrl, setServicesFormUrl] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()
    
    // const { updatedSavedChanges, updateFacilityUpdateData } = options?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }

    
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
       function handleInfrastructurePrevious() {
        // setFormId(`${parseInt(formId) - 1}`);
        // const url = new URL(servicesFormUrl)

        // url.searchParams.set('formId', '4')

        // url.searchParams.set('from', 'previous')

        // router.push(url)

        router.push({
            pathname: '/facilities/add',
            query: {
                formId: 4
            }
        })
        .then((navigated) => {
            if(navigated) setFormId(4)
        })


    }


       return ( <>
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Infrastracture</h4>
            
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>
          
                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <EditListWithCount
                        otherItemsCategory={null}
                        itemsCategoryName={'infrastructure'}
                        categoryItems={infrastructureOption.categories}
                        options={options.infrastructure}
                        token={options.token}
                        itemId={facilityId ?? options?.data?.id}
                        handleItemsSubmit={handleInfrastructureSubmit}
                        handleItemsUpdate={handleInfrastructureUpdates}
                        setSubmitting={setSubmitting}
                        submitting={submitting}
                        handleItemPrevious={handleInfrastructurePrevious}
                        nextItemCategory={'human resource'}
                        previousItemCategory={'services'}
                        itemData={options?.data ? options?.data?.facility_infrastructure : null}
                        title={tableheaders}
                        setFormId={setFormId}
                    />

                </div>
            </div>
        </>
       )
}