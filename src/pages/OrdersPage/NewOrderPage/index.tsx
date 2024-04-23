import { useNavigate } from 'react-router-dom';
import { NewOrderForm, SubmitButton } from '../../../components';
import { Button, Stack } from '@mui/material';
import { OrderBasicGroup } from './OrderBasic';
import { OrderItemsGroup } from './OrderItemsGroup';
import { OrderIdsGroup } from './OrderIdsGroup';

export const NewOrderPage = () => {
	const nav = useNavigate();

	return (
		<Stack flexDirection={'row'} width={'100%'} sx={{ boxSizing: 'border-box' }} >
			<NewOrderForm BoxProps={{ flex: 1, marginY: '1rem' }} onSuccess={(ref) => nav("/dashboard/orders?orderId=" + ref.id)}>
				<Stack gap={'1rem'} height={'100%'} sx={{ perspective: '1000px' }}>
					<OrderBasicGroup />
					<OrderIdsGroup/>
					<OrderItemsGroup />
					<Stack direction={'row'} justifyContent={'flex-end'} gap={"1rem"} marginY={"2rem"}>
						<Button variant={'outlined'} onClick={() => nav(-1)}>
							Cancel
						</Button>
						<SubmitButton />
					</Stack>
				</Stack>
			</NewOrderForm>
		</Stack>
	);
};
