import { MenuItem, TextField, TextFieldProps } from '@mui/material';

export const LimitSelectBox = (props: {
	TextFieldProps?: TextFieldProps;
	value: number;
	setValue: (value: number) => void;
}) => {
	const { TextFieldProps, value, setValue } = props;
	return (
		<TextField
			select
			value={value}
			onChange={(e) => {
				setValue(parseInt(e.target.value));
			}}
			size="small"
			variant="outlined"
            SelectProps={{ renderValue: (value) => `Showing ${value} entries`,MenuProps: {MenuListProps: {disablePadding: true, dense: true}}}}
			sx={{
				fontSize: '0.75rem',
				"& .MuiSelect-select": {
					paddingTop: ".25rem",
					paddingBottom: ".25rem",
					fontSize: "0.75rem"
				},
				"& .MuiMenuItem-root": {
					fontSize: "0.75rem"
				}
			}}
			{...TextFieldProps}>
			<MenuItem value={10}>10 entries</MenuItem>
			<MenuItem value={25}>25 entries</MenuItem>
			<MenuItem value={50}>50 entries</MenuItem>
			<MenuItem value={100}>100 entries</MenuItem>
		</TextField>
	);
};
