import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Case, casesCollection } from '../../../../../types/Case';
import { useOrgId } from '../../../../../util';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { FormLabel, IconButton, Input, InputAdornment, Stack, Tooltip } from '@mui/material';
import { Print, Undo } from '@mui/icons-material';

export const CaseIdForm = (props: { caseDetails: Case }) => {
	const frm = useForm<{ caseId: string }>({
		defaultValues: { caseId: props.caseDetails.caseId },
	});
	const orgId = useOrgId();
	const submitHandler: SubmitHandler<{ caseId: string }> = async (data) => {
		if (props.caseDetails.caseId === data.caseId || !orgId) return;
		const d = doc(casesCollection(orgId), props.caseDetails.id);
		await updateDoc(d, { caseId: data.caseId });
	};
	const resetForm = () => {
		frm.reset({ caseId: props.caseDetails.caseId });
	};
	const [focused, setFocused] = useState(false);
	const focus = () => {
		setFocused(true);
	};
	const blur = () => {
		setFocused(false);
		frm.handleSubmit(submitHandler)();
	};
	return (
		<FormProvider {...frm}>
			<Stack
				paddingX={'1rem'}
				flex={1}
				direction={'row'}
				component={'form'}
				onSubmit={frm.handleSubmit(submitHandler)}
				onReset={resetForm}
				justifyContent={'space-between'}>
				<Stack onClick={focus} onBlur={blur} direction="row" alignItems={'center'} gap={'1rem'}>
					<FormLabel sx={{ fontStyle: 'italic' }} htmlFor={`caseId-${props.caseDetails.caseId}`}>
						Case ID
					</FormLabel>
					<Input
						id={`caseId-${props.caseDetails.caseId}`}
						sx={{ fontWeight: 500 }}
						endAdornment={
							<InputAdornment position="end" sx={{ visibility: focused ? 'visible' : 'hidden' }}>
								<IconButton size={'small'} type={'reset'}>
									<Undo fontSize="small" />
								</IconButton>
							</InputAdornment>
						}
						{...frm.register('caseId')}
					/>
				</Stack>
				<ButtonGroup />
			</Stack>
		</FormProvider>
	);
};

const ButtonGroup = () => {
	return (
		<Stack direction={'row'} gap={'1rem'}>
			<Tooltip title={'Print Case Label'}>
				<IconButton size={'small'}>
					<Print fontSize="small" />
				</IconButton>
			</Tooltip>
		</Stack>
	);
};
