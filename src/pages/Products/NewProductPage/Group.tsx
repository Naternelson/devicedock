import { PropsWithChildren, useState } from 'react';
import { Paper, Stack, StackProps, styled } from '@mui/material';

export const FormGroup = ({ children }: PropsWithChildren) => {
	const [elevation, setElevation] = useState(1);
	return (
		<Paper
			onMouseEnter={() => setElevation(3)}
			onMouseLeave={() => setElevation(1)}
			elevation={elevation}
			onFocus={() => setElevation(3)}
			onBlur={() => setElevation(1)}
			sx={{
                backfaceVisibility: 'hidden',
                willChange: 'transform',
				position: 'relative',
				transform: elevation > 1 ? 'translate3d(-1px, -1px,0)' : 'translate3d(0px, 0px, 0)',
				transition: 'all 0.3s ease-in-out',
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				padding: '3rem',
				gap: '2rem',
			}}>
			{children}
		</Paper>
	);
};

export const TitleGroup = (props: StackProps) => {
	return <StyledStack alignItems={{ xs: 'center', md: 'flex-start' }} {...props} />;
};
const StyledStack = styled(Stack)({
	flex: 1,
	padding: 2,
	flexDirection: 'column',
	gap: 2,
	'& .MuiTypography-root': {
		textAlign: { xs: 'center', md: 'left' },
	},
});

export const FieldsGroup = (props: StackProps) => {
	return <StyledFieldsGroup {...props} />;
};
export const StyledFieldsGroup = styled(Stack)({
	flex: 2,
	flexDirection: 'column',
	gap: '1rem',
	padding: '1',
});
