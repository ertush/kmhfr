import {useContext, useRef, useState, createContext} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { useRouter } from 'next/router';

import {
    handleHrSubmit, handleHrUpdates
} from '../../controllers/facility/facilityHandlers';
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import { UpdateFormIdContext } from './Form';

import { useSearchParams } from 'next/navigation';



export const SubmitTypeCtxHr = createContext(null)


export function HumanResourceForm() {

    // Constants


    // Context
    const options = useContext(FormOptionsContext);
    const router = useRouter()
    const submitType = useRef(null)

    const setFormId = useContext(UpdateFormIdContext);

    const pageParams = useSearchParams()

    const facilityId = pageParams.get('facilityId')
      

    // const [infrastructureFormUrl, setInfrastructureFormUrl] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const { updatedSavedChanges, updateFacilityUpdateData } = options?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }


    const tableheaders = [
        "Name",
        "Present",
        "Number"
    ]


    // Options
    const hrOptions = ((_hr) => {

		// extract infrastructure categories and compose into an array of objects


		const categories = _hr.map(({category_name, category}) => ({label:category_name, value:category}));

		const hrCategoryValues = [ ...(new Set(categories.map(({value}) => value)).values()) ];

		const hrCategories = hrCategoryValues.map((id) => {
			return categories.filter(({value}) => value === id)[0]
		})

		return {
			categories: hrCategories,
		}

	})(options.hr ?? [])


    //Event handlers
    function handleHrPrevious(e){

    e.preventDefault()

   
    router.push({
        pathname: '/facilities/add',
        query: {
            formId: 5,
            facilityId,
            from: "previous"
        }
    })
    .then((navigated) => {
        if(navigated) setFormId(5)
    })
    


    }

    return (
        <>
            <h4 className="text-lg mt-4 uppercase pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900">Human resource </h4>
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <SubmitTypeCtxHr.Provider value={submitType}>
                    <EditListWithCount
                        initialSelectedItems={options?.data? options?.data.facility_specialists:[]}
                        categoryItems={hrOptions.categories}
                        itemsCategoryName={'human resource'}
                        token={options.token}
                        options={options.hr}
                        itemId={options?.data?.id ?? facilityId}
                        item={options?.data ?? null}
                        handleItemsSubmit={handleHrSubmit}
                        handleItemsUpdate={handleHrUpdates}
                        setSubmitting={setSubmitting}
                        submitting={submitting}
                        setIsSavedChanges={updatedSavedChanges}
                        handleItemPrevious={handleHrPrevious}
                        nextItemCategory={'finish'}
                        previousItemCategory={'infrastructure'}
                        itemData={options?.data ? options?.data?.facility_specialists : null}
                        title={tableheaders}

                    />
                    </SubmitTypeCtxHr.Provider>

                </div>

            </div>
        </>
    )
}