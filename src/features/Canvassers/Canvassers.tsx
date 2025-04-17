import { useState } from "react";
import {
	Box,
	Typography,
	CircularProgress,
	Drawer,
	IconButton,
	useTheme,
	useMediaQuery,
	Paper,
} from "@mui/material";
import CustomInput from "../../components/Input";
import { useCanvassers } from "../../context/CanvassersContext";
import CanvasserCard from "./CanvasserCard";
import CustomButton from "../../components/Button";
import { Close, PeopleAlt } from "@mui/icons-material";

interface Canvassers {
	id: string;
	name: string;
	email: string;
}

const Canvassers = () => {
	const { canvassers, loading, addCanvasser, removeCanvasser } =
		useCanvassers();
	const [open, setOpen] = useState(false);
	const [newName, setName] = useState("");
	const [newEmail, setEmail] = useState("");
	const [adding, setAdding] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleAddCanvasser = async () => {
		setAdding(true);
		const newCanvasser = {
			id: Date.now().toString(),
			name: newName,
			email: newEmail,
		};
		await addCanvasser(newCanvasser);
		setName("");
		setEmail("");
		setAdding(false);
	};

	const renderPanelContent = (
		<Box
			sx={(theme) => ({
				p: 3,
				width: isMobile ? 360 : 300,
				maxHeight: "100%",
				overflowY: "auto",
				"&::-webkit-scrollbar": {
					width: "0.4em",
				},
				"&::-webkit-scrollbar-track": {
					boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
					webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor:
						theme.palette.mode === "dark" ? "lightblue" : "#1976d2",
				},
			})}
		>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				mb={2}
			>
				<Typography variant="h6" gutterBottom>
					Canvassers
				</Typography>
				{isMobile && (
					<IconButton onClick={() => setOpen(false)}>
						<Close />
					</IconButton>
				)}
			</Box>

			<Box
				display="flex"
				flexDirection="column"
				gap={1}
				mb={2}
				sx={{ alignItems: "center" }}
			>
				<CustomInput
					label="Name"
					value={newName}
					onChange={(e) => setName(e.target.value)}
					fullWidth
				/>
				<CustomInput
					label="Email"
					value={newEmail}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
				/>

				<CustomButton
					label="Add"
					onClick={handleAddCanvasser}
					loading={adding}
				/>
			</Box>

			{loading ? (
				<Box textAlign="center" mt={4}>
					<CircularProgress />
				</Box>
			) : canvassers.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No users added yet.
				</Typography>
			) : (
				<Box>
					{canvassers.map((canvasser) => (
						<CanvasserCard
							key={canvasser.id}
							canvasser={canvasser}
							onDelete={removeCanvasser}
						/>
					))}
				</Box>
			)}
		</Box>
	);

	return (
		<>
			{isMobile && (
				<IconButton
					color="inherit"
					onClick={() => setOpen(true)}
					disableRipple
					sx={{
						position: "absolute",
						alignSelf: "flex-start",
					}}
				>
					<PeopleAlt />
				</IconButton>
			)}

			{isMobile ? (
				<Drawer
					anchor="left"
					open={open}
					onClose={() => setOpen(false)}
				>
					{renderPanelContent}
				</Drawer>
			) : (
				<Paper
					sx={{
						width: 300,
						position: "relative",
						flexShrink: 0,
					}}
				>
					{renderPanelContent}
				</Paper>
			)}
		</>
	);
};

export default Canvassers;
