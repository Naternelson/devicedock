import {Button, Stack } from '@mui/material';
import {
	NewProductForm,
	SubmitButton,

} from '../../../components/NewProductForm';
import { useNavigate } from 'react-router-dom';
import { AttributesGroup } from './AttributesGroup';
import { BasicsGroup } from './BasicGroup';
import { CaseSchemaGroup } from './CaseSchemaGroup';
import { UnitIdSchemaGroup } from './UnitIdSchemaGroup';

export const NewProductPage = () => {
	const nav = useNavigate();
	return (
		<Stack
			flexDirection={'row'}
			width={'100%'}
			sx={{ boxSizing: 'border-box' }}>
			<NewProductForm BoxProps={{ flex: 1, marginY: "1rem" }}>
				<Stack gap={'1rem'} height={'100%'} sx={{perspective: "1000px"}}>
					<BasicsGroup />
					<AttributesGroup />
					<UnitIdSchemaGroup />
					<CaseSchemaGroup />
					<Stack direction={'row'} gap={2} justifyContent={'flex-end'}>
						<Button variant={'outlined'} onClick={() => nav(-1)}>
							Cancel
						</Button>
						<SubmitButton />
					</Stack>
				</Stack>
			</NewProductForm>
		</Stack>
	);
};
