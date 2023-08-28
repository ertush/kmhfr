import {useCallback, useState} from 'react';



export const useLocalStorageState = ({ key, value }) => {
	const parsedLocalStorage = JSON.parse(localStorage.getItem(key) || '{}');
	const initialValue = Object.keys(parsedLocalStorage).length > 0 ? parsedLocalStorage : value;
	const [localStorageState, setLocalStorageState] = useState(initialValue);

	const handleUpdateLocalStorageState = useCallback(
		(x) => {
			setLocalStorageState(x);
			localStorage.setItem(key, JSON.stringify(x));
		},
		[key]
	);

	const resetLocalStorage = useCallback(() => {
		// [
		// 	'basic_details_form',
		// 	'facility_contacts_form',
		// 	'formId',
		// 	'geolocation_form',
		// 	'human_resource_form',
		// 	'infrastructure_form',
		// 	'regulation_form',
		// 	'services_form'
		// ].forEach(key => {
		// 	if(key.includes('formId')){
		// 		setLocalStorageState(0)
		// 		localStorage.setItem(key, JSON.stringify(0));
		// 	} else {
		// 		setLocalStorageState("")
		// 		localStorage.setItem(key, JSON.stringify(""));
		// 	}
		// })

		console.log("[>>>] Reseting form.....")
	},[])


	return { actions :{
				use: () => [localStorageState, handleUpdateLocalStorageState],
				reset: resetLocalStorage
				}
		};
};