import {useState, useContext, useCallback} from 'react';
import EditListItem from './formComponents/EditListItem';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FormContext } from './Form';
import {
    handleServiceSubmit,
    handleServiceUpdates
} from '../../controllers/facility/facilityHandlers'
import { FacilityIdContext } from './Form'



// import {Formik, Field, Form} from 'formik'


export function ServicesForm() {
    // Constants
    const[facilityId, _] = useContext(FacilityIdContext);
    const [formId, setFormId] = useContext(FormContext);
    const options = useContext(FormOptionsContext);
    


   

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
	})(options['15']?.service ?? [])

    //State
    const [services, setServices] = useState();

    //Event handlers
    const handleServicePrevious = useCallback(() => {
        setFormId(`${parseInt(formId) - 1}`);
    }, []);

    return <>
                <h4 className="text-lg uppercase pb-2 mt-4 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Services</h4>
                <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                    {/* Edit list Container */}
                    <div className='flex items-center w-full h-auto min-h-[300px]'>

                        <EditListItem
                            initialSelectedItems={[]}
                            categoryItems={serviceOptions.categories}
                            itemsCategoryName={'Services'}
                            setUpdatedItem={() => null}
                            itemId={facilityId}
                            setItems={setServices}
                            item={options['19']?.data ?? null}
                            options={options['15']?.service}
                            token={options['18']?.token ?? options['22']?.token}
                            removeItemHandler={() => null}
                            handleItemsSubmit={handleServiceSubmit}
                            handleItemsUpdate={handleServiceUpdates}
                            setNextItemCategory={setFormId}
                            nextItemCategoryId={formId}
                            nextItemCategory={'infrastructure'}
                            previousItemCategory={'regulation'}
                            handleItemPrevious={handleServicePrevious}
                            setIsSaveAndFinish={() => null}
                            servicesData={options['19']?.data ? options['19']?.data?.facility_services: null}
                            
                        /> 

                    </div>
                </div>
            </>
}