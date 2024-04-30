import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Case } from "../../../../../types/Case";
import { Product } from "../../../../../types/Product";
import { UnitValue, UnitValueType, unitValuesCollection } from "../../../../../types/UnitValue";
import { useOrgId } from "../../../../../util";
import { doc, setDoc } from "firebase/firestore";
import { IconButton, Input, Stack } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";

export const NewUnitValueForm = (props: { product: Product; caseDetails: Case }) => {
	const frm = useForm<UnitValueType>({
		defaultValues: {
			caseId: props.caseDetails.id,
			productId: props.product.id,
			orderId: props.caseDetails.orderId,
			ids: props.product.unitIdentifierSchema.reduce((acc, schema) => {
				acc[schema.name] = '';
				return acc;
			}, {} as Record<string, string>),
			count: 1,
			createdAt: new Date().toLocaleDateString(),
		},
	});
	const orgId = useOrgId();
	const submitHandler: SubmitHandler<UnitValueType> = async (data) => {
		if (!orgId) return;
		const unitValue = new UnitValue();
		unitValue.count = data.count;
		unitValue.ids = data.ids;
		unitValue.productId = data.productId;
		unitValue.orderId = data.orderId;
		unitValue.caseId = data.caseId;
		await setDoc(doc(unitValuesCollection(orgId)), unitValue);
	};
	const reset = () => frm.reset();
	return (
		<FormProvider {...frm}>
			<Stack
				gap={'1rem'}
				component="form"
				direction="row"
				onSubmit={frm.handleSubmit(submitHandler)}
				onReset={reset}>
				{props.product.unitIdentifierSchema.map((schema, i) => {
					return (
						<Input
							{...frm.register(`ids.${schema.name}`, {
								required: schema.unique ? 'This field is required' : false,
								pattern: {
									value: new RegExp(schema.pattern),
									message: `${schema.name} did not match the product pattern`,
								},
							})}
							defaultValue={schema.defaultValue}
							placeholder={`Enter ${schema.name}`}
							sx={{
								flex: 1,
								fontSize: (t) => t.typography.body2.fontSize,
							}}
							key={i}
							{...frm.register(`ids.${schema.name}`)}
						/>
					);
				})}
				<Input
					sx={{ fontSize: (t) => t.typography.body2.fontSize, flex: 0.5 }}
					{...frm.register('createdAt', {})}
				/>
				<Stack direction={'row'} gap={'0.5rem'} flex={0.5} justifyContent={'flex-end'}>
					<IconButton size={'small'} type={'reset'}>
						<Clear fontSize="small" />
					</IconButton>
					<IconButton size={'small'} type={'submit'} color="success">
						<Check fontSize="small" />
					</IconButton>
				</Stack>
			</Stack>
		</FormProvider>
	);
};
