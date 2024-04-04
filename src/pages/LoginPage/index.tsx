import {
	Box,
	Button,
	ClickAwayListener,
	Divider,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoaderOverlay } from '../../components';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { startDb } from '../../firebase.config';

interface FormData {
	email: string;
	password: string;
}

export const LoginPage = () => {
	const frm = useForm<FormData>();
	const nav = useNavigate();
	const toSignup = () => nav('/signup');

	const onSubmit = async (data: FormData) => {
		try {
			await startDb();
			const res = await signInWithEmailAndPassword(getAuth(), data.email, data.password);
			console.log(res);
		} catch (error) {
			console.error({error});
		}
		
	};
	return (
		<Box maxWidth={'500px'} margin={'auto'}>
			<FormProvider {...frm}>
				<form onSubmit={frm.handleSubmit(onSubmit)}>
					<LoaderOverlay load={frm.formState.isSubmitting}>
						<Stack sx={{ padding: '3rem', gap: '1rem' }} className="fadeup">
							<Typography variant="h4" textAlign={'center'}>
								Login
							</Typography>
							<Divider />
							<EmailField />
							<PasswordField />
							<Divider />
							<Button variant="contained" type="submit">
								Login
							</Button>
							<Button variant="text" onClick={toSignup}>
								Create an Account
							</Button>
						</Stack>
					</LoaderOverlay>
				</form>
			</FormProvider>
		</Box>
	);
};

const EmailField = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const errorMessage = errors['email']?.message?.toString();
	return (
		<TextField
			helperText={errorMessage}
			error={!!errorMessage}
			size={'small'}
			label="Email"
			{...register('email', {
				required: 'Email is required',
				pattern: {
					value: /\S+@\S+\.\S+/,
					message: 'Entered value does not match email format',
				},
			})}
		/>
	);
};

const PasswordField = () => {
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const errorMessage = errors['password']?.message?.toString();
	return (
		<ClickAwayListener onClickAway={() => setShowPassword(false)}>
			<TextField
				helperText={errorMessage}
				error={!!errorMessage}
				size={'small'}
				label="Password"
				type="password"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <VisibilityOff /> :  <Visibility /> }
							</IconButton>
						</InputAdornment>
					),
				}}
				{...register('password', {
					required: 'Password is required',
					minLength: {
						value: 6,
						message: 'Password must be at least 6 characters long',
					}
				})}
			/>
		</ClickAwayListener>
	);
};
