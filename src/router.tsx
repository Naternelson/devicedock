import { createBrowserRouter } from 'react-router-dom';
import {
	DashboardHome,
	DashboardLayout,
	Error404,
	Home,
	LoginPage,
	OrdersPage,
	PrivacyPolicy,
	RootLayout,
	ProductsPage,
	SignupPage,
	TermsPage,
	ProductsIndexPage,
	NewProductPage,
} from './pages';
import { collection, getDocs, getFirestore, limit, query, where } from 'firebase/firestore';
import { NewOrderPage } from './pages/OrdersPage/NewOrderPage';
import { OrdersIndexPage } from './pages/OrdersPage/OrderIndex';

export default createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <Error404 />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: 'privacy',
				element: <PrivacyPolicy />,
			},
			{
				path: 'terms',
				element: <TermsPage />,
			},
			{
				path: 'login',
				element: <LoginPage />,
			},
			{
				path: 'signup',
				element: <SignupPage />,
				loader: async ({ request }) => {
					const url = new URL(request.url);

					// Getting the orgCode from the searchParams
					const orgCode = url.searchParams.get('orgCode');
					if (!orgCode || orgCode === '') return {};

					try {
						const orgQuery = query(
							collection(getFirestore(), 'organizations'),
							where('code', '==', orgCode),
							limit(1),
						);
						const docSnap = await getDocs(orgQuery);
						if (docSnap.empty) return { error: 'No organization found for given link.' };
						const d = docSnap.docs[0].data();
						return {
							organizationCode: d.code,
							organizationName: d.name,
							organizationId: d.id,
							error: null,
						};
					} catch (error) {
						console.error('Error retrieving organization data:', error);
						return { error: 'Error retrieving organization data.' };
					}
				},
			},
			{
				path: 'dashboard',
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <DashboardHome />,
					},
					{
						path: 'products',
						element: <ProductsPage />,
						children: [
							{
								index: true,
								element: <ProductsIndexPage />,
							},
							{
								path: 'new',
								element: <NewProductPage />,
							},
							{
								path: ':id',
								element: <ProductsIndexPage />,
							},
							{
								path: ':id/edit',
								element: <NewProductPage />,
							},
						],
					},
					{
						path: 'orders',
						element: <OrdersPage />,
						children: [
							{
								index: true,
								element: <OrdersIndexPage />,
							},

							{
								path: 'new',
								element: <NewOrderPage />,
							},
						],
					},
				],
			},
		],
	},
]);
