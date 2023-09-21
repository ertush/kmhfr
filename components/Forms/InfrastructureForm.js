import { useContext, useCallback} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FormContext } from './Form';
import { FacilityIdContext } from './Form'


import {
    handleInfrastructureSubmit, handleInfrastructureUpdates,
} from '../../controllers/facility/facilityHandlers'
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';


export function InfrastructureForm() {


    // Context
    const options = useContext(FormOptionsContext);
    const [formId, setFormId] = useContext(FormContext);
    const[facilityId, _] = useContext(FacilityIdContext);

    
    const { updatedSavedChanges, updateFacilityUpdateData } = options['19']?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }

    


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

	})(options['16']?.infrastructure ?? [])

       //Event handlers
       const handleInfrastructurePrevious = useCallback(() => {
        setFormId(`${parseInt(formId) - 1}`);
    }, []);


       return ( <>
            <h4 className="text-lg uppercase mt-4 pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Infrastracture</h4>
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <EditListWithCount
                        initialSelectedItems={[]}
                        otherItemsCategory={null}
                        itemsCategoryName={'infrastructure'}
                        categoryItems={infrastructureOption.categories}
                        options={options['16']?.infrastructure}
                        token={options['18']?.token ?? options['22']?.token}
                        itemId={facilityId}
                        item={options['19']?.data ?? null}   
                        handleItemsSubmit={handleInfrastructureSubmit}
                        handleItemsUpdate={handleInfrastructureUpdates}
                        removeItemHandler={() => null}
                        setIsSavedChanges={updatedSavedChanges}
                        handleItemPrevious={handleInfrastructurePrevious}
                        setNextItemCategory={setFormId}
                        setItemsUpdateData={updateFacilityUpdateData}
                        nextItemCategoryId={formId}
                        nextItemCategory={'human resource'}
                        previousItemCategory={'services'}
                        setIsSaveAndFinish={updatedSavedChanges}
                        itemData={options['19']?.data ? options['19']?.data?.facility_infrastructure : null}
                    />

                </div>
            </div>
        </>
       )
}