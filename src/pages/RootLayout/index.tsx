import { Box, ButtonBase, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import './index.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import "../../styles"
import { useDOMListeners } from '../../styles';

export const RootLayout = () => {
	const ref = useDOMListeners();
	return (
		<Box ref={ref} >
			<Box
				sx={{
					backgroundColor: 'background.default',
					height: '100vh',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					boxSizing: 'border-box',
					overflow: 'auto',
				}}>
				<NavBar />
				<FauxNav />
				<Outlet />
			</Box>
		</Box>
	);
};

const NavBar = () => {
    const [authState] = useAuthState(getAuth());
    const logout = () => {
        return signOut(getAuth());
    }
	return (
		<StyledNav>
			<ul>
				<li>Dashboard</li>
				<li>About</li>
				<li>Contact</li>
                {authState && <li><ButtonBase onClick={logout}>Logout</ButtonBase></li>}
			</ul>
            
		</StyledNav>
	);
};

const StyledNav = styled('nav')(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	width: '100%',
	height: '1.75rem',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '0 1rem',
    boxShadow: theme.shadows[2],
	zIndex: 1000,
	position: "absolute",
	ul: {
		listStyle: 'none',
		display: 'flex',
		flexDirection: 'row',
        gap: '1rem',
		padding: 0,
		margin: 0,
	},
}));
const FauxNav = styled("div")(() => {
	return {
		minHeight: "1.75rem",
		width: "100%",
	}
})
