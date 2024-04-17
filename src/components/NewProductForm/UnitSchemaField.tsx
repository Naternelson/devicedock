import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';
import {
	Autocomplete,
	Box,
	Checkbox,
	CheckboxProps,
	ClickAwayListener,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	IconButton,
	MenuItem,
	TextField,
	TextFieldProps,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Info } from '@mui/icons-material';
import { useOrgId } from '../../util';
import { productsCollection } from '../../types/Product';
import { getDocs, query } from 'firebase/firestore';

export const useUnitSchemaField = () => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray({
		name: 'unitIdentifierSchema',
		control,
	});
};
export const UnitSchemaNameField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const {
			register,
			formState: { errors },
			setValue,
		} = useFormContext<ProductFormData>();
		const errorMessage = errors.unitIdentifierSchema?.[index]?.name?.message?.toString();
		const orgId = useOrgId();
		const [loading, setLoading] = React.useState(false);
		const [options, setOptions] = React.useState<string[]>([]);
		useEffect(() => {
			if (!orgId) return;
			const fetch = async () => {
				setLoading(true);
				const q = query(productsCollection(orgId));
				const snap = await getDocs(q);
				const arr = new Map<string, boolean>();
				snap.forEach((doc) => {
					doc.data().unitIdentifierSchema.forEach((schema: { name: string }) => {
						arr.set(schema.name, true);
					});
				});
				setOptions(Array.from(arr.keys()));
				setLoading(false);
			};
			fetch();
		}, [orgId]);
		const field = register(`unitIdentifierSchema.${index}.name`, {
			required: 'Name is required',
		});
		return (
			<Autocomplete
				onChange={(e, value) => setValue(`unitIdentifierSchema.${index}.name`, value || '')}
				freeSolo
				fullWidth
				openOnFocus
				autoHighlight
				autoSelect
				includeInputInList
				options={options}
				loading={loading}
				renderInput={(params) => (
					<TextField
						{...field}
						{...params}
						size={'small'}
						label="Name"
						placeholder='e.g. "Serial Number" or "Batch Number"'
						fullWidth
						error={Boolean(errorMessage)}
						helperText={errorMessage}
						{...TextFieldProps}
					/>
				)}
			/>
		);
	},
);

export const UnitSchemaCountField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const { register } = useFormContext<ProductFormData>();
		return (
			<TextField
				{...register(`unitIdentifierSchema.${index}.count`, { valueAsNumber: true, min: 1 })}
				label="Count"
				fullWidth
				sx={{ maxWidth: '100px' }}
				size={'small'}
				{...TextFieldProps}
			/>
		);
	},
);

export const UnitSchemaPatternField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const [hasFocus, setHasFocus] = React.useState(false);
		const {
			register,
			formState: { errors },
		} = useFormContext<ProductFormData>();
		const [open, setOpen] = React.useState(false);
		const toggleOpen = () => setOpen(!open);
		const errorMessage = errors.unitIdentifierSchema?.[index]?.pattern?.message?.toString();
		return (
			<>
				<Dialog open={open} onClose={toggleOpen}>
					<DialogTitle>Custom Pattern</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Describe how the pattern that this unit ID should match against
						</DialogContentText>
						<DialogContentText>For example:</DialogContentText>
						<DialogContentText> - Must be 24 characters long</DialogContentText>
						<DialogContentText> - Must have the text of 'PROD-' at the start</DialogContentText>
						<DialogContentText> - All letters should be uppercase</DialogContentText>
						<DialogContentText>
							{' '}
							- No special characters, punctuaction, new lines or white spaces
						</DialogContentText>
					</DialogContent>
				</Dialog>
				<ClickAwayListener onClickAway={() => setHasFocus(false)}>
					<Box onFocus={() => setHasFocus(true)}>
						<TextField
							{...register(`unitIdentifierSchema.${index}.pattern`, {
								maxLength: { value: 1000, message: 'Pattern is too long' },
							})}
							label="Pattern"
							multiline
							size="small"
							fullWidth
							error={Boolean(errorMessage)}
							helperText={errorMessage}
							InputProps={{
								endAdornment: (
									<IconButton disableRipple onClick={toggleOpen}>
										<Info
											sx={{ transition: 'all 300ms ease' }}
											color={hasFocus === true ? 'secondary' : 'inherit'}
											fontSize={'small'}
										/>
									</IconButton>
								),
							}}
							{...TextFieldProps}
						/>
					</Box>
				</ClickAwayListener>
			</>
		);
	},
);

export const UnitSchemaUniqueField = React.memo(
	({ index, CheckboxProps }: { index: number; CheckboxProps?: CheckboxProps }) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`unitIdentifierSchema.${index}.unique`}
				control={control}
				render={({ field }) => (
					<FormGroup>
						<FormControlLabel
							control={<Checkbox {...field} checked={field.value} {...CheckboxProps} />}
							label="Unique"
						/>
					</FormGroup>
				)}
			/>
		);
	},
);

export const UnitSchemaScopeField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`unitIdentifierSchema.${index}.scope`}
				control={control}
				rules={{
					required: 'Scope is required',
					validate: (value) => ['order', 'organization'].includes(value),
				}}
				render={({ field }) => (
					<TextField {...field} select size={'small'} label="Scope" fullWidth {...TextFieldProps}>
						<MenuItem value="order">Order</MenuItem>
						<MenuItem value="organization">Organization</MenuItem>
					</TextField>
				)}
			/>
		);
	},
);

export const UnitSchemaTemplateDefaultPrinterField = React.memo(
	({
		index,
		templateIndex,
		TextFieldProps,
	}: {
		index: number;
		templateIndex: number;
		TextFieldProps?: TextFieldProps;
	}) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`unitIdentifierSchema.${index}.labelTemplates.${templateIndex}.defaultPrinter`}
				control={control}
				render={({ field }) => (
					<TextField {...field} size="small" label="Printer" fullWidth {...TextFieldProps} />
				)}
			/>
		);
	},
);

export const UnitSchemaTemplateTemplateField = React.memo(
	({
		index,
		templateIndex,
		TextFieldProps,
	}: {
		index: number;
		templateIndex: number;
		TextFieldProps?: TextFieldProps;
	}) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`unitIdentifierSchema.${index}.labelTemplates.${templateIndex}.template`}
				control={control}
				render={({ field }) => (
					<TextField {...field} size={'small'} label="Template" fullWidth {...TextFieldProps} />
				)}
			/>
		);
	},
);

export const UnitSchemaTemplateAutoPrintField = React.memo(
	({
		index,
		templateIndex,
		CheckboxProps,
	}: {
		index: number;
		templateIndex: number;
		CheckboxProps?: CheckboxProps;
	}) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`unitIdentifierSchema.${index}.labelTemplates.${templateIndex}.autoPrint`}
				control={control}
				render={({ field }) => (
					<FormGroup>
						<FormControlLabel control={<Checkbox {...field} {...CheckboxProps} />} label="Auto Print" />
					</FormGroup>
				)}
			/>
		);
	},
);

export const UnitSchemaTransformField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`unitIdentifierSchema.${index}.transform`}
				control={control}
				rules={{
					validate: (value: string) => ['NONE', 'UPPERCASE', 'LOWERCASE'].includes(value),
				}}
				render={({ field }) => (
					<TextField {...field} size="small" select label="Transform" fullWidth {...TextFieldProps}>
						<MenuItem value="NONE">No changes</MenuItem>
						<MenuItem value="UPPERCASE">Make Uppercase</MenuItem>
						<MenuItem value="LOWERCASE">Make Lowercase</MenuItem>
					</TextField>
				)}
			/>
		);
	},
);
