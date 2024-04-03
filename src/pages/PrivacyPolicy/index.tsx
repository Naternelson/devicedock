import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
	return (
		<Box
			sx={{
				width: { xs: '100%', sm: '540px', md: '720px', lg: '960px', xl: '1140px' },
				margin: '0 auto',
				padding: '2rem',
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
			}}>

			<Typography variant={"h1"}>Privacy Policy</Typography>
			<Typography variant={"body1"}>
				Your privacy is important to us. It is our policy to respect your privacy regarding any information we
				may collect from you across our website, <Link to="http://localhost:3000">http://localhost:3000</Link>, and
				other sites we own and operate.
			</Typography>
			<Typography variant={"body1"}>
				We only ask for personal information when we truly need it to provide a service to you. We collect it by
				fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and
				how it will be used.
			</Typography>
			<Typography variant={"body1"}>
				We only retain collected information for as long as necessary to provide you with your requested
				service. What data we store, we’ll protect within commercially acceptable means to prevent loss and
				theft, as well as unauthorised access, disclosure, copying, use or modification.
			</Typography>
			<Typography variant={"body1"}>
				We don’t share any personally identifying information publicly or with third-parties, except when
				required to by law.
			</Typography>
			<Typography variant={"body1"}>
				Our website may link to external sites that are not operated by us. Please be aware that we have no
				control over the content and practices of these sites, and cannot accept responsibility or liability for
				their respective privacy policies.
			</Typography>
			<Typography variant={"body1"}>
				You are free to refuse our request for your personal information, with the understanding that we may be
				unable to provide you with some of your desired services.
			</Typography>
			<Typography variant={"body1"}>
				Your continued use of our website will be regarded as acceptance of our practices around privacy and
				personal information. If you have any questions about how we handle user data and personal information,
				feel free to contact us.
			</Typography>
			<Typography variant={"body1"}>This policy is effective as of April 1, 2024.</Typography>
		</Box>
	);
};
