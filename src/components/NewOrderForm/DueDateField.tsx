import { TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { OrderFormData } from './Form';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export const DueDateField = ({ TextFieldProps }: { TextFieldProps?: TextFieldProps }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext<OrderFormData>();
	const errorMessage = errors['dueDate']?.message?.toString();
	return (
		<Controller
			control={control}
			name="dueDate"
			render={({ field }) => (
				<DatePicker
					{...field}
					value={field.value || null}
					onChange={(value) => field.onChange(value ? dayjs(value) : null)}
					slotProps={{
						textField: {
							...TextFieldProps,
							helperText: errorMessage,
							error: !!errorMessage,
							size: 'small',
						},
					}}
					label="Due Date"
				/>
			)}
		/>
	);
};
