import { Box } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useOrders } from '../../api/useOrders';

export const DashboardHome = () => {
	const {orders} = useOrders({status: ['active', "queued"]});
	useEffect(() => {
		console.log({orders})
	},[])
	return (
		<Box>
			<h1>Dashboard</h1>
			<p>Welcome to the dashboard.</p>
		</Box>
	);
};

