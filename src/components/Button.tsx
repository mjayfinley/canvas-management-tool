import { Button, ButtonProps } from "@mui/material";

type CustomButtonProps = {
	label: string;
	loading?: boolean;
} & ButtonProps;

const CustomButton = ({
	label,
	loading = false,
	disabled,
	...props
}: CustomButtonProps) => {
	return (
		<Button
			variant="contained"
			color="primary"
			disabled={loading || disabled}
			fullWidth
			{...props}
		>
			{loading ? "Loading..." : label}
		</Button>
	);
};

export default CustomButton;
