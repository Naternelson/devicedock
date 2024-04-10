import { Box, Breadcrumbs, Button, Collapse, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useOrgId } from '../../util';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { productsCollection } from '../../types/Product';
import { ProductsTable } from './ProductsTable';
import { Link as NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

export const ProductsPage = () => {
	return (
		<Box display="flex" flex={1} flexDirection={'column'}>
			<ProductsBreadcrumbs />
			<Box display="flex" flex={1}>
				<Outlet />
			</Box>
		</Box>
	);
};

const ProductsBreadcrumbs = () => {
	const location = useLocation();
	const parts = location.pathname.split('/').slice(1);
	// Remove any search params
	if (parts.length === 1) return null;
	return (
		<Breadcrumbs>
			{parts.map((part, i, arr) => {
				if (i === arr.length - 1) return <Typography key={i} fontWeight={600}>{titleCase(part)}</Typography>;
				else
					return (
						<BreadcrumbLink key={i} to={'/' + parts.slice(0, i + 1).join('/')}>{titleCase(part)}</BreadcrumbLink>
					);
			})}
		</Breadcrumbs>
	);
};

const BreadcrumbLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
	return (
		<Link component={NavLink} to={to}>
			{children}
		</Link>
	);
};

const titleCase = (str: string) => {
	return str.replace(/\b\w/g, (l) => l.toUpperCase());
};

const NoProductsOverlay = () => {
	const nav = useNavigate();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const onMouseEnter = () => setOpen(true);
		const onMouseLeave = () => setOpen(false);
		el.addEventListener('mouseenter', onMouseEnter);
		el.addEventListener('mouseleave', onMouseLeave);
		return () => {
			el?.removeEventListener('mouseenter', onMouseEnter);
			el?.removeEventListener('mouseleave', onMouseLeave);
		};
	}, [ref]);
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
				outline: '1px solid red',
			}}>
			<Stack direction="column" alignItems="center" gap={3}>
				<Stack direction={'column'} alignItems={'center'} width="100%">
					<Typography variant="h6" className={'fadeup'} sx={{ animationDelay: '.2s' }}>
						No Products Found
					</Typography>
					<Divider flexItem />
				</Stack>

				<Button
					onClick={() => nav('new')}
					ref={ref}
					variant="outlined"
					className="fadedown"
					sx={{ animationDelay: '.3s' }}>
					Create New Product
				</Button>
				<Box minHeight="22px">
					<Collapse in={open}>
						<Typography variant="caption">- This is when the fun begins -</Typography>
					</Collapse>
				</Box>
			</Stack>
		</Box>
	);
};

export const ProductsIndexPage = () => {
	const orgId = useOrgId();
	const [productIds, setProductIds] = useState<string[]>([]);
	const [targetProductId, setTargetProductId] = useState<string | null>(null);
	useEffect(() => {
		if (!orgId) return;
		const q = query(productsCollection(orgId), orderBy('name'));
		return onSnapshot(q, (snap) => {
			setProductIds(snap.docs.map((d) => d.id));
		});
	}, [orgId]);
	const handleProductTarget = (id: string) => {
		setTargetProductId(id);
	};
	if (productIds.length === 0) return <NoProductsOverlay />;
	return (
		<Box>
			<ProductsTable handleProductTarget={handleProductTarget} productIds={productIds} />
		</Box>
	);
};

export * from './NewProductPage';
