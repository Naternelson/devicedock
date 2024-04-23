import { QueryDocumentSnapshot, SnapshotOptions, Timestamp, collection, getFirestore, or } from "firebase/firestore";
import { toTimestamp } from "../util";

export type DocumentMachineSettings = {
    machine: string;
    productId: string; 
    unitSchemaPrinter: {
        silent: boolean;
        name: string;
        printer: string;
        template: string;
    }[];
    caseSchemaPrinter: {
        silent: boolean;
        printer: string;
        template: string; 
    }[]; 
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type CreationMachineSettings = Omit<DocumentMachineSettings, 'createdAt' | 'updatedAt'>;

export type UpdateMachineSettings = Partial<CreationMachineSettings>;

export type MachineSettingsType = CreationMachineSettings & { createdAt?: string, updatedAt?: string };

export class MachineSettings implements MachineSettingsType {
    static readonly accessRules = {
        read: 'user',
        write: 'user',
        scope: 'organization'
    }
    static toFirestore(machineSettings: MachineSettings): DocumentMachineSettings {
        return {
            machine: machineSettings.machine,
            productId: machineSettings.productId,
            unitSchemaPrinter: machineSettings.unitSchemaPrinter,
            caseSchemaPrinter: machineSettings.caseSchemaPrinter,
            createdAt: toTimestamp(machineSettings.createdAt),
            updatedAt: toTimestamp(machineSettings.updatedAt),
        };
    }
    static fromFirestore(snapshot: QueryDocumentSnapshot<DocumentMachineSettings>, options: SnapshotOptions): MachineSettings {
        const data = snapshot.data(options);

        const machineSettings = new MachineSettings();
        machineSettings.machine = data.machine;
        machineSettings.productId = data.productId;
        machineSettings.unitSchemaPrinter = data.unitSchemaPrinter;
        machineSettings.caseSchemaPrinter = data.caseSchemaPrinter;
        machineSettings.createdAt = data.createdAt?.toDate().toISOString();
        machineSettings.updatedAt = data.updatedAt?.toDate().toISOString();
        return machineSettings;
    }
    machine: MachineSettingsType['machine'] = '';
    productId: MachineSettingsType['productId'] = '';
    unitSchemaPrinter: MachineSettingsType['unitSchemaPrinter'] = [];
    caseSchemaPrinter: MachineSettingsType['caseSchemaPrinter'] = [];
    createdAt: MachineSettingsType['createdAt'] = '';
    updatedAt: MachineSettingsType['updatedAt'] = '';
}

export const machineSettingsCollection = (orgId: string) =>
	collection(getFirestore(),`organizations/${orgId}/machineSettings` as const).withConverter({
		toFirestore: MachineSettings.toFirestore,
		fromFirestore: MachineSettings.fromFirestore,
	});
