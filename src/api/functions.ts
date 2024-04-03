import { httpsCallable } from "firebase/functions";
import {functions} from "../firebase.config";

export const createUserFromToken = httpsCallable(functions, 'createUserFromToken');
export const createOrganizationWithAdmin = httpsCallable(functions, 'createOrganizationWithAdmin');