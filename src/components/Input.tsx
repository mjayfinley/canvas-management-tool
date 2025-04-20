import { ChangeEvent } from "react";
import { TextField, TextFieldProps } from "@mui/material";

type CustomInputProps = {
	label: string;
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	customError?: string;
} & TextFieldProps;

const CustomInput = ({
	label,
	value,
	onChange,
	customError,
	...props
}: CustomInputProps) => {
	return (
		<TextField
			label={label}
			value={value}
			onChange={onChange}
			error={Boolean(customError)}
			helperText={customError}
			fullWidth
			margin="normal"
			{...props}
		/>
	);
};

export default CustomInput;
