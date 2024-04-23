import { Box, Breadcrumbs, Button, Link, Typography } from "@mui/material"
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useOrgId } from "../../util";
import { ordersCollection } from "../../types/Order";
import { getDocs, getFirestore, writeBatch } from "firebase/firestore";


export const OrdersPage = () => {
	const orgId = useOrgId();
	const deleteAllOrders = async () => {
		if(!orgId) return;
		
		const snap = await getDocs(ordersCollection(orgId))
		const batch = writeBatch(getFirestore());
		snap.forEach(doc => {
			batch.delete(doc.ref);
		});	
		await batch.commit();
		alert('All orders deleted');
	}
	return (
		<Box display="flex" flex={1} flexDirection={'column'}>
			<OrdersBreadcrumbs />
			<Box display="flex" flex={1}>
				<Outlet />
				<Button onClick={deleteAllOrders}>Delete All Orders</Button>
			</Box>
		</Box>
	);
};

const OrdersBreadcrumbs = () => {
	const location = useLocation();
	const parts = location.pathname.split('/').slice(1);
	// Remove any search params
	if (parts.length === 1) return null;
	return (
		<Breadcrumbs>
			{parts.map((part, i, arr) => {
				if (i === arr.length - 1)
					return (
						<Typography key={i} fontWeight={600}>
							{titleCase(part)}
						</Typography>
					);
				else
					return (
						<BreadcrumbLink key={i} to={'/' + parts.slice(0, i + 1).join('/')}>
							{titleCase(part)}
						</BreadcrumbLink>
					);
			})}
		</Breadcrumbs>
	);
};

const BreadcrumbLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
	return (
		<Link component={NavLink} to={to}>
			{children}
		</Link>
	);
};

const titleCase = (str: string) => {
	return str.replace(/\b\w/g, (l) => l.toUpperCase());
};