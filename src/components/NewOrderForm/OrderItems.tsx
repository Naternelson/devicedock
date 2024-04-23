import React, { useEffect, useState } from 'react';
import { useOrgId } from '../../util';
import { getDocs, query } from 'firebase/firestore';
import { Product, productsCollection } from '../../types/Product';
import { OrderFormData } from './Form';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Skeleton, Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

interface OrderItemProductIdProps {
	index: number;
	TextFieldProps?: TextFieldProps;
}

export const OrderItemProductId: React.FC<OrderItemProductIdProps> = ({ index, TextFieldProps }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext<OrderFormData>();
	const [options, setOptions] = useState<{ id: string; product: Product }[]>([]);
	const [loading, setLoading] = useState(false); // Add loading state
	const orgId = useOrgId();
	useEffect(() => {
		if (!orgId) return;
		const fetchProducts = async () => {
			setLoading(true);
			const snap = await getDocs(query(productsCollection(orgId)));
			setLoading(false);
			setOptions(snap.docs.map((doc) => ({ id: doc.id, product: doc.data() as Product })));
		};
		fetchProducts();
	}, [orgId]);

	const errorMessage = errors.orderItems?.[index]?.productId?.message?.toString();
	if(loading) return <Skeleton variant="text" ><TextField fullWidth size="small"/></Skeleton>;
	return (
		<Controller
			control={control}
			name={`orderItems.${index}.productId` as const}
			render={({ field }) => (
				<TextField
					disabled={loading}
					select={!loading}
					fullWidth
					{...field}
					value={!loading ? field.value : ''}
					size="small"
					label="Product"
					error={!!errorMessage}
					helperText={errorMessage}
					{...TextFieldProps}>
					{options.map((p) => (
						<MenuItem key={p.id} value={p.id} divider>
							<Stack width={'100%'} direction="row" justifyContent="space-between" alignItems="center">
								<Typography>{p.product.name}</Typography>
								<Info
									sx={{ color: (theme) => theme.palette.grey[500] }}
									color="inherit"
									fontSize="small"
								/>
							</Stack>
						</MenuItem>
					))}
				</TextField>
			)}
		/>
	);
};

export const OrderItemQuantityField = ({
	index,
	TextFieldProps,
}: {
	index: number;
	TextFieldProps?: TextFieldProps;
}) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<OrderFormData>();
	const field = register(`orderItems.${index}.quantity` as const, {
		required: 'Quantity is required',
		valueAsNumber: true,
		min: { value: 1, message: 'Quantity must be at least 1' },
	});
	const errorMessage = errors.orderItems?.[index]?.quantity?.message?.toString();
	return (
		<TextField
			fullWidth
			size="small"
			{...field}
			label="Quantity"
			error={!!errorMessage}
			helperText={errorMessage}
			{...TextFieldProps}
		/>
	);
};

export const OrderItemNotesField = ({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<OrderFormData>();
	const field = register(`orderItems.${index}.notes` as const);
	const errorMessage = errors.orderItems?.[index]?.notes?.message?.toString();
	return (
		<TextField
			fullWidth
			{...field}
			label="Notes"
			size="small"
			multiline
			rows={3}
			placeholder="Example: Needs to be delivered by 5pm."
			error={!!errorMessage}
			helperText={errorMessage}
			{...TextFieldProps}
		/>
	);
};
