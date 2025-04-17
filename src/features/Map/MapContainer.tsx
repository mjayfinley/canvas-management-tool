import { Box } from "@mui/material";
import Canvassers from "../Canvassers/Canvassers";
import MapInterface from "./MapInterface";

const MapContainer = () => {
	return (
		<Box sx={{ display: "flex", height: "90vh" }}>
			<Canvassers />
			<Box flex={1} ml={2}>
				<MapInterface />
			</Box>
		</Box>
	);
};

export default MapContainer;
