import { FormProvider, UseFormReturn, useForm, useFormContext } from 'react-hook-form';
import { Product, ProductType, productsCollection } from '../../types/Product';
import { PropsWithChildren } from 'react';
import { LoaderOverlay } from '../LoaderOverlay';
import { useOrgId } from '../../util';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import { MachineSettings, machineSettingsCollection } from '../../types/MachineSettings';
import { Box, BoxProps, Button } from '@mui/material';

export type ProductFormData = {
	machine: string;
	customers: string[];
	name: ProductType['name'];
	description: ProductType['description'];
	ids: ProductType['ids'];
	attributes: ProductType['attributes'];
	unitIdentifierSchema: (Omit<ProductType['unitIdentifierSchema'][number], 'labelTemplates'> & {
		labelTemplates: { autoPrint: boolean; defaultPrinter: string; template: string }[];
	})[];
	caseIdentifierSchema: Omit<ProductType['caseIdentifierSchema'], 'labelTemplates'> & {
		labelTemplates: { autoPrint: boolean; defaultPrinter: string; template: string }[];
	};
};

export const NewProductForm = ({ defaultValues,BoxProps, children }: PropsWithChildren<{ defaultValues?: ProductFormData, BoxProps?: BoxProps }>) => {
	const orgId = useOrgId();
	const frm = useForm<ProductFormData>({
		defaultValues: {
			machine: 'all',
			customers: [],
			name: '',
			description: '',
			attributes: [{ name: '', value: '' }],
			unitIdentifierSchema: [
				{
					name: '',
					count: 1,
					pattern: '',
					unique: true,
					transform: 'NONE',
					scope: 'organization',
					labelTemplates: [],
				},
			],
			caseIdentifierSchema: {
				name: 'Case ID',
				maxSize: 24,
				pattern: 'YYYYMMDD-###',
				unique: true,
				autoGen: true,
				scope: 'order',
				labelTemplates: [],
			},
			...defaultValues,
		},
	});

	return (
		<FormProvider {...frm}>
			<Box component="form" onSubmit={frm.handleSubmit(onSubmit(orgId, frm))} {...BoxProps}>
				<LoaderOverlay load={frm.formState.isSubmitting}>{children}</LoaderOverlay>
			</Box>
		</FormProvider>
	);
};

const onSubmit = (orgId: string | null, frm: UseFormReturn<ProductFormData>) => async (data: ProductFormData) => {
	if (!orgId) return;
	try {
		const batch = writeBatch(getFirestore());
		const product = new Product();
		product.attributes = data.attributes;
		product.customers = data.customers;
		product.description = data.description;
		product.name = data.name;
		product.caseIdentifierSchema = {
			...data.caseIdentifierSchema,
			labelTemplates: data.caseIdentifierSchema.labelTemplates.map((t) => t.template),
		};
		product.unitIdentifierSchema = data.unitIdentifierSchema.map((s) => ({
			...s,
			labelTemplates: s.labelTemplates.map((t) => t.template),
		}));

		const productRef = doc(productsCollection(orgId));

		const machineSettings = new MachineSettings();
		machineSettings.machine = data.machine;
		machineSettings.productId = productRef.id;
		data.unitIdentifierSchema.forEach((s) => {
			s.labelTemplates.forEach((t) => {
				machineSettings.unitSchemaPrinter.push({
					silent: t.autoPrint,
					name: s.name,
					printer: t.defaultPrinter,
					template: t.template,
				});
			});
		});
		data.caseIdentifierSchema.labelTemplates.forEach((t) => {
			machineSettings.caseSchemaPrinter.push({
				silent: t.autoPrint,
				printer: t.defaultPrinter,
				template: t.template,
			});
		});

		batch.set(productRef, product);
		batch.set(doc(machineSettingsCollection(orgId), machineSettings.productId), machineSettings);
		await batch.commit();
	} catch (error) {
		console.error(error);
	}
};

export const SubmitButton = ()=> {
	const {formState: {errors, isSubmitting}, } = useFormContext<ProductFormData>();
	const disabled = Object.keys(errors).length > 0 || isSubmitting;
	
	return <Button variant={"contained"} type={"submit"} disabled={disabled} >
		Create Product
	</Button>
}