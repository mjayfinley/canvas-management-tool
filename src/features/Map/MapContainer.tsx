import { Box } from "@mui/material";
import Canvassers from "../Canvassers/Canvassers";
import MapInterface from "./MapInterface";

const MapContainer = () => {
	return (
		<Box sx={{ display: "flex", height: "90vh", width: "100%" }}>
			<Canvassers />
			<Box flex={1} ml={1} mr={1}>
				<MapInterface />
			</Box>
		</Box>
	);
};

export default MapContainer;
