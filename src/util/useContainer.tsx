import { useEffect, useRef, useState } from 'react';

export const useContainer = (padding?: string) => {
	const ref = useRef<HTMLDivElement>(null);
	const [bool, setBool] = useState(false);

	const counter = useRef(0);
	useEffect(() => {
		setBool(true);
	}, []);

	useEffect(() => {
		if (counter.current > 10) return;
		if (!ref.current) {
			setTimeout(() => setBool((p) => !p), 60);
			counter.current++;
			return;
		}
		const el = ref.current;
		// Get the position of the element from the top of the page
		const top = el.getBoundingClientRect().top;
		// Get the bottom of the page minus the padding
		const bottom = window.innerHeight;
        const heightCalc = `calc(${bottom}px - ${padding || '0px'} - ${top}px)`;
		// Set the height of the element from the top of the page to the bottom of the page
		el.style.height = heightCalc;
	}, [bool, padding]);
	return ref;
};
