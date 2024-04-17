import { useFieldArray } from 'react-hook-form';
import { AttributeNameField, AttributeValueField, ProductFormData } from '../../../components/NewProductForm';
import { useEffect } from 'react';
import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { FieldsGroup, FormGroup, TitleGroup } from './Group';

export const AttributesGroup = () => {
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
		<FormGroup>
			<TitleGroup>
				<Typography variant={'h6'}>Product Attributes</Typography>
				<Typography variant={'caption'}>
					Add attributes to describe your product. <br /> For example, color, size, weight, special
					identifiers, etc.
				</Typography>
			</TitleGroup>

			<Divider flexItem orientation="vertical" />
            
			<FieldsGroup>
				{attributeFields.map((field, index) => (
					<Stack key={field.id} direction="row" gap={'1rem'} className="delaygroup">
						<AttributeNameField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<AttributeValueField index={index} TextFieldProps={{ className: 'fadeup' }} />
						<IconButton onClick={removeAttribute(index)}>
							<Delete fontSize="small" />
						</IconButton>
					</Stack>
				))}
				<Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
					<Button endIcon={<Add />} sx={{ flexGrow: 2 }} variant={'outlined'} onClick={appendAttribute}>
						Add Attribute
					</Button>
				</Stack>
			</FieldsGroup>
		</FormGroup>
	);
};
