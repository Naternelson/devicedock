import { Timestamp, collection, getFirestore } from 'firebase/firestore';
import { toTimestamp } from '../util';

export type DocumentOrganization = {
	name: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
};
export type CreationOrganization = Omit<DocumentOrganization, 'createdAt' | 'updatedAt'>;
export type UpdateOrganization = Partial<CreationOrganization>;

export type OrganizationType = CreationOrganization & { createdAt?: string; updatedAt?: string };

export class Organization implements OrganizationType {
    static readonly accessRules = {
        read: 'user',
        write: 'admin',
        scope: 'organization',
    }
    static toFirestore(organization: OrganizationType): DocumentOrganization {
        return {
            name: organization.name,
            createdAt: toTimestamp(organization.createdAt),
            updatedAt: toTimestamp(organization.updatedAt),
        };
    }
    static fromFirestore(snapshot: any, options: any): Organization {
        const data = snapshot.data(options);

        const organization = new Organization();
        organization.name = data.name;
        organization.createdAt = data.createdAt?.toDate().toISOString();
        organization.updatedAt = data.updatedAt?.toDate().toISOString();
        return organization;
    }
    name: OrganizationType['name'] = '';
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}

export const organizationsCollection = () => {
    return collection(getFirestore(), 'organizations').withConverter({
        toFirestore: Organization.toFirestore,
        fromFirestore: Organization.fromFirestore,
    });
};