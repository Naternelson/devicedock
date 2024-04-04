import { getAuth, signOut } from "firebase/auth"
import { clearIndexedDbPersistence, getFirestore, terminate } from "firebase/firestore";

export const logoutUser = async () => {
    await terminate(getFirestore());
    await clearIndexedDbPersistence(getFirestore());
    await signOut(getAuth());
}