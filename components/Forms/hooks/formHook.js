import React from 'react';



export const useLocalStorageState = ({ key, value }) => {
	const parsedLocalStorage = JSON.parse(localStorage.getItem(key) || '{}');
	const initialValue = Object.keys(parsedLocalStorage).length > 0 ? parsedLocalStorage : value;
	const [localStorageState, setLocalStorageState] = React.useState(initialValue);

	const handleUpdateLocalStorageState = React.useCallback(
		(x) => {
			setLocalStorageState(x);
			localStorage.setItem(key, JSON.stringify(x));
		},
		[key]
	);

	return [localStorageState, handleUpdateLocalStorageState];
};