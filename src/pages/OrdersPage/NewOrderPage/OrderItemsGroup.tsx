import {
	FieldsGroup,
	FormGroup,
	OrderFormData,
	OrderItemNotesField,
	OrderItemProductId,
	OrderItemQuantityField,
	TitleGroup,
} from '../../../components';
import { Box, Button, ButtonBase, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { Delete, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
export const OrderItemsGroup = () => {
    const nav = useNavigate();
	const { fields, append, remove } = useFieldArray<OrderFormData, 'orderItems'>({
		name: 'orderItems',
	});
	const appendOrderItem = () => {
		append({
			productId: '',
			quantity: 1,
			notes: '',
		});
	};
	const removeOrderItem = (index: number) => () => {
		remove(index);
	};
    const toNewProduct = () => {
        nav('/dashboard/products/new');
    }
	return (
		<FormGroup>
			<TitleGroup>
				<Typography variant={'h5'}>Order Items</Typography>
				<Divider flexItem />
				<Typography variant={'caption'}>
					Select the product and quantity. You can can attach multiple products in a single order
				</Typography>
				<ButtonBase onClick={toNewProduct} color="secondary" disableRipple>
					<Typography variant="overline" color={"secondary"}>Create New Product</Typography>
				</ButtonBase>
			</TitleGroup>
			<Divider flexItem orientation="vertical" />
			<FieldsGroup className="delaygroup" divider={<Divider flexItem />} gap={'2rem'} direction="column">
				{fields.map((field, index) => (
					<Stack key={field.id} direction={'row'} gap={'1rem'}>
						<Stack flex={1} direction={'column'} gap={'1rem'} className={'delaygroup'}>
							<Typography variant={'h6'}>
								Order Item:{' '}
								<em>
									{index + 1} of {fields.length}
								</em>
							</Typography>
							<Box paddingLeft={'2rem'}>
								<Stack direction={'row'} gap={'1rem'} className='fadeup'>
									<Box width={'100%'}>
										<OrderItemProductId TextFieldProps={{ className: 'fadeup' }} index={index} />
									</Box>
									<Box>
										<OrderItemQuantityField
											TextFieldProps={{ className: 'fadeup' }}
											index={index}
										/>
									</Box>
								</Stack>
								<ItemNotes index={index} field={field} />
							</Box>
						</Stack>
						<IconButton disabled={fields.length < 2} disableRipple onClick={removeOrderItem(index)}>
							<Delete />
						</IconButton>
					</Stack>
				))}
				<Button variant={'outlined'} onClick={appendOrderItem}>
					Add Line Item
				</Button>
			</FieldsGroup>
		</FormGroup>
	);
};

const ItemNotes = ({ index, field }: { index: number; field: FieldArrayWithId<OrderFormData, 'orderItems', 'id'> }) => {
	const [openNotes, setOpenNotes] = useState(false);
	return (
		<Stack direction="column" gap={'1rem'}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					'::before': {
						content: '""',
						position: 'absolute',
						borderBottom: '1px solid #000',
						width: '100%',
						flex: 1,
						display: 'block',
						opacity: 0.3,
						top: '50%',
					},
				}}>
				<Button
					endIcon={openNotes ? <ExpandLess /> : <ExpandMore />}
					onClick={() => setOpenNotes((p) => !p)}
					variant={'text'}
					color={'info'}
					sx={{
						backgroundColor: 'white',
						':hover': {
							backgroundColor: 'white',
						},
					}}>
					Item Notes
				</Button>
			</Box>

			<Collapse in={openNotes || field.notes.length > 0}>
				<OrderItemNotesField
					index={index}
					TextFieldProps={{ className: 'fadeup', sx: { marginTop: '0.25rem' } }}
				/>
			</Collapse>
		</Stack>
	);
};
