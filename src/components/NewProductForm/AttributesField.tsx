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
	Tooltip,
} from '@mui/material';
import React, { PropsWithChildren, ReactElement } from 'react';

/**
 * Custom hook for managing the attributes field array with react-hook-form.
 * @returns The field array methods and properties from useFieldArray.
 */
export const useAttributesFields = () => {
	const { control } = useFormContext<ProductFormData>();
	return useFieldArray<ProductFormData, "attributes">({
		name: 'attributes',
		control,
	});
};

/**
 * Button to add a new attribute to the attributes field array.
 */
export const AddAttributeButton = React.memo(
	({
		onClick,
		variant = 'button',
		ButtonProps,
		ButtonBaseProps,
		IconButtonProps,
		children,
	}: PropsWithChildren<{
		onClick: () => void;
		variant: 'button' | 'button-base' | 'icon-button';
		ButtonProps?: ButtonProps;
		ButtonBaseProps?: ButtonBaseProps;
		IconButtonProps?: IconButtonProps;
	}>) => {
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
		const { remove } = useAttributesFields();

		const onClick = () => remove(index);
		let button: ReactElement;
		switch (variant) {
			case 'button':
				button = (
					<Button onClick={onClick} {...ButtonProps}>
						{children}
					</Button>
				);
				break;
			case 'button-base':
				button = (
					<ButtonBase onClick={onClick} {...ButtonBaseProps}>
						{children}
					</ButtonBase>
				);
				break;
			case 'icon-button':
				button = (
					<IconButton onClick={onClick} {...IconButtonProps}>
						{children}
					</IconButton>
				);
				break;
		}
		return (
			<Tooltip arrow title="Remove Attribute">
				{button}
			</Tooltip>
		);
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
				size="small"
				placeholder="Color, Size, etc."
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
				size="small"
				placeholder="Red, Large, etc."
				fullWidth
				error={Boolean(errors.attributes?.[index]?.value)}
				helperText={errors.attributes?.[index]?.value?.message}
				{...TextFieldProps}
			/>
		);
	},
);
