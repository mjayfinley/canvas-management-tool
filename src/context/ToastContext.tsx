import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface ToastContextType {
	showToast: (
		message: string,
		severity?: AlertColor,
		duration?: number
	) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState<AlertColor>("info");
	const [duration, setDuration] = useState(3000);

	const showToast = (
		msg: string,
		severity: AlertColor = "info",
		duration = 3000
	) => {
		setMessage(msg);
		setSeverity(severity);
		setDuration(duration);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={duration}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Alert
					onClose={handleClose}
					severity={severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
};

export const useToastContext = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToastContext must be used within a ToastProvider");
	}
	return context;
};
