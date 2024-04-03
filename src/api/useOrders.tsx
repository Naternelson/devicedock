import { useEffect, useState } from 'react';
import { useOrgId } from '../util/useOrgId';
import {
	WhereFilterOp,
	collection,
	getDocs,
	getFirestore,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAt,
	where,
} from 'firebase/firestore';

export type OrderStatus = 'queued' | 'active' | 'cancelled' | 'complete' | 'error';

export interface Order {
	id: string;
	createdAt: string;
	customerId: string;
	items: { productId: string; quantity: number; status: OrderStatus }[];
	status: OrderStatus;
	dueDate: string;
	shipTo: string;
}

export const useOrders = (params: {
	customerId?: string;
	productId?: string;
	status?: OrderStatus[];
	limit?: number;
	offset?: number;
	orderBy?: 'asc' | 'desc';
	sortBy?: keyof Order;
	startDate?: string;
	dueDate?: string;
}) => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const orgId = useOrgId();
	const { customerId, productId, status, limit: maxCount, offset, orderBy: ob, sortBy, startDate, dueDate } = params;



    useEffect(() => {
        if (!orgId) return;
        const constraints: { field: string; operator: WhereFilterOp; value: any }[] = [];
		if (customerId) {
			constraints.push({ field: 'customerId', operator: '==', value: customerId });
		}
		if (productId) {
			constraints.push({ field: 'items.productId', operator: '==', value: productId });
		}
		if (status) {
			constraints.push({ field: 'status', operator: 'in', value: status });
		} else {
			constraints.push({ field: 'status', operator: 'not-in', value: ['cancelled', 'complete'] });
		}
		if (startDate) {
			constraints.push({ field: 'createdAt', operator: '>=', value: startDate });
		}
		if (dueDate) {
			constraints.push({ field: 'dueDate', operator: '==', value: dueDate });
		}

		const whereClauses = constraints.map((c) => {
			const { field, operator, value } = c;
			return where(field, operator, value);
		});

		const q = query(
			collection(getFirestore(), 'organizations', orgId, 'orders'),
			...whereClauses,
			limit(maxCount || 100),
			orderBy(sortBy || 'createdAt', ob || 'desc'),
		);
        return onSnapshot(q, (snap) => {
            setOrders(snap.docs.map((d) => d.data() as Order));
            setLoading(false);
        }, (error:any) => {
            setError(error);
            setLoading(false);
        })
    },[orgId, customerId, productId, status, maxCount, offset, ob, sortBy, startDate, dueDate])

	return {
		orders,
		loading,
		error,
	};
};

