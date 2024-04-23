import { Box, Divider, Stack, Typography } from '@mui/material';
import {
	CustomerSelectField,
	DueDateField,
	FieldsGroup,
	FormGroup,
	ShipToField,
	TitleGroup,
} from '../../../components';

export const OrderBasicGroup = () => {
	return (
		<FormGroup>
			<TitleGroup>
				<Typography variant={'h5'}>Order Information</Typography>
				<Divider flexItem />
				<Typography variant={'caption'}>Enter basic order information</Typography>
			</TitleGroup>
			<Divider flexItem orientation="vertical" />
			<FieldsGroup className="delaygroup">
				<Typography variant="h6">New Order</Typography>
				<Box paddingLeft={'2rem'}>
					<Stack direction="column" gap={'1rem'}>
						<CustomerSelectField TextFieldProps={{className: "fadeup"}} />
						<ShipToField TextFieldProps={{className: "fadeup"}} />
						<DueDateField TextFieldProps={{className:"fadeup"}} />
					</Stack>
				</Box>
			</FieldsGroup>
		</FormGroup>
	);
};
