import { Controller, useFormContext } from 'react-hook-form';
import { OrderFormData as FormData } from './Form';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOrgId } from '../../util';
import { getDocs, query, where } from 'firebase/firestore';
import { ordersCollection } from '../../types/Order';

export const OrderIDNameField = React.memo(
	({ TextFieldProps, index }: { TextFieldProps?: TextFieldProps; index: number }) => {
		const {
			setValue,
			control,
			formState: { errors },
		} = useFormContext<FormData>();
		const [loading, setLoading] = useState(false);
		const [options, setOptions] = useState<string[]>([]);
		const orgId = useOrgId();
		useEffect(() => {
			if (!orgId) return;
			const fetch = async () => {
				setLoading(true);
				const q = query(ordersCollection(orgId));
				const snap = await getDocs(q);
				if (snap.empty) {
					setLoading(false);
					setOptions([]);
					return;
				}
				const arr = new Map<string, boolean>();

				snap.forEach((doc) => {
					doc.data().ids?.forEach((id: { name: string }) => {
						arr.set(id.name, true);
					});
				});
				setOptions(Array.from(arr.keys()));
				setLoading(false);
			};
			fetch();
		}, [orgId]);

		return (
			<Controller
				control={control}
				name={`ids.${index}.name` as const}
				render={({ field }) => (
					<Autocomplete
						{...field}
						loading={loading}
						freeSolo
						fullWidth
						openOnFocus
						autoHighlight
						autoSelect
						includeInputInList
						options={options}
						onChange={(_e, value) => {
							setValue(`ids.${index}.name`, value || '');
						}}
						renderInput={(params) => {
							return (
								<TextField
									placeholder="Order ID, Purcher Order, etc."
									{...params}
									label="ID Name"
									fullWidth
									size="small"
									error={Boolean(errors.ids?.[index]?.name)}
									helperText={errors.ids?.[index]?.name?.message}
									{...TextFieldProps}
								/>
							);
						}}
					/>
				)}
			/>
		);
	},
);

/**
 * TextField for the identifier value field.
 */

export const OrderIDValueField = React.memo(({ TextFieldProps, index }: { TextFieldProps?: TextFieldProps; index: number }) => {
	const {
		watch,
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const orgId = useOrgId();
	const idName = watch(`ids.${index}.name`);
	const field = register(`ids.${index}.value` as const, {
		required: 'ID Value is required',
		minLength: { value: 1, message: 'ID value is too short' },
		maxLength: { value: 255, message: 'ID value is too long' },
		validate: {
			unique: async (value) => {
				if (!orgId || !idName) return true;
				try {
					const valid = await isUnique(orgId, value, idName);
					return valid || 'Value must be unique';
				} catch (error) {
					console.error(error);
					return 'Error checking uniqueness';
				}
			},
		},
	});
	return (
		<TextField
			label="ID Value"
			fullWidth
			size="small"
			error={Boolean(errors.ids?.[index]?.value)}
			helperText={errors.ids?.[index]?.value?.message}
			{...field}
			{...TextFieldProps}
		/>
	);
});

const isUnique = async (orgId: string, value: string, name: string) => {
	const q = query(ordersCollection(orgId), where('ids', 'array-contains', { name, value }));
	const snap = await getDocs(q);
	return snap.empty;
};
