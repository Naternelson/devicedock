import { useEffect, useRef, useState } from 'react';
import { UnitValue, unitValuesCollection } from '../../../../../types/UnitValue';
import { TabContainer } from '../utils';
import { Case, casesCollection } from '../../../../../types/Case';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Stack, Typography } from '@mui/material';
import { Product, productsCollection } from '../../../../../types/Product';
import { NewUnitValueForm } from './NewUnitValueForm';
import { UnitValueForm } from './UnitValueForm';
import { CaseIdForm } from './CaseIdForm';
import { useSearchParams } from 'react-router-dom';
import { useOrgId } from '../../../../../util';
import { doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
export const CasesTab = () => {
	const [cases, setCases] = useState<Case[]>([]);
	const [searchParams] = useSearchParams()
	const orderId = searchParams.get('orderId');
	const orgId = useOrgId();
	useEffect(() => {
		if (!orgId || !orderId) return;
		const q = query(casesCollection(orgId), where('orderId', '==', orderId), orderBy('createdAt', 'desc'));
		return onSnapshot(q, (snap) => {
			if(snap.empty) setCases([]);
			else setCases(snap.docs.map((d) => d.data() as Case));
		});
	},[orgId, orderId])

	return (
		<TabContainer tab="Cases">
			<Box flex={1} className="delaygroup" paddingX=".5rem" sx={{ backgroundColor: (t) => t.palette.background.default }}>
				{cases.map((c, i) => (
					<CaseAccordian orgId={orgId} key={i} caseDetails={{ ...c, caseId: `${c.caseId}${i}` }} />
				))}
			</Box>
		</TabContainer>
	);
};

// const sampleCase = () => {
// 	const sCase = new Case();
// 	sCase.id = faker.string.uuid();
// 	sCase.caseId = faker.helpers.mustache('202401{{day}}-{{count}}', {
// 		day: () => faker.number.int({ min: 1, max: 30 }).toString().padStart(2, '0'),
// 		count: faker.number.int({ min: 1, max: 100 }).toString().padStart(2, '0'),
// 	});
// 	sCase.createdAt = faker.date.recent().toISOString();
// 	sCase.orderId = faker.string.uuid();
// 	sCase.productId = faker.string.uuid();
// 	sCase.shipmentId = faker.string.uuid();
// 	sCase.status = faker.helpers.arrayElement(['full', 'partial', 'empty']);
// 	sCase.updatedAt = faker.date.recent().toISOString();

// 	return sCase;
// };

// const sampleProduct = new Product();
// sampleProduct.id = '123';
// sampleProduct.name = 'Product Name';
// sampleProduct.unitIdentifierSchema = [
// 	// REGEX with 6 number charactters
// 	{
// 		count: 1,
// 		pattern: '^d{6}$',
// 		name: 'Device ID',
// 		scope: 'order',
// 		unique: true,
// 		transform: 'NONE',
// 		labelTemplates: [],
// 		defaultValue: '',
// 	},
// 	{
// 		count: 1,
// 		pattern: '^[A-Z0-9]{9}$',
// 		name: 'UDI',
// 		scope: 'order',
// 		unique: true,
// 		transform: 'UPPERCASE',
// 		labelTemplates: [],
// 		defaultValue: '',
// 	},
// ];

// const sampleUnitValue = (sCase: Case, product: Product) => {
// 	const unitValue = new UnitValue();
// 	unitValue.id = faker.string.uuid();
// 	unitValue.caseId = sCase.id || '123';
// 	unitValue.productId = product.id || '123';
// 	unitValue.orderId = faker.string.uuid();
// 	unitValue.ids = product.unitIdentifierSchema.reduce((acc, schema) => {
// 		acc[schema.name] = faker.string.alphanumeric({ length: 6, casing: 'upper' });
// 		return acc;
// 	}, {} as Record<string, string>);
// 	unitValue.count = 1;
// 	return unitValue;
// };

const CaseAccordian = (props: { caseDetails: Case, orgId: string | null }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const [units, setUnits] = useState<UnitValue[]>([]);
	const { caseDetails, orgId } = props;
	const {id:caseId, productId} = caseDetails;
	const [expanded, setExpanded] = useState(false);

	useEffect(()=>{
		if(!orgId) return;
		const q = query(unitValuesCollection(orgId), where('caseId', '==', caseId));
		return onSnapshot(q, (snap) => {
			if(snap.empty) setUnits([]);
			else setUnits(snap.docs.map((d) => d.data() as UnitValue));
		});
	},[orgId, caseId])

	useEffect(()=>{
		if(!orgId || !productId) return;
		const q = doc(productsCollection(orgId), productId);
		return onSnapshot(q, (snap) => {
			if(snap.exists()) setProduct(snap.data() as Product);
			else setProduct(null);
		});
	},[orgId, productId])

	return (
		<Accordion
			ref={ref}
			slotProps={{
				transition: {
					unmountOnExit: true,
				},
			}}
			className="fadeup"
			expanded={expanded}
			onChange={() => {
				setExpanded((p) => {
					if (p === false) ref.current?.scrollIntoView({ behavior: 'smooth' });
					return !p;
				});
			}}>
			<CaseSummary caseDetails={caseDetails} />
			{product && <CaseDetails caseDetails={caseDetails} product={product} units={units} />}
		</Accordion>
	);
};
const CaseSummary = ({ caseDetails }: { caseDetails: Case }) => {
	return (
		<AccordionSummary>
			<Stack direction={'row'} gap={'2rem'} width={'100%'} paddingX={'2rem'} alignItems={'center'}>
				<Typography variant="subtitle1" fontWeight={500} sx={{ width: '100px' }}>
					{caseDetails.caseId}
				</Typography>
				<Typography
					textAlign={'center'}
					variant="subtitle2"
					textTransform={'capitalize'}
					sx={{
						width: '100px',
						color: (t) =>
							caseDetails.status === 'full'
								? t.palette.success.main
								: caseDetails.status === 'partial'
								? t.palette.primary.main
								: t.palette.grey[500],
					}}>
					{caseDetails.status}
				</Typography>
				<Typography variant="subtitle2" sx={{ width: '100px' }}>
					{new Date(caseDetails.createdAt || new Date()).toLocaleDateString()}
				</Typography>
			</Stack>
		</AccordionSummary>
	);
};

const CaseDetails = (props: { caseDetails: Case; product: Product; units: UnitValue[] }) => {
	const { caseDetails, product, units } = props;

	return (
		<AccordionDetails>
			<Divider />
			<Stack direction={'column'} paddingX={'1rem'}>
				<Stack direction={'row'} gap={'.5rem'} paddingY={'1rem'} alignItems="center">
					<CaseIdForm caseDetails={caseDetails} />
				</Stack>
				<Stack
					paddingX={'1rem'}
					direction={'row'}
					gap={'0.5rem'}
					sx={{ backgroundColor: (t) => t.palette.grey[600], color: 'white' }}>
					{product.unitIdentifierSchema.map((schema, i) => {
						return (
							<Typography sx={{ flex: 1 }} key={i} variant={'overline'}>
								{schema.name}
							</Typography>
						);
					})}
					<Box flex={'.5'}>
						<Typography variant={'overline'}>Inputed on</Typography>
					</Box>
					<Box flex={'.5'} display="flex" justifyContent={'flex-end'}>
						<Typography variant={'overline'}>Actions</Typography>
					</Box>
				</Stack>
				<Stack direction={'column'} divider={<Divider flexItem />} paddingX={'1rem'}>
					{units.map((unitValue, i) => {
						return <UnitValueForm key={i} unitValue={unitValue} product={product} />;
					})}
					<NewUnitValueForm product={product} caseDetails={caseDetails} />
				</Stack>
			</Stack>
		</AccordionDetails>
	);
};
