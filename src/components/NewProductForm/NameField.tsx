import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from './form';

export const NameField = (props: TextFieldProps) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<ProductFormData>();
	const errorMessage = errors.name?.message?.toString();
	return (
		<TextField
			{...register('name')}
			label="Name"
			multiline
            size={"small"}
			fullWidth
			error={Boolean(errorMessage)}
			helperText={errorMessage}
            {...props}
		/>
	);
};
