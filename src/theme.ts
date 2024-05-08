import { createTheme } from '@mui/material';

export default createTheme({
	palette: {
		// Define the color palette
		primary: {
			main: '#1A7174', // A nice shade of blue
			// light: '#63a4ff',
			// dark: '#004ba0',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#3A3042', // A complementary color for secondary actions

			contrastText: '#F9F8F4',
		},
		// Add additional colors as needed
		error: {
			main: '#AE1409',
		},
		warning: {
			main: '#ff9800',
		},
		info: {
			main: '#440381',
			contrastText: '#ffffff',
		},
		success: {
			main: '#38803A',
			contrastText: '#ffffff',
		},
		text: {
			primary: '#333333', // Softer than black for main text
			secondary: '#575757', // A lighter shade for secondary text
			disabled: '#A0A0A0', // Disabled text (can adjust as needed)
		},
		background: {
			default: '#f5f5f5', // Slightly off-white background,
			paper: '#ffffff', // White paper background
		},
	},
	typography: {
		// Use the Inter font family
		fontFamily: [
			'Inter',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		fontSize: 14, // Smaller base font size
		h1: {
			fontSize: '2.25rem',
		},
		h2: {
			fontSize: '2rem',
		},
		h3: {
			fontSize: '1.75rem',
		},
		// Continue defining other typography variants as needed
	},
	spacing: 4, // Adjust the base spacing unit (4px by default, adjust if needed)
	components: {
		// Customize specific component styles and default props
		MuiButton: {
			styleOverrides: {
				root: {
					// Reduce padding for buttons
					padding: '6px 12px',
				},
			},
		},
		MuiButtonBase: {
			styleOverrides: {
				root: {
					padding: '6px 12px',
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: 'filled',
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					minHeight: '40px',
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					minWidth: '75px',
					minHeight: '30px',
				},
			},
		},
		// Add more component customizations here
	},
});
