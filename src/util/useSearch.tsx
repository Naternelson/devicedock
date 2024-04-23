import { useLocation } from 'react-router-dom';

export const useSearch = (params?: string[]) => {
	const { search } = useLocation();
	const searchParams = new URLSearchParams(search);

	const searchResults =
		params?.reduce((acc, param) => {
			const value = searchParams.get(param);
			if (value !== null) {
				acc[param] = value;
			}
			return acc;
		}, {} as Record<string, string | null>) || {}; 

	return searchResults;
};
