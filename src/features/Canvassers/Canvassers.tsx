import { useState } from "react";
import {
	Drawer,
	IconButton,
	useTheme,
	useMediaQuery,
	Paper,
} from "@mui/material";

import { useCanvassersContext } from "../../context/CanvassersContext";

import { PeopleAlt } from "@mui/icons-material";
import { capitalizeFirstInitial } from "../../utils/helperFunctions";
import AddCanvasser from "./AddCanvasser";
import CanvasserPanel from "./CanvasserPanel";

const Canvassers = () => {
	const { canvassers, canvassersLoading, addCanvasser, removeCanvasser } =
		useCanvassersContext();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [newCanvasser, setNewCanvasser] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});

	const [modalOpen, setModalOpen] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleAddCanvasser = async () => {
		const formattedCanvasser = {
			id: Date.now().toString(),
			firstName: capitalizeFirstInitial(newCanvasser.firstName),
			lastName: capitalizeFirstInitial(newCanvasser.lastName),
			email: newCanvasser.email,
		};
		await addCanvasser(formattedCanvasser);
		setNewCanvasser({ firstName: "", lastName: "", email: "" });
		setModalOpen(false);
	};

	const handleCancelAddCanvasser = () => {
		setNewCanvasser({ firstName: "", lastName: "", email: "" });
		setModalOpen(false);
	};

	const handleAddCanvasserModal = () => {
		setModalOpen((prev) => !prev);
	};

	const handleSetCanvasserManagementOpen = () => {
		setDrawerOpen((prev) => !prev);
	};

	return (
		<>
			{isMobile ? (
				<>
					<IconButton
						color="inherit"
						onClick={() => handleSetCanvasserManagementOpen()}
						disableRipple
						sx={{
							position: "absolute",
							alignSelf: "flex-start",
							bottom: "25px",
							left: "25px",
							color: "black",
							zIndex: 1000,
							border: "1px solid rgba(0, 0, 0, 0.2)",
							boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
							borderRadius: 1,
							backgroundColor: "#fff",
						}}
					>
						<PeopleAlt />
					</IconButton>
					<Drawer
						anchor="left"
						open={drawerOpen}
						onClose={() => handleSetCanvasserManagementOpen()}
					>
						<CanvasserPanel
							canvassers={canvassers}
							canvassersLoading={canvassersLoading}
							handleAddCanvasserModal={handleAddCanvasserModal}
							onDelete={removeCanvasser}
							setOpen={handleSetCanvasserManagementOpen}
							isMobile={isMobile}
						/>
					</Drawer>
				</>
			) : (
				<Paper
					sx={{
						width: 300,
						position: "relative",
						flexShrink: 0,
					}}
				>
					<CanvasserPanel
						canvassers={canvassers}
						canvassersLoading={canvassersLoading}
						handleAddCanvasserModal={handleAddCanvasserModal}
						onDelete={removeCanvasser}
						setOpen={handleSetCanvasserManagementOpen}
						isMobile={isMobile}
					/>
				</Paper>
			)}

			<AddCanvasser
				open={modalOpen}
				newCanvasser={newCanvasser}
				setNewCanvasser={setNewCanvasser}
				onConfirm={handleAddCanvasser}
				onClose={handleCancelAddCanvasser}
			/>
		</>
	);
};

export default Canvassers;
