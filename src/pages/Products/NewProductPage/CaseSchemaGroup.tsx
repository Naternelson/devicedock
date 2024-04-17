import { Stack, Typography, Divider, styled, Box } from '@mui/material';
import {
	CaseAutoGenField,
	CaseIdentifierSchemaMaxSizeField,
	CaseIdentifierSchemaNameField,
	CaseIdentifierSchemaPatternField,
	CaseSchemaScopeField,
	CaseSchemaUniqueField,
} from '../../../components/NewProductForm';
import { FieldsGroup, FormGroup, TitleGroup } from './Group';
import { useEffect, useState } from 'react';

const fieldMessages = [
	{
		name: 'caseIdentifierSchema.name',
		message: "Case ID Alias refers to the name of the case identifier.",
	},
	{
		name: 'caseIdentifierSchema.pattern',
		message: `Case ID Pattern refers to the pattern of the case identifier. You can use '#' for numbers, and date characters for Year, Month and Date. For more information, click the Information Icon.`,
	},

	{
		name: 'caseIdentifierSchema.autogen',
		message: 'Case AutoGen refers to whether the case ID will be automatically generated according to the pattern.',
	},
	{
		name: 'caseSchema.unique',
		message: 'Case Unique refers to whether the case ID should be unique.',
	},
	{
		name: 'caseSchema.scope',
		message:
			`Case Scope refers to the scope of the Case ID, and whether it should be unique only to a the order it's assigned or to the organization at large`,
	},
	{
		name: 'caseIdentifierSchema.maxSize',
		message: 'Case Max Size refers to the maximum size of a case (in product units) before starting to a new case',
	},
];

export const CaseSchemaGroup = () => {
	const [focusField, setFocusField] = useState<string | null>(null);

	return (
		<div>
			<FormGroup>
				<TitleGroup>
					<Typography variant={'h6'}>Product Case Schema</Typography>
					<Divider flexItem />
					<Typography variant={'caption'}>
						Attach Case Validators to your product. Case Validators are used to validate the case
						identifiers of your product. You can test to see if a case identifier matches the schema, like
						the length of the ID, uniqueness, etc.
					</Typography>
					<FieldMessage message={fieldMessages.find((b) => b.name === focusField)?.message || null} />
				</TitleGroup>

				<Divider flexItem orientation="vertical" />
				<FieldsGroup>
					<div onFocus={() => setFocusField('caseIdentifierSchema.name')}>
						<CaseIdentifierSchemaNameField TextFieldProps={{ className: 'fadeup' }} />
					</div>
					<div onFocus={() => setFocusField('caseIdentifierSchema.pattern')}>
						<CaseIdentifierSchemaPatternField TextFieldProps={{ className: 'fadeup' }} />
					</div>
					<div onFocus={() => setFocusField('caseIdentifierSchema.autogen')}>
						<Stack direction={'row'} gap={'1rem'} alignItems="center">
							<CaseAutoGenField FormGroupProps={{ sx: { flex: 1 } }} />
							<Divider orientation={'vertical'} flexItem />
							<Typography variant="caption" sx={{ flex: 3 }} color={(theme) => theme.palette.grey[900]}>
								If true, the case ID will be automatically generated according to the pattern, otherwise
								the user must provide the ID.
							</Typography>
						</Stack>
					</div>

					<Stack direction={'row'} gap={'1rem'} alignItems={'center'}>
						<Box flex={1} onFocus={() => setFocusField('caseSchema.unique')}>
							<CaseSchemaUniqueField FormGroupProps={{ sx: { flex: 1 } }} />
						</Box>
						<Divider orientation={'vertical'} flexItem />
						<Box onClick={() => setFocusField('caseSchema.scope')} flex={3}>
							<CaseSchemaScopeField />
						</Box>
					</Stack>
					<div onFocus={() => setFocusField('caseIdentifierSchema.maxSize')}>
						<CaseIdentifierSchemaMaxSizeField TextFieldProps={{ className: 'fadeup' }} />
					</div>
				</FieldsGroup>
			</FormGroup>
		</div>
	);
};

const FieldMessage = ({ message }: { message: string | null }) => {
	const [transitionState, setTransitionState] = useState<'opening' | 'open' | 'closing' | 'closed'>('closed');
	const [displayMessage, setDisplay] = useState<string | null>(null);
	useEffect(() => {
		if (message && displayMessage !== message) {
			setTransitionState('opening');
			setTimeout(() => {
				setDisplay(message);
				setTransitionState('open');
			}, 300);
		} else if (!message && displayMessage) {
			setTransitionState('closing');
			setTimeout(() => {
				setDisplay(null);
				setTransitionState('closed');
			}, 300);
		}
	}, [message, displayMessage]);

	return (
		<StyledT
			color={'secondary.dark'}
			className={`transition-${transitionState}`}
			variant="subtitle1"
			sx={{ marginTop: '1rem' }}>
			{displayMessage || ' '}
		</StyledT>
	);
};

const StyledT = styled(Typography)({
	transition: 'all 200ms ease-out',
	'&.transition-opening': {
		opacity: 0,
		transform: 'translateY(10px)',
	},
	'&.transition-open': {
		opacity: 1,
		transform: 'translateY(0)',
	},
	'&.transition-closing': {
		opacity: 0,
		transform: 'translateY(10px)',
	},
	'&.transition-closed': {
		opacity: 0,
		transform: 'translateY(10px)',
	},
});
