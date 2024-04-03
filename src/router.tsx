import { createBrowserRouter, redirect } from 'react-router-dom';
import { DashboardHome, Error404, Home, LoginPage, PrivacyPolicy, RootLayout, SignupPage, TermsPage } from './pages';
import { collection, getDocs, getFirestore, limit, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
				path: "privacy",
				element: <PrivacyPolicy />
			},
			{
				path: "terms",
				element: <TermsPage />
			},
			{
				path: 'login',
				element: <LoginPage />,
				loader: async () => {
					getAuth().currentUser && redirect('/dashboard');
					return {};
				}
			},
			{
				path: 'signup',
				element: <SignupPage />,
				loader: async ({ request }) => {
					getAuth().currentUser && redirect('/dashboard');
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
				element: <DashboardHome />,
				loader: async () => {
					!getAuth().currentUser && redirect('/login');
					return {};
				},
			},
		],
	},
]);
