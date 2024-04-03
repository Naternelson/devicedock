import { Timestamp } from "firebase/firestore"

export const toTimestamp = (date?: Date | string ) => {
    if(!date) return Timestamp.fromDate(new Date());
    if(typeof date === 'string') return Timestamp.fromDate(new Date(date));
    return Timestamp.fromDate(date);
}