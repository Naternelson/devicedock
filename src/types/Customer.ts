import { Timestamp, collection, getFirestore } from "firebase/firestore";
import { toTimestamp } from "../util";

export type DocumentCustomer = {
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type CreationCustomer = Omit<DocumentCustomer, 'createdAt' | 'updatedAt'>;
export type UpdateCustomer = Partial<CreationCustomer>;

export type CustomerType = CreationCustomer & { createdAt?: string; updatedAt?: string };

export class Customer implements CustomerType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
        scope: 'organization'
	};
	static toFirestore(customer: CustomerType): DocumentCustomer {
		return {
			name: customer.name,
			email: customer.email,
			phone: customer.phone,
			address: customer.address,
			createdAt: toTimestamp(customer.createdAt),
			updatedAt: toTimestamp(customer.updatedAt),
		};
	}
	static fromFirestore(snapshot: any, options: any): Customer {
		const data = snapshot.data(options);

		const customer = new Customer();
		customer.name = data.name;
		customer.email = data.email;
		customer.phone = data.phone;
		customer.address = data.address;
		customer.createdAt = data.createdAt?.toDate().toISOString();
		customer.updatedAt = data.updatedAt?.toDate().toISOString();
		return customer;
	}
	name: CustomerType['name'] = '';
	email: CustomerType['email'] = '';
	phone: CustomerType['phone'] = '';
	address: CustomerType['address'] = '';
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}

export const customersCollection = (orgId: string) => {
    return collection(getFirestore(), 'organizations', orgId, 'customers').withConverter({
        toFirestore: Customer.toFirestore,
        fromFirestore: Customer.fromFirestore,
    });
};