import { useFieldArray } from 'react-hook-form';
import {
	ProductFormData,
	UnitSchemaCountField,
	UnitSchemaNameField,
	UnitSchemaPatternField,
	UnitSchemaScopeField,
	UnitSchemaTransformField,
	UnitSchemaUniqueField,
} from '../../../components/NewProductForm';
import { FieldsGroup, FormGroup, TitleGroup } from './Group';
import { Box, Button, Divider, Stack, Typography, styled } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const fieldMessages = [
	{
		name: 'name',
		message: `What's the name of this schema, e.g. Serial Number, Batch Number, Device ID etc.`,
	},
	{
		name: 'count',
		message:
			'You can group individuals under one ID Schema, this can be useful for batch IDs. Typically this is 1.',
	},
	{
		name: 'pattern',
		message: `Describe the pattern you'd like to see checked for this ID. It could be the length of the text, patterns within etc. For more information, click the Information Icon.`,
	},

	{
		name: 'unique',
		message: 'Refers to whether this this ID should be checked for uniqueness',
	},
	{
		name: 'scope',
		message:
			'If uniquue, this field indicates whether the ID should be unique to the order or to the organization at large',
	},
	{
		name: 'transform',
		message: `Before checking the ID, you can transform it. You can convert it to uppercase, lowercase, or make no changes.`,
	},
];

export const UnitIdSchemaGroup = () => {
	const [focusField, setFocusField] = useState<string | null>(null);
	const {
		fields: unitIdSchemas,
		append,
		remove,
	} = useFieldArray<ProductFormData, 'unitIdentifierSchema'>({ name: 'unitIdentifierSchema' });
	const appendUnitSchema = () => {
		append({
			name: '',
			count: 1,
			pattern: '',
			patternMessage: '',
			transform: 'NONE',
			unique: true,
			defaultValue: '',
			scope: 'order',
			labelTemplates: [],
		});
	};
	const removeUnitSchema = (index: number) => () => {
		remove(index);
	};
	return (
		<FormGroup>
			<TitleGroup>
				<Typography variant={'h6'}>Product Unit Schema</Typography>
				<Typography variant={'caption'}>
					Attach Unit Validators to your product. Unit Validators are used to validate the unit identifiers of
					your product. You can test to see if a unit identifier matches the schema, like the length of the
					ID, uniqueness, etc.
				</Typography>
				<FieldMessage message={fieldMessages.find((b) => b.name === focusField)?.message || null} />
			</TitleGroup>
			<Divider flexItem orientation="vertical" />
			<FieldsGroup>
				{unitIdSchemas.map((field, index) => (
					<Stack key={field.id} direction="column" gap={'1rem'} className={'delaygroup'}>
						<Typography variant={'subtitle1'}>Unit ID Schema: {index + 1}</Typography>
						<Stack direction={'row'} gap={'1rem'}>
							<Box width={'100%'} onFocus={() => setFocusField('name')}>
								<UnitSchemaNameField TextFieldProps={{ className: 'fadeup' }} index={index} />
							</Box>
							<Box onFocus={() => setFocusField('count')}>
								<UnitSchemaCountField TextFieldProps={{ className: 'fadeup' }} index={index} />
							</Box>
						</Stack>
						<Box onFocus={() => setFocusField('patternMessage')}>
							<UnitSchemaPatternField index={index} TextFieldProps={{ className: 'fadeup' }} />
						</Box>
						<Stack direction={'row'} gap={'1rem'}>
							<Box onFocus={() => setFocusField('unique')} flex={1}>
								<UnitSchemaUniqueField index={index} />
							</Box>
							<Divider orientation={'vertical'} flexItem />
							<Box
								onFocus={() => {
									setFocusField('scope');
								}}
								flex={3}>
								<UnitSchemaScopeField index={index} TextFieldProps={{ className: 'fadeup' }} />
							</Box>
						</Stack>
						<UnitSchemaTransformField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<Button
							variant="text"
							endIcon={<Delete />}
							color={'info'}
							disableRipple
							onClick={removeUnitSchema(index)}>
							Delete Schema
						</Button>

						<Divider />
					</Stack>
				))}
				<Divider />

				<Button endIcon={<Add />} fullWidth variant={'outlined'} onClick={appendUnitSchema}>
					Add Unit Schema
				</Button>
			</FieldsGroup>
		</FormGroup>
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
