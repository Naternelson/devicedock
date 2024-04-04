import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, collection, getFirestore } from "firebase/firestore";

export type DocumentProduct = {
    name: string,
    description: string,
    customers: string[],
    /**
     * Custom attributes for the product, could be color, size, weight, etc.
     */
    attributes: {
        name: string,
        value: string,
    }[],
    /**
     * Unique Identifier schema for the product, could be serial number, barcode, etc.
     */
    unitIdentifierSchema: {
        name: string, 
        count: number, 
        pattern: string,
        transform: 'UPPERCASE' | 'LOWERCASE' | 'NONE'
        unique: boolean,
        defaultValue: string,
        scope: "order" | "organization",
        labelTemplates: string[]
    }[],
    /**
     * Unique Identifier schema for the case of the product, could be carton number, etc.
     */
    caseIdentifierSchema: {
        name: string,   
        maxSize: number, 
        pattern: string,
        unique: boolean,
        autoGen: boolean,
        scope: "order" | "organization",
        labelTemplates: string[]
    }
    createdAt: Timestamp ,
    updatedAt: Timestamp ,
}

export type CreationProduct = Omit<DocumentProduct, 'createdAt' | 'updatedAt'>;
export type UpdateProduct = Partial<CreationProduct>;

export type ProductType = CreationProduct & {createdAt?: string, updatedAt?: string}

export class Product implements ProductType {
    static readonly accessRules = {
        read: 'user',
        write: 'user',
        scope: 'organization'
    }
	static toFirestore(product: ProductType): DocumentProduct {
		return {
			name: product.name,
			description: product.description,
			customers: product.customers,
			attributes: product.attributes,
			unitIdentifierSchema: product.unitIdentifierSchema,
			caseIdentifierSchema: product.caseIdentifierSchema,
			createdAt: toTimestamp(product.createdAt),
			updatedAt: toTimestamp(product.updatedAt),
		};
	}
	static fromFirestore(snapshot: QueryDocumentSnapshot<DocumentProduct>, options: SnapshotOptions): Product {
		const data = snapshot.data(options);

		const product = new Product();
		product.name = data.name;
		product.description = data.description;
		product.customers = data.customers;
		product.attributes = data.attributes;
		product.unitIdentifierSchema = data.unitIdentifierSchema;
		product.caseIdentifierSchema = data.caseIdentifierSchema;
		product.createdAt = data.createdAt?.toDate().toISOString();
		product.updatedAt = data.updatedAt?.toDate().toISOString();
		return product;
	}
	name: ProductType['name'] = '';
	description: ProductType['description'] = '';
	attributes: ProductType['attributes'] = [];
	unitIdentifierSchema: ProductType['unitIdentifierSchema'] = [];
	caseIdentifierSchema: ProductType['caseIdentifierSchema'] = {
        name: '',
        maxSize: 1,
        pattern: '',
        unique: false,
        autoGen: true,
        scope: 'organization',
        labelTemplates: []
    };
	customers: ProductType['customers'] = [];
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}

const toTimestamp = (date?: string) => {
    if (!date) return Timestamp.fromDate(new Date());
    return Timestamp.fromDate(new Date(date));
}

export const productsCollection = (orgId: string) => {
    return collection(getFirestore(), 'organizations', orgId, 'products').withConverter({
        toFirestore: Product.toFirestore,
        fromFirestore: Product.fromFirestore,
    });
}