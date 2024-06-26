// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';
import { initializeFirestore, persistentLocalCache, terminate } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDl4xdt0iixNH9YZt8D2bAtfOHWP2ukn8g',
	authDomain: 'spillway-d8e4a.firebaseapp.com',
	projectId: 'spillway-d8e4a',
	storageBucket: 'spillway-d8e4a.appspot.com',
	messagingSenderId: '521098748682',
	appId: '1:521098748682:web:79388c112e1546444bd0f3',
	measurementId: 'G-5PEH2QVSHR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);

const startDb = async () => {
	initializeFirestore(app, {
		localCache: persistentLocalCache(),
	});
};
export const db = startDb();

export default app;
export { analytics, functions, startDb };
