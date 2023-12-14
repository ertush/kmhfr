import {useState, useContext, useMemo} from 'react';
import EditListItem from './formComponents/EditListItem';
import { FormOptionsContext } from '../../pages/facilities/add';
// import { FormContext } from './Form';

import {
    handleServiceDelete,
    handleServiceSubmit,
    handleServiceUpdates
} from '../../controllers/facility/facilityHandlers'
// import { FacilityIdContext } from './EditForm'
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';




// import {Formik, Field, Form} from 'formik'


export function ServicesForm() {
    // ConstantsityUpdatesContext
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

    
    const [regulationFormURL, setRegulationFormURL] = useState('');
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

    const [submitting, setSubmitting] = useState(false)
    
    const options = useContext(FormOptionsContext);
    
    const { updatedSavedChanges, updateFacilityUpdateData } = options?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }
 
    
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
    const [services, setServices] = useState();

    //Event handlers
    function handleServicePrevious() {
        // setFormId(`${parseInt(formId) - 1}`);

        const url = new URL(regulationFormURL)

        url.searchParams.set('formId', '3')

        window.location.href = url

    

    } 

    return <>
                <h4 className="text-lg uppercase pb-2 mt-4 border-b border-blue-600 w-full mb-4 font-semibold text-blue-900">Services</h4>
                <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                
                    {/* Edit list Container */}
                    <div className='flex items-center w-full h-auto min-h-[300px]'>

                        <EditListItem
                            initialSelectedItems={options?.data? options?.data.facility_services:[]}
                            categoryItems={serviceOptions.categories}
                            itemsCategoryName={'Services'}
                            itemId={facilityId}
                            setItems={setServices}
                            item={options?.data ?? null}
                            options={options?.services}
                            token={options?.token}
                            removeItemHandler={handleServiceDelete}
                            handleItemsSubmit={handleServiceSubmit}
                            handleItemsUpdate={handleServiceUpdates}
                            setSubmitting={setSubmitting}
                            submitting={submitting}
                            setItemsUpdateData={updateFacilityUpdateData}
                            handleItemPrevious={handleServicePrevious}
                            setIsSaveAndFinish={updatedSavedChanges}
                            servicesData={options?.data ? options?.data?.facility_services: null}
                            
                        /> 

                    </div>
                </div>
            </>
}