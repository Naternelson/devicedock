// import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, collection, getFirestore } from 'firebase/firestore';

import { Timestamp, collection, getFirestore } from "firebase/firestore";
import { toTimestamp } from "../util";

export type DocumentUnitValue = {
    productId: string;
    schemaName: string;
    value: string;
    count: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type CreationUnitValue = Omit<DocumentUnitValue, 'createdAt' | 'updatedAt'>;
export type UpdateUnitValue = Partial<CreationUnitValue>;

export type UnitValueType = CreationUnitValue & { createdAt?: string; updatedAt?: string };

export class UnitValue implements UnitValueType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
        scope: 'organization'
	};
	static toFirestore(unitValue: UnitValueType): DocumentUnitValue {
		return {
			productId: unitValue.productId,
			schemaName: unitValue.schemaName,
			value: unitValue.value,
			count: unitValue.count,
			createdAt: toTimestamp(unitValue.createdAt),
			updatedAt: toTimestamp(unitValue.updatedAt),
		};
	}
	static fromFirestore(snapshot: any, options: any): UnitValue {
		const data = snapshot.data(options);

		const unitValue = new UnitValue();
		unitValue.productId = data.productId;
		unitValue.schemaName = data.schemaName;
		unitValue.value = data.value;
		unitValue.count = data.count;
		unitValue.createdAt = data.createdAt?.toDate().toISOString();
		unitValue.updatedAt = data.updatedAt?.toDate().toISOString();
		return unitValue;
	}
	productId: UnitValueType['productId'] = '';
	schemaName: UnitValueType['schemaName'] = '';
	value: UnitValueType['value'] = '';
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