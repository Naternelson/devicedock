import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { FieldsGroup, FormGroup, OrderFormData, TitleGroup } from '../../../components';
import { useFieldArray } from 'react-hook-form';
import { OrderIDNameField, OrderIDValueField } from '../../../components/NewOrderForm/IDsField';
import { Delete } from '@mui/icons-material';

export const OrderIdsGroup = () => {
	const { fields, append, remove } = useFieldArray<OrderFormData, 'ids'>({
		name: 'ids',
	});
	const appendOrderID = () => {
		append({
			name: '',
			value: '',
		});
	};
	const removeOrderID = (index: number) => () => {
		remove(index);
	};
	const disabledRemove = fields.length < 2;
	return (
		<FormGroup>
			<TitleGroup>
				<Typography variant="h5">Order IDs</Typography>
				<Divider flexItem />
				<Typography variant="caption">
					Enter any additional order IDs, you can add multiple order IDs
				</Typography>
			</TitleGroup>
			<Divider flexItem orientation="vertical" />
			<FieldsGroup className="delaygroup">
				<Typography variant="h6" display={{ xs: 'none', md: 'block' }}>
					Order IDs
				</Typography>
				<Stack direction="column" gap={'1rem'} paddingLeft={{ xs: '0', md: '2rem' }}>
					{fields.map((field, index) => (
						<Stack key={field.id} direction="row" gap="1rem" className="fadeup">
							<Box flex={1}>
								<OrderIDNameField index={index} />
							</Box>
							<Box flex={3}>
								<OrderIDValueField index={index} />
							</Box>
							<IconButton size="small" disabled={disabledRemove} onClick={removeOrderID(index)}>
								<Delete fontSize="small" />
							</IconButton>
						</Stack>
					))}
				</Stack>
				<Divider flexItem />
				<Button variant={'outlined'} onClick={appendOrderID}>
					Add Order ID
				</Button>
			</FieldsGroup>
		</FormGroup>
	);
};
