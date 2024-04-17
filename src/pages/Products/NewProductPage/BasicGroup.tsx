import { Divider, Stack, Typography } from '@mui/material';
import { FieldsGroup, FormGroup, TitleGroup } from './Group';
import { NameField } from '../../../components/NewProductForm/NameField';
import { DescriptionField } from '../../../components/NewProductForm';

export const BasicsGroup = () => {
	return (
		<FormGroup>
			<TitleGroup>
				<Typography variant={'h6'}>Product Basics</Typography>
				<Typography variant={'caption'} textAlign={'center'}>
					Add the name and description of the product
				</Typography>
			</TitleGroup>
			<Divider flexItem orientation="vertical" />
			<FieldsGroup>
				<NameField className="fadeup" />
				<DescriptionField className={'fadeup'} />
			</FieldsGroup>
		</FormGroup>
	);
};
