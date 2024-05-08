import { useEffect, useState } from "react";
import { Case } from "../types/Case";
import { UnitValue, unitValuesCollection } from "../types/UnitValue";
import { useOrgId } from "../util";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";

export const useCaseUnits = (orderCase?:Case ) => {
    const [units, setUnits] = useState<UnitValue[]>([]);
    const caseId = orderCase?.id;
    const orgId = useOrgId();
    useEffect(() => {
        if(!orgId || !caseId) return;
        const q = query(unitValuesCollection(orgId), where('caseId', '==',caseId), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snap) => {
            if(snap.empty) setUnits([]);
            else setUnits(snap.docs.map((d) => d.data() as UnitValue));
        });
    },[orgId, caseId])
    return units;
}