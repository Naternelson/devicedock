import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useOrgId } from '../../util/useOrgId';
import { onSnapshot } from 'firebase/firestore';
import { Autocomplete, TextField } from '@mui/material';
import { OrderFormData } from './Form';
import { customersCollection } from '../../types/Customer';

interface Customer {
	id: string | null;
	name: string;
}
interface CustomerSelectFieldProps {
	TextFieldProps?: object;
}
export const CustomerSelectField = ({ TextFieldProps }: CustomerSelectFieldProps) => {
	const {
		control,
		setValue,
		formState: { errors, defaultValues },
	} = useFormContext<OrderFormData>(); // Assuming you are using useFormContext to bind form context
	const orgId = useOrgId(); // This should be a hook or function that fetches the organization ID
	const [customers, setCustomers] = useState<Customer[]>([]);
	const defaultCustomer = { id: defaultValues?.customerId?.id || null, name: defaultValues?.customerId?.name || '' };
	const [currentCustomer, setCurrentCustomer] = useState<Customer>(defaultCustomer);
	const customerId = currentCustomer.id;
	const customerName = currentCustomer.name;
	useEffect(() => {
		if (!orgId) return;
		const c = customersCollection(orgId);
		const unsub = onSnapshot(c, (snap) => {
			setCustomers(
				snap.docs.map((d) => ({
					id: d.id,
					name: d.data().name,
				})),
			);
		});
		return () => unsub();
	}, [orgId]);

	useEffect(() => {
		setValue('customerId', { id: customerId, name: customerName})
	}, [customerId, customerName, setValue]);

	const errorMessage = errors.customerId?.message?.toString();
	return (
		<Controller
			control={control}
			name="customerId"
			render={({ field }) => (
				<Autocomplete
					{...field}
					size="small"
					freeSolo
					autoSelect
					options={customers}
					getOptionLabel={(option) => (typeof option === 'object' ? option.name : option)}
					onChange={(_e, value) => {
						if (typeof value === 'string') {
							setCurrentCustomer((p) => (p.name === value ? p : { id: null, name: value }));
						} else if (value) {
							setCurrentCustomer(value);
						} else {
							setCurrentCustomer({ id: null, name: '' });
						}
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							{...TextFieldProps}
							label="Customer"
							error={!!errorMessage}
							helperText={errorMessage}
						/>
					)}
				/>
			)}
		/>
	);
};
