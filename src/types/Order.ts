import { Timestamp } from "firebase/firestore";
import { toTimestamp } from "../util";

export enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    DELIVERED = "delivered",
    COMPLETED = "completed",
}

export type DocumentOrder = {
    customerId: string;
    documents: string[];
    orderItems: {productId: string, quantity: number, notes: string}[];
    status: OrderStatus;
    dueDate: Timestamp;
    orderedDate: Timestamp;
    shipToAddress: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreationOrder = Omit<DocumentOrder, 'createdAt' | 'updatedAt' | 'orderedDate' | 'dueDate'>;
export type UpdateOrder = Partial<CreationOrder>;

export type OrderType = CreationOrder & { createdAt?: string; updatedAt?: string; orderedDate?: string; dueDate?: string};

export class Order implements OrderType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
        scope: 'organization'
	};
	static toFirestore(order: OrderType): DocumentOrder {
		return {
			documents: order.documents,
			customerId: order.customerId,
			orderItems: order.orderItems,
			status: order.status,
			dueDate: toTimestamp(order.dueDate),
			orderedDate: toTimestamp(order.orderedDate),
			shipToAddress: order.shipToAddress,
			createdAt: toTimestamp(order.createdAt),
			updatedAt: toTimestamp(order.updatedAt),
		};
	}
	static fromFirestore(snapshot: any, options: any): Order {
		const data = snapshot.data(options);
		const order = new Order();
		order.documents = data.documents;
		order.customerId = data.customerId;
		order.orderItems = data.orderItems;
		order.status = data.status;
		order.dueDate = data.dueDate.toDate().toISOString();
		order.orderedDate = data.orderedDate.toDate().toISOString();
		order.shipToAddress = data.shipToAddress;
		order.createdAt = data.createdAt.toDate().toISOString();
		order.updatedAt = data.updatedAt.toDate().toISOString();
		return order;
	}
	documents: OrderType['documents'] = [];
	customerId: OrderType['customerId'] = '';
	orderItems: OrderType['orderItems'] = [];
	status: OrderType['status'] = OrderStatus.PENDING;
	dueDate?: OrderType['dueDate'];
	orderedDate: OrderType['orderedDate'];
	shipToAddress: OrderType['shipToAddress'] = '';
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}