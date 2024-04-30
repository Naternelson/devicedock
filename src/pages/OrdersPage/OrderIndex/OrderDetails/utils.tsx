import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Order } from '../../../../types/Order';
import { useSearchParams } from 'react-router-dom';
import { Collapse, Stack } from '@mui/material';

export const OrderContent = createContext<{ order: Order } | null>(null);
export const useOrder = () => {
	return useContext(OrderContent);
};

export const TabContainer = ({ tab, children }: PropsWithChildren<{ tab: string }>) => {
	const [searchParams] = useSearchParams();
	const isCurrentTab = searchParams.get('tab') === tab;

	const display = isCurrentTab ? 'initial' : 'none';

	return <Stack sx={{ display, flex: 1 }}>{children}</Stack>;
};
