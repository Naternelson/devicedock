import {
	Box,
	Button,
	ButtonBase,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Paper,
	Stack,
	Typography,
	alpha,
	styled,
} from '@mui/material';
import { TabContainer, useOrder } from './utils';
import { OrderStatusIndicator } from '../../../../components/OrderStatus';
import { deleteDoc, doc, getAggregateFromServer, query, sum, updateDoc, where } from 'firebase/firestore';
import { unitValuesCollection } from '../../../../types/UnitValue';
import { useEffect, useState } from 'react';
import { useNavOrders, useOrgId } from '../../../../util';
import { Order, OrderStatus, ordersCollection } from '../../../../types/Order';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { Product } from '../../../../types/Product';
import { SwipeableViews } from '../../../../components/SwipeableViews';
import { ArrowBack, ArrowForward, ArrowLeft, ArrowRight, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const OrderOverview = () => {
	const nav = useNavigate();
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

	const navToBuildOrder = () => {
		if (!order.id) return;
		nav(`/dashboard/?orderId=${order.id}`);
	};
	return (
		<TabContainer tab="Overview">
			<Stack direction={'column'} gap={'0.5rem'} className="delaygroup">
				<Stack direction={'row'} flex={1} padding={'1rem'} gap={'2rem'}>
					<Stack
						direction={'column'}
						gap={'0.25rem'}
						className="fadeup"
						flex={1}
						divider={<Divider flexItem />}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" paddingX={'2rem'}>
							<Box />
							<Typography textAlign="center" variant="h6">
								Order Overview
							</Typography>
							<IconButton size="small" onClick={() => console.log('edit')}>
								<Edit fontSize={'small'} />
							</IconButton>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Typography variant="caption" sx={{ minWidth: '100px' }}>
								{"Order ID(s)"}
							</Typography>
							<Stack direction={'column'}  paddingRight={"2rem"}>
								{order.ids.map(({ name, value }) => {
									return (
										<Stack direction={'row'} justifyContent={"space-between"} gap={"3rem"} key={name}>
											<Typography key={name} variant="body2">
												{value}
											</Typography>
											<Typography fontStyle={"italic"} textAlign={"right"} variant="body2" >
												{name}
											</Typography>
										</Stack>
									);
								})}
								
							</Stack>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Typography variant="caption" sx={{ minWidth: '100px' }}>
								Order Status
							</Typography>
							<OrderStatusIndicator
								ButtonProps={{ className: 'fadeup', sx: { padding: '.5rem .25rem' } }}
								order={order}
								withMenu={true}
							/>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Typography variant="caption" sx={{ minWidth: '100px' }}>
								Ordered Date
							</Typography>
							<Typography variant="body2">
								{new Date(order.orderedDate || new Date()).toLocaleDateString()}
							</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Typography variant="caption" sx={{ minWidth: '100px' }}>
								Due Date
							</Typography>
							<Stack direction="row" gap={'0.5rem'} alignItems="center">
								<Typography variant="body2">
									{new Date(order.dueDate || new Date()).toLocaleDateString()}
								</Typography>
								<Typography>
									{Math.floor(
										(new Date(order.dueDate || new Date()).getTime() - new Date().getTime()) /
											(1000 * 60 * 60 * 24),
									)}{' '}
									days left
								</Typography>
							</Stack>
						</Stack>
						<Stack direction={'row'} alignItems="center">
							<Typography variant="caption" sx={{ minWidth: '100px' }}>
								Ship To
							</Typography>
							<Typography variant="body2" className="fadeup">
								{order.shipToAddress}
							</Typography>
						</Stack>
						<Stack direction={'row'} alignItems="center">
							<Typography variant="caption" sx={{ minWidth: '100px' }}>
								Actions
							</Typography>
							<Stack direction="column" paddingY={'0.25rem'} gap={'0.25rem'}>
								<Button
									onClick={navToBuildOrder}
									sx={{ fontSize: '.75rem', padding: '.25rem 1rem' }}
									size="small"
									color="primary"
									variant="contained">
									Build
								</Button>
								<DeleteButton />
							</Stack>
						</Stack>
					</Stack>
					<Stack direction={'column'} gap={'0.5rem'} className="fadeup" alignItems="center">
						<QuantityCardGroup order={order} orderCounts={orderCounts} />
					</Stack>
				</Stack>
			</Stack>
		</TabContainer>
	);
};

const QuantityCardGroup = (props: { order: Order; orderCounts: Record<string, number> }) => {
	const { order, orderCounts } = props;
	const [index, setIndex] = useState(0);

	if (order.orderItems.length < 1) return null;
	return (
		<Paper elevation={0} sx={{ overflow: 'hidden', maxWidth: '200px' }}>
			<SwipeableViews value={index} onChange={(v) => setIndex(v)}>
				{order.orderItems.map((oi, i) => (
					<QuantityCard key={i} count={orderCounts[oi.productId]} item={oi} />
				))}
			</SwipeableViews>
			<Divider />
			<Stack
				direction="row"
				gap={'0.5rem'}
				justifyContent="space-between"
				sx={{ display: order.orderItems.length > 1 ? 'flex' : 'none' }}>
				<IconButton
					size={'small'}
					disableRipple
					disabled={index <= 0}
					sx={{ visibility: index <= 0 ? 'hidden' : 'visible' }}
					onClick={() => setIndex((p) => --p)}>
					<ArrowLeft />
				</IconButton>
				<Stack direction="row" gap={'0.5rem'} justifyContent="center" sx={{ overflowX: 'auto' }}>
					{order.orderItems.map((oi, i) => (
						<ButtonBase
							key={i}
							sx={{
								backgroundColor: (t) =>
									index === i ? alpha(t.palette.primary.light, 0.1) : 'transparent',
								padding: '.5rem',
								fontSize: '.8rem',
								color: (t) => (index === i ? t.palette.primary.main : t.palette.text.primary),
							}}
							onClick={() => setIndex(i)}>
							{i + 1}
						</ButtonBase>
					))}
				</Stack>
				<IconButton
					size="small"
					disableRipple
					sx={{
						visibility: index + 1 >= order.orderItems.length ? 'hidden' : 'visible',
					}}
					disabled={index + 1 >= order.orderItems.length}
					onClick={() => setIndex((p) => ++p)}>
					<ArrowRight />
				</IconButton>
			</Stack>
		</Paper>
	);
};

const QuantityCard = (props: { count: number; item: Order['orderItems'][number]; product?: Product }) => {
	const { count, item } = props;
	const percent = Math.floor((count / item.quantity) * 100);

	return (
		<Stack direction={'column'} position={'relative'} padding={'1rem 1rem 0.5rem 1rem'} alignItems={'center'}>
			<Typography textTransform={'uppercase'} fontWeight={500} sx={{ fontSize: '.9rem' }} textAlign={'center'}>
				{props.product?.name || props.item.productId}
			</Typography>

			<Gauge
				sx={{
					[`& .${gaugeClasses.valueText}`]: {
						fontSize: 18,
						transform: 'translate(0, 0)',
					},
				}}
				innerRadius={50}
				width={100}
				height={100}
				startAngle={-360 / 3}
				endAngle={360 / 3}
				value={percent <= 0 ? 1 : percent}
				text={`${count} / ${item.quantity}`}
			/>
		</Stack>
	);
};


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
				sx={{ fontSize: '.75rem', padding: '.25rem 1rem' }}
				size="small"
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
							<Button variant="contained" color="error" onClick={deleteOrder}>
								Delete Order
							</Button>
							<Button variant="contained" color="warning" onClick={cancelOrder}>
								Cancel Order
							</Button>
						</Stack>
					</DialogActions>
				</Stack>
			</Dialog>
		</>
	);
};
