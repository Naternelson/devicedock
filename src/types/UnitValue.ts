// import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, collection, getFirestore } from 'firebase/firestore';

import { SnapshotOptions, Timestamp, collection, getFirestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { toTimestamp } from '../util';

export type DocumentUnitValue = {
	productId: string;
	ids: { [key: string]: string };
	caseId: string;
	orderId: string;
	count: number;
	createdAt: Timestamp;
	updatedAt: Timestamp;
};
export type CreationUnitValue = Omit<DocumentUnitValue, 'createdAt' | 'updatedAt'>;
export type UpdateUnitValue = Partial<CreationUnitValue>;

export type UnitValueType = CreationUnitValue & { createdAt?: string; updatedAt?: string; id?: string };

export class UnitValue implements UnitValueType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
		scope: 'organization',
	};
	static toFirestore(unitValue: UnitValue): DocumentUnitValue {
		return {
			productId: unitValue.productId,
			ids: unitValue.ids,
			count: unitValue.count,
			caseId: unitValue.caseId,
			orderId: unitValue.orderId,
			createdAt: toTimestamp(unitValue.createdAt),
			updatedAt: toTimestamp(unitValue.updatedAt),
		};
	}
	static fromFirestore(snapshot: QueryDocumentSnapshot<DocumentUnitValue>, options: SnapshotOptions): UnitValue {
		const data = snapshot.data(options);

		const unitValue = new UnitValue();
		unitValue.id = snapshot.id;
		unitValue.productId = data.productId;
		unitValue.caseId = data.caseId;
		unitValue.orderId = data.orderId;
		unitValue.ids = data.ids;
		unitValue.count = data.count;
		unitValue.createdAt = data.createdAt?.toDate().toISOString();
		unitValue.updatedAt = data.updatedAt?.toDate().toISOString();
		return unitValue;
	}
	id: UnitValueType['id'];
	productId: UnitValueType['productId'] = '';
	caseId: UnitValueType['caseId'] = '';
	orderId: UnitValueType['orderId'] = '';
	ids: UnitValueType['ids'] = {};
	count: UnitValueType['count'] = 1;
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}

export const unitValuesCollection = (orgId: string) => {
	return collection(getFirestore(), 'organizations', orgId, 'unitValues').withConverter({
		toFirestore: UnitValue.toFirestore,
		fromFirestore: UnitValue.fromFirestore,
	});
};
