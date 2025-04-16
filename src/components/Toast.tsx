import { Snackbar, Alert, AlertColor } from "@mui/material";

export interface ToastProps {
	open: boolean;
	message: string;
	severity?: AlertColor;
	autoHideDuration?: number;
	onClose: () => void;
}

const Toast = ({
	open,
	message,
	severity = "info",
	autoHideDuration = 3000,
	onClose,
}: ToastProps) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<Alert
				onClose={onClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%" }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Toast;
