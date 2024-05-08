import { useSearchParams } from 'react-router-dom';
import { Order, ordersCollection } from '../../../types/Order';
import { Product, productsCollection } from '../../../types/Product';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useOrgId } from '../../../util';
import { doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Box, Button, Collapse, IconButton, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { ArrowLeft, Print } from '@mui/icons-material';
import { Case, casesCollection } from '../../../types/Case';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { unitValuesCollection } from '../../../types/UnitValue';
import { CaseList } from './CaseList';
import { useCase } from '../../../api/useCase';

export const BuildPage = () => {
	const {
		targetOrder,
		orderProducts,
		orderCases,
		targetProduct,
		targetCase,
		setSearchParams,
		openCaseView,
		setOpenCaseView,
	} = useBuildHooks();
	return (
		<Stack direction={'column'} flex={1}>
			<TabHeader targetProduct={targetProduct?.id || ''} products={orderProducts} />
			<Stack direction={'row'} flex={1} gap={'1rem'} justifyContent={'center'} alignItems={'center'}>
				<Stack flex={3}>
					<InputForm order={targetOrder} product={targetProduct} />
				</Stack>
				<Stack height={'100%'} sx={{ borderLeft: '1px solid rgb(100,100,100)', position: 'relative' }}>
					<Box
						onClick={() => setOpenCaseView((p) => !p)}
						component="span"
						sx={{
							position: 'absolute',
							backgroundColor: 'rgb(100,100,100)',
							borderRadius: '20px',
							color: 'white',
							display: 'inline-flex',
							justifyContent: 'center',
							alignItems: 'center',
							left: 0,
							top: '50%',
							transform: 'translate(-50%, -50%)',
							cursor: 'pointer',
						}}>
						<ArrowLeft
							sx={{
								transform: `rotate(${openCaseView ? '180deg' : '0deg'})`,
								transition: 'transform 0.3s ease-out',
							}}
						/>
					</Box>
					<Box
						component={'span'}
						sx={{
							padding: '0 1.25rem',
							position: 'absolute',
							top: '10%',
							transform: 'translate(-100%, -00%)',
							backgroundColor: 'rgb(150,150,150)',
							color: 'white',
						}}>
						<Typography lineHeight={'1rem'} variant="overline">
							Case
						</Typography>
					</Box>
					<Collapse appear in={openCaseView} orientation="horizontal">
						<Stack direction={'column'} gap={'1rem'} minWidth={'100px'}>
							{/* {order && products[0]} */}
						</Stack>
					</Collapse>
				</Stack>
			</Stack>
		</Stack>
	);
};

const useBuildHooks = () => {
	const orgId = useOrgId();
	const [loading, setLoading] = useState<{ order: boolean; products: boolean; cases: boolean }>({
		order: false,
		products: false,
		cases: false,
	});
	const {createNextCase, destroyEmptyCases} = useCase()
	const [openCaseView, setOpenCaseView] = useState(true);
	const [targetOrder, setTargetOrder] = useState<Order | undefined>(undefined);
	const [orderProducts, setOrderProducts] = useState<Product[]>([]);
	const [orderCases, setOrderCases] = useState<Case[]>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const targetOrderId = searchParams.get('orderId');
	const targetProductId = searchParams.get('productId');
	const targetCaseId = searchParams.get('caseId');
	const productIds = useMemo(
		() => (orgId ? targetOrder?.orderItems.map((oi) => oi.productId) || [] : []),
		[orgId, targetOrder],
	);
	const targetProduct = useMemo(
		() => (orgId ? orderProducts.find((p) => p.id === targetProductId) : undefined),
		[orgId, targetProductId, orderProducts],
	);
	const targetCase = useMemo(
		() => (orgId ? orderCases.find((c) => c.id === targetCaseId) : undefined),
		[orgId, targetCaseId, orderCases],
	);


	useEffect(() => {
		// Retrieve Order
		if (!orgId) return;
		if (!targetOrderId) {
			setTargetOrder(undefined);
			return;
		}
		const fn = async (orgId: string, targetOrderId: string) => {
			setLoading((p) => ({ ...p, order: true }));
			const snap = await getDoc(doc(ordersCollection(orgId), targetOrderId));
			if (snap.exists()) {
				setTargetOrder(snap.data() as Order);
			} else {
				setTargetOrder(undefined);
			}
			setLoading((p) => ({ ...p, order: false }));
		};
		fn(orgId, targetOrderId);
	}, [orgId, targetOrderId]);

	useEffect(() => {
		// Retrieve Order Products
		if (!orgId) {
			setOrderProducts([]);
			return;
		}
		const productRefs = productIds.map((id) => doc(productsCollection(orgId), id));
		const unsubscribers = productRefs.map((ref) => {
			setLoading((p) => ({ ...p, products: true }));
			return onSnapshot(ref, (snap) => {
				setOrderProducts((p) => {
					const i = p.findIndex((p) => p.id === snap.id);
					const newProduct = snap.data() as Product;

					if (i === -1) return [...p, newProduct];
					else return p.map((p) => (p.id === snap.id ? newProduct : p));
				});
				setLoading((p) => ({ ...p, products: false }));
			});
		});
		return () => unsubscribers.forEach((fn) => fn());
	}, [orgId, productIds]);

	useEffect(() => {
		// Retrieve Order Cases
		if (!orgId || !targetProductId || !targetOrderId) {
			setOrderCases([]);
			return;
		}
		const q = query(
			casesCollection(orgId),
			where('orderId', '==', targetOrderId),
			where('productId', '==', targetProductId),
		);
		setLoading((p) => ({ ...p, cases: true }));
		return onSnapshot(q, (snap) => {
			setOrderCases(snap.docs.map((d) => d.data() as Case));
			setLoading((p) => ({ ...p, cases: false }));
		});
	}, [orgId, targetOrderId, targetProductId]);

	useEffect(() => {
		// If the target product is not set, set it to the first product in the order
		if (!targetProductId && orderProducts.length > 0) {
			setSearchParams((p) => {
				p.set('productId', orderProducts[0].id || '');
				return p;
			});
		}
	}, [targetProductId, orderProducts, setSearchParams]);

	useEffect(() => {
		// If the target case is not set, set it to the first case in the order
		if (!targetCaseId && orderCases.length > 0) {
			setSearchParams((p) => {
				p.set('caseId', orderCases[0].id || '');
				return p;
			});
		}
	}, [targetCaseId, orderCases, setSearchParams]);

	useEffect(() =>{
		// If there are no cases, create the first case
		if(orderCases.length > 0 || !orgId || !targetProduct || !targetOrder) return 
		if(!loading.cases) return 
		createNextCase({order:targetOrder, product: targetProduct, orgId})

		
	},[orderCases, orgId, targetProduct, targetOrder, loading.cases, createNextCase])
	return {
		targetOrderId,
		targetProductId,
		targetCaseId,
		targetOrder,
		orderProducts,
		orderCases,
		targetProduct,
		targetCase,
		setSearchParams,
		openCaseView,
		setOpenCaseView,
		loaders: loading,
		loading: Object.values(loading).some((l) => l),
	};
};

// export const Build = () => {
// 	const [open, setOpen] = useState(true);
// 	const [searchParams, setSearchParams] = useSearchParams();
// 	const [order, setOrder] = useState<Order | null>(null);
// 	const [products, setProducts] = useState<Product[]>([]);
// 	const orderId = searchParams.get('orderId');
// 	const targetProduct = searchParams.get('productId');
// 	const orgId = useOrgId();

// 	useEffect(() => {
// 		if (!orderId || !orgId) return;
// 		const fn = async (orgId: string, orderId: string) => {
// 			const snap = await getDoc(doc(ordersCollection(orgId), orderId));
// 			if (snap.exists()) {
// 				setOrder(snap.data() as Order);
// 			} else {
// 				setOrder(null);
// 			}
// 		};
// 		fn(orgId, orderId);
// 	}, [orderId, orgId]);

// 	useEffect(() => {
// 		if (!order || !orgId) return;
// 		const fn = async (orgId: string, order: Order) => {
// 			const productRefs = order.orderItems.map((oi) => doc(productsCollection(orgId), oi.productId));
// 			const products = await Promise.all(
// 				productRefs.map(async (ref) => {
// 					const snap = await getDoc(ref);
// 					return snap.data() as Product;
// 				}),
// 			);
// 			setProducts(products);
// 		};
// 		fn(orgId, order);
// 	}, [order, orgId]);

// 	useEffect(() => {
// 		if (targetProduct || !order) return;
// 		const firstProductId = order.orderItems[0].productId;
// 		if (firstProductId)
// 			setSearchParams((p) => {
// 				p.set('productId', firstProductId);
// 				return p;
// 			});
// 	}, [setSearchParams, targetProduct, products, order]);

// 	if (!order)
// 		return (
// 			<Stack flex="1" justifyContent={'center'} alignItems={'center'} className="fadeup">
// 				Order Not Found
// 			</Stack>
// 		);

// 	return (
// 		<BuildContext.Provider value={{ order, products }}>
// 			<Stack direction={'column'} flex={1}>
// 				<TabHeader targetProduct={targetProduct || ''} products={products} />
// 				<Stack direction={'row'} flex={1} gap={'1rem'} justifyContent={'center'} alignItems={'center'}>
// 					<Stack flex={3}>
// 						<InputForm order={order} product={products.find((p) => p.id === targetProduct)!} />
// 					</Stack>
// 					<Stack height={'100%'} sx={{ borderLeft: '1px solid rgb(100,100,100)', position: 'relative' }}>
// 						<Box
// 							onClick={() => setOpen((p) => !p)}
// 							component="span"
// 							sx={{
// 								position: 'absolute',
// 								backgroundColor: 'rgb(100,100,100)',
// 								borderRadius: '20px',
// 								color: 'white',
// 								display: 'inline-flex',
// 								justifyContent: 'center',
// 								alignItems: 'center',
// 								left: 0,
// 								top: '50%',
// 								transform: 'translate(-50%, -50%)',
// 								cursor: 'pointer',
// 							}}>
// 							<ArrowLeft
// 								sx={{
// 									transform: `rotate(${open ? '180deg' : '0deg'})`,
// 									transition: 'transform 0.3s ease-out',
// 								}}
// 							/>
// 						</Box>
// 						<Box
// 							component={'span'}
// 							sx={{
// 								padding: '0 1.25rem',
// 								position: 'absolute',
// 								top: '10%',
// 								transform: 'translate(-100%, -00%)',
// 								backgroundColor: 'rgb(150,150,150)',
// 								color: 'white',
// 							}}>
// 							<Typography lineHeight={'1rem'} variant="overline">
// 								Case
// 							</Typography>
// 						</Box>
// 						<Collapse appear in={open} orientation="horizontal">
// 							<Stack direction={'column'} gap={'1rem'} minWidth={'100px'}>
// 								{order && products[0]}
// 							</Stack>
// 						</Collapse>
// 					</Stack>
// 				</Stack>
// 			</Stack>
// 		</BuildContext.Provider>
// 	);
// };

interface InputFormData {
	inputs: Record<string, string>[];
	orderId: string;
	caseId: string;
	productId: string;
}
interface InputFormProps {
	order?: Order;
	product?: Product;
	caseDetails?: Case;
}

const InputForm = (props: InputFormProps) => {
	const { order, product, caseDetails } = props;
	const frm = useForm<InputFormData>({
		mode: 'onChange',
		defaultValues: {
			inputs: product?.unitIdentifierSchema.map((schema) => ({ [schema.name]: '' })) || [],
			orderId: order?.id || '',
			caseId: caseDetails?.id || '',
			productId: product?.id || '',
		},
	});
	const onSubmit = frm.handleSubmit((data) => {
		console.log(data);
	});
	if (!order) return null;
	return (
		<FormProvider {...frm}>
			<Stack onSubmit={onSubmit} component={'form'} direction={'column'} gap={'1rem'}>
				{product?.unitIdentifierSchema.map((schema, i) => {
					return (
						<Stack direction="row" alignItems={'center'} gap={'1rem'}>
							<SchemaInput key={schema.name} index={i} schema={schema} order={order} />
							<IconButton size="small" tabIndex={-1}>
								<Print />
							</IconButton>
						</Stack>
					);
				})}
				<Box>
					<Button type="submit">Save</Button>
				</Box>
			</Stack>
		</FormProvider>
	);
};

const SchemaInput = (props: { order: Order; schema: Product['unitIdentifierSchema'][number]; index: number }) => {
	const { schema, order } = props;
	const {
		trigger,
		register,
		formState: { errors },
	} = useFormContext<InputFormData>();
	const errorMessage = errors.inputs?.[props.index]?.[schema.name]?.message?.toString();
	const orgId = useOrgId();
	const field = register(`inputs.${props.index}.${props.schema.name}`, {
		onChange: (e) => {
			const v = e.target.value;
			e.target.value =
				schema.transform === 'LOWERCASE'
					? v.toLowerCase()
					: schema.transform === 'UPPERCASE'
					? v.toUpperCase()
					: v;
		},
		required: schema.unique || `${schema.name} is required`,
		pattern: {
			value: new RegExp(schema.pattern || '.*'),
			message: schema.patternMessage || `${schema.name} is invalid`,
		},
		setValueAs: (v) =>
			schema.transform === 'LOWERCASE' ? v.toLowerCase() : schema.transform === 'UPPERCASE' ? v.toUpperCase() : v,
		validate: {
			unique: async (v) => {
				if (schema.unique && orgId) {
					const scope = schema.scope === 'order' ? [where('orderId', '==', order.id)] : [];
					const q = query(
						unitValuesCollection(orgId),
						...scope,
						where('productId', '==', order.id),
						where(`ids.${schema.name}`, '==', v),
					);
					const snap = await getDocs(q);
					if (snap.size > 0) {
						return 'Value must be unique';
					}
					return true;
				}
				return true;
			},
		},
	});
	return (
		<TextField sx={{ flex: 1 }} label={schema.name} {...field} error={!!errorMessage} helperText={errorMessage} />
	);
};

const TabHeader = (props: { targetProduct: string; products: Product[] }) => {
	const [, setSearchParams] = useSearchParams();
	return (
		<Tabs
			sx={{ padding: 0, minHeight: '20px' }}
			value={props.targetProduct}
			onChange={(_e, value) => {
				setSearchParams((p) => {
					p.set('productId', value);
					return p;
				});
			}}>
			{props.products.map((product, i) => (
				<Tab key={i} sx={{ padding: 0 }} label={product.name} value={product.id} />
			))}
		</Tabs>
	);
};

const BuildContext = createContext<{ order: Order; products: Product[] } | null>(null);
export const useBuildContext = () => {
	return useContext(BuildContext) || { order: null, products: [] };
};
