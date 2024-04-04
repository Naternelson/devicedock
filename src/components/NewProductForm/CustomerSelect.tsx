import { Controller, useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';
import { useEffect, useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { useOrgId } from '../../util';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { Customer, customersCollection } from '../../types/Customer';

export const CustomerSelectField = () => {
	const orgId = useOrgId();
	const { control } = useFormContext<ProductFormData>();
	const [customers, setCustomers] = useState<{ id: string; data: Customer }[]>([]);
	useEffect(() => {
		if (!orgId) return;
		const q = query(customersCollection(orgId), orderBy('name'));
		return onSnapshot(q, (snap) => {
			setCustomers(snap.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
		});
	}, [orgId]);
	return (
		<Controller
			name="customers"
			control={control}
			render={({ field }) => (
				<Select {...field} multiple>
					{customers.map((c) => (
						<MenuItem key={c.id} value={c.id}>
							{c.data.name}
						</MenuItem>
					))}
				</Select>
			)}
		/>
	);
};
