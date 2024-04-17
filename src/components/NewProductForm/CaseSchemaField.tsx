import {
	Box,
	Checkbox,
	CheckboxProps,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControlLabel,
	FormGroup,
	FormGroupProps,
	IconButton,
	InputAdornment,
	MenuItem,
	Stack,
	TextField,
	TextFieldProps,
	Typography,
} from '@mui/material';
import React from 'react';
import { ProductFormData } from './form';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Info } from '@mui/icons-material';

export const CaseIdentifierSchemaNameField = React.memo(({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<ProductFormData>();
	const errorMessage = errors.caseIdentifierSchema?.name?.message?.toString();
	return (
		<TextField
			{...TextFieldProps}
			{...register('caseIdentifierSchema.name', { required: 'Case Identifier Name is required' })}
			label="Case ID Alias"
			fullWidth
			size={'small'}
			error={Boolean(errorMessage)}
			helperText={errorMessage}
		/>
	);
});
export const CaseIdentifierSchemaMaxSizeField = React.memo(
	({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
		const {
			register,
			formState: { errors },
		} = useFormContext<ProductFormData>();
		const errorMessage = errors.caseIdentifierSchema?.maxSize?.message?.toString();
		return (
			<TextField
				{...TextFieldProps}
				{...register('caseIdentifierSchema.maxSize', { valueAsNumber: true, min: 1 })}
				label="Case Max Size (Units)"
				fullWidth
				size={'small'}
				error={Boolean(errorMessage)}
				helperText={errorMessage}
			/>
		);
	},
);

export const CaseIdentifierSchemaPatternField = React.memo(
	({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
		const [hasFocus, setHasFocus] = React.useState(false);
		const [open, setOpen] = React.useState(false);
		const toggleOpen = () => setOpen((o) => !o);
		const { register } = useFormContext<ProductFormData>();
		return (
			<>
				<Dialog open={open} onClose={toggleOpen}>
					<DialogTitle>Custom Format</DialogTitle>
					<DialogContent>
						<Stack gap={2}>
							<DialogContentText>
								Describe how the format of the Case ID should be. The format can look like the
								following:
							</DialogContentText>
							<DialogContentText>
								<Typography textAlign={'center'}>
									<strong>YYYYMMDD-###</strong>
								</Typography>
							</DialogContentText>
							<DialogContentText>
								Where <strong>YYYY</strong> is the year, <strong>MM</strong> is the month,{' '}
								<strong>DD</strong> is the day, and <strong>###</strong> is a number that increments.
							</DialogContentText>
							<Divider />
							<DialogContentText>Use the following characters to describe the format:</DialogContentText>
							<Box padding={'1rem'}>
								<DialogContentText>Y: Year</DialogContentText>
								<DialogContentText>M: Month</DialogContentText>
								<DialogContentText>D: Day</DialogContentText>
								<DialogContentText>#: Number</DialogContentText>
								<DialogContentText>Any other characters will be treated as literals.</DialogContentText>
							</Box>
						</Stack>
					</DialogContent>
				</Dialog>
				<Box width="100%" onFocus={() => setHasFocus(true)} onBlur={()=>setHasFocus(false)}>
					<TextField
						{...TextFieldProps}
						{...register('caseIdentifierSchema.pattern')}
						label="Case ID Format"
						fullWidth
						size={'small'}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={toggleOpen}>
										<Info sx={{transition: "all 300ms ease"}} color={hasFocus === true ? "secondary" : "inherit"} fontSize={'small'} />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Box>
			</>
		);
	},
);

export const CaseSchemaUniqueField = React.memo(({ CheckboxProps, FormGroupProps }: { FormGroupProps?:FormGroupProps, CheckboxProps?: CheckboxProps }) => {
	const { control } = useFormContext<ProductFormData>();
	return (
		<Controller
			name={`caseIdentifierSchema.unique`}
			control={control}
			render={({ field }) => (
				<FormGroup {...FormGroupProps}>
					<FormControlLabel control={<Checkbox {...field} checked={field.value} {...CheckboxProps} />} label="Unique" />
				</FormGroup>
			)}
		/>
	);
});

export const CaseAutoGenField = React.memo(({ CheckboxProps, FormGroupProps }: { FormGroupProps?: FormGroupProps, CheckboxProps?: CheckboxProps }) => {
	const { control } = useFormContext<ProductFormData>();
	return (
		<Controller
			name={`caseIdentifierSchema.autoGen`}
			control={control}
			render={({ field }) => (
				<FormGroup {...FormGroupProps}>
					<FormControlLabel
						control={<Checkbox {...field} checked={field.value} {...CheckboxProps} />}
						label="Auto Generate"
					/>
				</FormGroup>
			)}
		/>
	);
});

export const CaseSchemaScopeField = React.memo(({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
	const { control, watch } = useFormContext<ProductFormData>();
	const isUnique = watch('caseIdentifierSchema.unique');
	return (
		<Controller
			disabled={!isUnique}
			name={`caseIdentifierSchema.scope`}
			control={control}
			rules={{
				required: 'Scope is required',
				validate: (value) => ['order', 'organization'].includes(value),
			}}
			render={({ field }) => (
				<TextField {...field} select label="Scope" size={'small'} fullWidth {...TextFieldProps}>
					<MenuItem value="order">Order</MenuItem>
					<MenuItem value="organization">Organization</MenuItem>
				</TextField>
			)}
		/>
	);
});

export const useCaseLabelTemplatesField = () => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray({
		control,
		name: 'caseIdentifierSchema.labelTemplates',
	});
};

export const CaseTemplateDefaultPrinterField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const { register } = useFormContext<ProductFormData>();
		return (
			<TextField
				{...TextFieldProps}
				{...register(`caseIdentifierSchema.labelTemplates.${index}.defaultPrinter`)}
				label="Default Printer"
				fullWidth
			/>
		);
	},
);

export const CaseTemplateTemplateField = React.memo(
	({ index, TextFieldProps }: { index: number; TextFieldProps?: TextFieldProps }) => {
		const { register } = useFormContext<ProductFormData>();
		return (
			<TextField
				{...TextFieldProps}
				{...register(`caseIdentifierSchema.labelTemplates.${index}.template`)}
				label="Template"
				fullWidth
			/>
		);
	},
);

export const CaseTemplateAutoPrintField = React.memo(
	({ index, CheckboxProps }: { index: number; CheckboxProps?: CheckboxProps }) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`caseIdentifierSchema.labelTemplates.${index}.autoPrint`}
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
