import { Info, Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	ButtonBase,
	ClickAwayListener,
	Collapse,
	Divider,
	FormHelperText,
	IconButton,
	Modal,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Link, useLoaderData } from 'react-router-dom';
import { FormData, useOnSubmit } from './useOnSubmit';
import { LoaderOverlay } from '../../components';

export const SignupPage = () => {
	const loaderData = useLoaderData() as {
		token: string;
		orgName: string;
	};
	const frm = useForm<FormData>({
		mode: 'onTouched',
		defaultValues: {
			token: loaderData.token || '',
			organizationName: loaderData.orgName || '',
		},
	});
	const { onSubmit, error, isSubmitting } = useOnSubmit(frm);
	const submitHandler = frm.handleSubmit(onSubmit);
	return (
		<Stack
			boxSizing={'border-box'}
			direction={{ sm: 'column', md: 'row' }}
			alignContent={'center'}
			flexGrow={1}
			sx={{
				background: (theme) => ({
					md: `linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 55%, ${theme.palette.primary.main} 55%)`, // For xs and up
					sm: `linear-gradient(180deg, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 55%, ${theme.palette.primary.main} 55%)`, // Changes at md and up
					xs: `linear-gradient(180deg, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 55%, ${theme.palette.primary.main} 55%)`, // Changes at md and up
				}),
			}}>
			<Stack maxWidth={'1000px'} direction="column" justifyContent={'center'} flexGrow={1} padding={'2rem'}>
				<Typography
					paragraph={false}
					className={'fadeup'}
					variant="h1"
					textAlign={{ sm: 'center', md: 'right' }}
					fontSize={'8rem'}
					sx={{
						animationDelay: '.3s',
						color: (theme) => theme.palette.primary.dark,
						'& > .bold': {
							fontWeight: 400,
						},
					}}>
					<span>Device</span>
					<span className={'bold'}>Dock</span>
				</Typography>
				<Divider />
				<Typography
					className="fadedown"
					variant="subtitle1"
					fontStyle={'italic'}
					textAlign={{ xs: 'center', sm: 'center', md: 'right' }}
					fontSize={'2rem'}
					sx={{ color: (theme) => theme.palette.grey[800], animationDelay: '.4s' }}>
					The best way to manage your products
				</Typography>
			</Stack>
			<Box flexGrow={1} justifyContent={'center'} alignItems={'center'} display="flex">
				<Paper
					className={'fadeup'}
					elevation={15}
					sx={{ maxWidth: '400px', margin: '2rem', animationDelay: '.5s' }}>
					<FormProvider {...frm}>
						<form onSubmit={submitHandler}>
							<LoaderOverlay load={isSubmitting}>
								<Stack spacing={2} padding={'3rem'}>
									<Typography variant="h4" textAlign={'center'}>
										Create an Account
									</Typography>
									<Divider />
									<GeneralError error={error} />
									<Typography variant="subtitle2">Organization Information</Typography>
									<OrgName disabled={!!loaderData.token} />
									<Divider />
									<Typography variant="subtitle2">User Information</Typography>
									<DisplayName />
									<EmailField />
									<PasswordField />
									<ConfirmPassword />
									<Divider />
									<Box
										display="flex"
										gap={'1rem'}
										justifyContent={'flex-end'}
										alignItems={'center'}
										flexDirection={'row'}>
										<Button component={Link} to={'/login'} variant="text">
											Go to Login
										</Button>
										<Divider orientation="vertical" flexItem />
										<Button type="submit" variant="contained">
											Sign Up
										</Button>
									</Box>
									<Divider />
									<Box>
										<Typography variant="caption" textAlign={'center'}>
											By signing up, you agree to our <Link to={'/terms'}>Terms of Service</Link>{' '}
											and <Link to={'/privacy'}>Privacy Policy</Link>
										</Typography>
									</Box>
									<Divider />
									<Box>
										<ExistingOrgQuestion />
									</Box>
								</Stack>
							</LoaderOverlay>
						</form>
					</FormProvider>
				</Paper>
			</Box>
		</Stack>
	);
};

const GeneralError = ({ error }: { error: null | { message: string; code: string; details?: any } }) => {
	return (
		<Collapse in={!!error}>
			<FormHelperText error>{error?.message}</FormHelperText>
		</Collapse>
	);
};

const DisplayName = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const errorMessage = errors.displayName?.message?.toString();
	return (
		<TextField
			{...register('displayName', {
				minLength: { value: 3, message: 'Display name must be at least 3 characters long' },
				maxLength: { value: 100, message: 'Display name must be at most 100 characters long' },
				required: 'Display name is required',
			})}
			size={'small'}
			label={'Display Name'}
			helperText={errorMessage}
			error={!!errorMessage}
			placeholder={'John Doe'}
		/>
	);
};

const OrgName = ({ disabled }: { disabled?: boolean }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const errorMessage = errors.organizationName?.message?.toString();
	return (
		<TextField
			{...register('organizationName', {
				minLength: { value: 3, message: 'Organization name must be at least 3 characters long' },
				maxLength: { value: 100, message: 'Organization name must be at most 100 characters long' },
				required: 'Organization name is required',
			})}
			size={'small'}
			disabled={disabled}
			label={'Name of Organization'}
			helperText={errorMessage}
			error={!!errorMessage}
			placeholder={'Example Business LLC'}
		/>
	);
};

const EmailField = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const errorMessage = errors.email?.message?.toString();
	return (
		<TextField
			{...register('email', {
				required: 'Email is required',
				pattern: {
					value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
					message: 'Invalid email address',
				},
			})}
			placeholder="email@company.com"
			helperText={errorMessage}
			error={!!errorMessage}
			size={'small'}
			label={'Email'}
			type={'email'}
		/>
	);
};

const PasswordField = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<FormData>();
	const [show, setShow] = useState(false);
	const errorMessage = errors.password?.message?.toString();
	return (
		<ClickAwayListener onClickAway={() => setShow(false)}>
			<TextField
				{...register('password', {
					required: 'Password is required',
					pattern: {
						value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
						message:
							'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
					},
					minLength: { value: 8, message: 'Password must be at least 8 characters long' },
					maxLength: { value: 100, message: 'Password must be at most 100 characters long' },
				})}
				placeholder="Password"
				helperText={errorMessage}
				error={!!errorMessage}
				size={'small'}
				label={'Password'}
				InputProps={{
					endAdornment: (
						<IconButton onClick={() => setShow(!show)}>
							{show ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					),
				}}
				type={show ? 'text' : 'password'}
			/>
		</ClickAwayListener>
	);
};

const ConfirmPassword = () => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext<FormData>();
	const [show, setShow] = useState(false);
	const errorMessage = errors.confirmPassword?.message?.toString();
	return (
		<ClickAwayListener onClickAway={() => setShow(false)}>
			<TextField
				{...register('confirmPassword', {
					// required: 'Password is required',
					validate: {
						matches: (value) => {
							return value === watch('password') || 'Passwords do not match';
						},
					},
				})}
				placeholder="Password"
				helperText={errorMessage}
				error={!!errorMessage}
				size={'small'}
				label={'Confirm Password'}
				InputProps={{
					endAdornment: (
						<IconButton onClick={() => setShow(!show)}>
							{show ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					),
				}}
				type={show ? 'text' : 'password'}
			/>
		</ClickAwayListener>
	);
};

const ExistingOrgQuestion = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<ButtonBase disableRipple onClick={() => setOpen(!open)} sx={{ width: '100%', gap: '1rem' }}>
				<Info fontSize="small" sx={{ color: grey[500] }} />
				<Typography
					sx={{
						textAlign: 'center',
						transition: 'color 0.1s',
						'&:hover': {
							color: (theme) => theme.palette.primary.main,
						},
						'&:active': {
							color: (theme) => theme.palette.primary.dark,
						},
					}}
					variant={'subtitle2'}>
					How can I join an existing organization?
				</Typography>
			</ButtonBase>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Paper
					sx={{
						padding: '3rem',
						maxWidth: '400px',
						margin: 'auto',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
					}}>
					<Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
						<Typography variant={'h6'}>Join an Existing Organization</Typography>
						<Button variant={'text'} onClick={() => setOpen(false)}>
							Close
						</Button>
					</Stack>
					<Typography variant={'body1'}>
						To join an existing organization, you will need an invitation from the organization's
						administrator. The administrator will provide you a link for you to sign up with. The link will
						expire after 2 hours.
					</Typography>
				</Paper>
			</Modal>
		</>
	);
};
