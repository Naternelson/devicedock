import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import { OrderFormData } from './Form';
import { Controller, useFormContext } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { customersCollection } from '../../types/Customer';
import { useOrgId } from '../../util';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { ordersCollection } from '../../types/Order';

export const ShipToField = ({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
	const { loading, options, errorMessage, control, setValue } = useShipToHooks();
	return (
		<Controller
			control={control}
			name="shipToAddress"
			rules={{ maxLength: { value: 100, message: 'Address is too long' } }}
			render={({ field }) => (
				<Autocomplete
					{...field}
					loading={loading}
					freeSolo
					fullWidth
					
					size="small"
					options={options}
					onChange={(_e, value) => {
						setValue(`shipToAddress`, value || '');
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							multiline
							label="Ship To Address"
							placeholder="123 Main St, City, State, Zip Code"
							error={Boolean(errorMessage)}
							helperText={errorMessage}
							onKeyDown={(e)=> handleKeyNavigation(e, params.inputProps['aria-expanded'] as string)}
							{...TextFieldProps}
						/>
					)}
				/>
			)}
		/>
	);
};
function handleKeyNavigation(event:React.KeyboardEvent<HTMLDivElement>, dropdownOpen:string) {
	if (dropdownOpen === 'true') {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				// Prevents the cursor from moving up or down in the textarea
				event.preventDefault();
				break;
			case 'Enter':
				// Prevent form submission or other undesired behavior when selecting an option
				break;
			default:
				break;
		}
	}
}

const useShipToHooks = () => {
	const {
		setValue,
		control,
		watch,
		formState: { errors },
	} = useFormContext<OrderFormData>();
	const [options, setOptions] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const errorMessage = errors['shipToAddress']?.message?.toString();
	const customerId = watch('customerId');
	const orgId = useOrgId();
	useEffect(() => {
		if (!customerId || !orgId) return;
		const fetchCustomerAddress = async () => {
			if (customerId.id === null) return;
			setLoading(true);
			const addresses = new Set<string>();
			const snap = await getDoc(doc(customersCollection(orgId), customerId.id));
			const previousOrdersWithCustomer = await getDocs(
				query(ordersCollection(orgId), where('customerId', '==', customerId.id)),
			);
			const customerAddress = snap?.data()?.address;
			if (customerAddress) addresses.add(customerAddress);
			previousOrdersWithCustomer.docs.forEach((doc) => addresses.add(doc.data().shipToAddress));

			const arr = Array.from(addresses);
			setValue('shipToAddress',arr[0] || '');
			setOptions(arr);
			setLoading(false);
		};
		fetchCustomerAddress();
	}, [customerId, orgId, setValue]);

	return {
		loading,
		options,
		errorMessage,
		control,
		setValue,
	};
};
