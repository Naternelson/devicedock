import { Box, BoxProps, CircularProgress, styled } from '@mui/material';

export const LoaderOverlay = ({ load, children, className, ...rest }: { load: boolean } & BoxProps) => {
	const boxProps: BoxProps = { className: load ? [className, 'disabled-overlay'].join(' ') : className, ...rest };

	return (
		<StyledContainer {...boxProps}>
			{load && (
				<div className="loader">
					<CircularProgress color="inherit" />
				</div>
			)}
			{children}
		</StyledContainer>
	);
};

const StyledContainer = styled(Box)(({ theme }) => ({
	position: 'relative',
	'& .loader': {
        color: "white",
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backdropFilter: 'blur(1px)',
		zIndex: 1000,
	},
}));
