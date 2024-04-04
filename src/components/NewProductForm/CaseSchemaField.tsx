import { Button, ButtonBase, ButtonBaseProps, ButtonProps, Checkbox, CheckboxProps, Dialog, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, IconButton, IconButtonProps, MenuItem, Select, SelectProps, TextField, TextFieldProps } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { ProductFormData } from './form';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

export const CaseIdentifierSchemaNameField = React.memo(({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
	const { register } = useFormContext<ProductFormData>();
	return (
		<TextField
			{...TextFieldProps}
			{...register('caseIdentifierSchema.name')}
			label="Case Identifier Schema Name"
			fullWidth
		/>
	);
});
export const CaseIdentifierSchemaMaxSizeField = React.memo(
	({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
		const { register } = useFormContext<ProductFormData>();
		return (
			<TextField
				{...TextFieldProps}
				{...register('caseIdentifierSchema.maxSize', { valueAsNumber: true })}
				label="Case Identifier Schema Max Size"
				fullWidth
			/>
		);
	},
);

export const CaseIdentifierSchemaPatternField = React.memo(
	({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
        const [open, setOpen] = React.useState(false);
        const toggleOpen = () => setOpen((o) => !o);
		const { register } = useFormContext<ProductFormData>();
		return (
			<>
				<Dialog open={open} onClose={toggleOpen}>
					<DialogTitle>Custom Pattern</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Describe how the format of the case Identifier should be. The format can look like the following: 
						</DialogContentText>
						<DialogContentText>YYYYMMDD-###</DialogContentText>
                        <DialogContentText>Where YYYY is the year, MM is the month, DD is the day, and ### is a number that increments.</DialogContentText>
                        <DialogContentText>Use the following characters to describe the format:</DialogContentText>
                        <DialogContentText>Y: Year</DialogContentText>
                        <DialogContentText>M: Month</DialogContentText>
                        <DialogContentText>D: Day</DialogContentText>
                        <DialogContentText>#: Number</DialogContentText>
                        <DialogContentText>Any other characters will be treated as literals.</DialogContentText>
					</DialogContent>
				</Dialog>
				<TextField
					{...TextFieldProps}
					{...register('caseIdentifierSchema.pattern')}
					label="Case Identifier Format"
					fullWidth
				/>
			</>
		);
	},
);


export const CaseSchemaUniqueField = React.memo(
	({CheckboxProps }: { index: number; CheckboxProps?: CheckboxProps }) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`caseIdentifierSchema.unique`}
				control={control}
				render={({ field }) => (
					<FormGroup>
						<FormControlLabel control={<Checkbox {...field} {...CheckboxProps} />} label="Unique" />
					</FormGroup>
				)}
			/>
		);
	},
);

export const CaseAutoGenField = React.memo(
    ({ CheckboxProps }: { CheckboxProps?: CheckboxProps }) => {
        const { control } = useFormContext<ProductFormData>();
        return (
            <Controller
                name={`caseIdentifierSchema.autoGen`}
                control={control}
                render={({ field }) => (
                    <FormGroup>
                        <FormControlLabel control={<Checkbox {...field} {...CheckboxProps} />} label="Auto Generate" />
                    </FormGroup>
                )}
            />
        );
    },
);

export const CaseSchemaScopeField = React.memo(
	({ SelectFieldProps }: { index: number; SelectFieldProps?: SelectProps }) => {
		const { control } = useFormContext<ProductFormData>();
		return (
			<Controller
				name={`caseIdentifierSchema.scope`}
				control={control}
				render={({ field }) => (
					<Select {...field} label="Scope" fullWidth {...SelectFieldProps}>
						<MenuItem value="order">Order</MenuItem>
						<MenuItem value="organization">Organization</MenuItem>
					</Select>
				)}
			/>
		);
	},
);

export const useCaseLabelTemplatesField = () => {
    const {control} = useFormContext<ProductFormData>();
    return useFieldArray({
        control,
        name: 'caseIdentifierSchema.labelTemplates',
    });
};

export const AddCaseSchemaTemplateButton = React.memo(
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
        const { append } = useCaseLabelTemplatesField();
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
export const RemoveCaseSchemaTemplateButton = React.memo(
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
        const { remove } = useCaseLabelTemplatesField();
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