import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, collection, getFirestore } from 'firebase/firestore';
import { toTimestamp } from '../util';

export enum OrderStatus {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	CANCELLED = 'cancelled',
	DELIVERED = 'delivered',
	COMPLETED = 'completed',
}

export type DocumentOrder = {
	customerId: string;
	ids: {
		name: string;
		value: string;
	}[];
	documents: string[];
	orderItems: { productId: string; quantity: number; notes: string }[];
	status: OrderStatus;
	dueDate: Timestamp;
	orderedDate: Timestamp;
	shipToAddress: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
};

export type CreationOrder = Omit<DocumentOrder, 'createdAt' | 'updatedAt' | 'orderedDate' | 'dueDate'>;
export type UpdateOrder = Partial<CreationOrder>;

export type OrderType = CreationOrder & {
	createdAt?: string;
	updatedAt?: string;
	orderedDate?: string;
	dueDate?: string;
};

export class Order implements OrderType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
		scope: 'organization',
	};
	static toFirestore(order: Order): DocumentOrder {
		return {
			documents: order.documents,
			customerId: order.customerId,
			orderItems: order.orderItems,
			status: order.status,
			ids: order.ids,
			dueDate: toTimestamp(order.dueDate),
			orderedDate: toTimestamp(order.orderedDate),
			shipToAddress: order.shipToAddress,
			createdAt: toTimestamp(order.createdAt),
			updatedAt: toTimestamp(order.updatedAt),
		};
	}
	static fromFirestore(snapshot: QueryDocumentSnapshot<DocumentOrder>, options: SnapshotOptions): Order {
		const data = snapshot.data(options);
		const order = new Order();
		order.documents = data.documents;
		order.customerId = data.customerId;
		order.orderItems = data.orderItems;
		order.status = data.status;
		order.ids = data.ids;
		order.dueDate = data.dueDate?.toDate().toISOString();

		order.orderedDate = data.orderedDate?.toDate().toISOString();
		order.shipToAddress = data.shipToAddress;
		order.createdAt = data.createdAt?.toDate().toISOString();
		order.updatedAt = data.updatedAt?.toDate().toISOString();
		return order;
	}
	documents: OrderType['documents'] = [];
	customerId: OrderType['customerId'] = '';
	orderItems: OrderType['orderItems'] = [];
	status: OrderType['status'] = OrderStatus.PENDING;
	dueDate?: OrderType['dueDate'];
	ids: OrderType['ids'] = [];
	orderedDate: OrderType['orderedDate'];
	shipToAddress: OrderType['shipToAddress'] = '';
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}

export const ordersCollection = (orgId: string) => {
	return collection(getFirestore(), `organizations/${orgId}/orders` as const).withConverter({
		toFirestore: Order.toFirestore,
		fromFirestore: Order.fromFirestore,
	});
};
