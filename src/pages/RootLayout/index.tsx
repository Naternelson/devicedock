import { Box, ButtonBase, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import './index.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import "../../styles"

export const RootLayout = () => {
	return (
		<Box sx={{ height: '100vh', display: 'flex', overflow: "auto", flexDirection: "column", boxSizing: "border-box" }}>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
				}}>
				<NavBar />
				<Outlet />
			</Box>
			<FooterBar />
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
	padding: '0 1rem',
    boxShadow: theme.shadows[2],
	zIndex: 1000,
	ul: {
		listStyle: 'none',
		display: 'flex',
		flexDirection: 'row',
        gap: '1rem',
		padding: 0,
		margin: 0,
	},
}));

const FooterBar = () => {
    return (
        <StyledFooter>
            <p>&copy; 2021 My Company</p>
        </StyledFooter>
    );
}

const StyledFooter = styled('footer')(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    
    width: '100%',
    padding: '1rem',
    textAlign: 'center',
    boxSizing: 'border-box',
}));