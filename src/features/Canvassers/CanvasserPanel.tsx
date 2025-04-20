import {
	Box,
	Typography,
	CircularProgress,
	IconButton,
	useTheme,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import CanvasserCard from "./CanvasserCard";

interface CanvasserPanelProps {
	canvassers: any[];
	canvassersLoading: boolean;
	isMobile: boolean;
	handleAddCanvasserModal: () => void;
	onDelete: (id: string) => void;
	setOpen: () => void;
}

const CanvasserPanel = ({
	canvassers,
	canvassersLoading,
	isMobile,
	handleAddCanvasserModal,
	onDelete,
	setOpen,
}: CanvasserPanelProps) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
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
			}}
		>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				mb={1}
			>
				<Typography variant="h6">Canvassers</Typography>

				<IconButton
					color="success"
					onClick={() => handleAddCanvasserModal()}
				>
					<Add />
				</IconButton>

				{isMobile && (
					<IconButton onClick={() => setOpen()}>
						<Close />
					</IconButton>
				)}
			</Box>

			{canvassersLoading ? (
				<Box textAlign="center" mt={4}>
					<CircularProgress />
				</Box>
			) : canvassers.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No Canvassers added yet.
				</Typography>
			) : (
				<Box>
					{canvassers.map((canvasser) => (
						<CanvasserCard
							key={canvasser.id}
							canvasser={canvasser}
							onDelete={onDelete}
							setOpen={handleAddCanvasserModal}
						/>
					))}
				</Box>
			)}
		</Box>
	);
};

export default CanvasserPanel;
