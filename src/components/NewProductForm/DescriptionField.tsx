import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./form";

export const DescriptionField = () => {
    const {register, formState: {errors}} = useFormContext<ProductFormData>();
    const errorMessage = errors.description?.message?.toString();
    return (
        <TextField
            {...register('description')}
            label="Description"
            multiline
            fullWidth
            error={Boolean(errorMessage)}   
            helperText={errorMessage}
        />
    );
}