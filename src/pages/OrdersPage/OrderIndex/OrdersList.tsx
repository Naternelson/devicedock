import {
	Box,
	Button,
	ButtonProps,
	Checkbox,
	CircularProgress,
	Divider,
	FormControlLabel,
	MenuItem,
	MenuList,
	Stack,
	Tooltip,
	Typography,
	alpha,
	useTheme,
} from '@mui/material';
import {
	DocumentSnapshot,
	QueryConstraint,
	doc,
	endBefore,
	getCountFromServer,
	getDoc,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { LimitSelectBox } from '../../../components/LimitSelectBox';
import { Order, OrderStatus, ordersCollection } from '../../../types/Order';
import { statusColor, useOrgId } from '../../../util';
import { OrderStatusIndicator } from '../../../components/OrderStatus';
import { Product, productsCollection } from '../../../types/Product';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const OrdersList = () => {
	const {
		totalPages,
		nextPage,
		previousPage,
		page,
		orders,
		count,
		limit,
		setLimit,
		includeCompleted,
		setIncludeCompleted,
	} = useOrdersListHooks();
	const startIndex = (page - 1) * limit + 1; // Calculate start index based on current page and limit
	const endIndex = startIndex + orders.length - 1; // The actual end index might be less than the max if orders are fewer

	const footerDisplay =
		count > -1 ? `Displaying ${startIndex}-${endIndex} of ${count}` : `Displaying ${startIndex}-${endIndex}`;

	return (
		<Stack direction="column" justifyContent={'space-between'} sx={{ backgroundColor: (t) => t.palette.grey[200] }}>
			<Stack direction="column">
				<Stack
					sx={{ borderRadius: '5px 5px 0 0', backgroundColor: (theme) => theme.palette.grey[100] }}
					direction="row"
					justifyContent={'space-between'}
					alignItems="center"
					gap={'1rem'}
					padding={'1rem'}>
					<Typography variant="h3">Orders</Typography>
					<Stack direction="row" alignItems="center">
						<FormControlLabel
							control={
								<Checkbox
									size="small"
									onChange={(e) => {
										setIncludeCompleted(e.target.checked);
									}}
									checked={includeCompleted}
								/>
							}
							label={<Typography variant="caption">Show All</Typography>}
						/>
						<LimitSelectBox value={limit} setValue={setLimit} />
					</Stack>
				</Stack>
				<OrderListRender orders={orders} />
			</Stack>

			<Stack
				direction="row"
				alignItems={'center'}
				justifyContent={'space-between'}
				sx={{ borderRadius: '0 0 5px 5px', backgroundColor: (theme) => theme.palette.grey[300] }}>
				<Button onClick={previousPage} sx={{ visibility: page === 1 ? 'hidden' : 'visible' }}>
					Previous
				</Button>
				<Typography variant="overline">{footerDisplay}</Typography>

				<Button onClick={nextPage} sx={{ visibility: page === totalPages ? 'hidden' : 'visible' }}>
					Next
				</Button>
			</Stack>
		</Stack>
	);
};

const OrderListRender = (props: { orders: Order[] }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const orderId = searchParams.get('orderId');
	const theme = useTheme();
	const { orders } = props;

	return (
		<MenuList className="delaygroup" dense disablePadding sx={{ overflow: 'auto', padding: '2px' }}>
			{orders.map((order) => (
				<MenuItem
					selected={orderId === order.id}
					onClick={() => {
						orderId === order.id
							? searchParams.delete('orderId')
							: searchParams.set('orderId', order.id || '');
						setSearchParams(searchParams);
					}}
					key={order.id}
					divider
					className="fadeup"
					sx={{
						width: '500px',
						position: 'relative',
						boxSizing: 'border-box',
						outline: `2px solid ${alpha(theme.palette.primary.main, order.id === orderId ? 1 : 0)}`,
						transition: 'outline 0.15s ease-out',
						paddingBottom: '.25',
						paddingTop: '.25rem',
						paddingLeft: '.25rem',
						justifyContent: 'space-between',
						gap: '.25rem',
						background: `linear-gradient(to right, ${alpha(
							statusColor(theme, order.status),
							0.15,
						)} 0%, ${alpha(statusColor(theme, order.status), 0.03)} 50%) `,
					}}>
					<Stack direction="column" flex={1}>
						<OrderStatusIndicator order={order} />
						{order.dueDate && (
							<Tooltip title={'Due Date'} arrow>
								<Typography
									variant="caption"
									textAlign={'center'}
									sx={{
										marginTop: '.25rem',
										color:
											pastDue(new Date(order.dueDate)) && order.status !== OrderStatus.COMPLETED
												? (t) => t.palette.error.main
												: (t) => t.palette.grey[500],
									}}>
									{new Date(order.dueDate).toLocaleDateString()}
								</Typography>
							</Tooltip>
						)}
					</Stack>
					<Divider flexItem orientation="vertical" />
					<Stack direction="column" alignItems="flex-start" flex={1}>
						{order.ids.map((id, index) => (
							<Tooltip title={id.name} arrow key={id.value}>
								<Typography
									variant={index === 0 ? 'subtitle1' : 'caption'}
									fontWeight={index === 0 ? 600 : 300}>
									{id.value}
								</Typography>
							</Tooltip>
						))}
					</Stack>
					<Divider flexItem orientation="vertical" />
					<Stack direction="column" alignItems="center" flex={1}>
						{order.orderItems.map((item, index) => (
							<ProductDisplay
								key={item.productId + `${index}`}
								productId={item.productId}
								index={index}
								quantity={item.quantity}
							/>
						))}
					</Stack>
					<Divider flexItem orientation="vertical" />
					<QuantityDisplay order={order} />
					<Divider flexItem orientation="vertical" />
					<Stack flex={1}>
						<ActivateButton order={order} />
					</Stack>
				</MenuItem>
			))}
		</MenuList>
	);
};

const ActivateButton = (props: { order: Order }) => {
	const nav = useNavigate();
	const order = props.order;
	const status = order.status;
	const buttonProps: ButtonProps = {
		variant: 'text',
	};

	switch (status) {
		case OrderStatus.ACTIVE:
			return (
				<Button
					{...buttonProps}
					onClick={(e) => {
						e.stopPropagation();
						nav(`/dashboard/?orderId=${order.id}`);
					}}>
					Continue
				</Button>
			);
		case OrderStatus.COMPLETED:
			return (
				<Button {...buttonProps} sx={{ visibility: 'hidden' }} onClick={() => alert('Order is completed')}>
					Completed
				</Button>
			);
		case OrderStatus.CANCELLED:
			return (
				<Button {...buttonProps} onClick={() => alert('Order is cancelled')}>
					Reactivate
				</Button>
			);
		case OrderStatus.ERROR:
		case OrderStatus.PAUSED:
			return (
				<Button {...buttonProps} onClick={() => alert('Order has an error')}>
					Reactivate
				</Button>
			);
		default:
			return (
				<Button
					{...buttonProps}
					color={"secondary"}
					variant='outlined'
					onClick={(e) => {
						e.stopPropagation();
						nav(`/dashboard/?orderId=${order.id}`);
					}}>
					Build
				</Button>
			);
	}
};

const ProductDisplay = ({ productId, index, quantity }: { productId: string; index: number; quantity: number }) => {
	const [product, setProduct] = useState<Product | null>(null);
	const orgId = useOrgId();

	useEffect(() => {
		if (!orgId) return;
		const fetch = async () => {
			const c = productsCollection(orgId);
			const snap = await getDoc(doc(c, productId));
			if (snap.exists()) {
				setProduct(snap.data());
			}
		};
		fetch();
	}, [orgId, productId]);
	const firstId = product?.ids && product.ids.length > 0 ? product?.ids[0].value : 'PROD-123';
	return (
		<Tooltip title={`${product?.name || 'Product'}: ${quantity.toLocaleString()} ordered`}>
			<Typography
				variant={'overline'}
				sx={{ lineHeight: '1rem', fontWeight: index === 0 ? 700 : 400 }}
				textAlign="center">
				{product?.name} - {firstId}
			</Typography>
		</Tooltip>
	);
};

const QuantityDisplay = (props: { order: Order }) => {
	const total = props.order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
	// Change amount to a random number between 0 and total for testing
	const amount = Math.round(Math.random() * total);
	const theme = useTheme();
	const percentage = ((amount / total) * 100).toFixed(0).toLocaleString();
	const color = amount === total ? theme.palette.success.main : amount > 0 ? theme.palette.primary.main : 'inherit';
	if (amount === 0)
		return (
			<Stack flex={1}>
				<Typography variant="subtitle1" textAlign={'center'}>
					0 / {total.toLocaleString()}
				</Typography>
			</Stack>
		);
	return (
		<Tooltip title={`${percentage}%`} arrow>
			<Stack flex={1} direction="row" gap={'.75rem'} alignItems={'center'} justifyContent={'center'}>
				<Stack direction="column">
					<Typography
						color={color}
						fontWeight={700}
						textAlign="center"
						variant="subtitle2"
						lineHeight={'1.25rem'}>
						{amount.toLocaleString()}
					</Typography>
					<Divider flexItem />
					<Typography textAlign={'center'} variant="overline" lineHeight={'1.25rem'}>
						{total.toLocaleString()}
					</Typography>
				</Stack>
				<Box sx={{ color: color }}>
					<CircularProgress
						color={'inherit'}
						variant="determinate"
						value={amount >= total ? 100 : (amount / total) * 100}
						size={20}
						thickness={12}
					/>
				</Box>
			</Stack>
		</Tooltip>
	);
};

/**
 * UTILITIES
 */

const useOrdersListHooks = () => {
	const [count, setCount] = useState(-1);
	const [includeCompleted, setIncludeCompleted] = useState(false);
	const [orders, setOrders] = useState<Order[]>([]);
	const [firstVisibleDoc, setFirstVisibleDoc] = useState<DocumentSnapshot | null>(null);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot | null>(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(25);
	const orgId = useOrgId();
	useEffect(() => {
		if (!orgId) return;
		const q = ordersQuery(orgId, includeCompleted, {
			limit,
			startAfter: page > 1 ? lastVisibleDoc : undefined,
			endBefore: page > 1 ? firstVisibleDoc : undefined,
		});
		const unsubscribe = onSnapshot(q, (snap) => {
			if (snap.empty) {
				setOrders([]);
				setFirstVisibleDoc(null);
				setLastVisibleDoc(null);
				return;
			}
			setOrders(snap.docs.map((doc) => doc.data() as Order));
			setFirstVisibleDoc(snap.docs[0]);
			setLastVisibleDoc(snap.docs[snap.docs.length - 1]);
		});
		return unsubscribe; // Clean up the subscription
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orgId, includeCompleted, page, limit]);

	useEffect(() => {
		if (!orgId) return;
		const fetch = async () => {
			const snap = await getCountFromServer(ordersQuery(orgId, includeCompleted)).catch((error) => {
				console.error('Error getting order count:', error);
				setCount(-1);
			});
			if (snap) setCount(snap.data().count);
		};
		fetch();
	}, [orgId, includeCompleted]);

	const nextPage = () => {
		if (orders.length < limit) return;
		setLastVisibleDoc(null);
		setPage(page + 1);
		setFirstVisibleDoc(lastVisibleDoc);
	};
	const previousPage = () => {
		if (page === 1) return;
		setFirstVisibleDoc(null);
		setPage(page - 1);
		setLastVisibleDoc(firstVisibleDoc);
	};
	const reset = () => {
		setFirstVisibleDoc(null);
		setPage(1);
		setLastVisibleDoc(null);
	};
	const totalPages = count > -1 ? Math.ceil(count / limit) : 0;
	return {
		totalPages,
		nextPage,
		previousPage,
		reset,
		limit,
		setLimit,
		page,
		orders,
		count,
		includeCompleted,
		setIncludeCompleted,
	};
};

const ordersQuery = (
	orgId: string,
	includeCompleted: boolean,
	params?: {
		limit?: number;
		startAfter?: DocumentSnapshot | null;
		endBefore?: DocumentSnapshot | null;
	},
) => {
	const clauses: QueryConstraint[] = [];
	if (params?.startAfter) clauses.unshift(startAfter(params.startAfter));
	if (params?.endBefore) clauses.unshift(endBefore(params.endBefore));
	if (params?.limit) clauses.unshift(orderBy('dueDate', 'desc'), limit(params.limit));
	if (!includeCompleted) clauses.unshift(where('status', 'not-in', [OrderStatus.COMPLETED, OrderStatus.CANCELLED]));
	return query(ordersCollection(orgId), ...clauses);
};

const pastDue = (dueDate: Date) => {
	//convert both dates to start of day
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	dueDate.setHours(0, 0, 0, 0);
	return dueDate < today;
};
