import { useNavigate, useSearchParams } from 'react-router-dom';

interface NavigateOptions {
	back?: boolean;
	to?: string;
	searchParams?: URLSearchParams;
}

export const useAppNav = (urlBase?: string) => {
	const nav = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const navigate = (options: NavigateOptions) => {
		// Handle going back
		if (options.back) {
			nav(-1);
			if (options.searchParams) {
				setSearchParams(options.searchParams);
			}
			return;
		}

		// Handle navigation to a new route with updated search parameters
		if (options.to) {
			const path = urlBase ? `/${urlBase}/${options.to}`.replace(/\/\/+/g, '/') : options.to;

			if (options.searchParams) {
				nav(`${path}?${options.searchParams.toString()}`);
			} else {
				nav(path);
			}
			return; // Ensure no further setSearchParams if navigated already with parameters in URL
		}

		// Update search parameters if provided, without navigation
		if (options.searchParams) {
			setSearchParams(options.searchParams);
		}
	};

	return { navigate, searchParams };
};

export const useNavDashboard = () => {
	const { navigate, searchParams } = useAppNav('/dashboard');
	return { navigate, searchParams };
};
export const useNavOrders = () => {
	const { navigate, searchParams } = useAppNav('/dashboard/orders');
	return { navigate, searchParams };
};
export const useNavProducts = () => {
	const { navigate, searchParams } = useAppNav('/dashboard/products');
	return { navigate, searchParams };
};
