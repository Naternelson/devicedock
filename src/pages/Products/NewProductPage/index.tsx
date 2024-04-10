import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import {
	AttributeNameField,
	AttributeValueField,
	CaseAutoGenField,
	CaseIdentifierSchemaMaxSizeField,
	CaseIdentifierSchemaNameField,
	CaseIdentifierSchemaPatternField,
	CaseSchemaScopeField,
	CaseSchemaUniqueField,
	DescriptionField,
	NewProductForm,
	ProductFormData,
	SubmitButton,
	UnitSchemaCountField,
	UnitSchemaNameField,
	UnitSchemaPatternField,
	UnitSchemaScopeField,
	UnitSchemaTransformField,
	UnitSchemaUniqueField,
} from '../../../components/NewProductForm';
import { NameField } from '../../../components/NewProductForm/NameField';
import { Add, Delete } from '@mui/icons-material';
import {useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const NewProductPage = () => {
	const nav = useNavigate();
	return (
		<Stack
			flexDirection={'row'}
			width={'100%'}
			sx={{ boxSizing: 'border-box' }}
			justifyContent={'center'}
			id={'hello'}>
			<Box flex={1}></Box>
			<NewProductForm>
				<Stack gap={'1rem'} maxWidth={'500px'} height={'100%'}>
					<BasicsGroup />
					<AttributesGroup />
					<UnitIdSchemaGroup />
					<CaseSchemaGroup />
					<Stack direction={'row'} gap={2} justifyContent={'flex-end'}>
						<Button variant={'outlined'} onClick={() => nav(-1)}>
							Cancel
						</Button>
						<SubmitButton/>
					</Stack>
				</Stack>
			</NewProductForm>
			<Box flex={1}></Box>
		</Stack>
	);
};

const BasicsGroup = () => {
	return (
		<Stack
			className="delaygroup"
			gap={2}
			padding={'3rem'}
			sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
			<Typography variant={'h6'}>Product Basics</Typography>
			<Typography variant={'caption'} textAlign={'center'}>
				Add the name and description of the product
			</Typography>
			<Divider />
			<NameField className="fadeup" />
			<DescriptionField className={'fadeup'} />
		</Stack>
	);
};

const AttributesGroup = () => {
	const {
		fields: attributeFields,
		append,
		remove,
	} = useFieldArray<ProductFormData, 'attributes'>({ name: 'attributes' });
	useEffect(() => {}, [attributeFields]);
	const appendAttribute = () => {
		append({ name: '', value: '' });
	};
	const removeAttribute = (index: number) => () => {
		remove(index);
	};

	return (
		<Stack gap={2} padding={'3rem'} sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
				<Typography variant={'h6'}>Product Attributes</Typography>
			</Stack>
			<Typography variant={'caption'} textAlign={'center'}>
				Add attributes to describe your product.
			</Typography>
			<Divider />
			<Stack direction="column" gap={2}>
				{attributeFields.map((field, index) => (
					<Stack key={field.id} direction="row" gap={1} className="delaygroup">
						<AttributeNameField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<AttributeValueField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<IconButton onClick={removeAttribute(index)}>
							<Delete fontSize="small" />
						</IconButton>
					</Stack>
				))}
				<Divider />
				<Button endIcon={<Add />} fullWidth variant={'outlined'} onClick={appendAttribute}>
					Add Attribute
				</Button>
			</Stack>
		</Stack>
	);
};

const CaseSchemaGroup = () => {
	return (
		<Stack gap={5} padding={'3rem'} sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
				<Typography variant={'h6'}>Product Case Schema</Typography>
			</Stack>
			<Typography variant={'caption'} textAlign={'center'}>
				Attach Case Validators to your product. Case Validators are used to validate the case identifiers of
				your product. You can test to see if a case identifier matches the schema, like the length of the ID,
				uniqueness, etc.
			</Typography>
			<Divider />
			<Stack direction="column" gap={5}>
				<CaseIdentifierSchemaNameField TextFieldProps={{ className: 'fadeup' }} />
				<CaseIdentifierSchemaPatternField TextFieldProps={{ className: 'fadeup' }} />
				<Stack direction={'row'} gap={3} alignItems="center" justifyContent={'space-between'}>
					<CaseAutoGenField />
					<Divider orientation={'vertical'} flexItem />
					<Typography variant="caption" color={(theme) =>theme.palette.grey[900]}>
						If true, the case ID will be automatically generated according to the pattern, otherwise the
						user must provide the ID.
					</Typography>
				</Stack>

				<Stack direction={'row'} gap={3} alignItems={'center'} justifyContent={'space-between'}>
					<CaseSchemaUniqueField />
					<Divider orientation={'vertical'} flexItem />
					<CaseSchemaScopeField />
				</Stack>
				<CaseIdentifierSchemaMaxSizeField TextFieldProps={{ className: 'fadeup' }} />
			</Stack>
		</Stack>
	);
};

const UnitIdSchemaGroup = () => {
	const {
		fields: unitIdSchemas,
		append,
		remove,
	} = useFieldArray<ProductFormData, 'unitIdentifierSchema'>({ name: 'unitIdentifierSchema' });
	const appendUnitSchema = () => {
		// name: string,
		// count: number,
		// pattern: string,
		// transform: 'UPPERCASE' | 'LOWERCASE' | 'NONE'
		// unique: boolean,
		// defaultValue: string,
		// scope: "order" | "organization",
		// labelTemplates: string[]
		append({
			name: '',
			count: 1,
			pattern: '',
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
		<Stack gap={2} padding={'3rem'} sx={{ border: (theme) => `1px solid ${theme.palette.grey[300]}` }}>
			<Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
				<Typography variant={'h6'}>Product Unit Schema</Typography>
			</Stack>
			<Typography variant={'caption'} textAlign={'center'}>
				Attach Unit Validators to your product. Unit Validators are used to validate the unit identifiers of
				your product. You can test to see if a unit identifier matches the schema, like the length of the ID,
				uniqueness, etc.
			</Typography>
			<Divider />
			<Stack direction="column" gap={2}>
				{unitIdSchemas.map((field, index) => (
					<Stack key={field.id} direction="column" gap={2} className={'delaygroup'}>
						<Typography variant={'subtitle1'}>Unit ID Schema: {index + 1}</Typography>
						<Stack direction={'row'} gap={1}>
							<UnitSchemaNameField TextFieldProps={{ className: 'fadeup' }} index={index} />
							<UnitSchemaCountField TextFieldProps={{ className: 'fadeup' }} index={index} />
						</Stack>
						<UnitSchemaPatternField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<Stack direction={'row'}>
							<UnitSchemaUniqueField index={index} />
							<UnitSchemaScopeField index={index} TextFieldProps={{ className: 'fadeup' }} />
						</Stack>
						<UnitSchemaTransformField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<IconButton disableRipple onClick={removeUnitSchema(index)}>
							<Delete fontSize="small" />
						</IconButton>

						<Divider />
					</Stack>
				))}
				<Divider />

				<Button endIcon={<Add />} fullWidth variant={'outlined'} onClick={appendUnitSchema}>
					Add Unit Schema
				</Button>
			</Stack>
		</Stack>
	);
};
