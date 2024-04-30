import { ButtonBase, ButtonBaseProps, Menu, MenuItem, Stack, Typography, alpha, useTheme } from '@mui/material';
import { Order, OrderStatus, ordersCollection } from '../../types/Order';
import { useState } from 'react';
import { Circle } from '@mui/icons-material';
import { statusColor, useOrgId } from '../../util';
import { doc, updateDoc } from 'firebase/firestore';

export const OrderStatusIndicator = (props: { order: Order; withMenu?: boolean; ButtonProps?: ButtonBaseProps }) => {
	const { order, withMenu } = props;
	const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);
	const theme = useTheme();
	const color = statusColor(theme, order.status);
	const orgId = useOrgId();
	return (
		<>
			<ButtonBase
				disabled={!withMenu}
				onClick={(e) => {
					e.stopPropagation();

					setAnchorRef(e.currentTarget);
				}}
				{...props.ButtonProps}>
				<Stack color={color} direction="row" alignItems="center" gap={'.5rem'}>
					<Circle fontSize="small" color={'inherit'} />
					<Typography variant="body2" color="inherit" textTransform={'capitalize'}>
						{order.status}
					</Typography>
				</Stack>
			</ButtonBase>
			<Menu
				sx={{ color: (t) => t.palette.grey[800] }}
				open={!!anchorRef}
				onClose={() => setAnchorRef(null)}
				anchorEl={anchorRef}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
				{Object.entries(OrderStatus).map(([key, value]) => {
					return (
						<MenuItem
							key={key}
							value={value}
							sx={{
								textTransform: 'capitalize',
								'&:hover': {
									color: statusColor(theme, value as OrderStatus),
									backgroundColor: alpha(statusColor(theme, value as OrderStatus), 0.15),
								},
							}}
							onClick={async (e) => {
								e.stopPropagation();
								setAnchorRef(null);

								updateOrderStatus(orgId, order.id, value as OrderStatus)
									?.then(() => {
										console.log('Successfully updated order status');
									})
									.catch((error) => {
										console.error('Error updating order status: ', error);
										alert('Error updating order status');
									});
							}}>
							{value}
						</MenuItem>
					);
				})}
			</Menu>
		</>
	);
};

const updateOrderStatus = (orgId: string | null, orderId: string | undefined, status: OrderStatus) => {
	if (!orgId || !orderId) return;
	const d = doc(ordersCollection(orgId), orderId);
	return updateDoc(d, { status });
};
