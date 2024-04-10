import { Box, BoxProps, styled } from '@mui/material';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';

export const FormTooltip = (props: PropsWithChildren<{ message: ReactNode; open?: boolean }>) => {
	const [state, setState] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const openState = Array<any>(true, false).includes(props.open) ? props.open : state;
	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		el.addEventListener('focusin', () => {
			setState(true);
		});
		el.addEventListener('focusout', () => {
			setState(false);
		});
	}, []);

	return (
		<StyledBox ref={ref} {...props} data-transition-state={openState === true ? 'true' : 'false'}>
			{props.children}
			<div className="form-tooltip">{props.message}</div>
		</StyledBox>
	);
};

type StyledBoxProps = BoxProps & { 'data-transition-state': 'true' | 'false' };

const StyledBox = styled(Box)<StyledBoxProps>(({ theme, ...props }) => ({
	position: 'relative',
	'& .form-tooltip': {
		display: props['data-transition-state'] === 'true' ? 'block' : 'none',
		position: 'absolute',
		top: '50%',
		right: '115%',
		fontSize: '0.8rem',
		boxSizing: 'border-box',
		transform: 'translateY(-50%)',
		background: theme.palette.background.paper,
		// padding: '0.5rem',
		borderRadius: '8px 1px 1px 8px',
		borderSize: '1px',
		borderColor: theme.palette.grey[300],
		borderStyle: 'solid',
		opacity: props['data-transition-state'] === 'true' ? 1 : 0,
		pointerEvents: props['data-transition-state'] === 'true' ? 'auto' : 'none',
		transition: 'opacity 0.3s ease',
		zIndex: 1000,
	},
}));
