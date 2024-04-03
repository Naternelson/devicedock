import { Timestamp, collection, getFirestore } from "firebase/firestore";
import { toTimestamp } from "../util";

export type DocumentCase = {
	productId: string;
	orderId: string;
	shipmentId: string;
	caseId: string;
	status: 'full' | 'partial' | 'empty';
	createdAt: Timestamp;
	updatedAt: Timestamp;
};

export type CreationCase = Omit<DocumentCase, 'createdAt' | 'updatedAt'>;
export type UpdateCase = Partial<CreationCase>;

export type CaseType = CreationCase & { createdAt?: string; updatedAt?: string };

export class Case implements CaseType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
        scope: 'organization'
	};
	static toFirestore(caseValue: CaseType): DocumentCase {
		return {
            productId: caseValue.productId,
			orderId: caseValue.orderId,
			shipmentId: caseValue.shipmentId,
			caseId: caseValue.caseId,
			status: caseValue.status,
			createdAt: toTimestamp(caseValue.createdAt),
			updatedAt: toTimestamp(caseValue.updatedAt),
		};
	}
	static fromFirestore(snapshot: any, options: any): Case {
		const data = snapshot.data(options);

		const caseValue = new Case();
        caseValue.productId = data.productId;
		caseValue.orderId = data.orderId;
		caseValue.shipmentId = data.shipmentId;
		caseValue.caseId = data.caseId;
		caseValue.status = data.status;
		caseValue.createdAt = data.createdAt?.toDate().toISOString();
		caseValue.updatedAt = data.updatedAt?.toDate().toISOString();
		return caseValue;
	}
    productId: CaseType['productId'] = '';
	orderId: CaseType['orderId'] = '';
	shipmentId: CaseType['shipmentId'] = '';
	caseId: CaseType['caseId'] = '';
	status: CaseType['status'] = 'empty';
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}

export const casesCollection = (orgId: string) => {
    return collection(getFirestore(), 'organizations', orgId, 'cases').withConverter({
        toFirestore: Case.toFirestore,
        fromFirestore: Case.fromFirestore,
    });
};