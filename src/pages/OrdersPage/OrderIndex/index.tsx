import {
	Box,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import { OrdersList } from './OrdersList';
import { OrderDetails } from './OrderDetails';

export const OrdersIndexPage = () => {
	return (
		<Stack flex={1}>
			<HeroBanner />
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					padding: '1rem',
					flex: 1,
					borderTopLeftRadius: 0,
					borderTopRightRadius: 0,
				}}>
				<Stack direction="row" flex={1} gap={"1rem"}>
					<OrdersList />
					<OrderDetails/>
				</Stack>
			</Paper>
		</Stack>
	);
};

const HeroBanner = () => {
	return (
		<Box
			sx={{
				borderRadius: '20px 20px 0 0',
				backgroundColor: (t) => t.palette.secondary.main,
				color: (t) => t.palette.secondary.contrastText,
			}}>
			<Typography
				variant="h1"
				sx={{ padding: '1rem 2rem', textTransform: 'uppercase', letterSpace: '.5rem' }}
				textAlign={'center'}>
				Orders
			</Typography>
		</Box>
	);
};