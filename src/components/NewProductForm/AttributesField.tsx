import { useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOrgId } from '../../util';
import { getDocs, query } from 'firebase/firestore';
import { productsCollection } from '../../types/Product';

/**
 * Custom hook for managing the attributes field array with react-hook-form.
 * @returns The field array methods and properties from useFieldArray.
 */
export const useAttributesFields = () => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray<ProductFormData, 'attributes'>({
		name: 'attributes',
		control,
	});
};

/**
 * TextField for the attribute name field.
 */
export const AttributeNameField = React.memo(
	({ TextFieldProps, index }: { TextFieldProps?: TextFieldProps; index: number }) => {
		const {
			setValue,
			register,
			formState: { errors },
		} = useFormContext<ProductFormData>();
		const [loading, setLoading] = useState(false);
		const [options, setOptions] = useState<string[]>([]);
		const orgId = useOrgId();
		useEffect(() => {
			if (!orgId) return;
			const fetch = async () => {
				setLoading(true);
				const q = query(productsCollection(orgId));
				const snap = await getDocs(q);
				const arr = new Map<string, boolean>();
				snap.forEach((doc) => {
					doc.data().attributes.forEach((attr: { name: string }) => {
						arr.set(attr.name, true);
					});
				});
				setOptions(Array.from(arr.keys()));
				setLoading(false);
			};
			fetch();
		}, [orgId]);
		const field = register(`attributes.${index}.name` as const, {
			required: 'Attribute name is required',
			maxLength: { value: 255, message: 'Attribute name is too long' },
		});
		return (
			<Autocomplete
				loading={loading}
				freeSolo
				fullWidth
				openOnFocus
				autoHighlight
				autoSelect
				includeInputInList
				options={options}
				onChange={(_e, value) => {
					setValue(`attributes.${index}.name`, value || '');
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						{...field}
						label="Attribute Name"
						fullWidth
						size="small"
						placeholder="Color, Size, etc."
						error={Boolean(errors.attributes?.[index]?.name)}
						helperText={errors.attributes?.[index]?.name?.message}
						{...TextFieldProps}
					/>
				)}
			/>
		);
	},
);

/**
 * TextField for the attribute value field.
 */
export const AttributeValueField = React.memo(
	({ TextFieldProps, index }: { TextFieldProps?: TextFieldProps; index: number }) => {
		const {
			watch,
			setValue,
			register,
			formState: { errors },
		} = useFormContext<ProductFormData>();
		const [loading, setLoading] = useState(false);
		const [options, setOptions] = useState<string[]>([]);
		const orgId = useOrgId();
		const currentName = watch(`attributes.${index}.name`);
		useEffect(() => {
			if (!orgId) return;
			const fetch = async () => {
				setLoading(true);
				const q = query(productsCollection(orgId));
				const snap = await getDocs(q);
				const arr = new Map<string, boolean>();
				snap.forEach((doc) => {
					doc.data()
						.attributes.filter((attr: { name: string }) => attr.name === currentName)
						.forEach((attr: { value: string }) => {
							arr.set(attr.value, true);
						});
				});
				setOptions(Array.from(arr.keys()));
				setLoading(false);
			};
			fetch();
		}, [orgId, currentName]);
		const field = register(`attributes.${index}.value` as const, {
			required: 'Attribute value is required',
			maxLength: { value: 255, message: 'Attribute value is too long' },
		});
		return (
			<Autocomplete
				loading={loading}
				freeSolo
				fullWidth
				openOnFocus
				autoHighlight
				autoSelect
				includeInputInList
				options={options}
				onChange={(_e, value) => {
					setValue(`attributes.${index}.value`, value || '');
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						{...field}
						label="Attribute Value"
						fullWidth
						size="small"
						placeholder="Red, Large, etc."
						error={Boolean(errors.attributes?.[index]?.value)}
						helperText={errors.attributes?.[index]?.value?.message}
						{...TextFieldProps}
					/>
				)}
			/>
		);
	},
);
