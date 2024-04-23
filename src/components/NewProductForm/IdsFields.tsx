import { useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useOrgId } from '../../util';
import { getDocs, query } from 'firebase/firestore';
import { productsCollection } from '../../types/Product';

const defaultProductIds = [
	'UPC',
	'EAN',
	'ISBN',
	'ASIN',
	'GTIN',
	'SKU',
	'MPN',
	'iMEI',
	'JAN',
	'ITF',
	'ISSN',
	'IBAN',
	'NAID',
	'DOI',
	'PMID',
	'ISRC',
];
export const IDNameField = React.memo(
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
					doc.data().ids.forEach((id: { name: string }) => {
						arr.set(id.name, true);
					});
					defaultProductIds.forEach((id) => {
						arr.set(id, true);
					});
				});
				setOptions(Array.from(arr.keys()));
				setLoading(false);
			};
			fetch();
		}, [orgId]);
		const field = register(`ids.${index}.name` as const, {
			required: 'Identifier name is required',
			maxLength: { value: 255, message: 'Identifier name is too long' },
		});
		return (
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
				renderInput={(params) => (
					<TextField
						{...params}
						label="ID Name"
						fullWidth
						size="small"
						error={Boolean(errors.ids?.[index]?.name)}
						helperText={errors.ids?.[index]?.name?.message}
						{...TextFieldProps}
					/>
				)}
			/>
		);
	},
);

/**
 * TextField for the identifier value field.
 */
export const IDValueField = React.memo(
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
		const currentName = watch(`ids.${index}.name`);
		useEffect(() => {
			if (!orgId) return;
			const fetch = async () => {
				setLoading(true);
				const q = query(productsCollection(orgId));
				const snap = await getDocs(q);
				const arr = new Map<string, boolean>();
				snap.forEach((doc) => {
					doc.data()
						.ids.filter((id: { name: string }) => id.name === currentName)
						.forEach((id: { value: string }) => {
							arr.set(id.value, true);
						});
				});
				setOptions(Array.from(arr.keys()));
				setLoading(false);
			};
			fetch();
		}, [orgId, currentName]);
		const field = register(`ids.${index}.value` as const, {
			required: 'Identifier value is required',
			maxLength: { value: 255, message: 'Identifier value is too long' },
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
					setValue(`ids.${index}.value`, value || '');
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						{...field}
						label="ID Value"
						fullWidth
						size="small"
						error={Boolean(errors.ids?.[index]?.value)}
						helperText={errors.ids?.[index]?.value?.message}
						{...TextFieldProps}
					/>
				)}
			/>
		);
	},
);
