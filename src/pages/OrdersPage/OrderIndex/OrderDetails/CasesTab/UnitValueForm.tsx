import {  SubmitHandler, useForm } from 'react-hook-form';
import { Product } from '../../../../../types/Product';
import { UnitValue,  unitValuesCollection } from '../../../../../types/UnitValue';
import { useOrgId } from '../../../../../util';
import { deleteDoc, doc,  updateDoc } from 'firebase/firestore';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, Stack, Typography } from '@mui/material';
import { Delete, Print } from '@mui/icons-material';
import React, { useState } from 'react';
export const UnitValueForm = React.memo((props: { unitValue: UnitValue; product: Product }) => {
	const frm = useForm<{ ids: typeof props.unitValue.ids }>({
		defaultValues: {
			ids: props.unitValue.ids,
		},
	});
	const orgId = useOrgId();

	const submitHandler: SubmitHandler<{ ids: typeof props.unitValue.ids }> = async (data) => {
		if (!orgId) return;
		const allMatch = Object.entries(data.ids).every(([key, value]) => {
			return props.unitValue.ids[key] === value;
		});
		if (allMatch) return;
		const d = doc(unitValuesCollection(orgId), props.unitValue.id);
		await updateDoc(d, { ids: data.ids });
	};
	const reset = () => frm.reset({ ids: props.unitValue.ids });

	return (
		<Box>
			<Stack
				gap={'1rem'}
				component="form"
				direction="row"
				onSubmit={frm.handleSubmit(submitHandler)}
				onReset={reset}>
				{props.product.unitIdentifierSchema.map((schema, i) => {
					return (
						<Input
							value={props.unitValue.ids[schema.name]}
							sx={{
								flex: 1,
								fontSize: (t) => t.typography.body2.fontSize,
								'&::before': {
									borderBottom: '2px solid rgba(0,0,0,0)',
								},
							}}
							key={i}
							{...frm.register(`ids.${schema.name}`)}
						/>
					);
				})}
				<Input
					sx={{ fontSize: (t) => t.typography.body2.fontSize, flex: 0.5 }}
					disableUnderline
					disabled
					value={new Date(props.unitValue.createdAt || new Date()).toLocaleDateString()}
				/>
				<Stack direction={'row'} flex={0.5} justifyContent={'flex-end'}>
					<DeleteButton unitValue={props.unitValue} orgId={orgId || ''} />
					<PrintButton />
				</Stack>
			</Stack>
		</Box>
	);
});


const PrintButton = () => {
	return (
		<IconButton color="primary">
			<Print fontSize="small" />
		</IconButton>
	);
};

const DeleteButton = ({ unitValue, orgId }: { unitValue: UnitValue; orgId: string }) => {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	return (
		<>
			<IconButton
				onClick={() => {
					setOpen((p) => !p);
				}}>
				<Delete fontSize="small" />
			</IconButton>
			<Dialog open={open} onClose={close}>
				<DialogTitle>Delete Unit {Object.values(unitValue.ids).join(' ')}?</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this unit?</Typography>
				</DialogContent>
				<Divider />
				<DialogActions>
					<Stack direction="row" gap={'1rem'} justifyContent="flex-end">
						<Button
							size="small"
							color="error"
							variant="contained"
							onClick={async () => {
								await deleteDoc(doc(unitValuesCollection(orgId), unitValue.id));
								close();
							}}>
							Delete
						</Button>
						<Button size="small" variant="outlined" onClick={close}>
							Cancel
						</Button>
					</Stack>
				</DialogActions>
			</Dialog>
		</>
	);
};
