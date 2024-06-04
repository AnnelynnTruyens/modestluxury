import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContainer";

// Hook for fetching of data on a path
const useFetch = (path: string) => {
	// State to store fetched data and potential errors
	const [data, setData] = useState(); // Initialise with data from store
	const [error, setError] = useState(); // Errors, if any
	const { token } = useAuthContext();

	// Function to fetch data
	const fetchData = useCallback(() => {
		let isActive = true; // Control is hook is still active

		// Fetch data
		fetch(path, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((data) => data.json()) // Data in JSON-format
			.then((data) => isActive && setData(data)) // Set Data is hook is active
			.catch((err) => isActive && setError(err)) // Set error if any and if hook is active
			.finally(() => isActive && (isActive = false)); // When done, put isActive on false

		// Put hook on inactive
		return () => {
			isActive = false;
		};
	}, [path]);

	// UseEffect to fetch data when using component for the first time or when fetchData changes
	useEffect(() => {
		return fetchData(); // Fetch data when fetchData function changes
	}, [fetchData]);

	// Function to refetch data
	const invalidate = () => {
		fetchData(); // Fetch new data
	};

	// Set isLoading when data is still loading
	const isLoading = !error && !data;

	// Return data and functions available for use of this hook
	return {
		isLoading, // Boolean to see if data is loading
		data, // Fetched data
		error, // Potential errors
		invalidate, // Function to refetch data
	};
};

export default useFetch;
