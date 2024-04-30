import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Stack,
	Typography,
	styled,
} from '@mui/material';
import { TabContainer, useOrder } from './utils';
import { OrderStatusIndicator } from '../../../../components/OrderStatus';
import { deleteDoc, doc, getAggregateFromServer, query, sum, updateDoc, where } from 'firebase/firestore';
import { unitValuesCollection } from '../../../../types/UnitValue';
import { useEffect, useState } from 'react';
import { useNavOrders, useOrgId } from '../../../../util';
import { Order, OrderStatus, ordersCollection } from '../../../../types/Order';

export const OrderOverview = () => {
	const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});
	const { order } = useOrder()!;
	const orgId = useOrgId();
	const productIds = order.orderItems.map((oi) => oi.productId);
	useEffect(() => {
		if (!orgId || !order.id) return;
		const fn = async (orderId: string, orgId: string, productIds: string[]) => {
			const counts: { [key: string]: number } = {};
			await Promise.all(
				productIds.map(async (productId) => {
					const result = await retrieveOrderCount(orderId, orgId, productId);
					counts[productId] = result.data().totalUnits || 0;
				}),
			);
			setOrderCounts(counts);
		};
		fn(order.id, orgId, productIds);
	}, [order.id, productIds, orgId]);
	return (
		<TabContainer tab="Overview">
			<Stack direction="column" gap={'0.5rem'} className="delaygroup">
				<Stack direction="row" gap={'0.5rem'} className="fadeup">
					<Typography variant="h6">Order Overview</Typography>
				</Stack>
				<OrderStatusIndicator
					ButtonProps={{ className: 'fadeup', sx: { padding: '.5rem .25rem' } }}
					order={order}
					withMenu={true}
				/>
				<Stack direction="row" gap={'0.5rem'} className="fadeup">
					{Object.entries(orderCounts).map(([productId, count]) => {
						return <QuantityCard key={productId} count={count} order={order} />;
					})}
				</Stack>
				<Stack direction="row" gap={'0.5rem'} className="fadeup">
					<Typography variant="body2">
						Ordered Date: {new Date(order.orderedDate || new Date()).toLocaleDateString()}
					</Typography>
					<Typography variant="body2">
						Due Date: {new Date(order.dueDate || new Date()).toLocaleDateString()}
					</Typography>
				</Stack>
				<Typography variant="body2" className="fadeup">
					Ship To: {order.shipToAddress}
				</Typography>
				<Stack direction="row" gap={'0.5rem'} className="fadeup">
					<DeleteButton />
				</Stack>
			</Stack>
		</TabContainer>
	);
};

const QuantityCard = (props: { count: number; order: Order }) => {
	const progressValue = (2 / 3) * props.count;
	return (
		<Stack direction={'column'} gap={'0.5rem'} position={'relative'}>
			<Box sx={{ transform: `rotate(-${(360 * 1) / 3}deg)`, transformOrigin: 'center', display: 'inline-flex' }}>
				<CircularProgress
					color="info"
					size="10rem"
					variant="determinate"
					value={progressValue}
					thickness={5}
					sx={{}}
				/>
			</Box>
			<Label>
				<Typography variant="h3" color={'info.light'}>
					{props.count}
				</Typography>
				<Typography variant="caption">
					{props.count} / {props.order.orderItems[0].quantity}
				</Typography>
			</Label>
		</Stack>
	);
};
const Label = styled(Box)({
	top: '50%',
	left: 0,
	right: 0,
	transform: 'translateY(-50%)',
	position: 'absolute',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
});

const retrieveOrderCount = (orderId: string, orgId: string, productId: string) => {
	const q = query(unitValuesCollection(orgId), where('orderId', '==', orderId), where('productId', '==', productId));
	return getAggregateFromServer(q, {
		totalUnits: sum('count'),
	});
};

const DeleteButton = () => {
	const { order } = useOrder()!;
	const [open, setOpen] = useState(false);
	const orgId = useOrgId()!;
	const close = () => setOpen(false);
	const { navigate } = useNavOrders();
	const deleteOrder = async () => {
		await deleteDoc(doc(ordersCollection(orgId), order.id));
		close();
		navigate({ searchParams: new URLSearchParams() });
	};

	const cancelOrder = async () => {
		await updateDoc(doc(ordersCollection(orgId), order.id), { status: OrderStatus.CANCELLED });
		close();
		navigate({ searchParams: new URLSearchParams() });
	};

	return (
		<>
			<Button
				color="error"
				variant="outlined"
				onClick={() => {
					setOpen((p) => !p);
				}}>
				Delete Order
			</Button>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<Stack direction="column" gap={'1rem'} padding={'1rem'}>
					<DialogTitle>Delete Order</DialogTitle>
					<DialogContent>
						<Typography> Would you like to cancel, or permanently delete this order?</Typography>
						<Typography> Deleting the order cannot be undone</Typography>
					</DialogContent>
					<Divider />
					<DialogActions>
						<Stack direction="row" justifyContent="flex-end" gap={'1rem'}>
							<Button onClick={() => setOpen(false)}>Cancel</Button>
							<Button variant="outlined" color="error" onClick={deleteOrder}>
								Delete Order
							</Button>
							<Button variant="outlined" color="warning" onClick={cancelOrder}>
								Cancel Order
							</Button>
						</Stack>
					</DialogActions>
				</Stack>
			</Dialog>
		</>
	);
};
