import { ReactNode } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";

interface CustomModalProps {
	open: boolean;
	title?: string;
	content: ReactNode;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	confirmDisabled?: boolean;
	cancelText?: string;
}

const CustomModal = ({
	open,
	title,
	content,
	onClose,
	onConfirm,
	confirmText = "Confirm",
	confirmDisabled = false,
	cancelText = "Cancel",
}: CustomModalProps) => {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			{title && <DialogTitle>{title}</DialogTitle>}

			<DialogContent sx={{ mt: "20px" }}>{content}</DialogContent>

			<DialogActions>
				<Button onClick={onClose} color="secondary">
					{cancelText}
				</Button>
				{onConfirm && (
					<Button
						onClick={onConfirm}
						color="primary"
						variant="contained"
						disabled={confirmDisabled}
					>
						{confirmText}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default CustomModal;
