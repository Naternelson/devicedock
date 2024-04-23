import { Collapse, Divider, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Product } from '../../../types/Product';

interface ProductsTableProps {
	handleProductTarget: (target: string) => void;
	targetProduct: string;
	products: { id: string; product: Product }[];
	height?: number;
	width?: number;
}

const RowHeight = 50;

export const ProductsTable: React.FC<ProductsTableProps> = ({
	handleProductTarget,
	targetProduct,
	products,
	height = 500,
	width = 500,
}) => {
	return (
		<MenuList disablePadding>
			<List className="delaygroup" height={height} itemCount={products.length} itemSize={RowHeight} width={width}>
				{({ index, style }) => (
					<div style={style}>
						<Row
							selected={targetProduct === products[index].id}
							onClick={() => handleProductTarget(products[index].id)}
							product={products[index].product}
						/>
					</div>
				)}
			</List>
		</MenuList>
	);
};

const Row = React.memo(
	({ product, onClick, selected }: { onClick: () => void; product: Product; selected?: boolean }) => {
		const [appear, setAppear] = useState(false);
		return (
			<MenuItem
				onMouseEnter={() => setAppear(true)}
				onMouseLeave={() => setAppear(false)}
				selected={selected}
				onClick={onClick}
				disableGutters
				divider
				sx={{
					gap: '1rem',
					height: RowHeight,
					display: 'flex',
					padding: '0 1rem',
					margin: 0,
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<Typography variant={'subtitle1'}>{product?.name}</Typography>
				<Attributes product={product} appear={selected || appear} />
			</MenuItem>
		);
	},
);

const Attributes = ({ product, appear }: { product: Product; appear: boolean }) => {
	return (
		<Stack direction={'row'} gap={'1rem'} flex={1}>
			{product.attributes.map((attr) => (
				<Collapse appear={true} in={appear} key={attr.name} collapsedSize={10.5}>
					<Stack
						direction={'column'}
						key={attr.name}
						alignItems={'center'}
						justifyContent={'center'}
						gap={'5px'}>
						<Typography
							variant={'overline'}
							sx={{ lineHeight: '1', fontWeight: 700, color: (theme) => theme.palette.grey[600] }}>
							{attr.value}
						</Typography>
						<Divider flexItem />
						<Typography variant={'caption'} sx={{ lineHeight: 1 }}>
							{attr.name}
						</Typography>
					</Stack>
				</Collapse>
			))}
		</Stack>
	);
};
