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
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import CustomInput from "../../components/Input";
import { useCanvassers } from "../../context/CanvassersContext";
import CanvasserCard from "./CanvasserCard";
import CustomButton from "../../components/Button";
import { Add, Close, PeopleAlt } from "@mui/icons-material";
import CustomModal from "../../components/Modal";

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
	const [modalOpen, setModalOpen] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleAddCanvasser = async () => {
		const newCanvasser = {
			id: Date.now().toString(),
			name: newName,
			email: newEmail,
		};
		await addCanvasser(newCanvasser);
		setName("");
		setEmail("");

		setModalOpen(false);
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
				mb={1}
			>
				<Typography variant="h6">Canvassers</Typography>

				<IconButton color="success" onClick={() => setModalOpen(true)}>
					<Add />
				</IconButton>

				{isMobile && (
					<IconButton onClick={() => setOpen(false)}>
						<Close />
					</IconButton>
				)}
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
						top: "80px",
						left: "25px",
						color: "black",
						zIndex: 1000,
						border: "1px solid rgba(0, 0, 0, 0.2)", // faint outline
						boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", // subtle shadow
						borderRadius: 1, // square shape (0 = sharp, 1 = slight rounding)
						backgroundColor: "#fff", // optional: helps shadow show up better
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
			<CustomModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Add New Canvasser"
				content={
					<>
						<CustomInput
							label="Name"
							value={newName}
							onChange={(e) => setName(e.target.value)}
						/>
						<CustomInput
							label="Email"
							value={newEmail}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</>
				}
				onConfirm={handleAddCanvasser}
				confirmText="Add"
			/>
			{/* <Dialog
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				fullWidth
			>
				<DialogTitle>Add New Canvasser</DialogTitle>
				<DialogContent
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
						mt: 1,
					}}
				>
					<CustomInput
						label="Name"
						value={newName}
						onChange={(e) => setName(e.target.value)}
					/>
					<CustomInput
						label="Email"
						value={newEmail}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModalOpen(false)}>Cancel</Button>
					<CustomButton
						label="Add"
						onClick={handleAddCanvasser}
						loading={adding}
					/>
				</DialogActions>
			</Dialog> */}
		</>
	);
};

export default Canvassers;
