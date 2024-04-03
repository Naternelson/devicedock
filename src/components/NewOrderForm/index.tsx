import { Controller, FormProvider, UseFormReturn, useForm, useFormContext } from 'react-hook-form';
import { OrderStatus, Order } from '../../api/useOrders';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useOrgId } from '../../util/useOrgId';
import { DocumentData, DocumentReference, addDoc, collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { LoaderOverlay } from '../LoaderOverlay';
import { MenuItem, Select, SxProps, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface OrderFormData {
	status: OrderStatus;
	customerId: string;
	items: Order['items'];
	dueDate: string;
	shipTo: string;
}

export const NewOrderForm = ({
	children,
	onSuccess,
	onError,
}: PropsWithChildren<{
	onSuccess?: (ref: DocumentReference<DocumentData>, form: UseFormReturn<OrderFormData>) => void;
	onError?: (error: any, form: UseFormReturn<OrderFormData>) => void;
}>) => {
	const orgId = useOrgId();
	const frm = useForm<OrderFormData>({
        defaultValues: {
            status: 'queued',
            items: [],
            customerId: '',
            dueDate: '',
            shipTo: '',
        }
    });
	const onSubmit = async (data: OrderFormData) => {
		if (!orgId) return;
		const c = collection(getFirestore(), 'organizations', orgId, 'orders');
		try {
			const ref = await addDoc(c, data);
			frm.reset();
			onSuccess?.(ref, frm);
		} catch (error) {
			console.error('Error adding document:', error);
			onError?.(error, frm);
		}
	};

	return (
		<FormProvider {...frm}>
			<form onSubmit={frm.handleSubmit(onSubmit)}>
				<LoaderOverlay load={frm.formState.isSubmitting}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
				</LoaderOverlay>
			</form>
		</FormProvider>
	);
};

export const CustomerSelectField = (props: { sx: SxProps }) => {
	const { control, formState: {errors} } = useFormContext<OrderFormData>();
	const orgId = useOrgId();
	const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
	useEffect(() => {
		if (!orgId) return;
		const c = collection(getFirestore(), 'organizations', orgId, 'customers');
		const unsub = onSnapshot(c, (snap) => {
			setCustomers(
				snap.docs.map((d) => ({
					id: d.id,
					name: d.data().name,
				})),
			);
		});
		return unsub;
	}, [orgId]);
    const errorMessage = errors['customerId']?.message?.toString();
	return (
		<Controller
			control={control}
			name="customerId"
            rules={{required: 'Customer is required'}}
			render={({ field }) => (
				<Select {...field} size="small" sx={props.sx} error={!!errorMessage} >
					{customers.map((c) => (
						<MenuItem key={c.id} value={c.id}>
							{c.name}
						</MenuItem>
					))}
				</Select>
			)}
		/>
	);
};

export const ShipToField = ({sx}: {sx: SxProps}) => {
	const { control, formState: {errors} } = useFormContext<OrderFormData>();
    const errorMessage = errors['shipTo']?.message?.toString();
	return (
		<Controller
			control={control}
			name="shipTo"

			render={({ field }) => <DatePicker {...field} slotProps={{
                textField: {
                    sx,
                    helperText: errorMessage,
                    error: !!errorMessage,
                    size: 'small',
                }
            }} label="Ship To" />}
		/>
	);
};

export const DueDate = ({sx}: {sx: SxProps}) => {
    const { control, formState: {errors} } = useFormContext<OrderFormData>();
    const errorMessage = errors['dueDate']?.message?.toString();
    return (
        <Controller
            control={control}
            name="dueDate"
            render={({ field }) => <DatePicker {...field} slotProps={{
                textField: {
                    sx,
                    helperText: errorMessage,
                    error: !!errorMessage,
                    size: 'small',
                }
            }} label="Due Date" />}
        />
    );
}



const ProductField = () => {
    const [products, setProducts] = useState<>([]);
}