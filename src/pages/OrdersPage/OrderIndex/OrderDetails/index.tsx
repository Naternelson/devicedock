import { AppBar,  Button, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Order, ordersCollection } from '../../../../types/Order';
import { useAppNav, useOrgId } from '../../../../util';
import { doc, onSnapshot } from 'firebase/firestore';
import { useContainer } from '../../../../util/useContainer';
import { OrderOverview } from './OrderOverview';
import { OrderContent, useOrder } from './utils';
import { ProductTab } from './ProductOverview';
import { CasesTab } from './CasesTab';

export const OrderDetails = () => {
	const ref = useContainer('2rem');
	const [searchParams] = useSearchParams();
	const [order, setOrder] = useState<Order | null>(null);

	const orgId = useOrgId();
	const orderId = searchParams.get('orderId');
	useEffect(() => {
		if (!orderId) {
			setOrder(null);
			return;
		}
		if (!orgId) return;
		const q = doc(ordersCollection(orgId), orderId);
		return onSnapshot(q, (snap) => {
			if (snap.exists()) {
				setOrder(snap.data() as Order);
			} else {
				setOrder(null);
			}
		});
	}, [orderId, orgId]);

	if (!order)
		return (
			<Stack direction="column" flex={1} justifyContent="center" alignItems="center">
				No order found
			</Stack>
		);
	return (
		<OrderContent.Provider value={{ order }}>
			<Stack
				flex={1}
				ref={ref}
				direction="column"
				gap={'0.5rem'}
				sx={{ overflow: 'auto', boxSizing: 'border-box' }}
				divider={<Divider flexItem />}>
				<Stack gap={'1rem'} marginY={'1rem'} className={'delaygroup'}>
					<OrderTitle />
					<ActionBar />
				</Stack>
				<Stack flex={1}>
					<TabsHeader />
					<Stack direction="row" id={'hello'} flex={1} sx={{ flexGrow: 1 }}>
						<OrderOverview />
						<ProductTab />
						<CasesTab />
					</Stack>
				</Stack>
			</Stack>
		</OrderContent.Provider>
	);
};
const OrderTitle = () => {
	const { order } = useOrder()!;
	return (
		<Stack direction="column" alignItems={'center'} className="delaygroup">
			<Stack
				direction={"column"}
				alignItems={'center'}
				gap={'.25rem'}
				className="fadeup">
				<Typography fontWeight={400} variant={'h1' }>
					{order.ids[0].value}
				</Typography>
				<Divider flexItem />
				<Typography fontStyle={'italic'} variant="caption" lineHeight={'1.5rem'}>
					{order.ids[0].name}
				</Typography>
			</Stack>
		</Stack>
	);
};

const ActionBar = () => {
	const { order } = useOrder()!;
	const { navigate: nav } = useAppNav('/dashboard');
	return (
		<Stack direction="row" justifyContent="center" gap={'3rem'} alignItems="center">
			<Button
				color="primary"
				className="fadeup"
				variant="contained"
				fullWidth
				onClick={() => nav({ to: '?orderId=' + order.id })}>
				Build
			</Button>
		</Stack>
	);
};

const tabs = (count: number) => ['Overview', count > 1 ? 'Products' : 'Product', 'Cases', 'Customer'];
const TabsHeader = () => {
	const { order } = useOrder()!;
	const [searchParams, setSearchParams] = useSearchParams();
	const currentTab = searchParams.get('tab');
	useEffect(() => {
		if (currentTab) return;
		searchParams.set('tab', tabs(order.orderItems.length)[0]);
		setSearchParams(searchParams);
	}, [currentTab, searchParams, setSearchParams, order.orderItems.length]);

	const changeTab = (e: any, newValue: string) => {
		searchParams.set('tab', newValue);
		setSearchParams(searchParams);
	};
	return (
		<AppBar position="static" color="default">
			<Tabs value={currentTab} onChange={changeTab} aria-label="order tabs" className="delaygroup">
				{tabs(order.orderItems.length).map((tab, index) => {
					return <Tab key={index} label={tab} value={tab} className="fadeup" />;
				})}
			</Tabs>
		</AppBar>
	);
};
