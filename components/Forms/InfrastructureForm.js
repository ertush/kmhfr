import { useContext, useMemo, useState} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
// import { FormContext } from './Form';
// import { FacilityIdContext } from './EditForm'


import {
    handleInfrastructureSubmit, handleInfrastructureUpdates,
} from '../../controllers/facility/facilityHandlers'
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';


export function InfrastructureForm() {


    // Context
    const options = useContext(FormOptionsContext);
    // const [formId, setFormId] = useContext(FormContext);
    const [formId, setFormId] = useMemo(() => {
        let id = ''

        function setId(_id) {
            id = _id
        }

        if(window) {
            setId(new URL(window.location.href).searchParams.get('formId'))
        }

        // console.log({id})

        return [id, setId]
    }, [])

    // const[facilityId, _] = useContext(FacilityIdContext);
    const[facilityId, setFacilityId] = useMemo(() => {
        let id = ''

        function setId(_id) {
            id = _id
        }

        if(window) {
            setId(new URL(window.location.href).searchParams.get('facilityId'))
        }

        // console.log({id})

        return [id, setId]
    }, [])

    const [servicesFormUrl, setServicesFormUrl] = useState('')
    const [submitting, setSubmitting] = useState(false)
    
    const { updatedSavedChanges, updateFacilityUpdateData } = options?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }

    
    const tableheaders =[
        "Name",
        "Category",
        "Present",
        "Number"
    ]

    //Options
    const infrastructureOption = ((_infrastructure) => {

		// extract infrastructure categories and compose into an array of objects

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
        const url = new URL(servicesFormUrl)

        url.searchParams.set('formId', '4')

        url.searchParams.set('from', 'previous')


        window.location.href = url

    }


       return ( <>
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Infrastracture</h4>
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <EditListWithCount
                        initialSelectedItems={options?.data? options?.data.facility_infrastructure:[]}
                        otherItemsCategory={null}
                        itemsCategoryName={'infrastructure'}
                        categoryItems={infrastructureOption.categories}
                        options={options.infrastructure}
                        token={options.token}
                        itemId={facilityId ?? options?.data?.id}
                        item={options?.data ?? null}   
                        handleItemsSubmit={handleInfrastructureSubmit}
                        handleItemsUpdate={handleInfrastructureUpdates}
                        setSubmitting={setSubmitting}
                        submitting={submitting}
                        removeItemHandler={() => null}
                        setIsSavedChanges={updatedSavedChanges}
                        handleItemPrevious={handleInfrastructurePrevious}
                        setNextItemCategory={setFormId}
                        setItemsUpdateData={updateFacilityUpdateData}
                        nextItemCategoryId={formId}
                        nextItemCategory={'human resource'}
                        previousItemCategory={'services'}
                        setIsSaveAndFinish={updatedSavedChanges}
                        itemData={options?.data ? options?.data?.facility_infrastructure : null}
                        title={tableheaders}
                    />

                </div>
            </div>
        </>
       )
}