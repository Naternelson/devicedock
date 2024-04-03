import { createTheme } from '@mui/material';

export default createTheme({
	palette: {
		// Define the color palette
		primary: {
			main: '#29ADB2', // A nice shade of blue
			// light: '#63a4ff',
			// dark: '#004ba0',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#ffc400', // A complementary color for secondary actions
			light: '#fff64f',
			dark: '#c79400',
			contrastText: '#000000',
		},
		// Add additional colors as needed
		error: {
			main: '#f44336',
		},
		warning: {
			main: '#ff9800',
		},
		info: {
			main: '#2196f3',
		},
		success: {
			main: '#4caf50',
		},
		text: {
			primary: '#333333', // Softer than black for main text
			secondary: '#575757', // A lighter shade for secondary text
			disabled: '#A0A0A0', // Disabled text (can adjust as needed)
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
		// Add more component customizations here
	},
});
