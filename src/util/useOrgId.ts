import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const useOrgId = () => { 
    const [orgId, setOrgId] = useState<string | null>(null);
    useEffect(() => {
        onAuthStateChanged(getAuth(), async (user) => {
            if(user){
                const idTokenResult = await user.getIdTokenResult()
                setOrgId((idTokenResult.claims['orgId'] as string) || null)
            } else {
                setOrgId(null)
            }
        })
    },[])
    return orgId 
}