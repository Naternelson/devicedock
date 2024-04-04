import { useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';
import {
	Button,
	ButtonBase,
	ButtonBaseProps,
	ButtonProps,
	IconButton,
	IconButtonProps,
	TextField,
	TextFieldProps,
} from '@mui/material';
import React, { PropsWithChildren } from 'react';


/**
 * Custom hook for managing the attributes field array with react-hook-form.
 * @returns The field array methods and properties from useFieldArray.
 */
export const useAttributesFields = () => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray({
		name: 'attributes',
		control,
	});
};

/**
 * Button to add a new attribute to the attributes field array.
 */
export const AddAttributeButton = React.memo(
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
			name: 'attributes',
		});
		const onClick = () => append({
            name: '',
            value: '',
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


/**
 * Button to remove an attribute from the attributes field array.
 */
export const RemoveAttributeButton = React.memo(
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
		const { remove } = useFieldArray({
			name: 'attributes',
		});
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


/**
 * TextField for the attribute name field.
 */
export const AttributeNameField = React.memo(
	({ TextFieldProps, index }: { TextFieldProps?: TextFieldProps; index: number }) => {
		const {
			register,
			formState: { errors },
		} = useFormContext<ProductFormData>();
		return (
			<TextField
				{...register(`attributes.${index}.name` as const)}
				label="Attribute Name"
				fullWidth
				error={Boolean(errors.attributes?.[index]?.name)}
				helperText={errors.attributes?.[index]?.name?.message}
				{...TextFieldProps}
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
			register,
			formState: { errors },
		} = useFormContext<ProductFormData>();
		return (
			<TextField
				{...register(`attributes.${index}.value` as const)}
				label="Attribute Value"
				fullWidth
				error={Boolean(errors.attributes?.[index]?.value)}
				helperText={errors.attributes?.[index]?.value?.message}
				{...TextFieldProps}
			/>
		);
	},
);
