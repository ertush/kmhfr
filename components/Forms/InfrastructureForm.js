import { useContext, useCallback} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FormContext } from './Form';
import {
    handleInfrastructureSubmit,
} from '../../controllers/facility/facilityHandlers'


export function InfrastructureForm() {

    // Constants
    const facilityId = '09990980'

    // Context
    const options = useContext(FormOptionsContext);
    const [formId, setFormId] = useContext(FormContext);


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
            <h4 className="text-lg uppercase pb-2 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Infrastracture</h4>
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
                        itemId={facilityId}
                        item={null}
                        handleItemsSubmit={handleInfrastructureSubmit}
                        handleItemsUpdate={() => null}
                        removeItemHandler={() => null}
                        setIsSavedChanges={null}
                        setItemsUpdateData={null}
                        handleItemPrevious={handleInfrastructurePrevious}
                        setNextItemCategory={setFormId}
                        nextItemCategoryId={formId}
                        nextItemCategory={'human resource'}
                        previousItemCategory={'services'}
                        setIsSaveAndFinish={() => null}
                    />

                </div>
            </div>
        </>
       )
}