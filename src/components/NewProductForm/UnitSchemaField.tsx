import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';
import {
	Button,
	ButtonBase,
	ButtonBaseProps,
	ButtonProps,
	Checkbox,
	CheckboxProps,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	IconButton,
	IconButtonProps,
	MenuItem,
	Select,
	SelectProps,
	TextField,
	TextFieldProps,
} from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { Info } from '@mui/icons-material';

export const useUnitSchemaField = () => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray({
		name: 'unitIdentifierSchema',
		control,
	});
};

export const AddUnitSchemaButton = React.memo(
	({
		variant = 'button',
		ButtonProps,
		ButtonBaseProps,
		IconButtonProps,
		children,
	}: PropsWithChildren<{
		variant: 'button' | 'button-base' | 'icon-button';
		ButtonProps?: ButtonProps;
		ButtonBaseProps?: ButtonBaseProps;
		IconButtonProps?: IconButtonProps;
	}>) => {
		const { append } = useFieldArray({
			name: 'unitIdentifierSchema',
		});
		const onClick = () =>
			append({
				name: '',
				count: 1,
				pattern: '',
				unique: true,
				scope: 'organization',
				labelTemplates: [],
			});
		switch (variant) {
			case 'button':
				return (
					<Button onClick={onClick} {...ButtonProps}>
						{children}
					</Button>
				);
			case 'button-base':
				return (
					<ButtonBase onClick={onClick} {...ButtonBaseProps}>
						{children}
					</ButtonBase>
				);
			case 'icon-button':
				return (
					<IconButton onClick={onClick} {...IconButtonProps}>
						{children}
					</IconButton>
				);
		}
	},
);

export const RemoveUnitSchemaButton = React.memo(
	({
		index,
		variant = 'button',
		ButtonProps,
		ButtonBaseProps,
		IconButtonProps,
		children,
	}: PropsWithChildren<{
		index: number;
		variant: 'button' | 'button-base' | 'icon-button';
		ButtonProps?: ButtonProps;
		ButtonBaseProps?: ButtonBaseProps;
		IconButtonProps?: IconButtonProps;
	}>) => {
		const { remove } = useUnitSchemaField();
		const onClick = () => remove(index);
		switch (variant) {
			case 'button':
				return (
					<Button onClick={onClick} {...ButtonProps}>
						{children}
					</Button>
				);
			case 'button-base':
				return (
					<ButtonBase onClick={onClick} {...ButtonBaseProps}>
						{children}
					</ButtonBase>
				);
			case 'icon-button':
				return (
					<IconButton onClick={onClick} {...IconButtonProps}>
						{children}
					</IconButton>
				);
		}
	},
);

export const UnitSchemaNameField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const { register } = useFormContext<ProductFormData>();
		return (
			<TextField
				{...register(`unitIdentifierSchema.${index}.name`)}
				size={'small'}
				label="Name"
				placeholder='e.g. "Serial Number" or "Batch Number"'
				fullWidth
				{...TextFieldProps}
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
		const { register } = useFormContext<ProductFormData>();
		const [open, setOpen] = React.useState(false);
		const toggleOpen = () => setOpen(!open);
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
				<TextField
					{...register(`unitIdentifierSchema.${index}.pattern`)}
					label="Pattern"
					multiline
					size="small"
					InputProps={{
						endAdornment: (
							<IconButton disableRipple onClick={toggleOpen}>
								<Info />
							</IconButton>
						),
					}}
					{...TextFieldProps}
				/>
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

const useUnitSchemaTemplatesArray = (index: number) => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray({
		name: `unitIdentifierSchema.${index}.labelTemplates`,
		control,
	});
};

export const AddUnitSchemaTemplateButton = React.memo(
	({
		index,
		variant = 'button',
		ButtonProps,
		ButtonBaseProps,
		IconButtonProps,
		children,
	}: PropsWithChildren<{
		index: number;
		variant: 'button' | 'button-base' | 'icon-button';
		ButtonProps?: ButtonProps;
		ButtonBaseProps?: ButtonBaseProps;
		IconButtonProps?: IconButtonProps;
	}>) => {
		const { append } = useUnitSchemaTemplatesArray(index);
		const onClick = () =>
			append({
				defaultPrinter: '',
				template: '',
				autoPrint: true,
			});
		switch (variant) {
			case 'button':
				return (
					<Button onClick={onClick} {...ButtonProps}>
						{children}
					</Button>
				);
			case 'button-base':
				return (
					<ButtonBase onClick={onClick} {...ButtonBaseProps}>
						{children}
					</ButtonBase>
				);
			case 'icon-button':
				return (
					<IconButton onClick={onClick} {...IconButtonProps}>
						{children}
					</IconButton>
				);
		}
	},
);

export const RemoveUnitSchemaTemplateButton = React.memo(
	({
		index,
		templateIndex,
		variant = 'button',
		ButtonProps,
		ButtonBaseProps,
		IconButtonProps,
		children,
	}: PropsWithChildren<{
		index: number;
		templateIndex: number;
		variant: 'button' | 'button-base' | 'icon-button';
		ButtonProps?: ButtonProps;
		ButtonBaseProps?: ButtonBaseProps;
		IconButtonProps?: IconButtonProps;
	}>) => {
		const { remove } = useUnitSchemaTemplatesArray(index);
		const onClick = () => remove(templateIndex);
		switch (variant) {
			case 'button':
				return (
					<Button onClick={onClick} {...ButtonProps}>
						{children}
					</Button>
				);
			case 'button-base':
				return (
					<ButtonBase onClick={onClick} {...ButtonBaseProps}>
						{children}
					</ButtonBase>
				);
			case 'icon-button':
				return (
					<IconButton onClick={onClick} {...IconButtonProps}>
						{children}
					</IconButton>
				);
		}
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
				render={({ field }) => <TextField {...field} size={"small"} label="Template" fullWidth {...TextFieldProps} />}
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
