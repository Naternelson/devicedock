import { Box, BoxProps, styled } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const SwipeableViews = (props: Omit<BoxProps, "onChange"> & { value?: number; onChange?: (index: number) => void }) => {
    const {children, value, onChange, sx, ...rest} = props;
	const [index, setIndex] = useState(value ?? 0);
	const startX = useRef<number | null>(null);
	const startY = useRef<number | null>(null);

    const internalOnChange = useCallback((index: number) => {
        setIndex(index);
        onChange && onChange(index);
    },[onChange, setIndex])

	const handleSwipeMove = (event: React.TouchEvent<HTMLDivElement>) => {
		if (startX.current === null || startY.current === null) {
			return;
		}

		const deltaX = event.touches[0].clientX - startX.current;
		const deltaY = event.touches[0].clientY - startY.current;

		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
			setIndex((prevIndex) => {
				const childCount = React.Children.count(children);
				const newIndex = deltaX < 0 ? Math.min(prevIndex + 1, childCount - 1) : Math.max(prevIndex - 1, 0);
				internalOnChange(newIndex);
				return newIndex;
			});
		}
	};

	const handleSwipeEnd = (event: React.TouchEvent<HTMLDivElement>) => {
		// Reset start coordinates
		startX.current = null;
		startY.current = null;
	};

	const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		startX.current = event.touches[0].clientX;
		startY.current = event.touches[0].clientY;
	};

    useEffect(() => {
        if(typeof value === "number" && value !== index) internalOnChange(value);
    },[value, internalOnChange, index])

	return (
		<Container
            {...rest}
			onTouchStart={handleTouchStart}
			onTouchMove={handleSwipeMove}
			onTouchEnd={handleSwipeEnd}
			sx={{
				transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
				transform: `translateX(-${index * 100}%)`,
                ...sx,
			}}>
			{React.Children.map(children, (child, index) => (
				<Box key={index} sx={{ flex: '0 0 100%', minWidth: '100%', touchAction: 'pan-y' }}>
					{child}
				</Box>
			))}
		</Container>
	);
};

const Container = styled(Box)(() => ({
	display: 'flex',
	flexDirection: 'row',
	// overflowX: 'auto',
}));
