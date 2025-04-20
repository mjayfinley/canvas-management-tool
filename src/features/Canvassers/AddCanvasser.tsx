import React from "react";
import CustomModal from "../../components/Modal";
import CustomInput from "../../components/Input";
import { Box } from "@mui/material";

interface AddCanvasserProps {
	open: boolean;
	newCanvasser: {
		firstName: string;
		lastName: string;
		email: string;
	};
	setNewCanvasser: (value: {
		firstName: string;
		lastName: string;
		email: string;
	}) => void;
	onConfirm: () => void;
	onClose: () => void;
}

const AddCanvasser: React.FC<AddCanvasserProps> = ({
	open,
	newCanvasser,
	setNewCanvasser,
	onConfirm,
	onClose,
}) => {
	const handleChange =
		(field: keyof typeof newCanvasser) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setNewCanvasser({ ...newCanvasser, [field]: e.target.value });
		};

	return (
		<CustomModal
			open={open}
			onClose={onClose}
			title="Add New Canvasser"
			content={
				<Box display="flex" flexDirection="column">
					<Box display="flex" flexDirection="row" gap={2}>
						<CustomInput
							label="First Name"
							value={newCanvasser.firstName}
							onChange={handleChange("firstName")}
						/>
						<CustomInput
							label="Last Name"
							value={newCanvasser.lastName}
							onChange={handleChange("lastName")}
						/>
					</Box>
					<Box>
						<CustomInput
							label="Email"
							value={newCanvasser.email}
							onChange={handleChange("email")}
						/>
					</Box>
				</Box>
			}
			onConfirm={onConfirm}
			confirmDisabled={
				!newCanvasser.firstName ||
				!newCanvasser.lastName ||
				!newCanvasser.email
			}
			confirmText="Add"
		/>
	);
};

export default AddCanvasser;
