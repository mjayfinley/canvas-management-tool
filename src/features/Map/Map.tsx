import { Box } from "@mui/material";
import Canvassers from "../Canvassers/Canvassers";

const MapInterface = () => {
	return (
		<Box sx={{ display: "flex", height: "90vh" }}>
			<Canvassers />
			Map
		</Box>
	);
};

export default MapInterface;
