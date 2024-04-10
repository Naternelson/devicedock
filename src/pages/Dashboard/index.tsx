import { Category, Home, StickyNote2 } from '@mui/icons-material';
import {
	Box,
	Button,
	ButtonBase,
	ClickAwayListener,
	Collapse,
	Divider,
	IconButton,
	MenuItem,
	MenuList,
	Stack,
	Typography,
} from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const DashboardLayout = () => {
	const nav = useNavigate();
	useEffect(()=>{
		onAuthStateChanged(getAuth(), (user) => {
			if (!user) {
				nav("/login");
			}
		});
	},[])
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			flex={1}
			sx={{ boxSizing: 'border-box', padding: { xs: 'none', sm: '1rem' } }}>
			<SideNav />
			<Box flex={1} display={"flex"} height={"100%"} sx={{overflow: "auto"}}>
				<Outlet />
			</Box>
		</Box>
	);
};

const SideNav = () => {
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);


	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const onMouseEnter = () => setOpen(true);
		const onMouseLeave = () => setOpen(false);
		el.addEventListener('mouseenter', onMouseEnter);
		el.addEventListener('mouseleave', onMouseLeave);
		el.addEventListener('focusin', onMouseEnter);
		el.addEventListener('focusout', onMouseLeave);
		return () => {
			el?.removeEventListener('mouseenter', onMouseEnter);
			el?.removeEventListener('mouseleave', onMouseLeave);
		};
	}, [ref]);
	const targetSegment = location.pathname.split('/')[2];
	const atDashboard = location.pathname === '/dashboard';
	return (
		<ClickAwayListener onClickAway={() => setOpen(false)}>
			<Collapse
				ref={ref}
				in={open}
				collapsedSize={'40px'}
				orientation="horizontal"
				sx={{ borderRadius: {xs: "none", sm: "5px"},zIndex: 1000, boxShadow: (theme) => theme.shadows[5] }}>
				<Stack
					sx={{
						borderRadius: {xs: "none", sm: "5px"},
						height: '100%',
						minWidth: '40px',
						backgroundColor: (theme) => theme.palette.primary.main,
						color: (theme) => theme.palette.primary.contrastText,
					}}>
					<MenuList disablePadding sx={{ padding: 0, margin: 0 }}>
						<NavItem to={'/dashboard'} label={'Home'} selected={atDashboard}>
							<Home />
						</NavItem>

						<NavItem to={'/dashboard/orders'} label={'Orders'} selected={targetSegment === "orders"}>
							<StickyNote2 />
						</NavItem>

						<NavItem to={'/dashboard/products'} label={'Products'} selected={targetSegment === "products"}>
							<Category />
						</NavItem>
					</MenuList>
				</Stack>
			</Collapse>
		</ClickAwayListener>
	);
};

const NavItem = ({
	children,
	to,
	selected,
	label,
}: PropsWithChildren<{ to: string; label: string; selected: boolean }>) => {
	const nav = useNavigate();
	const onClick = () => nav(to);
	return (
		<MenuItem
			onClick={onClick}
			sx={{
				opacity: selected ? '100%' : '75%',
				padding: 0,
				margin: 0,
				color: 'white',
				backgroundColor: selected ? (theme) => theme.palette.primary.dark : 'transparent',
				borderBottom: '1px solid rgba(255,255,255,.6)',
				'&:hover': {
					opacity: '100%',
				},
			}}
			selected={selected}>
			<Stack justifyContent={'center'} alignItems={'center'} width="40px" height={'40px'}>
				{children}
			</Stack>
			<Stack justifyContent={'center'} alignItems={'center'} padding={'1rem'}>
				<Typography variant={'subtitle1'}>{label}</Typography>
			</Stack>
		</MenuItem>
	);
};
export * from './DashboardHome';
