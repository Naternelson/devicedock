import { Timestamp, collection, getFirestore } from "firebase/firestore";
import { toTimestamp } from "../util";

export type DocumentCaseUnit = {
    caseId: string;
    unitId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type CreationCaseUnit = Omit<DocumentCaseUnit, 'createdAt' | 'updatedAt'>;
export type UpdateCaseUnit = Partial<CreationCaseUnit>;

export type CaseUnitType = CreationCaseUnit & { createdAt?: string; updatedAt?: string };

export class CaseUnit implements CaseUnitType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
        scope: 'organization'
	};
	static toFirestore(caseUnit: CaseUnitType): DocumentCaseUnit {
		return {
			caseId: caseUnit.caseId,
			unitId: caseUnit.unitId,
			createdAt: toTimestamp(caseUnit.createdAt),
			updatedAt: toTimestamp(caseUnit.updatedAt),
		};
	}
	static fromFirestore(snapshot: any, options: any): CaseUnit {
		const data = snapshot.data(options);

		const caseUnit = new CaseUnit();
		caseUnit.unitId = data.unitId;
        caseUnit.caseId = data.caseId;
		caseUnit.createdAt = data.createdAt?.toDate().toISOString();
		caseUnit.updatedAt = data.updatedAt?.toDate().toISOString();
		return caseUnit;
	}
    caseId: CaseUnitType['caseId'] = '';
    unitId: CaseUnitType['unitId'] = '';
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
}

export const caseUnitsCollection = (orgId: string) => {
    return collection(getFirestore(), 'organizations', orgId, 'caseUnits').withConverter({
        toFirestore: CaseUnit.toFirestore,
        fromFirestore: CaseUnit.fromFirestore,
    });
};