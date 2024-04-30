import { Stack, StackProps } from '@mui/material';
import { useState } from 'react';

export const Accordian = ({ open: accordianOpen, ...rest }: { open?: boolean } & StackProps) => {
	const [open, setOpen] = useState(accordianOpen);
	return <Stack aria-role aria-expanded={open} direction="column" alignItems={'center'} className="delaygroup"></Stack>;
};
