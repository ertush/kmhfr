import {useContext, useCallback, useMemo, useState} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FormContext } from './Form';
import { FacilityIdContext } from './EditForm'

import {
    handleHrSubmit, handleHrUpdates
} from '../../controllers/facility/facilityHandlers';
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';




export function HumanResourceForm() {

    // Constants


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

    const [infrastructureFormUrl, setInfrastructureFormUrl] = useState('')
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

    const handleHrPrevious = useCallback(() => {

    const url = new URL(infrastructureFormUrl)

    url.searchParams.set('formId', '5')

    url.searchParams.set('from', 'previous')

    window.location.href = url
    }, []);

    return (
        <>
            <h4 className="text-lg mt-4 uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Human resource </h4>
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <EditListWithCount
                        initialSelectedItems={options?.data? options?.data.facility_specialists:[]}
                        categoryItems={hrOptions.categories}
                        itemsCategoryName={'human resource'}
                        token={options.token}
                        options={options.hr}
                        itemId={facilityId ?? options?.data?.id}
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

                </div>

            </div>
        </>
    )
}