import { Box, Breadcrumbs, Button, Collapse, Divider, Link, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useOrgId } from '../../util';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { Product, productsCollection } from '../../types/Product';
import { ProductsTable } from './Table/ProductsTable';
import { Link as NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TargetProduct } from './Target';

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
				if (i === arr.length - 1)
					return (
						<Typography key={i} fontWeight={600}>
							{titleCase(part)}
						</Typography>
					);
				else
					return (
						<BreadcrumbLink key={i} to={'/' + parts.slice(0, i + 1).join('/')}>
							{titleCase(part)}
						</BreadcrumbLink>
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
	const {id: targetProductId=null} = useParams();


	const nav = useNavigate();
	const ref = useRef<HTMLDivElement>(null);
	const orgId = useOrgId();
	const [products, setProducts] = useState<{id: string, product: Product}[]>([]);
	useEffect(() => {
		if (!orgId) return;
		const q = query(productsCollection(orgId), orderBy('name'));
		return onSnapshot(q, (snap) => {
			const products: {id: string, product: Product}[] = [];
			for(let i =0; i < 1000; i++){
				snap.docs.forEach((doc) => (products.push({ id: doc.id, product: doc.data() as Product })));
			}
			setProducts(products);
		});
	}, [orgId]);
	const handleProductTarget = (id: string) => {
		nav("/dashboard/products/" + id);
	};


	const tableHeight = useResize(ref, products.length);
	if (products.length === 0) return <NoProductsOverlay />;
	return (
		<Stack ref={ref} direction="row" flex={1} gap={"2rem"} justifyContent={"space-between"}>
			<ProductsTable
				targetProduct={targetProductId  || ''}
				handleProductTarget={handleProductTarget}
				products={products}
				height={tableHeight}
				width={300}
			/>
			<TargetProduct productId={targetProductId} product={products.find(el => el.id === targetProductId)?.product || null}/>
		</Stack>
	);
};

const useResize = (ref: React.RefObject<HTMLElement>, length: number) => {
	const [height, setHeight] = useState(0);
	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		setHeight(el.offsetHeight);
		const onResize = () => {
			setHeight(el.offsetHeight);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [ref, length]);
	return height;
}

export * from './NewProductPage';
