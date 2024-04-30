import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { PropsWithChildren } from 'react';
import { useOrgId } from '../../util/useOrgId';
import {
	DocumentData,
	DocumentReference,
	WriteBatch,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	where,
	writeBatch,
} from 'firebase/firestore';
import { LoaderOverlay } from '../LoaderOverlay';
import { Box, BoxProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Order, OrderStatus, ordersCollection } from '../../types/Order';
import { useSearch } from '../../util';
import { Customer, customersCollection } from '../../types/Customer';

export interface OrderFormData {
	status: OrderStatus;
	customerId: { name: string; id: string | null };
	ids: Order['ids'];
	orderItems: Order['orderItems'];
	dueDate: Dayjs;
	shipToAddress: string;
}

const defaultValues: OrderFormData = {
	status: OrderStatus.PENDING,
	ids: [
		{
			name: 'Order ID',
			value: '',
		},
	],
	orderItems: [
		{
			productId: '',
			quantity: 1,
			notes: '',
		},
	],
	customerId: { name: '', id: null },
	dueDate: dayjs(),
	shipToAddress: '',
};

export const NewOrderForm = ({
	BoxProps,
	children,
	onSuccess,
	onError,
}: PropsWithChildren<{
	BoxProps?: BoxProps;
	onSuccess?: (ref: DocumentReference<DocumentData>, form: UseFormReturn<OrderFormData>) => void;
	onError?: (error: any, form: UseFormReturn<OrderFormData>) => void;
}>) => {
	const { product, quantity, idname, idvalue, customername, customerid } = useSearch([
		'product',
		'quantity',
		'idname',
		'idvalue',
		'customername',
		'customerid',
	]);
	const orgId = useOrgId();
	const frm = useForm<OrderFormData>({
		mode: 'onTouched',
		defaultValues: {
			...defaultValues,
			customerId: { name: customername || '', id: customerid || null },
			ids: [{ name: idname || 'Order ID', value: idvalue || '' }], // Default to one empty ID
			orderItems: [{ productId: product || '', quantity: Number(quantity) || 1, notes: '' }],
		},
	});
	const handleSubmit = onSubmit({ orgId, frm, onSuccess, onError });

	return (
		<FormProvider {...frm}>
			<Box component={'form'} onSubmit={frm.handleSubmit(handleSubmit)} {...BoxProps}>
				<LoaderOverlay load={frm.formState.isSubmitting}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
				</LoaderOverlay>
			</Box>
		</FormProvider>
	);
};

const onSubmit =
	(params: {
		orgId: string | null;
		frm: UseFormReturn<OrderFormData, any, undefined>;
		onSuccess?: (ref: DocumentReference<DocumentData>, form: UseFormReturn<OrderFormData>) => void;
		onError?: (error: any, form: UseFormReturn<OrderFormData>) => void;
	}) =>
	async (data: OrderFormData) => {
		const { orgId, frm, onSuccess, onError } = params;
		if (!orgId) return;
		const b = writeBatch(getFirestore());
		try {
			const params = { orgId, data, frm, batch: b };
			await verifyOrderIds(params);
			const updatedData = await handleCustomer(params);
			const ref = await handleOrder({ ...params, data: updatedData });
			await b.commit();
			// frm.reset(defaultValues);
			onSuccess?.(ref, frm);
		} catch (error) {
			console.error('Error adding document:', error);
			onError?.(error, frm);
		}
	};

const handleCustomer = async (params: {
	orgId: string;
	data: OrderFormData;
	frm: UseFormReturn<OrderFormData, any, undefined>;
	batch: WriteBatch;
}) => {
	const { orgId, data, frm, batch } = params;
	const c = customersCollection(orgId);
	const temp = { ...data.customerId }; // Ensure we're working with a copy of customerId
	const isNewCustomer = temp.id === null && temp.name.length > 0;

	if (temp.id) {
		const d = doc(c, temp.id);
		const snap = await getDoc(d);
		if (!snap.exists()) {
			frm.setError('customerId', {
				type: 'not-found',
				message: 'Customer not found',
			});
			throw new Error('Customer not found');
		}
	} else if (isNewCustomer) {
		const customer = new Customer();
		customer.name = temp.name;
		customer.address = data.shipToAddress;
		const d = doc(c);
		batch.set(d, customer);
		// Create a new object with updated customerId.id
		return {
			...data,
			customerId: {
				...data.customerId,
				id: d.id,
			},
		};
	}
	// If no changes, return the original data object
	return data;
};

const handleOrder = async (params: {
	orgId: string;
	data: OrderFormData;
	frm: UseFormReturn<OrderFormData, any, undefined>;
	batch: WriteBatch;
}) => {
	const { orgId, data, batch } = params;
	const o = ordersCollection(orgId);
	const order = new Order();
	order.ids = data.ids;

	order.status = data.status;
	order.customerId = data.customerId.id || '';
	order.orderItems = data.orderItems;
	order.dueDate = data.dueDate.toDate().toISOString();
	order.shipToAddress = data.shipToAddress;
	const d = doc(o);
	batch.set(d, order);
	return d;
};
const verifyOrderIds = async (params: {
	orgId: string;
	data: OrderFormData;
	frm: UseFormReturn<OrderFormData, any, undefined>;
	batch: WriteBatch;
}) => {
	// Verify that the order ids are unique
	const { orgId, data, frm } = params;
	const o = ordersCollection(orgId);
	await Promise.all(
		data.ids.map(async (id, index) => {
			const q = query(o, where('ids', 'array-contains', { name: id.name, value: id.value }));
			const snap = await getDocs(q);
			if (!snap.empty) {
				frm.setError(`ids.${index}.value`, {
					type: 'duplicate',
					message: `${id.name} already exists`,
				});
				throw new Error('Order ID already exists');
			}
		}),
	);
};
