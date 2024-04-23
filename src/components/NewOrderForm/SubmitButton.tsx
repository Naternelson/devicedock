import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { OrderFormData } from "./Form";

export const SubmitButton = () => {
	const {
		formState: { errors, isSubmitting },
	} = useFormContext<OrderFormData>();
	const disabled = Object.keys(errors).length > 0 || isSubmitting;

	return (
		<Button variant={'contained'} type={'submit'} disabled={disabled}>
			Create Order
		</Button>
	);
};
