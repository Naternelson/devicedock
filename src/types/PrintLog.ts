import { Timestamp, collection, getFirestore } from 'firebase/firestore';
import { toTimestamp } from '../util';
import { getAuth } from 'firebase/auth';

export type DocumentPrintLog = {
	date: Timestamp;
	machine: string;
	labelTemplate: string;
	message: string;
	type: string;
	user: string;
};

export type CreationPrintLog = Omit<DocumentPrintLog, 'date'>;
export type UpdatePrintLog = Partial<CreationPrintLog>;

export type PrintLogType = CreationPrintLog & { date?: string };

export class PrintLog implements PrintLogType {
	static readonly accessRules = {
		read: 'user',
		write: 'user',
		scope: 'organization',
	};
	static toFirestore(printLog: PrintLogType): DocumentPrintLog {
		return {
			date: toTimestamp(printLog.date),
			machine: printLog.machine,
			labelTemplate: printLog.labelTemplate,
			message: printLog.message,
			type: printLog.type,
			user: printLog.user,
		};
	}
	static fromFirestore(snapshot: any, options: any): PrintLog {
		const data = snapshot.data(options);

		const printLog = new PrintLog();
		printLog.date = data.date?.toDate().toISOString();
		printLog.machine = data.machine;
		printLog.labelTemplate = data.labelTemplate;
		printLog.message = data.message;
		printLog.type = data.type;
		printLog.user = data.user;
		return printLog;
	}
	date?: string | undefined;
	machine: PrintLogType['machine'] = '';
	labelTemplate: PrintLogType['labelTemplate'] = '';
	message: PrintLogType['message'] = '';
	type: PrintLogType['type'] = '';
	user: PrintLogType['user'] = '';
	constructor() {
		this.user = getAuth().currentUser?.uid || '';
	}
}

export const printLogsCollection = (orgId: string) => {
    return collection(getFirestore(), 'organizations', orgId, 'printLogs').withConverter({
        toFirestore: PrintLog.toFirestore,
        fromFirestore: PrintLog.fromFirestore,
    });
};

