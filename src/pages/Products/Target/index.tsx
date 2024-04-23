import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Product } from '../../../types/Product';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TargetProductProps {
	product: Product | null;
	productId: string | null;
}

export const TargetProduct: React.FC<TargetProductProps> = ({ product, productId }) => {
	if (!product || !productId) return <NoProductSelected />;
	return (
		<Paper sx={{display: "flex", padding: "2rem", flexDirection: "column", flexGrow: 1, alignItems: "center"}}>
			<Stack gap={'.5rem'} direction="column"  alignItems={'center'} className="delaygroup">
				<Typography className="fadeup" variant={'h5'}>
					{product.name}
				</Typography>
				<Typography className="fadeup" variant={'subtitle1'} fontStyle="italic">
					{product.description}
				</Typography>
				<Stack
					direction={'row'}
					gap={'1rem'}
					alignItems={'center'}
					divider={<Divider flexItem orientation="vertical" />}>
					{product.attributes.map((attr) => (
						<Stack
							key={attr.name}
							className={'fadeup'}
							direction="row"
							gap={'5px'}
							sx={{
								borderRadius: '25px',
								padding: '.1rem .5rem',
								backgroundColor: (theme) => theme.palette.grey[300],
							}}>
							<Typography variant={'subtitle2'} fontWeight={400} fontStyle={'italic'}>
								{attr.name}:
							</Typography>
							<Typography variant={'subtitle2'}>{attr.value}</Typography>
						</Stack>
					))}
				</Stack>
				<Divider flexItem />

				<ActionGroup productId={productId} />
			</Stack>
		</Paper>
	);
};

const NoProductSelected = () => {
	return (
		<Box id={'no-product-selected'} flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
			<Typography variant={'h6'} sx={{ color: (theme) => theme.palette.grey[500] }} textAlign={'center'}>
				No Product Selected
			</Typography>
		</Box>
	);
};


const ActionGroup = ({productId}: {productId: string}) => {
    const nav = useNavigate();

    const handleEdit = () => {
        nav("edit");
    };
    const handleNewOrder = () => {
        nav(`/dashboard/orders/new?product=${productId}`);
    }
    const handleDelete = () => {
        nav('delete');
    }
    return (
        <Stack direction={'row'} gap={'1rem'} sx={{ color: (theme) => theme.palette.grey[500] }}>
            <Button size="small" variant={'text'} color={'inherit'} startIcon={<Delete fontSize={'small'} />} onClick={handleDelete}>
                Delete
            </Button>

            <Button size="small" variant={'text'} onClick={handleEdit}>Edit</Button>
            <Button size="small" variant={'contained'} onClick={handleNewOrder}>Start Order</Button>
        </Stack>
    );
}