import { Button, ButtonProps } from "@mui/material";
import { ReactElement } from "react";

type CustomButtonProps = {
	label: string | ReactElement;
	loading?: boolean;
	color?: string;
} & ButtonProps;

const CustomButton = ({
	label,
	loading = false,
	color = "primary",
	disabled,
	...props
}: CustomButtonProps) => {
	return (
		<Button
			variant="contained"
			color={color}
			disabled={loading || disabled}
			fullWidth
			{...props}
		>
			{loading ? "Loading..." : label}
		</Button>
	);
};

export default CustomButton;
