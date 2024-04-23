import { UseFormReturn } from 'react-hook-form';
import { createOrganizationWithAdmin, createUserFromToken } from '../../api/functions';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startDb } from '../../firebase.config';

export type FormData = {
	token: string;
	organizationName: string;
	email: string;
	password: string;
	confirmPassword: string;
	displayName: string;
};

export const useOnSubmit = (frm: UseFormReturn<FormData, any, undefined>) => {
    const nav = useNavigate();
	const [error, setError] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		let result = null;
		if (data.token && data.token.trim() !== '') {
			result = await fromToken(data, frm);
		} else {
			result = await createWithOrg(data, frm);
		}
		if (result.success) {
			frm.reset();
			setError(null);
            nav('/dashboard', {replace: true})
		} else {
			setError(result.error);
		}
		setIsSubmitting(false);
		// Path 2, Create a new user and organization
	};
	return { onSubmit, error, isSubmitting };
};

const fromToken = async (
	data: FormData,
	frm: UseFormReturn<FormData, any, undefined>,
): Promise<{ success: boolean; error: any }> => {
	try {
		await createUserFromToken({
			token: data.token,
			password: data.password,
			displayName: data.displayName,
		});
		await signInWithEmailAndPassword(getAuth(), data.email, data.password);
		return { success: true, error: null };
	} catch (error: any) {
		console.error(error);
		const code = error?.code || '';
		const message = error?.message || '';

		switch (code) {
			case 'invalid-argument':
				if (message.includes('password')) {
					frm.setError('password', { message });
				} else if (message.includes('organization')) {
					frm.setError('organizationName', { message });
				} else if (message.includes('email')) {
					frm.setError('email', { message });
				} else if (message.includes('name')) {
					frm.setError('displayName', { message });
				}
				break;
			case 'auth/email-already-in-use':
				frm.setError('email', { message });
				break;
			case 'auth/invalid-email':
				frm.setError('email', { message });
				break;
			case 'auth/weak-password':
				frm.setError('password', { message });
				break;
			default:
				return { success: false, error };
		}
	}
	return { success: false, error: { message: 'There was an unexpected error', code: 'Unexpected Failure' } };
};

const createWithOrg = async (data: FormData, frm: UseFormReturn<FormData, any, undefined>) => {
	try {
		await createOrganizationWithAdmin({
			organizationName: data.organizationName,
			userEmail: data.email,
			userPassword: data.password,
			displayName: data.displayName,
		});
		await startDb();
		await signInWithEmailAndPassword(getAuth(), data.email, data.password);
		return { success: true, error: null };
	} catch (error: any) {
		console.error(error);
		const code = error?.code || '';
		const message = error?.message || '';
		switch (code) {
			case 'invalid-argument':
				if (message.includes('password')) {
					frm.setError('password', { message });
				} else if (message.includes('organization')) {
					frm.setError('organizationName', { message });
				} else if (message.includes('email')) {
					frm.setError('email', { message });
				} else if (message.includes('name')) {
					frm.setError('displayName', { message });
				}
				break;
			case 'auth/email-already-in-use':
				frm.setError('email', { message });
				break;
			case 'auth/invalid-email':
				frm.setError('email', { message });
				break;
			case 'auth/weak-password':
				frm.setError('password', { message });
				break;
			default:
				return { success: false, error };
		}
	}

	return { success: false, error: { message: 'There was an unexpected error', code: 'Unexpected Failure' } };
};
