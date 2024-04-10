import { Checkbox, IconButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrgId } from '../../util';
import { doc, onSnapshot } from 'firebase/firestore';
import { Product, productsCollection } from '../../types/Product';
import { Delete, Edit } from '@mui/icons-material';
import { FixedSizeList as List } from 'react-window';

const ProductRow = (props: {
	style: React.CSSProperties;
	productId: string;
	selected: boolean;
	onClick: (id: string) => void;
	onSelect: (id: string) => void;
}) => {
	const { productId, selected, onClick, onSelect } = props;
	const [product, setProduct] = useState<Product | null>(null);
	const orgId = useOrgId();
	useEffect(() => {
		if (!orgId) return;
		const unsub = onSnapshot(doc(productsCollection(orgId), productId), (snap) => {
			setProduct(snap.data() as Product);
		});
		return unsub;
	}, [productId, orgId]);

	return (
		<Stack
			direction={'row'}
			style={props.style}
			className={selected ? 'selected' : ''}
			onClick={() => onClick(productId)}>
			<Stack minHeight={'40px'} minWidth={'100px'} justifyContent="center" alignItems={'center'}>
				<Checkbox checked={selected} onClick={() => onSelect(productId)} />
			</Stack>
			<Stack direction="row" alignItems="center">
				{product?.name}
			</Stack>
			<Stack direction="row" alignItems="center">
				{product?.description}
			</Stack>
			<Stack direction="row" alignItems="center">
				{product?.unitIdentifierSchema.map((u) => u.name).join(', ')}
			</Stack>
			<Stack direction="row" alignItems="center">
				<IconButton onClick={() => console.log('Edit', productId)}>
					<Edit />
				</IconButton>
				<IconButton onClick={() => console.log('Delete', productId)}>
					<Delete />
				</IconButton>
			</Stack>
		</Stack>
	);
};

const columns = [
	{ field: 'name', headerName: 'Name', width: 100 },
	{ field: 'description', headerName: 'Description', width: 100 },
	{ field: 'unitIds', headerName: 'Unit IDs', width: 100 },
	{ field: 'actions', headerName: 'Actions', width: 100 },
];

const HeaderRow = (props: {
	handleGlobalSelect: () => void;
	globalSelectState: 'true' | 'false' | 'indeterminate';
}) => {
	return (
		<Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
			<Stack minHeight={'40px'} minWidth={'100px'} justifyContent="center" alignItems={'center'}>
				<Checkbox
					disableRipple
					indeterminate={props.globalSelectState === 'indeterminate'}
					checked={props.globalSelectState === 'true'}
				/>
			</Stack>
			{columns.map((c) => (
				<Stack key={c.field} direction="row" alignItems="center" width={c.width} sx={{ fontWeight: 600 }}>
					{c.headerName}
				</Stack>
			))}
		</Stack>
	);
};

export const ProductsTable = ({
	handleProductTarget,
	productIds,
}: {
	handleProductTarget: (id: string) => void;
	productIds: string[];
}) => {
	const [selected, setSelected] = useState<Map<string, boolean>>(new Map<string, boolean>());
	const handleSelect = (id: string) => {
		setSelected((prev) => {
			const next = new Map(prev);
			next.set(id, !prev.get(id));
			return next;
		});
	};
	const globalCheckboxState: 'true' | 'false' | 'indeterminate' =
		selected.size === 0 ? 'false' : selected.size === productIds.length ? 'true' : 'indeterminate';
	const handleSelectAll = () => {
		if (globalCheckboxState === 'true') {
			setSelected(new Map<string, boolean>());
		} else {
			const next = new Map<string, boolean>();
			productIds.forEach((id) => next.set(id, true));
			setSelected(next);
		}
	};
	const isSelected = (id: string) => selected.get(id) || false;
	return (
		<Stack direction="column">
			<HeaderRow handleGlobalSelect={handleSelectAll} globalSelectState={globalCheckboxState} />
			<List height={400} itemCount={productIds.length} itemSize={40} width={'100%'}>
				{(listProps) => (
					<ProductRow
						style={listProps.style}
						productId={productIds[listProps.index]}
						onClick={handleProductTarget}
						onSelect={handleSelect}
						selected={isSelected(productIds[listProps.index])}
					/>
				)}
			</List>
		</Stack>
	);
};
