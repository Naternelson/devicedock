import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, collection, getFirestore } from "firebase/firestore";
import { toTimestamp } from "../util";

export type DocumentCase = {
	productId: string;
	orderId: string;
	shipmentId: string;
	caseId: string;
	count: number; 
	maxSize: number; 
	createdAt: Timestamp;
	updatedAt: Timestamp;
};

export type CreationCase = Omit<DocumentCase, 'createdAt' | 'updatedAt'>;
export type UpdateCase = Partial<CreationCase>;

export type CaseType = CreationCase & { createdAt?: string; updatedAt?: string; id?: string };

export class Case implements CaseType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
		scope: 'organization',
	};
	static toFirestore(caseValue: Case): DocumentCase {
		return {
			productId: caseValue.productId,
			orderId: caseValue.orderId,
			shipmentId: caseValue.shipmentId,
			caseId: caseValue.caseId,
			count: caseValue.count,
			maxSize: caseValue.maxSize,
			createdAt: toTimestamp(caseValue.createdAt),
			updatedAt: toTimestamp(caseValue.updatedAt),
		};
	}
	static fromFirestore(snapshot: QueryDocumentSnapshot<DocumentCase>, options: SnapshotOptions): Case {
		const data = snapshot.data(options);

		const caseValue = new Case();
		caseValue.id = snapshot.id;
		caseValue.productId = data.productId;
		caseValue.orderId = data.orderId;
		caseValue.shipmentId = data.shipmentId;
		caseValue.caseId = data.caseId;
		caseValue.count = data.count;
		caseValue.maxSize = data.maxSize;
		caseValue.createdAt = data.createdAt?.toDate().toISOString();
		caseValue.updatedAt = data.updatedAt?.toDate().toISOString();
		return caseValue;
	}
	id: CaseType['id'];
	productId: CaseType['productId'] = '';
	orderId: CaseType['orderId'] = '';
	shipmentId: CaseType['shipmentId'] = '';
	caseId: CaseType['caseId'] = '';
	count: CaseType['count'] = 0;
	maxSize: CaseType['maxSize'] = 0;
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}

export const casesCollection = (orgId: string) => {
    return collection(getFirestore(), 'organizations', orgId, 'cases').withConverter({
        toFirestore: Case.toFirestore,
        fromFirestore: Case.fromFirestore,
    });
};