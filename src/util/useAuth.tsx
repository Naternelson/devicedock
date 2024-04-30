import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useAuth = () => {
	const [user, loading, error] = useAuthState(getAuth());
	const [userDataLoading, setUserDataLoading] = useState(false);
	const [userData, setUserData] = useState<Record<string, string> | null>(null);
	const uid = user?.uid;
	useEffect(() => {
		if (uid) {
			const db = getFirestore();
			const userCollection = collection(db, 'users');
			const retrieveUser = async () => {
				setUserDataLoading(true);
				const docData = doc(userCollection, uid);
                try{
                    const docSnap = await getDoc(docData);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setUserData(null);
                    }
                } catch (error) {
                    console.error('Error retrieving user data:', error);
                    setUserData(null);

                } finally {
                    setUserDataLoading(false);
                }
			};
			retrieveUser();
		} else {
            setUserData(null)
            setUserDataLoading(false)
        }
	}, [uid]);
    return {
        user, userData, loading: loading || userDataLoading, error
    }
};
